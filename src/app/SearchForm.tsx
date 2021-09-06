import { Button } from "components";
import { useState } from "react";
import { FC } from "react";
import { UnmountClosed } from "react-collapse";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { Genre, Language } from "./Home";

export interface ISearchForm {
  title?: string;
  minVotes?: number;
  maxVotes?: number;
  minReleased?: string;
  maxReleased?: string;
  minRating?: number;
  maxRating?: number;
  language?: string;
  genre?: string;

  sortColumn: string;
  ascending: boolean;
}

export const DEFAULT_SEARCH_FORM = {
  minVotes: 100,
  maxVotes: 100_000,
  minRating: 0,
  maxRating: 10,
  language: "eng",
  sortColumn: "user_vote_count",
  ascending: false,
};

interface Props {
  form: ISearchForm;
  setForm: React.Dispatch<React.SetStateAction<ISearchForm>>;
  languages: Language[];
  genres: Genre[];
}

const SearchForm: FC<Props> = ({ form, setForm, languages, genres }) => {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = isOpen ? FaChevronUp : FaChevronDown;
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">Search</span>
        <span>
          <Icon className="inline" />
        </span>
      </div>
      <UnmountClosed isOpened={isOpen}>
        <FormFields
          form={form}
          setForm={setForm}
          languages={languages}
          genres={genres}
        />
      </UnmountClosed>
    </div>
  );
};

const FormFields: FC<Props> = ({ form, setForm, languages, genres }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
      <div>Title</div>
      <div>
        <input
          type="text"
          className="w-full bg-gray-700"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>Votes</div>
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
        <input
          type="number"
          min={form.minVotes || undefined}
          className="w-full bg-gray-700"
          value={form.maxVotes}
          onChange={(e) =>
            setForm({ ...form, maxVotes: Number(e.target.value) })
          }
        />
      </div>
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
      <div>Released</div>
      <div className="flex gap-2">
        <input
          type="date"
          className="w-full bg-gray-700"
          value={form.minReleased}
          onChange={(e) =>
            setForm({
              ...form,
              minReleased: e.target.value,
            })
          }
        />
        <input
          type="date"
          className="w-full bg-gray-700"
          value={form.maxReleased}
          onChange={(e) =>
            setForm({
              ...form,
              maxReleased: e.target.value,
            })
          }
        />
      </div>

      <div>Language</div>
      <div>
        <select
          className="w-full bg-gray-700"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
        >
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

      <div>Genre</div>
      <div>
        <select
          className="w-full bg-gray-700"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div>Sort Column</div>
      <div className="flex">
        <select
          className="w-full bg-gray-700"
          value={form.sortColumn}
          onChange={(e) => setForm({ ...form, sortColumn: e.target.value })}
        >
          {[
            { value: "user_vote_average", label: "User Rating" },
            { value: "user_vote_count", label: "User Votes" },
            { value: "released", label: "Released" },
          ].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button
          className="px-4 text-white bg-gray-700 border-gray-500 border-l-0"
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
  );
};

export default SearchForm;
