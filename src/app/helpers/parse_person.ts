import { Person } from '@prisma/client';
import { pick } from 'lodash';
import logger from '../../services/logger';
import { getPerson } from '../../services/tmdb';

export const idToParsedPerson = async (id: number) => {
  const data = await getPerson(id);

  // ignore people missing required data
  if (!data || !data.name || !data.profile_path) {
    logger.error(`failed on person:`, data?.id);
    return undefined;
  }

  return {
    ...pick(data, ['id', 'biography', 'name', 'popularity']),
    birthday: new Date(data.birthday),
    deathday: data.deathday ? new Date(data.deathday) : undefined,
    gender: Number(data.gender),
    imdbId: data.imdb_id,
    knownForDepartment: data.known_for_department,
    placeOfBirth: data.place_of_birth,
    profilePath: data.profile_path,
  } as Person;
};
