import { useState } from "react";
import EzyVetModal from "../menu/ezy-vet-env-modal";
import PulsModal from "../menu/pulse-env-modal";
import DBModal from "../menu/db-env-modal";
import EzyVetAccountsModal from "../menu/ezy-vet-accounts";
import PulseAccountsModal from "../menu/pulse-accounts";

export default function HeaderSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEzyAccountModal, setisOpenEzyAccountModal] = useState(false);
  const [isOpenPulseAccountModal, setIsOpenPulseAccountModal] = useState(false);
  const [isOpenDBModal, setIsOpenDBModal] = useState(false);

  const openEzyVetModal = () => setisOpenEzyAccountModal(true);
  const closeEzyAccountModal = () => setisOpenEzyAccountModal(false);

  const openPulsModal = () => setIsOpenPulseAccountModal(true);
  const closePulsModal = () => setIsOpenPulseAccountModal(false);

  const openDBModal = () => setIsOpenDBModal(true);
  const closeDBModal = () => setIsOpenDBModal(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const ezyVetAPIDropdown = () => {
    setIsOpen(false);
    openEzyVetModal();
  };

  const pulsAPIDropdown = () => {
    setIsOpen(false);
    openPulsModal();
  };

  const dbDropdown = () => {
    setIsOpen(false);
    openDBModal();
  };

  return (
    <div className="flex justify-end w-full">
      <button
        id="dropdownMenuIconButton"
        type="button"
        onClick={toggleDropdown}
        data-dropdown-toggle="dropdownDots"
        className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.58579 2.58579C9.96086 2.21071 10.4696 2 11 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V4.0888L15.473 4.28469L15.536 4.22179C15.911 3.84719 16.4199 3.63621 16.95 3.63621C17.4803 3.63621 17.9889 3.84684 18.364 4.22179L19.7781 5.63589C20.153 6.01095 20.3638 6.51967 20.3638 7.05C20.3638 7.58007 20.1534 8.08845 19.7788 8.46345L19.7153 8.52703L19.9112 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V13C22 13.5304 21.7893 14.0391 21.4142 14.4142C21.0391 14.7893 20.5304 15 20 15H19.9112L19.7153 15.473L19.7782 15.536C20.1528 15.911 20.3638 16.4199 20.3638 16.95C20.3638 17.4803 20.1532 17.9889 19.7782 18.364L18.3641 19.7781C17.9891 20.153 17.4803 20.3638 16.95 20.3638C16.4197 20.3638 15.9111 20.1532 15.536 19.7782L15.4726 19.7148L15 19.9108V20C15 20.5304 14.7893 21.0391 14.4142 21.4142C14.0391 21.7893 13.5304 22 13 22H11C10.4696 22 9.96086 21.7893 9.58579 21.4142C9.21071 21.0391 9 20.5304 9 20V19.9112L8.52703 19.7153L8.464 19.7782C8.089 20.1528 7.58007 20.3638 7.05 20.3638C6.51967 20.3638 6.01105 20.1532 5.636 19.7782L4.22189 18.3641C3.84695 17.9891 3.63621 17.4803 3.63621 16.95C3.63621 16.4199 3.84664 15.9116 4.22123 15.5366L4.28469 15.473L4.0888 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H4.08916L4.28518 8.52739L4.22189 8.46411C3.84695 8.08905 3.63621 7.58033 3.63621 7.05C3.63621 6.51967 3.84684 6.01106 4.22179 5.636L5.63589 4.22189C6.01095 3.84695 6.51967 3.63621 7.05 3.63621C7.58007 3.63621 8.08844 3.84664 8.46345 4.22123L8.52703 4.28469L9 4.0888V4C9 3.46957 9.21071 2.96086 9.58579 2.58579ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
            fill="#ffffff"
          />
        </svg>
        <span className="sr-only">Icon description</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul>
            <li>
              <a
                href="#"
                onClick={ezyVetAPIDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                EzyVet API
              </a>
            </li>
            <hr className="border-t border-gray-300"></hr>
            <li>
              <a
                href="#"
                onClick={pulsAPIDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Pulse API
              </a>
            </li>
            <hr className="border-t border-gray-300"></hr>
            <li>
              <a
                href="#"
                onClick={dbDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                DB
              </a>
            </li>
          </ul>
        </div>
      )}
      {isOpenEzyAccountModal && (
        <EzyVetAccountsModal onClose={closeEzyAccountModal} />
      )}
      {isOpenPulseAccountModal && (
        <PulseAccountsModal onClose={closePulsModal} />
      )}
      {isOpenDBModal && <DBModal onClose={closeDBModal} />}
    </div>
  );
}
