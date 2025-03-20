import { FaHeart, FaStar } from 'react-icons/fa';
import Stat from './Stat';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

interface Props {
	autoWidth?: boolean;
	bgColor: string;
	data: {
		genre?: string;
		language?: string;
		voteAverage?: number;
		voteCount?: number;
	};
}

export const toShort = (voteCount: number) =>
	Number(voteCount) > 1000 ? `${Math.round(voteCount / 1000)}k` : String(voteCount);

const heartColor = (voteAverage: number) =>
	voteAverage >= 8
		? 'text-red-600'
		: voteAverage >= 7
			? 'text-red-600'
			: voteAverage >= 6
				? 'text-red-700'
				: 'text-red-800';

const starColor = (voteCount: number) =>
	voteCount >= 10_000
		? 'text-yellow-300'
		: voteCount >= 1000
			? 'text-yellow-400'
			: voteCount >= 1000
				? 'text-yellow-500'
				: 'text-yellow-700';

const MediaStats = ({
	autoWidth = true,
	bgColor,
	data: { genre, language, voteAverage = 0, voteCount = 0 },
}: Props) => {
	const stats = [
		{
			key: 'voteAverage',
			label: nf.format(voteAverage),
			color: heartColor(voteAverage),
			icon: FaHeart,
			width: 'w-20',
		},
		{
			key: 'voteCount',
			label: toShort(voteCount),
			color: starColor(voteCount),
			icon: FaStar,
			width: 'w-20',
		},
		{
			key: 'genre',
			label: genre,
			color: 'text-blue-400',
			icon: undefined,
			width: 'w-32',
		},
		{
			key: 'language',
			label: language,
			color: 'text-green-500',
			icon: undefined,
			width: 'w-32',
		},
	].filter((o) => o.label && !['?', 'en'].includes(o.label));

	return (
		<span className={`flex ${autoWidth ? 'flex-wrap' : ''} gap-2`}>
			{stats.map((stat) => (
				<Stat
					key={stat.key}
					bgColor={bgColor}
					color={stat.color}
					icon={stat.icon}
					label={stat.label || ''}
					width={autoWidth ? undefined : stat.width}
				/>
			))}
		</span>
	);
};

export default MediaStats;
