import chroma from 'chroma-js';
import Vibrant from 'node-vibrant';
import { useQuery } from '@tanstack/react-query';

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
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  const p = await new Vibrant(img).getPalette();

  const lessMuted = chroma.mix(
    p.DarkVibrant?.getHex() || '#333',
    'rgb(38,38,38)',
    0.7,
  );
  const muted = chroma.mix(p.DarkVibrant?.getHex() || '#333', 'rgb(38,38,38)', 0.95);
  const bgStyles = {
    background: `linear-gradient(45deg, ${muted} 5%, ${muted} 45%, ${lessMuted} 95%)`,
  };

  return {
    bgStyles,
    darkMuted: p.DarkMuted?.getHex() || DEFAULT_PALETTE.darkMuted,
    darkVibrant: p.DarkVibrant?.getHex() || DEFAULT_PALETTE.darkVibrant,
    lightMuted: p.LightMuted?.getHex() || DEFAULT_PALETTE.lightMuted,
    lightVibrant: p.LightVibrant?.getHex() || DEFAULT_PALETTE.lightVibrant,
    muted: p.Muted?.getHex() || DEFAULT_PALETTE.muted,
    vibrant: p.Vibrant?.getHex() || DEFAULT_PALETTE.vibrant,
  };
};

export const usePalette = (imageUrl: string) => {
  const query = useQuery({queryKey: ['palette', imageUrl], queryFn: () => toPalette(imageUrl)});

  return query;
};
