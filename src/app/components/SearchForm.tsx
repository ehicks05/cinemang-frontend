import { useState } from 'react';

import { UnmountClosed } from 'react-collapse';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { useQueryParams } from 'use-query-params';
import { useAtom } from 'jotai';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_MOVIE_SEARCH_FORM,
  DEFAULT_TV_SEARCH_FORM,
  MOVIE_QUERY_PARAMS,
  QUERY_PARAMS,
  SHOW_QUERY_PARAMS,
} from '../../queryParams';
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

const Title = () => {
  const [form, _setForm] = useQueryParams(MOVIE_QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
    <div className="flex gap-2">
      <div className="flex-grow">
        <div>Title</div>
        <div>
          <input
            className="w-full bg-gray-700"
            onChange={e => setForm({ title: e.target.value })}
            type="text"
            value={form.title}
          />
        </div>
      </div>
    </div>
  );
};

const Name = () => {
  const [form, _setForm] = useQueryParams(SHOW_QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
    <div className="flex gap-2">
      <div className="flex-grow">
        <div>Title</div>
        <div>
          <input
            className="w-full bg-gray-700"
            onChange={e => setForm({ name: e.target.value })}
            type="text"
            value={form.name}
          />
        </div>
      </div>
    </div>
  );
};

const CreditName = () => {
  const [form, _setForm] = useQueryParams(QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
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
  );
};

const Providers = () => {
  const [{ providers }] = useAtom(systemDataAtom);
  const [form, _setForm] = useQueryParams(QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  const getStreamLabel = (count: number) =>
    count !== 0 ? `(${count} selected)` : '';

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <div>Stream {getStreamLabel(form.providers.length)}</div>
        <div>
          <ComboBox
            mapper={p => ({
              id: p.id,
              imageUrl: getTmdbImage({
                path: p.logo_path,
                width: 'original',
              }),
              label: p.name,
            })}
            onChange={value => setForm({ providers: value })}
            options={providers
              .sort((o1, o2) => o1.display_priority - o2.display_priority)
              .filter(p => p.count > 0)}
            selectedOptionIds={form.providers as number[]}
          />
        </div>
      </div>
    </div>
  );
};

const MinVotes = () => {
  const { pathname } = useLocation();
  const queryConfig = pathname === '/tv' ? SHOW_QUERY_PARAMS : MOVIE_QUERY_PARAMS;

  const [form, _setForm] = useQueryParams(queryConfig);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
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
  );
};

const Rating = () => {
  const [form, _setForm] = useQueryParams(QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
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
  );
};

const Released = () => {
  const [form, _setForm] = useQueryParams(MOVIE_QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
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
  );
};

const FirstAirDate = () => {
  const [form, _setForm] = useQueryParams(SHOW_QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
    <div>
      <div>First Aired</div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="w-full bg-gray-700"
          onChange={e => setForm({ minFirstAirDate: e.target.value })}
          type="date"
          value={form.minFirstAirDate}
        />
        <input
          className="w-full bg-gray-700"
          onChange={e => setForm({ maxFirstAirDate: e.target.value })}
          type="date"
          value={form.maxFirstAirDate}
        />
      </div>
    </div>
  );
};

const Language = () => {
  const [{ languages }] = useAtom(systemDataAtom);
  const [form, _setForm] = useQueryParams(QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
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
  );
};

const Genre = () => {
  const { pathname } = useLocation();
  const [{ genres }] = useAtom(systemDataAtom);
  const mediaGenres = genres.filter(
    o => o.type !== (pathname === '/tv' ? 'MOVIE' : 'SHOW'),
  );
  const [form, _setForm] = useQueryParams(QUERY_PARAMS);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
    <div className="flex w-full flex-col">
      <div>Genre</div>
      <div>
        <select
          className="w-full bg-gray-700"
          onChange={e => setForm({ genre: e.target.value })}
          value={form.genre}
        >
          <option value="">Any</option>
          {mediaGenres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const Sort = () => {
  const { pathname } = useLocation();
  const queryConfig = pathname === '/tv' ? SHOW_QUERY_PARAMS : MOVIE_QUERY_PARAMS;
  const [form, _setForm] = useQueryParams(queryConfig);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  const OPTIONS = [
    { label: 'User Rating', value: 'vote_average' },
    { label: 'User Votes', value: 'vote_count' },
    'minReleasedAt' in queryConfig
      ? { label: 'Released', value: 'released_at' }
      : { label: 'First Aired', value: 'first_air_date' },
  ];

  return (
    <div>
      <div>Sort</div>
      <div className="flex">
        <select
          className="w-full bg-gray-700"
          onChange={e => setForm({ sortColumn: e.target.value })}
          value={form.sortColumn}
        >
          {OPTIONS.map(option => (
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
  );
};

const ResetButton = () => {
  const { pathname } = useLocation();
  const queryConfig = pathname === '/tv' ? SHOW_QUERY_PARAMS : MOVIE_QUERY_PARAMS;
  const defaults =
    pathname === 'tv' ? DEFAULT_TV_SEARCH_FORM : DEFAULT_MOVIE_SEARCH_FORM;
  const [form, _setForm] = useQueryParams(queryConfig);

  const setForm = (update: Record<string, any>) => {
    _setForm({ ...form, ...update, ...(!update.page && { page: 0 }) });
  };

  return (
    <div>
      {/* Field title placeholder */}
      <div>&nbsp;</div>
      <div className="flex">
        <Button
          className="border-gray-500 bg-gray-700 px-3 py-2 text-base text-white"
          onClick={() => setForm({ ...defaults })}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

const FormFields = () => {
  const { pathname } = useLocation();
  const mode = pathname === '/tv' ? 'tv' : 'movie';

  return (
    <div className="grid gap-4 text-sm sm:grid-cols-2 sm:text-sm lg:grid-cols-3 xl:grid-cols-4">
      {mode === 'movie' && <Title />}
      {mode === 'tv' && <Name />}
      <CreditName />
      <Providers />
      <div className="flex gap-2">
        <MinVotes />
        <Rating />
      </div>
      {mode === 'movie' && <Released />}
      {mode === 'tv' && <FirstAirDate />}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Language />
        <Genre />
      </div>

      <Sort />

      <ResetButton />
    </div>
  );
};

export default SearchForm;
