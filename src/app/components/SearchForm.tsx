import { Button, ComboBox } from '../../core-components';
import { useState, FC } from 'react';

import { UnmountClosed } from 'react-collapse';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import {
  DecodedValueMap,
  QueryParamConfigMap,
  useQueryParams,
} from 'use-query-params';
import { DEFAULT_SEARCH_FORM } from '../../constants';
import { Genre, Language, WatchProvider } from '../../types';

interface Props {
  genres: Genre[];
  languages: Language[];
  watchProviders: WatchProvider[];
}

const SearchForm: FC<Props> = ({ languages, genres, watchProviders }) => {
  const [isOpen, setIsOpen] = useState(process.env.NODE_ENV !== 'production');
  const Icon = isOpen ? FaChevronUp : FaChevronDown;
  return (
    <div className="mx-auto flex flex-col gap-4 rounded-lg bg-gray-800 p-4">
      <div
        className="flex cursor-pointer justify-between gap-32"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="select-none text-xl">Search</span>
        <span>
          <Icon className="inline" />
        </span>
      </div>
      <UnmountClosed isOpened={isOpen}>
        <FormFields
          genres={genres}
          languages={languages}
          watchProviders={watchProviders}
        />
      </UnmountClosed>
    </div>
  );
};

const FormFields: FC<Props> = ({ languages, genres, watchProviders }) => {
  const [form, setFormInner] = useQueryParams();

  const setForm = (updatedForm: DecodedValueMap<QueryParamConfigMap>) => {
    if (updatedForm.page === form.page) {
      updatedForm.page = 0;
    }
    setFormInner(updatedForm);
  };

  const getStreamLabel = (count: number) =>
    count !== 0 ? `(${count} selected)` : '';

  return (
    <div className="grid gap-4 text-sm sm:grid-cols-2 sm:text-sm lg:grid-cols-3 xl:grid-cols-4">
      <div className="flex gap-2">
        <div className="flex-grow">
          <div>Title</div>
          <div>
            <input
              className="w-full bg-gray-700"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              type="text"
              value={form.title}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-full">
          <div>Stream {getStreamLabel(form.watchProviders.length)}</div>
          <div>
            <ComboBox
              form={form}
              formKey="watchProviders"
              mapper={(provider) => ({
                id: provider.provider_id,
                imageUrl: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                label: provider.provider_name,
              })}
              onChange={setForm}
              options={watchProviders
                .sort((o1, o2) => o1.display_priority - o2.display_priority)
                .filter((wp) => wp.count > 0)}
              selectedOptionIds={form.watchProviders}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-shrink-0">
          <div className="whitespace-nowrap">Min Votes</div>
          <div className="flex gap-2">
            <input
              className="w-full bg-gray-700"
              max={form.maxVotes || undefined}
              min={1}
              onChange={(e) =>
                setForm({ ...form, minVotes: Number(e.target.value) })
              }
              type="number"
              value={form.minVotes}
            />
            {/* <input
              type="number"
              min={form.minVotes || undefined}
              className="w-full bg-gray-700"
              value={form.maxVotes}
              onChange={(e) =>
                setForm({ ...form, maxVotes: Number(e.target.value) })
              }
            /> */}
          </div>
        </div>
        <div className="flex-shrink">
          <div>Rating</div>
          <div className="flex gap-2">
            <input
              className="w-full bg-gray-700"
              onChange={(e) =>
                setForm({
                  ...form,
                  minRating: Number(e.target.value),
                })
              }
              type="number"
              value={form.minRating}
            />
            <input
              className="w-full bg-gray-700"
              onChange={(e) =>
                setForm({
                  ...form,
                  maxRating: Number(e.target.value),
                })
              }
              type="number"
              value={form.maxRating}
            />
          </div>
        </div>
      </div>
      <div>
        <div>Released</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="w-full bg-gray-700"
            onChange={(e) =>
              setForm({
                ...form,
                minReleasedAt: e.target.value,
              })
            }
            type="date"
            value={form.minReleasedAt}
          />
          <input
            className="w-full bg-gray-700"
            onChange={(e) =>
              setForm({
                ...form,
                maxReleasedAt: e.target.value,
              })
            }
            type="date"
            value={form.maxReleasedAt}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex w-full flex-col">
          <div>Language</div>
          <div>
            <select
              className="w-full bg-gray-700"
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              value={form.language}
            >
              <option value="">Any</option>
              {languages
                .sort((o1, o2) => o2.count - o1.count)
                .slice(0, 10)
                .map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <div>Genre</div>
          <div>
            <select
              className="w-full bg-gray-700"
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              value={form.genre}
            >
              <option value="">Any</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div>Sort</div>
        <div className="flex">
          <select
            className="w-full bg-gray-700"
            onChange={(e) => setForm({ ...form, sortColumn: e.target.value })}
            value={form.sortColumn}
          >
            {[
              { label: 'User Rating', value: 'vote_average' },
              { label: 'User Votes', value: 'vote_count' },
              { label: 'Released', value: 'released_at' },
            ].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            className="border-l-0 border-gray-500 bg-gray-700 px-3 text-white"
            onClick={() => setForm({ ...form, ascending: !form.ascending })}
          >
            {form.ascending ? (
              <HiSortAscending className="text-xl" />
            ) : (
              <HiSortDescending className="text-xl" />
            )}
          </Button>
        </div>
      </div>

      <div>
        <div>&nbsp;</div>
        <div className="flex">
          <Button
            className="border-gray-500 bg-gray-700 px-3 py-2 text-base text-white"
            onClick={() => setForm({ ...DEFAULT_SEARCH_FORM })}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
