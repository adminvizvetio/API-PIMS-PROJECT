import DatePicker from "react-datepicker";
import { startOfQuarter, endOfQuarter } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/additional-styles/custom-datepicker.css";

interface SelectQuarterProps {
  startDate: Date;
  endDate: Date;
  onChange: (sDate: Date, eDate: Date) => void;
}

const SelectQuarter: React.FC<SelectQuarterProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleQuarterChange = (date: any) => {
    const startOfQuarterDate = startOfQuarter(date);
    const endOfQuarterDate = endOfQuarter(date);

    onChange(startOfQuarterDate, endOfQuarterDate);
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
        onChange={handleQuarterChange}
        dateFormat="MMMM yyyy"
        showQuarterYearPicker
        inline
        placeholderText="Select a month in a quarter"
      />
    </div>
  );
};

export default SelectQuarter;
