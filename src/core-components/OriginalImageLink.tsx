import { FaExternalLinkAlt } from 'react-icons/fa';
import { getTmdbImage } from '@/utils';

/**
 * Usage: Nest inside a relative-positioned element, sibling to an img
 */
const OriginalImageLink = ({ path }: { path: string }) => (
  <a
    href={getTmdbImage({ path, width: 'original' })}
    target="_blank"
    rel="noreferrer"
    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-neutral-700 hover:bg-neutral-600"
  >
    <FaExternalLinkAlt className="h-3 w-3 text-neutral-400" />
  </a>
);

export default OriginalImageLink;
