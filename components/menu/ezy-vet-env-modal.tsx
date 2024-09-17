import { FunctionComponent as FC, useEffect, useState } from "react";
import { checkEzyENV } from "@/utils/ezyvet";
import { Label, Radio, ToggleSwitch } from "flowbite-react";
import Collapse from "@/components/common/collapse";
import PasswordInput from "../common/password-input";
import {
  DEFAULT_ACCOUNT,
  INVOICELINE_STATUS_ALL,
  INVOICELINE_STATUS_FILALISED,
  INVOICELINE_STATUS_NONE_FILALISED,
} from "@/utils/constants";

interface IProps {
  onClose: () => void;
  onUpdateClient: (data: any) => void;
  client: any | undefined;
}

const EzyVetModal: FC<IProps> = ({ onClose, client, onUpdateClient }) => {
  const [clientName, setClientName] = useState("");
  const [clientAccountId, setClientAccountId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [grantType, setGrantType] = useState("");
  const [scope, setScope] = useState("");
  const [joinEnable, setJoinEnable] = useState(true);
  const [filterInvoiceLines, setFilterInvoiceLines] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setClientName(client.clientName);
    setClientAccountId(client.clientAccountId);
    setPartnerId(client.partnerId);
    setClientId(client.clientId);
    setClientSecret(client.clientSecret);
    setGrantType(client.grantType);
    setScope(client.scope);
    setJoinEnable(client.invoice_join);
    setFilterInvoiceLines(client.filterInvoiceLines);

    onUpdateClient({
      id: client.id,
      clientName: client.clientName,
      clientAccountId: client.clientAccountId,
      newAccount: false,
    });
  }, [client]);

  const clearEnv = () => {
    setPartnerId("");
    setClientId("");
    setClientSecret("");
    setGrantType("");
    setScope("");

    setErrorMessage("");
  };

  const setEnv = async () => {
    setErrorMessage("");

    if (clientName === "") {
      setErrorMessage("Please add client name.");

      return;
    } else if (clientAccountId === "") {
      setErrorMessage("Please add client account id.");

      return;
    } else {
      if (
        partnerId === "" ||
        clientId === "" ||
        clientSecret === "" ||
        grantType === "" ||
        scope === ""
      ) {
        setErrorMessage("Please provide information in all fields.");
      } else {
        try {
          setLoading(true);

          const checkENV = await checkEzyENV({
            partnerId,
            clientId,
            clientSecret,
            grantType,
            scope,
          });

          if (checkENV) {
            onUpdateClient({
              id: client.id,
              clientName,
              clientAccountId,
              clientId,
              clientSecret,
              grantType,
              partnerId,
              scope,
              invoice_join: joinEnable,
              pass: true,
              newAccount: false,
              filterInvoiceLines: filterInvoiceLines,
            });

            onClose();
          } else {
            setErrorMessage(
              "Oops! Something went wrong with your request. Please double-check your input and try again."
            );
          }
          setLoading(false);
        } catch (error: any) {
          if (error.response) {
            // The request was made and the server responded with a status code outside of the 2xx range
            if (error.response.status === 400) {
              // console.log("Bad Request:", error.response.data);
              setErrorMessage(
                "Oops! Something went wrong with your request. Please double-check your input and try again."
              );
            } else {
              // console.log("Error:", error.response.status);
              setErrorMessage(
                "Oops! Something went wrong with your request. Please double-check your input and try again."
              );
            }
          } else if (error.request) {
            // The request was made but no response was received
            // console.log("No response received:", error.request);
            setErrorMessage(
              "Oops! Something went wrong with your request. Please double-check your input and try again."
            );
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log("Error:", error.message);
            setErrorMessage(
              "Oops! Something went wrong with your request. Please double-check your input and try again."
            );
          }
          setLoading(false);
        }
      }
    }
  };

  const handleChange = (e: any) => {
    if (e.target.name === "clientName") {
      setClientName(e.target.value);
    }

    if (e.target.name === "clientAccountId") {
      setClientAccountId(e.target.value);
    }

    if (e.target.name === "partnerId") {
      setPartnerId(e.target.value);
    }

    if (e.target.name === "clientId") {
      setClientId(e.target.value);
    }

    if (e.target.name === "clientSecret") {
      setClientSecret(e.target.value);
    }

    if (e.target.name === "grantType") {
      setGrantType(e.target.value);
    }

    if (e.target.name === "scope") {
      setScope(e.target.value);
    }

    setErrorMessage("");
  };

  // Handle the change event when a radio button is selected
  const handleFilterInvoiceLinesChange = (event: any) => {
    setFilterInvoiceLines(event.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 text-gray-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {client.newAccount ? `Add EzyVet Client` : `Edit EzyVet Client`}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="m-5 md:flex justify-between items-center">
            <div className="flex ml-5">
              <svg
                className="h-6 w-6 text-blue-500 float-left"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="block ml-1 text-sm text-blue-500 dark:text-white">
                Client Name:
              </span>
            </div>
            <div className="">
              <input
                type="text"
                name="clientName"
                id="name"
                disabled={client.clientName === DEFAULT_ACCOUNT ? true : false}
                value={clientName}
                onChange={handleChange}
                className="text-blue-500 ml-2 rounded border border-gray-300"
                placeholder=""
              />
            </div>
          </div>
          <div className="m-5 md:flex justify-between items-center">
            <div className="flex ml-5">
              <svg
                className="h-6 w-6 text-blue-500 float-left"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <line x1="18" y1="20" x2="18" y2="10" />{" "}
                <line x1="12" y1="20" x2="12" y2="4" />{" "}
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span className="block ml-1 text-sm text-blue-500 dark:text-white">
                Account ID:
              </span>
            </div>
            <div className="">
              <input
                type="text"
                name="clientAccountId"
                id="accountId"
                disabled={client.clientName === DEFAULT_ACCOUNT ? true : false}
                value={clientAccountId}
                onChange={handleChange}
                className="text-blue-500 ml-2 rounded border border-gray-300"
                placeholder=""
              />
            </div>
          </div>
          <div className="p-4 md:p-5 grid gap-4 max-h-[80vh] overflow-auto">
            <Collapse title="Credential" open={false}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Partner ID
                  </label>
                  <input
                    type="text"
                    name="partnerId"
                    id="name"
                    disabled={
                      client.clientName === DEFAULT_ACCOUNT ? true : false
                    }
                    value={partnerId}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Client ID
                  </label>
                  <input
                    type="text"
                    name="clientId"
                    id="name"
                    disabled={
                      client.clientName === DEFAULT_ACCOUNT ? true : false
                    }
                    value={clientId}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Client Secret
                  </label>
                  <PasswordInput
                    label=""
                    name="clientSecret"
                    id="name"
                    disabled={
                      client.clientName === DEFAULT_ACCOUNT ? true : false
                    }
                    value={clientSecret}
                    onChange={handleChange}
                    placeholder=""
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Grant Type
                  </label>
                  <input
                    type="text"
                    name="grantType"
                    id="name"
                    disabled={
                      client.clientName === DEFAULT_ACCOUNT ? true : false
                    }
                    value={grantType}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="scope"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Scope
                  </label>
                  <textarea
                    id="scope"
                    rows={2}
                    name="scope"
                    disabled={
                      client.clientName === DEFAULT_ACCOUNT ? true : false
                    }
                    value={scope}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                  ></textarea>
                </div>
              </div>
            </Collapse>
            <br />
            <Collapse title="Additional" open={true}>
              <div className="grid gap-4 mb-4">
                <div className="col-span-2">
                  <ToggleSwitch
                    checked={joinEnable}
                    onChange={() => {
                      setJoinEnable((state) => !state);
                    }}
                    label="Merge Invoiceline with Invoice"
                  />
                </div>
              </div>
              <div className="grid gap-4 mb-4">
                <fieldset className="flex max-w-md flex-col gap-4">
                  <legend className="mb-4">Filter InvoiceLines</legend>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="united-state"
                      name="Finalised"
                      value={INVOICELINE_STATUS_FILALISED}
                      checked={
                        filterInvoiceLines === INVOICELINE_STATUS_FILALISED
                      }
                      onChange={handleFilterInvoiceLinesChange}
                    />
                    <Label htmlFor="united-state">Finalised</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="germany"
                      name="None_Finalised"
                      value={INVOICELINE_STATUS_NONE_FILALISED}
                      checked={
                        filterInvoiceLines === INVOICELINE_STATUS_NONE_FILALISED
                      }
                      onChange={handleFilterInvoiceLinesChange}
                    />
                    <Label htmlFor="germany">None Finalised</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="spain"
                      name="All"
                      value={INVOICELINE_STATUS_ALL}
                      checked={filterInvoiceLines === INVOICELINE_STATUS_ALL}
                      onChange={handleFilterInvoiceLinesChange}
                    />
                    <Label htmlFor="spain">All</Label>
                  </div>
                </fieldset>
              </div>
            </Collapse>
            <br />
            {errorMessage !== "" && (
              <div className="col-span-2">
                <div
                  className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
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
              </div>
            )}
            <div className="flex justify-center">
              {client.clientName !== DEFAULT_ACCOUNT && (
                <button
                  type="button"
                  onClick={clearEnv}
                  className="text-white inline-flex mr-4 items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={setEnv}
                disabled={loading}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <>
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <p>{client.newAccount ? `Add` : `Update`}</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EzyVetModal;
