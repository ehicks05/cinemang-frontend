import { Loading } from '../../../../core-components';
import { getTmdbImage } from '../../../../utils';
import { useFetchFilm } from '@/hooks/useFetchFilms';
import { usePalette } from '@/hooks/usePalette';
import Film from '../../Film';

const HoverFilm = ({ id }: { id: number }) => {
  const { data: film, error, isLoading } = useFetchFilm(id);
  const posterPath = getTmdbImage({ path: film?.poster_path });
  const {
    data: palette,
    error: paletteError,
    isLoading: isPaletteLoading,
  } = usePalette(posterPath);

  return (
    <div className="hidden text-gray-50 shadow-2xl sm:block sm:max-w-md">
      {(error || paletteError || isLoading || isPaletteLoading) && (
        <Loading
          error={error || paletteError}
          loading={isLoading || isPaletteLoading}
        />
      )}
      {film && palette && <Film film={film} palette={palette} />}
    </div>
  );
};

export default HoverFilm;
