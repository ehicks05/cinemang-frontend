import chroma from 'chroma-js';
import { Vibrant } from 'node-vibrant/browser';

export const DEFAULT_PALETTE = {
	bgStyles: { background: '#333' },
	darkMuted: '#333',
	darkVibrant: '#333',
	lightMuted: '#333',
	lightVibrant: '#333',
	muted: '#333',
	vibrant: '#333',
};

export interface Palette {
	bgStyles: { background: string };
	darkMuted: string;
	darkVibrant: string;
	lightMuted: string;
	lightVibrant: string;
	muted: string;
	vibrant: string;
}

export const toPalette = async (url: string) => {
	const p = await new Vibrant(url).getPalette();

	const lessMuted = chroma.mix(p.DarkVibrant?.hex || '#333', 'rgb(38,38,38)', 0.7);
	const muted = chroma.mix(p.DarkVibrant?.hex || '#333', 'rgb(38,38,38)', 0.95);
	const bgStyles = {
		background: `linear-gradient(45deg, ${muted} 5%, ${muted} 45%, ${lessMuted} 95%)`,
	};

	return {
		bgStyles,
		darkMuted: p.DarkMuted?.hex || DEFAULT_PALETTE.darkMuted,
		darkVibrant: p.DarkVibrant?.hex || DEFAULT_PALETTE.darkVibrant,
		lightMuted: p.LightMuted?.hex || DEFAULT_PALETTE.lightMuted,
		lightVibrant: p.LightVibrant?.hex || DEFAULT_PALETTE.lightVibrant,
		muted: p.Muted?.hex || DEFAULT_PALETTE.muted,
		vibrant: p.Vibrant?.hex || DEFAULT_PALETTE.vibrant,
	} as Palette;
};
