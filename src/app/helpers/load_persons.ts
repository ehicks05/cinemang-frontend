import { Prisma } from '@prisma/client';
import P from 'bluebird';
import { differenceBy, intersectionBy, keyBy } from 'lodash';
import { PRISMA_OPTIONS } from '../../constants';
import logger from '../../services/logger';
import prisma from '../../services/prisma';
import { getPerson } from '../../services/tmdb';
import { TMDB_OPTIONS } from '../../services/tmdb/constants';
import { PersonResponse } from '../../services/tmdb/types/responses';
import { isEqual } from './helpers';
import { parsePerson } from './parse_person';

const toId = (o: { id: number }) => o.id;

export const loadPersons = async (personIds: number[]) => {
	logger.info(`fetching person data for ${personIds.length} ids`);
	const remote = (
		await P.map(personIds, (id) => getPerson(id), TMDB_OPTIONS)
	).filter((o) => o) as unknown as PersonResponse[];
	const parsed = remote
		.map(parsePerson)
		.filter((o) => o) as Prisma.PersonCreateInput[];

	const local = await prisma.person.findMany({
		where: { id: { in: personIds } },
	});
	const localById = keyBy(local, toId);

	logger.info('determining new vs updated');
	const toCreate = differenceBy(parsed, local, toId);
	const remoteThatExist = intersectionBy(parsed, local, toId);
	const toUpdate = remoteThatExist.filter((o) => {
		const p = localById[o.id];
		return p && !isEqual(o, p);
	});

	try {
		const createResult = await prisma.person.createMany({
			data: toCreate,
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

		await P.map(toUpdate, updateOne, PRISMA_OPTIONS);

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
