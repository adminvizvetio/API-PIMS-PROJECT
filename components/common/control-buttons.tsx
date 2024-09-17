import {
  STATUS_COMPLETE,
  STATUS_START,
  STATUS_IDLE,
  STATUS_PAUSE,
  STATUS_RESTART,
  STATUS_RESUME,
  STATUS_STOP,
} from "@/utils/constants";
import { FC } from "react";

interface ControlButtonsProps {
  status: string;
  onPause: () => void;
  onPlay: () => void;
  onStop: () => void;
  onRestart: () => void;
}

const ControlButtons: FC<ControlButtonsProps> = ({
  status,
  onPause,
  onPlay,
  onStop,
  onRestart,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="flex space-x-4 mb-4">
        {/* Play Button */}
        {(status === STATUS_PAUSE ||
          status === STATUS_IDLE ||
          status === STATUS_STOP ||
           status === STATUS_COMPLETE) && (
          <button onClick={onPlay}>
            <svg
              className="h-10 w-10 text-blue-500 hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}

        {/* Pause Button */}
        {(status === STATUS_RESUME || status === STATUS_RESTART  || status === STATUS_START) && (
          <button onClick={onPause}>
            <svg
              className="h-10 w-10 text-blue-500 hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}

        {/* Stop Button */}
        <button
          onClick={onStop}
          disabled={
            status === STATUS_IDLE || status === STATUS_STOP ? true : false
          }
        >
          <svg
            className={
              status === STATUS_IDLE || status === STATUS_STOP
                ? "h-10 w-10 text-gray-500"
                : "h-10 w-10 text-blue-500 hover:scale-110"
            }
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
        </button>

        {/* Restart Button */}

        <button
          onClick={onRestart}
          disabled={
            status === STATUS_IDLE || status === STATUS_STOP ? true : false
          }
        >
          <svg
            className={
              status === STATUS_IDLE || status === STATUS_STOP
                ? "h-10 w-10 text-gray-500"
                : "h-10 w-10 text-blue-500 hover:scale-110"
            }
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />{" "}
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
          </svg>
        </button>
      </div>
      <div>
        <p className="text-sm">Status: {status}</p>
      </div>
    </div>
  );
};

export default ControlButtons;
