import { FC } from 'react';
import { IconType } from 'react-icons';

interface StatProps {
	bgColor: string;
	color: string;
	icon?: IconType;
	label?: string | number;
	title?: string;
	width?: string;
}

const Stat: FC<StatProps> = ({
	bgColor,
	color,
	icon: Icon,
	label,
	title,
	width,
}) => (
	<div
		className={`flex ${width} items-center justify-center gap-1 rounded-lg bg-gray-700 px-3 py-2 sm:px-4`}
		style={{ backgroundColor: bgColor }}
		title={title}
	>
		{Icon && <Icon className={color} />}
		{label && <div className="text-xs sm:text-sm">{label}</div>}
	</div>
);

export default Stat;
