import React, { FC } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import Stat from './Stat';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

interface Props {
  bgColor: string;
  data: {
    genre?: string;
    language?: string;
    voteAverage?: number;
    voteCount?: number;
  };
}

export const toShort = (voteCount: number) =>
  Number(voteCount) > 1000
    ? `${Math.round(voteCount / 1000)}k`
    : String(voteCount);

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

const FilmStats: FC<Props> = ({
  bgColor,
  data,
  data: { genre, language, voteAverage = 0, voteCount = 0 },
}) => {
  const stats = {
    genre: {
      color: 'text-blue-400',
      icon: undefined,
      label: genre,
      order: 2,
    },
    language: {
      color: 'text-green-500',
      icon: undefined,
      label: language,
      order: 3,
    },
    voteAverage: {
      color: heartColor(voteAverage),
      icon: FaHeart,
      label: nf.format(voteAverage),
      order: 0,
    },
    voteCount: {
      color: starColor(voteCount),
      icon: FaStar,
      label: toShort(voteCount),
      order: 1,
    },
  } as const;

  return (
    <span className="flex flex-wrap gap-2">
      {Object.entries(data)
        .filter(([key, val]) => key !== 'language' && val !== 'English')
        .map(([key]) => {
          const stat = stats[key as keyof typeof stats];
          return stat;
        })
        .sort((s1, s2) => s1.order - s2.order)
        .map((stat) => (
          <Stat
            Icon={stat.icon}
            bgColor={bgColor}
            color={stat.color}
            key={stat.label}
            label={stat.label || ''}
          />
        ))}
    </span>
  );
};

export default FilmStats;
