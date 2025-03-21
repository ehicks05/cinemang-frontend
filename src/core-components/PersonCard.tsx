import { Link } from '@tanstack/react-router';
import { getTmdbImage } from '~/utils/getTmdbImage';
import type { Palette } from '~/utils/palettes/palette';

interface Props {
	characters?: string[];
	jobs?: string[];
	name: string;
	palette: Palette;
	personId: number;
	profilePath?: string;
}

const toInitials = (name: string) => {
	const parts = name.split(' ');
	return [parts.at(0), parts.at(-1)]
		.map((part) => (part || '').slice(0, 1))
		.join('');
};

const getDefaultProfile = (name: string, color: string) =>
	`https://via.placeholder.com/300x450/${color}/fff/?text=${toInitials(name)}`;

const PersonCard = ({
	characters,
	jobs,
	name,
	palette,
	personId,
	profilePath,
}: Props) => {
	const profile = getTmdbImage({
		defaultImage: getDefaultProfile(name, palette.darkMuted.slice(1)),
		path: profilePath,
	});

	return (
		<Link
			className="flex w-full flex-col rounded-lg p-0.5"
			style={{ backgroundColor: palette.darkMuted }}
			to={'/people/$personId'}
			params={{ personId: String(personId) }}
		>
			<img alt="cast" className="rounded-t-lg" src={profile} />

			<div className="grow p-1.5">
				<div>{name}</div>
				{characters && <div className="text-sm">as {characters.join(', ')}</div>}
				{jobs && <div className="text-sm">{jobs.join(', ')}</div>}
			</div>
		</Link>
	);
};

export default PersonCard;
