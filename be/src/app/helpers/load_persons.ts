import type { Prisma } from '@prisma/client';
import axios, { type AxiosError } from 'axios';
import P from 'bluebird';
import { subDays } from 'date-fns';
import { intersection } from 'lodash';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { getRecentlyChangedIds } from '~/services/tmdb/changes.js';
import { TMDB_OPTIONS } from '~/services/tmdb/constants.js';
import { getPerson } from '~/services/tmdb/index.js';
import type { PersonResponse } from '~/services/tmdb/types/responses.js';
import { PRISMA_OPTIONS } from '../../constants.js';
import { parsePerson } from './parse_person.js';

const toId = (o: { id: number }) => o.id;

export const createPersons = async (personIds: number[]) => {
	logger.info(`fetching person data for ${personIds.length} ids`);
	const remote = await P.map(personIds, getPerson, TMDB_OPTIONS);
	const toParse = remote.filter((o): o is PersonResponse => o && !('error' in o));

	const parsed = toParse
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

	const remote = await P.map(personIdsToUpdate, getPerson, TMDB_OPTIONS);

	const toParse = remote.filter((o): o is PersonResponse => o && !('error' in o));
	const toDelete = remote.filter(
		(o): o is { id: number; error: AxiosError } =>
			o &&
			'error' in o &&
			axios.isAxiosError(o.error) &&
			o.error.response?.status === 404,
	);

	const parsed = toParse
		.map(parsePerson)
		.filter((o): o is Prisma.PersonCreateInput => !!o);

	const results = await P.map(parsed, updateOne, PRISMA_OPTIONS);

	const deleteResult = await prisma.person.deleteMany({
		where: { id: { in: toDelete.map((o) => o.id) } },
	});

	logger.info('persons', {
		localPersonIds: localPersonIds.length,
		changedPersonIds: recentlyChangedPersonIds.length,
		updated: results.filter((o) => o.result === 'ok').length,
		failed: results.filter((o) => o.result === 'error').length,
		deleted: deleteResult.count,
	});
};
