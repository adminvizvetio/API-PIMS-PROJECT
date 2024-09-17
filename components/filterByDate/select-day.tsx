import DatePicker from "react-datepicker";

interface SelectDayProps {
  startDate: Date;
  onChange: (sDate: Date) => void;
}

const SelectDay: React.FC<SelectDayProps> = ({ startDate, onChange }) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(date);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center z-50">
      <p className="my-2 text-base text-blue-600">
        {startDate && startDate.getMonth() + 1}/
        {startDate && startDate.getDate()}/
        {startDate && startDate.getFullYear()}
      </p>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="Select a date"
        inline
      />
    </div>
  );
};

export default SelectDay;
