import { FC } from 'react';
import { IconType } from 'react-icons';

interface StatProps {
  Icon?: IconType;
  bgColor: string;
  color: string;
  label: string | number;
  title?: string;
  width?: string;
}

const Stat: FC<StatProps> = ({ bgColor, color, Icon, label, title, width }) => {
  return (
    <div
      className={`flex ${width} items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 sm:px-4`}
      style={{ backgroundColor: bgColor }}
      title={title}
    >
      {Icon && (
        <div>
          <Icon className={color} />
        </div>
      )}
      <div className="text-xs sm:text-sm">{label}</div>
    </div>
  );
};

export default Stat;
