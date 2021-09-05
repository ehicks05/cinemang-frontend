import { useState } from "react";
import { FC } from "react";
import { UnmountClosed } from "react-collapse";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

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
  minVotes: 0,
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
}

const SearchForm: FC<Props> = ({ form, setForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? BiUpArrow : BiDownArrow;
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
        <div className="grid grid-cols-2 gap-2">
          <FormFields form={form} setForm={setForm} />
        </div>
      </UnmountClosed>
    </div>
  );
};

const FormFields: FC<Props> = ({ form, setForm }) => {
  return (
    <>
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
      <div>Sort Column</div>
      <div>
        <select
          className="w-full bg-gray-700"
          value={form.sortColumn}
          onChange={(e) => setForm({ ...form, sortColumn: e.target.value })}
        >
          {["user_vote_average", "user_vote_count"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SearchForm;
