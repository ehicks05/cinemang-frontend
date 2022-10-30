import React, { FC } from 'react';
import { FaMask, FaStar } from 'react-icons/fa';
import Stat from './Stat';

interface Props {
  autoWidth?: boolean;
  bgColor: string;
  data: {
    knownForDepartment: string;
    popularity: string;
  };
}

const FilmStats: FC<Props> = ({ bgColor, data, autoWidth = true }) => {
  const stats = [
    {
      color: 'text-yellow-300',
      icon: FaStar,
      value: data.popularity,
      width: 'w-20',
    },
    {
      color: 'text-blue-400',
      icon: FaMask,
      value: data.knownForDepartment,
      width: 'w-32',
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
          label={stat.value}
          width={autoWidth ? undefined : stat.width}
        />
      ))}
    </div>
  );
};

export default FilmStats;
