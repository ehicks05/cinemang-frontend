import { range } from 'lodash';
import MediaSkeleton from './MediaSkeleton';
import MediaLayout from './MediaLayout';

const MediaSkeletons = () => (
  <MediaLayout>
    {range(0, 20).map(i => (
      <MediaSkeleton key={i} />
    ))}
  </MediaLayout>
);

export default MediaSkeletons;
