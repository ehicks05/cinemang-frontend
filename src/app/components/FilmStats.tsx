import React, { FC } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import Stat from './Stat';
const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

interface Props {
  bgColor: string;
  data: {
    genre: string;
    language: string;
    voteAverage: number;
    voteCount: number;
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

const FilmStats: FC<Props> = ({ bgColor, data }) => {
  const stats = [
    {
      color: heartColor(data.voteAverage),
      icon: FaHeart,
      value: nf.format(data.voteAverage),
    },
    {
      color: starColor(data.voteCount),
      icon: FaStar,
      value: toShort(data.voteCount),
    },
    {
      color: 'text-green-500',
      value: data.language,
    },
    {
      color: 'text-blue-400',
      value: data.genre,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {stats.map((stat) => (
        <Stat
          Icon={stat.icon}
          bgColor={bgColor}
          color={stat.color}
          key={stat.value}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default FilmStats;
