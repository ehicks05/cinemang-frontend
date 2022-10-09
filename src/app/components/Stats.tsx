import React, { FC } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface StatProps {
  Icon?: IconType;
  bgColor: string;
  color: string;
  value: string;
}

const FilmStat: FC<StatProps> = ({ Icon, color, bgColor, value }) => {
  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-gray-700 px-2 py-1 sm:px-4 sm:py-2"
      style={{ backgroundColor: bgColor }}
    >
      {Icon && (
        <div>
          <Icon className={color} />
        </div>
      )}
      <div className="text-xs sm:text-sm">{value}</div>
    </div>
  );
};

interface Props {
  bgColor: string;
  data: {
    genre: string;
    language: string;
    voteAverage: string;
    voteCount: string;
  };
}

const Stats: FC<Props> = ({ bgColor, data }) => {
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
        <FilmStat
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

export default Stats;
