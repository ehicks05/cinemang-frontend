import { Prisma } from '@prisma/client';
import P from 'bluebird';
import { subDays } from 'date-fns';
import { intersection } from 'lodash';
import { PRISMA_OPTIONS } from '../../constants';
import logger from '../../services/logger';
import prisma from '../../services/prisma';
import { getPerson } from '../../services/tmdb';
import { getRecentlyChangedIds } from '../../services/tmdb/changes';
import { TMDB_OPTIONS } from '../../services/tmdb/constants';
import { parsePerson } from './parse_person';

const toId = (o: { id: number }) => o.id;

export const createPersons = async (personIds: number[]) => {
	logger.info(`fetching person data for ${personIds.length} ids`);
	const parsed = (await P.map(personIds, getPerson, TMDB_OPTIONS))
		.map(parsePerson)
		.filter((o): o is Prisma.PersonCreateInput => !!o);

	try {
		const createResult = await prisma.person.createMany({
			data: parsed,
		});

		logger.info('person', {
			ids: personIds.length,
			created: createResult?.count,
			invalid: personIds.length - parsed.length,
		});

		return personIds;
	} catch (e) {
		logger.error('error while saving', e);
	}
};

export const updatePersons = async () => {
	logger.info('updating persons');

	const updateOne = async (o: Prisma.PersonCreateInput) => {
		try {
			await prisma.person.update({ where: { id: o.id }, data: o });
			return { result: 'ok', id: o.id };
		} catch (e) {
			logger.error(e);
			return { result: 'error', id: o.id };
		}
	};

	const localPersonIds = (
		await prisma.person.findMany({
			select: { id: true },
		})
	).map(toId);
	logger.info(`fetched ${localPersonIds.length} personIds from db`);

	// find recently changed persons and drop them, then fetch and load the remainder
	const recentlyChangedPersonIds = await getRecentlyChangedIds('person', {
		start: subDays(new Date(), 2),
		end: new Date(),
	});
	logger.info(`fetched ${recentlyChangedPersonIds.length} personIds from /changes`);

	const personIdsToUpdate = intersection(localPersonIds, recentlyChangedPersonIds);
	logger.info(`identified ${personIdsToUpdate.length} personIds to update`);

	const parsed = (await P.map(personIdsToUpdate, getPerson, TMDB_OPTIONS))
		.map(parsePerson)
		.filter((o): o is Prisma.PersonCreateInput => !!o);

	const results = await P.map(parsed, updateOne, PRISMA_OPTIONS);

	logger.info('persons', {
		localPersonIds: localPersonIds.length,
		changedPersonIds: recentlyChangedPersonIds.length,
		updated: results.filter((o) => o.result === 'ok').length,
		failed: results.filter((o) => o.result === 'error').length,
	});
};
