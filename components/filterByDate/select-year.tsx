import DatePicker from "react-datepicker";
import { startOfYear, endOfYear } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/additional-styles/custom-datepicker.css";

interface SelectYearProps {
  startDate: Date;
  endDate: Date;
  onChange: (sDate: Date, eDate: Date) => void;
}

const SelectYear: React.FC<SelectYearProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleYearChange = (date: any) => {
    const startOfYearDate = startOfYear(date);
    const endOfYearDate = endOfYear(date);
    onChange(startOfYearDate, endOfYearDate);
  };

  return (
    <div className="flex flex-col items-center justify-center z-50">
      <div className="flex">
        <p className="my-2 text-base text-blue-600">
          {startDate && startDate.getMonth() + 1}/
          {startDate && startDate.getDate()}/
          {startDate && startDate.getFullYear()}
        </p>
        <p className="my-2 text-base text-blue-600">&nbsp;-&nbsp;</p>
        <p className="my-2 text-base text-blue-600">
          {endDate && endDate.getMonth() + 1}/{endDate && endDate.getDate()}/
          {endDate && endDate.getFullYear()}
        </p>
      </div>
      <DatePicker
        selected={startDate}
        onChange={handleYearChange}
        dateFormat="yyyy"
        showYearPicker
        showYearDropdown
        placeholderText="Select a Year"
        inline
      />
    </div>
  );
};

export default SelectYear;
