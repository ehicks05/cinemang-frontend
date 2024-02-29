import { range } from 'lodash';
import MediaLayout from './MediaLayout';
import MediaSkeleton from './MediaSkeleton';

const MediaSkeletons = () => (
	<MediaLayout>
		{range(0, 20).map((i) => (
			<MediaSkeleton key={i} />
		))}
	</MediaLayout>
);

export default MediaSkeletons;
