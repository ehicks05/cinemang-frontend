import { Prisma } from '@prisma/client';
import { pick } from 'lodash';
import { PersonResponse } from '../../services/tmdb/types/responses';

const isValidPerson = (person: PersonResponse) => person.profile_path;

export const parsePerson = (data?: PersonResponse) => {
	if (!data || !isValidPerson(data)) {
		return undefined;
	}

	const create: Prisma.PersonCreateInput = {
		...pick(data, ['id', 'biography', 'name', 'popularity']),
		birthday: new Date(data.birthday),
		deathday: data.deathday ? new Date(data.deathday) : null,
		gender: Number(data.gender),
		imdbId: data.imdb_id,
		knownForDepartment: data.known_for_department || '',
		placeOfBirth: data.place_of_birth,
		profilePath: data.profile_path as string,
	};
	return create;
};
