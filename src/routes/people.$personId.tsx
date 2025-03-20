import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { getPersonById } from '~/hooks/useFetchPersons';
import { PersonDetail } from '~/temp/app/components';
import { getTmdbImage } from '~/utils/getTmdbImage';
import { toPalette } from '~/utils/palettes/palette';

export const Route = createFileRoute('/people/$personId')({
	loader: async ({ params }) => {
		const person = await getPersonById(Number(params.personId));
		const palette = await toPalette(
			getTmdbImage({ path: person.profile_path, width: 'w500' }),
		);
		return { person, palette };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
	ssr: false,
});

function RouteComponent() {
	const { person, palette } = Route.useLoaderData();

	return (
		<div>
			<PersonDetail person={person} palette={palette} />
		</div>
	);
}
