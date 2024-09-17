import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/additional-styles/custom-datepicker.css";

interface SelectDateRangeProps {
  startDate: Date;
  endDate: Date;
  onChange: (sDate: Date, eDate: Date) => void;
}

const SelectDateRange: React.FC<SelectDateRangeProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleChange = (dates: [any, any]) => {
    const [start, end] = dates;
    onChange(start, end);
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
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        showYearDropdown
        showMonthDropdown
        selectsRange
        inline
      />
    </div>
  );
};

export default SelectDateRange;
