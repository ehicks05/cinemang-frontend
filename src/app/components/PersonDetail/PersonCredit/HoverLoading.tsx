import { Loading } from '@/core-components';
import { container } from './constants';

interface Props {
	background: string;
	error: unknown;
	isLoading: boolean;
}

const HoverLoading = ({ background, error, isLoading }: Props) => (
	<div className={container}>
		<div className="flex flex-col gap-4 p-4 sm:rounded-lg" style={{ background }}>
			<Loading error={error} loading={isLoading} />
		</div>
	</div>
);

export default HoverLoading;
