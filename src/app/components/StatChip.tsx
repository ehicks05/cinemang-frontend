import type { IconType } from 'react-icons';

interface Props {
	bgColor: string;
	color: string;
	icon?: IconType;
	label?: string | number;
	title?: string;
	width?: string;
}

const StatChip = ({ bgColor, color, icon: Icon, label, title, width }: Props) => (
	<div
		className={`flex ${width} items-center justify-center gap-1 rounded-lg bg-neutral-700 px-3 py-2 sm:px-4`}
		style={{ backgroundColor: bgColor }}
		title={title}
	>
		{Icon && <Icon className={color} />}
		{label && <div className="text-xs sm:text-sm">{label}</div>}
	</div>
);

export { StatChip };
