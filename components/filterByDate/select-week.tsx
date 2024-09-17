import React from "react";
import DatePicker from "react-datepicker";
import { startOfWeek, endOfWeek } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/additional-styles/custom-datepicker.css";

interface SelectWeekProps {
  startDate: Date;
  endDate: Date;
  onChange: (sDate: Date, eDate: Date) => void;
}

const SelectWeek: React.FC<SelectWeekProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleWeekChange = (date: any) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 }); // Sunday end

    onChange(startOfWeekDate, endOfWeekDate);
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
        onChange={handleWeekChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a week"
        calendarStartDay={1}
        showYearDropdown
        showMonthDropdown
        showWeekPicker
        inline
      />
    </div>
  );
};

export default SelectWeek;
