import { useState } from "react";
import DatePicker from "react-datepicker";
import {getDateTimeString,
  msToTime
} from "@/utils/utils"
interface OutPutProps {
  data: any;
  pushPercent: number;
  startTime: Date | undefined;
  runTime: number;
  finishTime: Date| undefined;
  message: string;
}


const Output: React.FC<OutPutProps> = ({
  data,
  pushPercent,
  startTime,
  runTime,
  finishTime,
  message,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Page Total</div>
          <p className="mt-2 bg-gray-50 text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {data && data?.meta.items_page_total}
          </p>
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Items Total</div>
          <p className="mt-2 bg-gray-50 text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {data && data?.meta.items_total}
          </p>
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Progressing</div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
                style={{ width: `${pushPercent}%` }}
              >
                {" "}
                {pushPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Start Time</div>
          <p className="mt-2 bg-gray-50 text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {getDateTimeString(startTime)}
          </p>
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Run Time</div>
          <p className="mt-2 bg-gray-50 text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {runTime !== 0 && msToTime(runTime)}
          </p>
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Finish Time</div>
          <p className="mt-2 bg-gray-50 text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {getDateTimeString(finishTime)}
          </p>
        </div>
      </div>
      <div className="flex-col justify-start w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="block">
          <div className="w-full text-sm">Message</div>
          <div className="mt-2 bg-gray-50 text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <pre className="max-h-48 overflow-auto">{message}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
