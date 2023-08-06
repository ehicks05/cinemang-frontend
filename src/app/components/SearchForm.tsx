import { useState } from 'react';

import { UnmountClosed } from 'react-collapse';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { useQueryParams } from 'use-query-params';
import { useAtom } from 'jotai';
import { DEFAULT_MOVIE_SEARCH_FORM, MOVIE_QUERY_PARAMS } from '../../queryParams';
import { systemDataAtom } from '../../atoms';
import { Button, ComboBox } from '../../core-components';
import { getTmdbImage } from '../../utils';

const SearchForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? FaChevronUp : FaChevronDown;
  return (
    <div className="flex w-full flex-col gap-4 bg-gray-800 p-4 sm:rounded-lg">
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
        <FormFields />
      </UnmountClosed>
    </div>
  );
};

const Title = ({
  value,
  onChange,
}: {
  value: any;
  onChange: (value: any) => void;
}) => (
  <div className="flex gap-2">
    <div className="flex-grow">
      <div>Title</div>
      <div>
        <input
          className="w-full bg-gray-700"
          onChange={e => onChange(e.target.value)}
          type="text"
          value={value}
        />
      </div>
    </div>
  </div>
);

const FormFields = () => {
  const [form, _setForm] = useQueryParams(MOVIE_QUERY_PARAMS);
  const [{ genres, languages, watchProviders }] = useAtom(systemDataAtom);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  const getStreamLabel = (count: number) =>
    count !== 0 ? `(${count} selected)` : '';

  return (
    <div className="grid gap-4 text-sm sm:grid-cols-2 sm:text-sm lg:grid-cols-3 xl:grid-cols-4">
      <Title
        value={form.title}
        onChange={(value: any) => setForm({ title: value })}
      />
      <div className="flex gap-2">
        <div className="flex-grow">
          <div>Credits Include</div>
          <div>
            <input
              className="w-full bg-gray-700"
              onChange={e => setForm({ creditName: e.target.value })}
              type="text"
              value={form.creditName}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-full">
          <div>Stream {getStreamLabel(form.providers.length)}</div>
          <div>
            <ComboBox
              form={form}
              formKey="providers"
              mapper={provider => ({
                id: provider.id,
                imageUrl: getTmdbImage({
                  path: provider.logo_path,
                  width: 'original',
                }),
                label: provider.name,
              })}
              onChange={setForm}
              options={watchProviders
                .sort((o1, o2) => o1.display_priority - o2.display_priority)
                .filter(wp => wp.count > 0)}
              selectedOptionIds={form.providers as number[]}
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
              onChange={e => setForm({ minVotes: Number(e.target.value) })}
              type="number"
              value={form.minVotes}
            />
          </div>
        </div>
        <div className="flex-shrink">
          <div>Rating</div>
          <div className="flex gap-2">
            <input
              className="w-full bg-gray-700"
              onChange={e => setForm({ minRating: Number(e.target.value) })}
              type="number"
              value={form.minRating}
            />
            <input
              className="w-full bg-gray-700"
              onChange={e => setForm({ maxRating: Number(e.target.value) })}
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
            onChange={e => setForm({ minReleasedAt: e.target.value })}
            type="date"
            value={form.minReleasedAt}
          />
          <input
            className="w-full bg-gray-700"
            onChange={e => setForm({ maxReleasedAt: e.target.value })}
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
              onChange={e => setForm({ language: e.target.value })}
              value={form.language}
            >
              <option value="">Any</option>
              {languages
                .sort((o1, o2) => o2.count - o1.count)
                .slice(0, 10)
                .map(language => (
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
              onChange={e => setForm({ genre: e.target.value })}
              value={form.genre}
            >
              <option value="">Any</option>
              {genres.map(genre => (
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
            onChange={e => setForm({ sortColumn: e.target.value })}
            value={form.sortColumn}
          >
            {[
              { label: 'User Rating', value: 'vote_average' },
              { label: 'User Votes', value: 'vote_count' },
              { label: 'Released', value: 'released_at' },
            ].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            className="border-l-0 border-gray-500 bg-gray-700 px-3 text-white"
            onClick={() => setForm({ ascending: !form.ascending })}
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
            onClick={() => setForm({ ...DEFAULT_MOVIE_SEARCH_FORM })}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
