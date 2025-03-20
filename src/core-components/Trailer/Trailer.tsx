import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import type { Video } from '~/types/types';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface Props {
	trailer: Video;
}

const Trailer = ({ trailer }: Props) => {
	if (!trailer) return null;

	return (
		<div>
			<LiteYouTubeEmbed
				id={trailer.key}
				title={trailer.name}
				wrapperClass="yt-lite rounded-lg"
			/>
		</div>
	);
};

export default Trailer;
