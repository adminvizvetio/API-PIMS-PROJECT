import { DEFAULT_ACCOUNT, STORAGE_PULSE_ACCOUNTS } from "@/utils/constants";
import { useEffect, useState } from "react";
import { defaultEzyAccounts, defaultPulseAccounts } from "@/utils/utils";
import PulsModal from "../menu/pulse-env-modal";

export default function PulseListManager() {
  const [accounts, setAccounts] = useState<any[]>(defaultPulseAccounts);
  const [inputValue, setInputValue] = useState<string>("");
  const [status, setStatus] = useState(false);

  const [isOpenPulseModal, setIsOpenPulseModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedAccounts = localStorage.getItem(STORAGE_PULSE_ACCOUNTS);
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    } else {
      localStorage.setItem(
        STORAGE_PULSE_ACCOUNTS,
        JSON.stringify(defaultPulseAccounts)
      );
    }
  }, []);

  useEffect(() => {
    if (status) {
      localStorage.setItem(STORAGE_PULSE_ACCOUNTS, JSON.stringify(accounts));
    }
  }, [accounts]);

  useEffect(() => {
    setErrorMessage("");
  }, [inputValue]);

  const addItem = () => {
    if (inputValue.trim() !== "") {
      const existObj = accounts.find(
        (item: any) => item.clientName === inputValue
      );

      if (existObj) {
        setErrorMessage(
          "This account already exists. Please add a different client."
        );
      } else {
        const id = Number(Math.random() * 1000000000).toFixed(0);

        setAccounts([
          ...accounts,
          {
            id,
            clientName: inputValue,
            userName: "",
            password: "",
            installation: "",
            pass: false,
            newAccount: true,
          },
        ]);
        setInputValue("");
        setStatus(true);

        setSelectedClient({
          id,
          clientName: inputValue,
          userName: "",
          password: "",
          installation: "",
          pass: false,
          newAccount: true,
        });
        openPulseModal();
      }
    }
  };

  const removeItem = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index));
    setStatus(true);
  };

  const openPulseModal = () => setIsOpenPulseModal(true);
  const closePulseModal = () => setIsOpenPulseModal(false);

  const handleUpdateClient = (data: any) => {
    const updateAccounts = accounts.map((item, index) => {
      if (item.id === data.id) {
        return {
          ...item,
          ...data,
        };
      } else {
        return item;
      }
    });

    setAccounts(updateAccounts);
    setStatus(true);
  };

  return (
    <div className="w-full mx-auto">
      <ul className="list-disc">
        {accounts.map((item, index) => (
          <li key={index} className="flex mb-2">
            <span className="text-black border border-gray-300 p-2 rounded w-5/6 mr-1">
              {item.clientName}
            </span>
            {item.clientName === DEFAULT_ACCOUNT && (
              <div className="flex w-1/6">
                <button
                  onClick={() => {
                    setSelectedClient(item);
                    openPulseModal();
                  }}
                >
                  <svg
                    className="h-6 w-6 text-blue-500 hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </button>
              </div>
            )}
            {item.clientName !== DEFAULT_ACCOUNT && (
              <div className="flex w-1/6 justify-end">
                <button
                  onClick={() => {
                    setSelectedClient(item);
                    openPulseModal();
                  }}
                >
                  <svg
                    className="h-6 w-6 text-blue-500 hover:scale-110"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    {" "}
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />{" "}
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="ml-2" onClick={() => removeItem(index)}>
                  <svg
                    className="h-6 w-6 text-red-500 hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <circle cx="12" cy="12" r="10" />{" "}
                    <line x1="15" y1="9" x2="9" y2="15" />{" "}
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {errorMessage !== "" && (
        <div
          className="flex items-center justify-center p-4 mt-10 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}
      <div className="flex m-10">
        <input
          type="text"
          className="flex-grow border text-black border-gray-300 p-2 rounded w-5/6 mr-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add New Pulse Installation"
        />
        <div className="flex w-1/6 justify-end">
          <button onClick={addItem}>
            <svg
              className="h-6 w-6 text-blue-500 hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpenPulseModal && (
        <PulsModal
          onClose={closePulseModal}
          client={selectedClient}
          onUpdateClient={(data) => handleUpdateClient(data)}
        />
      )}
    </div>
  );
}
