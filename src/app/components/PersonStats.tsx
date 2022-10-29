import React, { FC } from 'react';
import { FaMask, FaStar } from 'react-icons/fa';
import Stat from './Stat';

interface Props {
  bgColor: string;
  data: {
    knownForDepartment: string;
    popularity: string;
  };
}

const FilmStats: FC<Props> = ({ bgColor, data }) => {
  const stats = [
    {
      color: 'text-yellow-300',
      icon: FaStar,
      value: data.popularity,
    },
    {
      color: 'text-blue-400',
      icon: FaMask,
      value: data.knownForDepartment,
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
