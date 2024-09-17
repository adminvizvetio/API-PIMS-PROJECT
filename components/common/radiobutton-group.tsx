import { useEffect, useState } from "react";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioButtonGroupProps {
  options: RadioOption[];
  name: string;
  selected: string;
  onChange: (item: string) => void;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
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
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      {options.map((option) => (
        <div key={option.value}>
          <input
            type="radio"
            id={option.value}
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
            className="hidden"
            required
          />
          <label
            key={option.value}
            htmlFor={option.value}
            className={
              selectedValue === option.value
                ? "inline-flex items-center justify-start w-full p-4 text-blue-800 bg-white border border-blue-600 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                : "inline-flex items-center justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            }
          >
            <div className="block">
              <div className="w-full text-sm">{option.label}</div>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
