import { useFetchTrailers } from '@/hooks/useFetchVideos';
import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { Video } from '../types';

const nameIncludesOfficial = (t: Video) => t.name.includes('Official');

type Props =
	| { movieId: number }
	| { showId: number }
	| { showId: number; season?: number };

const Trailer = (props: Props) => {
	const key =
		'movieId' in props
			? { movieId: props.movieId }
			: 'season' in props
			  ? { showId: props.showId, season: props.season }
			  : { showId: props.showId };
	const { data } = useFetchTrailers(key);
	if (!data || data.length === 0) return null;

	const trailers =
		data
			?.sort((t1, t2) => t1.name.length - t2.name.length)
			.sort((t1, t2) => t1.name.localeCompare(t2.name)) || [];
	const officialTrailer =
		trailers.filter(nameIncludesOfficial)?.[0] || trailers?.[0] || [];

	return (
		<div className="">
			{officialTrailer && (
				<LiteYouTubeEmbed
					id={officialTrailer.key}
					title={officialTrailer.name}
					wrapperClass="yt-lite rounded-lg"
				/>
			)}
		</div>
	);
};

export default Trailer;
