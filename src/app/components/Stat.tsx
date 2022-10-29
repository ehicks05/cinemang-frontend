import { FC } from 'react';
import { IconType } from 'react-icons';

interface StatProps {
  Icon?: IconType;
  bgColor: string;
  color: string;
  value: string;
}

const Stat: FC<StatProps> = ({ Icon, color, bgColor, value }) => {
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

export default Stat;
