import { FaFilm, FaMask, FaStar } from 'react-icons/fa';
import { StatChip } from '../StatChip';

interface Props {
	autoWidth?: boolean;
	bgColor: string;
	data: {
		credits: number;
		knownForDepartment: string;
		popularity: string;
	};
}

const FilmStats = ({ bgColor, data, autoWidth = true }: Props) => {
	const stats = [
		{
			color: 'text-yellow-300',
			icon: FaStar,
			title: 'Popularity',
			value: data.popularity,
			width: 'w-20',
		},
		{
			color: 'text-blue-400',
			icon: FaMask,
			title: 'Known for',
			value: data.knownForDepartment,
			width: 'w-32',
		},
		{
			color: 'text-blue-400',
			icon: FaFilm,
			title: 'Credits',
			value: data.credits,
			width: 'w-32',
		},
	];

	return (
		<div className="flex flex-wrap gap-2">
			{stats.map((stat) => (
				<StatChip
					bgColor={bgColor}
					color={stat.color}
					icon={stat.icon}
					key={stat.value}
					label={stat.value}
					title={stat.title}
					width={autoWidth ? undefined : stat.width}
				/>
			))}
		</div>
	);
};

export default FilmStats;
