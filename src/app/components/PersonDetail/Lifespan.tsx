import { intervalToDuration, parseISO } from 'date-fns';
import type { Person } from '~/types/types';
import type { Palette } from '~/utils/palettes/palette';

interface Props {
	palette: Palette;
	person: Person;
}

export const Lifespan = ({ person, palette }: Props) => {
	const age = intervalToDuration({
		end: person.deathday ? parseISO(person.deathday) : new Date(),
		start: person.birthday ? parseISO(person.birthday) : new Date(),
	});

	if (!person.birthday && !person.deathday) return null;

	return (
		<div className="border-l-4 pl-2" style={{ borderColor: palette.darkVibrant }}>
			{person.birthday && (
				<div>
					<div className="font-semibold">Born</div>
					<div>
						{person.birthday} {!person.deathday && `(${age.years})`}
					</div>
					<div>{person.place_of_birth && person.place_of_birth}</div>
				</div>
			)}
			{person.deathday && (
				<div>
					<div className="font-semibold">Died</div>
					<div>
						{person.deathday} ({age.years})
					</div>
				</div>
			)}
		</div>
	);
};
