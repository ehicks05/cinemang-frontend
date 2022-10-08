import { Button, ComboBox } from "core-components";
import { useState } from "react";
import { FC } from "react";
import { UnmountClosed } from "react-collapse";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { useQueryParams } from "use-query-params";
import { Genre, Language, WatchProvider } from "../../types";

interface Props {
  languages: Language[];
  genres: Genre[];
  watchProviders: WatchProvider[];
}

const SearchForm: FC<Props> = ({ languages, genres, watchProviders }) => {
  const [isOpen, setIsOpen] = useState(process.env.NODE_ENV !== "production");
  const Icon = isOpen ? FaChevronUp : FaChevronDown;
  return (
    <div className="flex flex-col mx-auto gap-4 p-4 bg-gray-800 rounded-lg">
      <div
        className="flex gap-32 justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl select-none">Search</span>
        <span>
          <Icon className="inline" />
        </span>
      </div>
      <UnmountClosed isOpened={isOpen}>
        <FormFields
          languages={languages}
          genres={genres}
          watchProviders={watchProviders}
        />
      </UnmountClosed>
    </div>
  );
};

const FormFields: FC<Props> = ({ languages, genres, watchProviders }) => {
  const [form, setForm] = useQueryParams();

  const getStreamLabel = (count: number) =>
    count !== 0 ? `(${count} selected)` : "";

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm sm:text-sm">
      <div className="flex gap-2">
        <div className="flex-grow">
          <div>Title</div>
          <div>
            <input
              type="text"
              className="w-full bg-gray-700"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-full">
          <div>Stream {getStreamLabel(form.watchProviders.length)}</div>
          <div>
            <ComboBox
              options={
                watchProviders.sort(
                  (o1, o2) => o1.display_priority - o2.display_priority
                )
                // .slice(0, 16)
              }
              selectedOptionIds={form.watchProviders}
              formKey="watchProviders"
              form={form}
              onChange={setForm}
              mapper={(provider) => ({
                id: provider.provider_id,
                label: provider.provider_name,
                imageUrl: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
              })}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-shrink-0">
          <div className="whitespace-nowrap">Min Votes</div>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={form.maxVotes || undefined}
              className="w-full bg-gray-700"
              value={form.minVotes}
              onChange={(e) =>
                setForm({ ...form, minVotes: Number(e.target.value) })
              }
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
              type="number"
              className="w-full bg-gray-700"
              value={form.minRating}
              onChange={(e) =>
                setForm({
                  ...form,
                  minRating: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              className="w-full bg-gray-700"
              value={form.maxRating}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxRating: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>
      <div>
        <div>Released</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            className="w-full bg-gray-700"
            value={form.minReleasedAt}
            onChange={(e) =>
              setForm({
                ...form,
                minReleasedAt: e.target.value,
              })
            }
          />
          <input
            type="date"
            className="w-full bg-gray-700"
            value={form.maxReleasedAt}
            onChange={(e) =>
              setForm({
                ...form,
                maxReleasedAt: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex flex-col w-full">
          <div>Language</div>
          <div>
            <select
              className="w-full bg-gray-700"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
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

        <div className="flex flex-col w-full">
          <div>Genre</div>
          <div>
            <select
              className="w-full bg-gray-700"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
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
            value={form.sortColumn}
            onChange={(e) => setForm({ ...form, sortColumn: e.target.value })}
          >
            {[
              { value: "vote_average", label: "User Rating" },
              { value: "vote_count", label: "User Votes" },
              { value: "released_at", label: "Released" },
            ].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            className="px-3 text-white bg-gray-700 border-gray-500 border-l-0"
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
    </div>
  );
};

export default SearchForm;
