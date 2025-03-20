import MediaLayout from '../MediaLayout';
import MediaSkeleton from './MediaSkeleton';

const zeroTo19 = [...new Array(20)].map((_, i) => i);

const MediaSkeletons = () => (
	<MediaLayout>
		{zeroTo19.map((i) => (
			<MediaSkeleton key={i} />
		))}
	</MediaLayout>
);

export default MediaSkeletons;
