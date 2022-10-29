import React, { FC } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import Stat from './Stat';

interface Props {
  bgColor: string;
  data: {
    genre: string;
    language: string;
    voteAverage: string;
    voteCount: string;
  };
}

const FilmStats: FC<Props> = ({ bgColor, data }) => {
  const stats = [
    {
      color: 'text-red-600',
      icon: FaHeart,
      value: data.voteAverage,
    },
    {
      color: 'text-yellow-300',
      icon: FaStar,
      value: data.voteCount,
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
