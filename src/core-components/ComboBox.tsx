import { Fragment, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { HiCheck, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { SetQuery, QueryParamConfigMap, DecodedValueMap } from 'use-query-params';

type Id = string | number;

export interface Option {
  id: Id;
  imageUrl: string;
  label: string;
}

interface Props<T> {
  form: DecodedValueMap<QueryParamConfigMap>;
  formKey: string;
  mapper: (input: T) => Option;
  onChange: SetQuery<QueryParamConfigMap>;
  options: T[];
  selectedOptionIds: Id[];
}

// reasoning for the T,:
// https://github.com/microsoft/TypeScript/issues/15713#issuecomment-499474386
const ComboBox = <T,>({
  options,
  selectedOptionIds,
  formKey,
  form,
  onChange,
  mapper,
}: Props<T>) => {
  const [query, setQuery] = useState('');

  const parsedOptions = options.map(mapper);

  const filteredOptions =
    query === ''
      ? parsedOptions
      : parsedOptions.filter(({ label }) =>
          label.toLowerCase().includes(query.toLowerCase()),
        );

  const handleChange = (values: Id[]) => {
    onChange({ ...form, [formKey]: values });
  };

  return (
    <div className="relative">
      <Combobox
        defaultValue={selectedOptionIds}
        multiple
        onChange={values => handleChange(values)}
      >
        <Combobox.Input
          className="w-full bg-gray-700"
          onChange={event => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute right-2 top-1.5 flex w-4 flex-col">
          <HiChevronUp />
          <HiChevronDown />
        </Combobox.Button>
        <Combobox.Options className="absolute flex w-full flex-col bg-gray-700">
          {filteredOptions.map(option => (
            <Combobox.Option as={Fragment} key={option.id} value={option.id}>
              {({ active, selected }) => (
                <li
                  className={`flex cursor-pointer items-center justify-between bg-gray-700 p-2 ${
                    active ? 'bg-gray-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      alt="logo"
                      className={`h-6 w-6 rounded ${!selected ? 'opacity-50' : ''}`}
                      src={option.imageUrl}
                    />
                    <span className={selected ? 'font-bold' : ''}>
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
