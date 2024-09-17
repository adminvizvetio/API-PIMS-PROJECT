import DatePicker from "react-datepicker";
import { startOfMonth, endOfMonth } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/additional-styles/custom-datepicker.css";

interface SelectMonthProps {
  startDate: Date;
  endDate: Date;
  onChange: (sDate: Date, eDate: Date) => void;
}

const SelectMonth: React.FC<SelectMonthProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleMonthChange = (date: any) => {
    const startOfMonthDate = startOfMonth(date);
    const endOfMonthDate = endOfMonth(date);
    onChange(startOfMonthDate, endOfMonthDate);
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
        onChange={handleMonthChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        showYearDropdown
        placeholderText="Select a month"
        inline
      />
    </div>
  );
};

export default SelectMonth;
