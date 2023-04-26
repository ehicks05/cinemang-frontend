import { useTimeout } from 'react-use';
import { Loading } from '../../../../core-components';
import { getTmdbImage } from '../../../../utils';
import { useFetchFilm } from '@/hooks/useFetchFilms';
import { usePalette } from '@/hooks/usePalette';
import Film from '../../Film';

const container = 'hidden text-gray-50 shadow-2xl sm:block sm:max-w-md';

const HoverFilm = ({ id }: { id: number }) => {
  const { data: film, error, isLoading } = useFetchFilm(id);
  const posterPath = getTmdbImage({ path: film?.poster_path });
  const {
    data: palette,
    error: paletteError,
    isLoading: isPaletteLoading,
  } = usePalette(posterPath);
  const [isReady] = useTimeout(1000);

  if (isReady() && (error || paletteError || isLoading || isPaletteLoading)) {
    return (
      <div className={container}>
        <div
          className="flex flex-col gap-4 p-4 sm:rounded-lg"
          style={palette?.bgStyles || { background: '#333' }}
        >
          <Loading
            error={error || paletteError}
            loading={isLoading || isPaletteLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={container}>
      {film && palette && <Film film={film} palette={palette} />}
    </div>
  );
};

export default HoverFilm;
