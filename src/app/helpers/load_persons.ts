import { differenceBy, intersectionBy, keyBy } from 'lodash';
import { Prisma } from '@prisma/client';
import P from 'bluebird';
import { getPerson } from '../../services/tmdb';
import logger from '../../services/logger';
import prisma from '../../services/prisma';
import { PersonResponse } from '../../services/tmdb/types/responses';
import { isEqual } from './helpers';
import { parsePerson } from './parse_person';

const options = { concurrency: 32 };

const toId = (o: { id: number }) => o.id;

export const loadPersons = async (personIds: number[]) => {
  logger.info(`fetching person data for ${personIds.length} ids`);
  const remote = (await P.map(personIds, id => getPerson(id), options)).filter(
    o => o,
  ) as unknown as PersonResponse[];
  const parsed = remote
    .map(parsePerson)
    .filter(o => o) as Prisma.PersonCreateInput[];
  const parsedById = keyBy(parsed, toId);

  const local = await prisma.person.findMany({
    where: { id: { in: personIds } },
  });
  const localById = keyBy(local, toId);

  logger.info('determining new vs updated');
  const toCreate = differenceBy(parsed, local, toId);
  const remoteThatExist = intersectionBy(parsed, local, toId);
  const toUpdate = remoteThatExist.filter(o => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  const remoteInvalid = remote.filter(o => !parsedById[o.id]);
  await prisma.ignoredPerson.createMany({
    data: remoteInvalid.map(o => ({ id: o.id })),
  });

  try {
    const createResult = await prisma.person.createMany({
      data: toCreate as any,
    });

    const updateOne = async (o: Prisma.PersonCreateInput) => {
      try {
        await prisma.person.update({ where: { id: o.id }, data: o });
        return { result: 'ok', id: o.id };
      } catch (e) {
        logger.error(e);
        return { result: 'error', id: o.id };
      }
    };

    await P.map(toUpdate, updateOne, options);

    logger.info('person', {
      ids: personIds.length,
      fetched: remote.length,
      created: createResult?.count,
      updated: toUpdate.length,
      unchanged: remoteThatExist.length - toUpdate.length,
      invalid: personIds.length - parsed.length,
    });

    return personIds;
  } catch (e) {
    logger.error('error while saving', e);
  }
};
