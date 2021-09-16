import React, { FC } from "react";
import { FaHeart, FaLanguage, FaStar, FaTheaterMasks } from "react-icons/fa";
import { IconType } from "react-icons";

interface StatProps {
  Icon: IconType;
  color: string;
  bgColor: string;
  value: string;
}

const FilmStat: FC<StatProps> = ({ Icon, color, bgColor, value }) => {
  return (
    <div
      className="flex flex-col gap-1 items-center px-2 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-700"
      style={{ backgroundColor: bgColor }}
    >
      <div>
        <Icon className={color} />
      </div>
      <div className="text-xs sm:text-sm">{value}</div>
    </div>
  );
};

interface Props {
  bgColor: string;
  data: {
    voteAverage: string;
    voteCount: string;
    language: string;
    genre: string;
  };
}

const Stats: FC<Props> = ({ bgColor, data }) => {
  const stats = [
    { icon: FaHeart, color: "text-red-600", value: data.voteAverage },
    {
      value: data.voteCount,
      icon: FaStar,
      color: "text-yellow-300",
    },
    {
      value: data.language,
      icon: FaLanguage,
      color: "text-green-500",
    },
    { value: data.genre, icon: FaTheaterMasks, color: "text-blue-400" },
  ];

  return (
    <div className="flex flex-wrap mx-auto gap-2">
      {stats.map((stat) => (
        <FilmStat
          key={stat.value}
          value={stat.value}
          Icon={stat.icon}
          color={stat.color}
          bgColor={bgColor}
        />
      ))}
    </div>
  );
};

export default Stats;
