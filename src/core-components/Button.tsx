import type { FC, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

const Button: FC<Props> = ({ className, disabled, onClick, children }) => (
	<button
		type="button"
		className={`border bg-black px-2 py-1 text-white
      ${disabled ? 'cursor-default opacity-50' : ''} ${className}`}
		disabled={disabled}
		onClick={onClick}
	>
		{children}
	</button>
);

export default Button;
