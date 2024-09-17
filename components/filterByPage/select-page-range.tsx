import { ITEM_MAX_LIMIT } from "@/utils/constants";

interface SelectPageProps {
  pageSize: string;
  pageStart: string;
  pageEnd: string;
  onChange: (type: string, value: string) => void;
}

const SelectPage: React.FC<SelectPageProps> = ({
  pageSize,
  pageStart,
  pageEnd,
  onChange,
}) => {
  const handlePageChange = (event: any) => {
    onChange(event.target.name, event.target.value);
  };
  

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-xs">Page Size</div>
          <input
            type="number"
            value={pageSize}
            onChange={handlePageChange}
            id="page-size"
            name="page-size"
            max={ITEM_MAX_LIMIT}
            min={1}
            aria-describedby="helper-text-explanation"
            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="limit"
          />
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-xs">Page Start</div>
          <input
            type="number"
            value={pageStart}
            onChange={handlePageChange}
            id="page-start"
            name="page-start"
            min={1}
            aria-describedby="helper-text-explanation"
            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="page"
          />
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-xs">Page End</div>
          <input
            type="number"
            value={pageEnd}
            onChange={handlePageChange}
            id="page-end"
            name="page-end"
            min={1}
            aria-describedby="helper-text-explanation"
            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="page"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
