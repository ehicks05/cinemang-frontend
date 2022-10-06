import { Fragment, useState } from "react";
import { Combobox } from "@headlessui/react";
import { HiCheck, HiChevronDown, HiChevronUp } from "react-icons/hi";

interface Option {
  id: string | number;
  label: string;
  imageUrl: string;
}

interface Props {
  options: Option[];
  selectedOptions: (string | number)[];
  onChange: (selectedOptions: (string | number)[]) => void;
}

const ComboBox = ({ options, onChange }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter(({ label }) => {
          return label.toLowerCase().includes(query.toLowerCase());
        });

  const handleChange = (values: Option[]) => {
    setSelectedOptions(values);
    onChange(values.map((v) => v.id));
  };

  return (
    <div className="relative">
      <Combobox
        value={selectedOptions}
        onChange={handleChange}
        multiple
        nullable
      >
        {/* {JSON.stringify(selectedOptions, null, 2)} */}
        <Combobox.Input
          className={"relative bg-gray-700"}
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: Option) => option.label}
        />
        <Combobox.Button
          className={"flex flex-col absolute right-2 top-1.5 w-4"}
        >
          <HiChevronUp />
          <HiChevronDown />
        </Combobox.Button>
        <Combobox.Options className={"flex flex-col bg-gray-700"}>
          {filteredOptions.map((option) => (
            <Combobox.Option key={option.label} value={option} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={`flex items-center justify-between p-2 cursor-pointer bg-gray-700 ${
                    active ? "bg-gray-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="h-6 w-6 rounded"
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
