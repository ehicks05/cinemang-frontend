import { Fragment, useState } from "react";
import { Combobox } from "@headlessui/react";
import { HiCheck, HiChevronDown, HiChevronUp } from "react-icons/hi";
import {
  SetQuery,
  QueryParamConfigMap,
  DecodedValueMap,
} from "use-query-params";

type Id = string | number;

export interface Option {
  id: Id;
  label: string;
  imageUrl: string;
}

interface Props<T> {
  options: T[];
  selectedOptionIds: Id[];
  formKey: string;
  form: DecodedValueMap<QueryParamConfigMap>;
  onChange: SetQuery<QueryParamConfigMap>;
  mapper: (input: T) => Option;
}

const ComboBox = <T extends unknown>({
  options,
  selectedOptionIds,
  formKey,
  form,
  onChange,
  mapper,
}: Props<T>) => {
  const [query, setQuery] = useState("");

  const parsedOptions = options.map(mapper);

  const filteredOptions =
    query === ""
      ? parsedOptions
      : parsedOptions.filter(({ label }) => {
          return label.toLowerCase().includes(query.toLowerCase());
        });

  const handleChange = (values: Id[]) => {
    onChange({ ...form, [formKey]: values });
  };

  return (
    <div className="relative">
      <Combobox
        defaultValue={selectedOptionIds}
        onChange={(values) => handleChange(values)}
        multiple
      >
        <Combobox.Input
          className={"w-full bg-gray-700"}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button
          className={"flex flex-col absolute right-2 top-1.5 w-4"}
        >
          <HiChevronUp />
          <HiChevronDown />
        </Combobox.Button>
        <Combobox.Options className={"flex flex-col bg-gray-700"}>
          {filteredOptions.map((option) => (
            <Combobox.Option key={option.id} value={option.id} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={`flex items-center justify-between p-2 cursor-pointer bg-gray-700 ${
                    active ? "bg-gray-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`h-6 w-6 rounded ${
                        !selected ? "opacity-50" : ""
                      }`}
                      src={option.imageUrl}
                      alt="logo"
                    />
                    <span className={selected ? "font-bold" : ""}>
                      {option.label}
                    </span>
                  </div>
                  {selected && <HiCheck />}
                </li>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};

export default ComboBox;
