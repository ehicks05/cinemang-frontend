import { Link, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { cn } from '~/utils/cn';

interface Props {
	children: ReactNode;
	className?: string;
	isActive?: boolean;
	isDisabled?: boolean;
	page: number;
}

export const PageLink = ({
	children,
	className,
	isActive,
	isDisabled,
	page,
}: Props) => {
	const { pathname } = useLocation();
	const from = pathname === '/tv' ? '/tv' : '/films';

	const defaults =
		'flex items-center justify-center w-9 h-9 border border-neutral-600';
	const disabled = isDisabled ? 'opacity-60' : '';
	const active = isActive ? 'z-10 border-emerald-700 bg-emerald-900' : '';
	const notSpecial = !isDisabled && !isActive ? 'hover:bg-neutral-700' : '';

	return (
		<Link
			disabled={isDisabled}
			className={cn(defaults, disabled, active, notSpecial, className)}
			search={(prev) => ({ ...prev, page })}
			to={from}
		>
			{children}
		</Link>
	);
};
