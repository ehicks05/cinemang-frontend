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

	const base = {
		darkMuted: p.DarkMuted?.hex || DEFAULT_PALETTE.darkMuted,
		darkVibrant: p.DarkVibrant?.hex || DEFAULT_PALETTE.darkVibrant,
		lightMuted: p.LightMuted?.hex || DEFAULT_PALETTE.lightMuted,
		lightVibrant: p.LightVibrant?.hex || DEFAULT_PALETTE.lightVibrant,
		muted: p.Muted?.hex || DEFAULT_PALETTE.muted,
		vibrant: p.Vibrant?.hex || DEFAULT_PALETTE.vibrant,
	};

	// slightly vary `darkVibrant` for use in background gradients
	const lessMuted = `color-mix(in oklch, ${base.darkVibrant}, #131313 50%)`;
	const moreMuted = `color-mix(in oklch, ${base.darkVibrant}, #262626 90%)`;
	const bgStyles = {
		background: `linear-gradient(45deg, ${moreMuted} 5%, ${moreMuted} 45%, ${lessMuted} 95%)`,
	};

	return {
		...base,
		bgStyles,
	} as Palette;
};
