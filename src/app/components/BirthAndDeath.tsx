import { intervalToDuration, parseISO } from 'date-fns';
import { Person } from '../../types';
import { Palette } from '../hooks/usePalette';

interface Props {
  palette: Palette;
  person: Person;
}

const BirthAndDeath = ({ person, palette }: Props) => {
  const age = intervalToDuration({
    end: person.deathday ? parseISO(person.deathday) : new Date(),
    start: parseISO(person.birthday),
  });

  return person.birthday || person.deathday ? (
    <div
      className="rounded border p-2"
      style={{ borderColor: palette.darkVibrant }}
    >
      {person.birthday && (
        <div>
          <div className="font-bold">Born</div>
          <div>
            {person.birthday} {!person.deathday && `(${age.years})`}
          </div>
          <div>{person.place_of_birth && person.place_of_birth}</div>
        </div>
      )}
      {person.deathday && (
        <div>
          <div className="font-bold">Died</div>
          <div>
            {person.deathday} ({age.years})
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default BirthAndDeath;