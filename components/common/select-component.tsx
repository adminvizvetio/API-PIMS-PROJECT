import { useEffect, useState } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectComponentProps {
  options: SelectOption[];
  name: string;
  selected: string;
  onChange: (item: string) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  name,
  selected,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(selected);

  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  const handleChange = (event: any) => {
    // setSelectedValue(event.target.value);
    // console.log(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <select
        id="large"
        className="block w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
