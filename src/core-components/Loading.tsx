import type { FC } from 'react';
import { VscLoading } from 'react-icons/vsc';

interface Props {
	error?: Error | null;
	loading: boolean;
	size?: number;
}

const Loading: FC<Props> = ({ loading, error, size = 128 }) => {
	if (error) {
		return <span>Error: {JSON.stringify(error, null, 2)}</span>;
	}
	if (loading) {
		return (
			<div className="flex grow items-center justify-center">
				<VscLoading
					className="animate-spin opacity-25"
					color="#15eda1"
					size={size}
				/>
			</div>
		);
	}

	return null;
};

export default Loading;
