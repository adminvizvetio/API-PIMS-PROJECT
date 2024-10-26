"use client";
import {
  isTokenExpired,
  saveEzyToken,
  joinInvoicelineWithInvoice,
  saveDB,
  getIds,
} from "@/utils/ezyvet";
import { savePulseToken } from "@/utils/pulse";
import {
  delayMs,
  delay,
  extractFirstNumber,
  dbDelayMs,
  splitDateRangeTo10Days,
  updateMessage,
  defaultEzyAccounts,
  defaultPulseAccounts,
  getDateTimeString,
  msToTime,
} from "../../utils/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  EZY_ENP_ANIMAL,
  EZY_ENP_CONTACT,
  EZY_ENP_INVOICE,
  EZY_ENP_INVOICELINE,
  EZY_ENP_PRODUCT_V2,
  EZY_ENP_PRODUCTGROUP,
  EZY_ENP_RESOURCE,
  EZY_ENP_SEPARATION,
  EZY_ENP_SEX,
  EZY_ENP_SPECIES,
  EZY_ENP_LBL_ANIMAL,
  EZY_ENP_LBL_CONTACT,
  EZY_ENP_LBL_INVOICE,
  EZY_ENP_LBL_INVOICELINE,
  EZY_ENP_LBL_PRODUCT_V2,
  EZY_ENP_LBL_PRODUCTGROUP,
  EZY_ENP_LBL_RESOURCE,
  EZY_ENP_LBL_SEPARATION,
  EZY_ENP_LBL_SEX,
  EZY_ENP_LBL_SPECIES,
  EZY_VET_API,
  FILTER_BY_DATE_ALL,
  FILTER_BY_DATE_RANGE,
  FILTER_BY_DATE_DAY,
  FILTER_BY_DATE_MONTH,
  FILTER_BY_DATE_QUARTER,
  FILTER_BY_DATE_WEEK,
  FILTER_BY_DATE_YEAR,
  SELECT_PAGE_ALL,
  SELECT_PAGE_NUMBER,
  SELECT_PAGE_RANGE,
  PULSE_API,
  EZY_TOKEN,
  EZY_TOKEN_EXPIRE_IN,
  PULSE_TOKEN_EXPIRE_IN,
  PULSE_ENP_INVOICES,
  PULSE_ENP_TRANSACTIONS,
  PULSE_TOKEN,
  STORAGE_PULSE_ENV_INSTALLATION,
  STORAGE_EZY_INVOICE_JOIN,
  STORAGE_SQLSRV_CHECK_EXIST_DB,
  RETRY_COUNT,
  EZY_COLLECT_PARAMS_API_URL,
  EZY_CALL_PAGE_API_URL,
  PULSE_COLLECT_PARAMS_API_URL,
  PULSE_CALL_PAGE_API_URL,
  ITEM_MAX_LIMIT,
  STATUS_START,
  STATUS_IDLE,
  STATUS_COMPLETE,
  STATUS_PAUSE,
  STATUS_RESUME,
  STATUS_STOP,
  STORE_STATUS,
  EZY_TIME_ZONE_API_URL,
  EZY_TIME_ZONE,
  PULSE_ENP_CLIENTS,
  PULSE_ENP_CODES,
  PULSE_ENP_PATIENTS,
  PULSE_ENP_SITES,
  PULSE_ENP_ClientPatientRelationships,
  STATUS_RESTART,
  STORAGE_EZY_ACCOUNTS,
  STORAGE_EZY_ENV_PARTNERID,
  STORAGE_EZY_ENV_CLIENTID,
  STORAGE_EZY_ENV_CLIENTSECRET,
  STORAGE_EZY_ENV_GRATNTYPE,
  STORAGE_EZY_ENV_SCOPE,
  STORAGE_EZY_ENV_CLIENT_NAME,
  STORAGE_PULSE_ENV_PASSWORD,
  STORAGE_PULSE_ENV_USERNAME,
  STORAGE_PULSE_ENV_CLIENT_NAME,
  STORAGE_PULSE_ACCOUNTS,
  THROW_APP_STOP,
  STORAGE_EZY_ENV_FILTER_INVOICELINES,
  STORAGE_PULSE_ENV_ACCOUNT_ID,
  STORAGE_EZY_ENV_ACCOUNT_ID,
} from "@/utils/constants";
import { itemValue } from "@/utils/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  startOfYesterday,
} from "date-fns";
import Collapse from "@/components/common/collapse";
import SelectPage from "@/components/filterByPage/select-page";
import SelectPageRange from "@/components/filterByPage/select-page-range";
import SelectDay from "@/components/filterByDate/select-day";
import SelectWeek from "@/components/filterByDate/select-week";
import SelectMonth from "@/components/filterByDate/select-month";
import SelectQuarter from "@/components/filterByDate/select-quarter";
import SelectYear from "@/components/filterByDate/select-year";
import SelectDateRange from "@/components/filterByDate/select-date-range";
import Output from "@/components/ui/output";
import SelectComponent from "@/components/common/select-component";
import ControlButtons from "@/components/common/control-buttons";
import EnsureStopModal from "@/components/common/ensure-stop-modal";
import EnsureRestartModal from "@/components/common/ensure-restart-modal";
import useLocalStorage from "@/components/hooks/useLocalStorage";
import useLocalStorageChange from "@/components/hooks/useLocalStorage";

// Update UI 0.0.2

const optionsAPIs = [
  { label: "EzyVet API", value: EZY_VET_API },
  { label: "Pulse API", value: PULSE_API },
];

const optionsEzyEndpoints = [
  { label: EZY_ENP_LBL_ANIMAL, value: EZY_ENP_ANIMAL },
  { label: EZY_ENP_LBL_CONTACT, value: EZY_ENP_CONTACT },
  { label: EZY_ENP_LBL_INVOICE, value: EZY_ENP_INVOICE },
  { label: EZY_ENP_LBL_INVOICELINE, value: EZY_ENP_INVOICELINE },
  { label: EZY_ENP_LBL_RESOURCE, value: EZY_ENP_RESOURCE },
  { label: EZY_ENP_LBL_PRODUCT_V2, value: EZY_ENP_PRODUCT_V2 },
  { label: EZY_ENP_LBL_PRODUCTGROUP, value: EZY_ENP_PRODUCTGROUP },
  { label: EZY_ENP_LBL_SEPARATION, value: EZY_ENP_SEPARATION },
  { label: EZY_ENP_LBL_SEX, value: EZY_ENP_SEX },
  { label: EZY_ENP_LBL_SPECIES, value: EZY_ENP_SPECIES },
];

const optionsPulseEndpoints = [
  { label: PULSE_ENP_CLIENTS, value: PULSE_ENP_CLIENTS },
  { label: PULSE_ENP_CODES, value: PULSE_ENP_CODES },
  { label: PULSE_ENP_INVOICES, value: PULSE_ENP_INVOICES },
  { label: PULSE_ENP_PATIENTS, value: PULSE_ENP_PATIENTS },
  { label: PULSE_ENP_SITES, value: PULSE_ENP_SITES },
  { label: PULSE_ENP_TRANSACTIONS, value: PULSE_ENP_TRANSACTIONS },
  {
    label: PULSE_ENP_ClientPatientRelationships,
    value: PULSE_ENP_ClientPatientRelationships,
  },
];

const optionsFilterByDate = [
  { label: "All", value: FILTER_BY_DATE_ALL },
  { label: "Day", value: FILTER_BY_DATE_DAY },
  { label: "Week", value: FILTER_BY_DATE_WEEK },
  { label: "Month", value: FILTER_BY_DATE_MONTH },
  { label: "Quarter", value: FILTER_BY_DATE_QUARTER },
  { label: "Year", value: FILTER_BY_DATE_YEAR },
  { label: "Date Range", value: FILTER_BY_DATE_RANGE },
];

const optionsInvoiceLinesFilterByDate = [
  { label: "Day", value: FILTER_BY_DATE_DAY },
  { label: "Week", value: FILTER_BY_DATE_WEEK },
  { label: "Month", value: FILTER_BY_DATE_MONTH },
  { label: "Quarter", value: FILTER_BY_DATE_QUARTER },
  { label: "Year", value: FILTER_BY_DATE_YEAR },
  { label: "Date Range", value: FILTER_BY_DATE_RANGE },
];

const optionsFilterByPage = [
  { label: "All", value: SELECT_PAGE_ALL },
  { label: "Page Number", value: SELECT_PAGE_NUMBER },
  { label: "Page Range", value: SELECT_PAGE_RANGE },
];

export default function Home() {
  const localEzyAccounts = useLocalStorageChange(STORAGE_EZY_ACCOUNTS);
  const localPulseAccounts = useLocalStorageChange(STORAGE_PULSE_ACCOUNTS);

  const [loading, setLoading] = useState(false);

  const [clientEzyEnvAccounts, setClientEzyEnvAccounts] = useState([]);
  const [clientEzyAccounts, setClientEzyAccounts] = useState([]);
  const [clientPulseEnvAccounts, setClientPulseEnvAccounts] = useState([]);
  const [clientPulseAccounts, setClientPulseAccounts] = useState([]);

  const [apiUrl, setApiUrl] = useState(optionsAPIs[0].value);
  const [client, setClient] = useState("");
  const [endpoint, setEndpoint] = useState(optionsEzyEndpoints[0].value);
  const [byDate, setDateBy] = useState(optionsFilterByDate[0].value);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [byPage, setSelectPage] = useState(optionsFilterByPage[0].value);
  const [pageSize, setPageSize] = useState("10");
  const [pageNumber, setPageNumber] = useState("1");
  const [pageStart, setPageStart] = useState("1");
  const [pageEnd, setPageEnd] = useState("1");

  const [pushToDB, setPushToDB] = useState(true);

  const [startTime, setStartTime] = useState<Date>();
  const [runTime, setRunTime] = useState(0);
  const [finishTime, setFinishTime] = useState<Date>();
  const [message, setMessage] = useState("");

  const [pushPercent, setPushPercent] = useState(0);

  const [status, setStatus] = useState(STATUS_IDLE);
  const [restartFlag, setRestartFlag] = useState(false);

  const [timeZone, setTimeZone] = useState("");

  const [isOpenEnsureStopModal, setIsOpenEnsureStopModal] = useState(false);
  const [isOpenEnsureRestartModal, setIsOpenEnsureRestartModal] =
    useState(false);
  const [metaData, setMetaData] = useState({
    meta: {
      timestamp: "",
      items_page_total: 0,
      items_total: 0,
    },
  });

  useEffect(() => {
    const storedEzyAccounts = localStorage.getItem(STORAGE_EZY_ACCOUNTS);
    const storedPulseAccounts = localStorage.getItem(STORAGE_PULSE_ACCOUNTS);

    if (storedEzyAccounts) {
    } else {
      localStorage.setItem(
        STORAGE_EZY_ACCOUNTS,
        JSON.stringify(defaultEzyAccounts)
      );
    }

    if (storedPulseAccounts) {
    } else {
      localStorage.setItem(
        STORAGE_PULSE_ACCOUNTS,
        JSON.stringify(defaultPulseAccounts)
      );
    }

    const interval = setInterval(async () => {
      await tokenCheck();
    }, 60000); // 60000ms = 1 minute

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (apiUrl === EZY_VET_API) {
      setEndpoint(optionsEzyEndpoints[0].value);

      const fetchTimeZone = async () => {
        try {
          await tokenCheck();
          let bearer_token;
          bearer_token = `${localStorage.getItem(EZY_TOKEN)}`;

          const rspTimeZone: any = await axios.post(EZY_TIME_ZONE_API_URL, {
            token: bearer_token,
          });

          localStorage.setItem(
            EZY_TIME_ZONE,
            rspTimeZone.data.items[0].systemsetting.timezone.name
          );

          setTimeZone(rspTimeZone.data.items[0].systemsetting.timezone.name);
        } catch (error) {
          // console.log("error to get time zone", error);
        }
      };

      // Call the async function
      fetchTimeZone();
    } else {
      setEndpoint(optionsPulseEndpoints[0].value);

      const fetchTimeZone = async () => {
        try {
          // const rspTimeZone = await axios.get(
          //   PULSE_TIME_ZONE_API_URL
          // );
          // console.log('rspTimeZone', rspTimeZone);
        } catch (error) {
          // console.log("error to get time zone");
        }
      };

      // Call the async function
      fetchTimeZone();
    }
  }, [apiUrl]);

  useEffect(() => {
    if (endpoint === EZY_ENP_INVOICELINE) {
      setDateBy(optionsInvoiceLinesFilterByDate[0].value);
    } else {
      setDateBy(optionsFilterByDate[0].value);
    }
  }, [endpoint]);

  useEffect(() => {
    if (byDate === FILTER_BY_DATE_DAY) {
      setStartDate(new Date());
      setEndDate(new Date());
    }

    if (byDate === FILTER_BY_DATE_WEEK) {
      setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    }

    if (byDate === FILTER_BY_DATE_MONTH) {
      setStartDate(startOfMonth(new Date()));
      setEndDate(endOfMonth(new Date()));
    }

    if (byDate === FILTER_BY_DATE_QUARTER) {
      setStartDate(startOfQuarter(new Date()));
      setEndDate(endOfQuarter(new Date()));
    }

    if (byDate === FILTER_BY_DATE_YEAR) {
      setStartDate(startOfYear(new Date()));
      setEndDate(endOfYear(new Date()));
    }

    if (byDate === FILTER_BY_DATE_RANGE) {
      setStartDate(startOfYesterday());
      setEndDate(new Date());
    }
  }, [byDate]);

  useEffect(() => {
    if (byPage === SELECT_PAGE_ALL) {
      setPageSize(ITEM_MAX_LIMIT.toString());
      setPageNumber("1");
    } else {
      setPageSize("10");
      setPageNumber("1");
    }
  }, [byPage]);

  useEffect(() => {
    if (localEzyAccounts !== null) {
      let optionsEzyVetClients = JSON.parse(localEzyAccounts);

      setClientEzyEnvAccounts(optionsEzyVetClients);

      optionsEzyVetClients = optionsEzyVetClients.map((item: any) => ({
        label: item.clientName,
        value: item.clientName,
      }));

      setClientEzyAccounts(optionsEzyVetClients);
      setClient(optionsEzyVetClients[0].value);
    }
  }, [localEzyAccounts]);

  useEffect(() => {
    if (localPulseAccounts !== null) {
      let optionsPulseClients = JSON.parse(localPulseAccounts);

      setClientPulseEnvAccounts(optionsPulseClients);

      optionsPulseClients = optionsPulseClients.map((item: any) => ({
        label: item.clientName,
        value: item.clientName,
      }));

      setClientPulseAccounts(optionsPulseClients);
      setClient(optionsPulseClients[0].value);
    }
  }, [localPulseAccounts]);

  useEffect(() => {
    let clientObj: any;

    if (apiUrl === EZY_VET_API) {
      clientObj = clientEzyEnvAccounts.find(
        (item: any) => item.clientName === client
      );
    }

    if (apiUrl === PULSE_API) {
      clientObj = clientPulseEnvAccounts.find(
        (item: any) => item.clientName === client
      );
    }

    switchClient(clientObj, apiUrl);
  }, [apiUrl, client, clientEzyEnvAccounts, clientPulseEnvAccounts]);

  useEffect(() => {
    updateMessage(setMessage, `STATUS:${status}`);
    switch (status) {
      /* case STATUS_IDLE:
        setMetaData({
        meta: {
         timestamp: "",
          items_page_total: 0,
          items_total: 0,
        },
      });
      setRunTime(0);
      setPushPercent(0);
      setStartTime(undefined);
      setFinishTime(undefined);
      updateMessage(setMessage, `STATUS:IDLE`);
      if (restartFlag) {
        setRestartFlag(false);
        //delay(1000);
      }
      break; */
      case STATUS_START:
        break;
      case STATUS_RESUME:
        break;
      case STATUS_PAUSE:
        break;
      case STATUS_COMPLETE:
        break;
      case STATUS_STOP:
        break;
      case STATUS_RESTART:
        setStatus(STATUS_STOP);
        setRestartFlag(true);
        handleSubmit();
        break;
    }
    localStorage.setItem(STORE_STATUS, status);
  }, [status]);

  const tokenCheck = async () => {
    if (apiUrl === EZY_VET_API) {
      // console.log("ezy tokencheck");
      const tokenExpireIn: string | null =
        localStorage.getItem(EZY_TOKEN_EXPIRE_IN);
      const tokenStatus = isTokenExpired(tokenExpireIn);

      if (tokenStatus) {
        const tokenSave = await saveEzyToken();
        if (!tokenSave) {
          setLoading(false);
          updateMessage(setMessage, `Failed to get token`);
          return false;
        }
        updateMessage(setMessage, `Get a new token successfully!`);
        return true;
      }
    }
    if (apiUrl === PULSE_API) {
      // console.log("pulse tokencheck");
      const tokenExpireIn: string | null = localStorage.getItem(
        PULSE_TOKEN_EXPIRE_IN
      );
      const tokenStatus = isTokenExpired(tokenExpireIn);
      if (tokenStatus) {
        const tokenSave = await savePulseToken();
        if (!tokenSave) {
          setLoading(false);
          updateMessage(setMessage, `Failed to get token`);
          return false;
        }
        updateMessage(setMessage, `Get a new token successfully!`);
        return true;
      }
    }
    return true;
  };

  const switchClient = (clientObj: any, apiType: string) => {
    if (apiType === EZY_VET_API) {
      if (clientObj) {
        localStorage.setItem(STORAGE_EZY_ENV_CLIENT_NAME, clientObj.clientName);
        localStorage.setItem(
          STORAGE_EZY_ENV_ACCOUNT_ID,
          clientObj.clientAccountId
        );
        localStorage.setItem(STORAGE_EZY_ENV_PARTNERID, clientObj.partnerId);
        localStorage.setItem(STORAGE_EZY_ENV_CLIENTID, clientObj.clientId);
        localStorage.setItem(
          STORAGE_EZY_ENV_CLIENTSECRET,
          clientObj.clientSecret
        );
        localStorage.setItem(STORAGE_EZY_ENV_GRATNTYPE, clientObj.grantType);
        localStorage.setItem(STORAGE_EZY_ENV_SCOPE, clientObj.scope);
        localStorage.setItem(
          STORAGE_EZY_INVOICE_JOIN,
          clientObj.invoice_join.toString()
        );
        localStorage.setItem(
          STORAGE_EZY_ENV_FILTER_INVOICELINES,
          clientObj.filterInvoiceLines
        );

        const fetchToken = async () => {
          try {
            localStorage.setItem(EZY_TOKEN, "");
            localStorage.setItem(EZY_TOKEN_EXPIRE_IN, "");
            setMessage("");

            const tokenSave = await saveEzyToken();
            if (!tokenSave) {
              setLoading(false);
              updateMessage(
                setMessage,
                `Failed: to get token for "${clientObj.clientName}" client.`
              );
              return;
            }
            updateMessage(
              setMessage,
              `Get a new token successfully for "${clientObj.clientName}" client!`
            );
          } catch (error) {
            // console.log("error to get a new token.");
          }
        };

        // Call the async function
        fetchToken();
      }
    }

    if (apiType === PULSE_API) {
      if (clientObj) {
        localStorage.setItem(
          STORAGE_PULSE_ENV_CLIENT_NAME,
          clientObj.clientName
        );
        localStorage.setItem(
          STORAGE_PULSE_ENV_ACCOUNT_ID,
          clientObj.clientAccountId
        );
        localStorage.setItem(STORAGE_PULSE_ENV_USERNAME, clientObj.userName);
        localStorage.setItem(STORAGE_PULSE_ENV_PASSWORD, clientObj.password);
        localStorage.setItem(
          STORAGE_PULSE_ENV_INSTALLATION,
          clientObj.installation
        );

        const fetchToken = async () => {
          try {
            localStorage.setItem(PULSE_TOKEN, "");
            localStorage.setItem(PULSE_TOKEN_EXPIRE_IN, "");
            setMessage("");

            const tokenSave = await savePulseToken();
            if (!tokenSave) {
              setLoading(false);
              updateMessage(
                setMessage,
                `Failed: to get token for "${clientObj.clientName}" client.`
              );
              return;
            }
            updateMessage(
              setMessage,
              `Get a new token successfully for "${clientObj.clientName}" client!`
            );
          } catch (error) {
            console.log("error to get a new token.");
          }
        };

        // Call the async function
        fetchToken();
      }
    }
  };

  const handlePushToDBStatus = (e: any) => {
    setPushToDB((status) => !status);
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    const start = performance.now();
    let pauseTime = 0;
    let itemsPageTotal = 0;
    let itemsTotal = 0;
    let itemsFiltered = 0;
    let itemsExisting = 0;
    let itemsNonExisting = 0;
    let itemsSaved = 0;
    let startTimeDate = new Date();
    let successPageCount = 0;
    let failPageCount = 0;
    const showStatusMessage = () => {
      const current = performance.now();
      const runTime = current - start - pauseTime;
      const finishTimeDate = new Date();
      setRunTime(runTime);
      setFinishTime(new Date());
      updateMessage(
        setMessage,
        `Page Total: ${itemsPageTotal}, Successful Pages:${successPageCount}, Failed Pages: ${failPageCount}, 
        Items Total: ${itemsTotal}, Filtered Items: ${itemsFiltered}, Already Existing Ids: ${itemsExisting}, Non Existing Items: ${itemsNonExisting}, Saved Items: ${itemsSaved}
        Start Time: ${getDateTimeString(startTimeDate)}, Run Time: ${msToTime(runTime)}, Pause Time: ${msToTime(pauseTime)}, End Time: ${getDateTimeString(finishTimeDate)}
        `
      );
    };
    try {
      const initSubmitVariables = () => {
        setMetaData({
          meta: {
            timestamp: "",
            items_page_total: 0,
            items_total: 0,
          },
        });
        setRunTime(0);
        setMessage("");
        setPushPercent(0);
        setFinishTime(undefined);
        startTimeDate = new Date();
        setStartTime(startTimeDate);
      };
      const getEzyVetExistingIDsInDB = async () => {
        let existIds: any[] = [];
        if (byDate === FILTER_BY_DATE_ALL) {
          const perIds = await getIds(
            apiUrl,
            endpoint,
            startDate,
            endDate,
            byDate,
            setMessage
          );
          existIds = [...perIds];
        } else {
          const intervals = splitDateRangeTo10Days(startDate, endDate);

          for (const interval of intervals) {
            //let durationTime = await handleStatusChanges();
            //pauseTime = Number(pauseTime) + Number(durationTime);
            const perIds = await getIds(
              apiUrl,
              endpoint,
              interval.start,
              interval.end,
              byDate,
              setMessage
            );
            existIds = [...existIds, ...perIds];
          }
        }

        updateMessage(
          setMessage,
          `Total number of items already in the database : ${existIds.length}`
        );
        return existIds;
      };
      const ezyVetJoinInvoiceline = async (items: any[]) => {
        let dbitems = [];
        const invoiceJoin =
          itemValue(STORAGE_EZY_INVOICE_JOIN) === "true" ? true : false;

        if (invoiceJoin) {
          dbitems = await joinInvoicelineWithInvoice(items, setMessage);
        } else {
          dbitems = items;
        }
        return dbitems;
      };
      const handleEzyVetAPISubmit = async () => {
        let bearer_token;
        bearer_token = `${localStorage.getItem(EZY_TOKEN)}`;

        // Get Ids From DB
        let existIds: any[] = [];
        if (settingCheckExistDB) {
          existIds = await getEzyVetExistingIDsInDB();
        }
        itemsExisting = existIds.length;
        let durationTime = await handleStatusChanges();
        pauseTime = Number(pauseTime) + Number(durationTime);

        // Get Collect Params
        const rspCollectParams = await axios.post(EZY_COLLECT_PARAMS_API_URL, {
          token: bearer_token,
          startDate,
          endDate,
          byDate,
          byPage,
          pageSize,
          pageStart,
          pageEnd,
          endpoint,
        });
        itemsPageTotal = rspCollectParams.data.items_page_total;
        itemsTotal = rspCollectParams.data.items_total;
        setMetaData({
          meta: {
            timestamp: "",
            items_page_total: rspCollectParams.data.items_page_total,
            items_total: rspCollectParams.data.items_total,
          },
        });

        // Get data by per page
        let paramsList = rspCollectParams.data.paramsList;
        (successPageCount = 0), (failPageCount = 0);
        itemsSaved = 0;
        itemsFiltered = 0;
        for (const [pageIndex, paramsItem] of paramsList.entries()) {
          // console.log("bear token", bearer_token);
          let durationTime = await handleStatusChanges();
          pauseTime = Number(pauseTime) + Number(durationTime);

          let success = false;
          let retry = RETRY_COUNT;
          let filteredCountOneParam = 0;
          while (!success && retry) {
            let durationTime = await handleStatusChanges();
            pauseTime = Number(pauseTime) + Number(durationTime);

            bearer_token = `${localStorage.getItem(EZY_TOKEN)}`;
            try {
              let startAPI = performance.now();
              const rspCallPage = await axios.post(EZY_CALL_PAGE_API_URL, {
                token: bearer_token,
                endpoint: endpoint,
                params: paramsItem,
                filterInvoiceLines: itemValue(
                  STORAGE_EZY_ENV_FILTER_INVOICELINES
                ),
              });

              filteredCountOneParam = rspCallPage.data.items.length;
              console.log("rspCall Page", rspCallPage);
              updateMessage(
                setMessage,
                `Retrieve page data ${paramsItem.page}`
              );
              // console.log("Retrieve page data", paramsItem.page);
              // console.log("Get data", rspCallPage.data.items);

              if (pushToDB) {
                let dbitems = [];
                if (endpoint === EZY_ENP_INVOICELINE) {
                  dbitems = await ezyVetJoinInvoiceline(rspCallPage.data.items);
                  // console.log("dbitems", dbitems);
                } else {
                  dbitems = rspCallPage.data.items;
                }

                if (dbitems.length !== 0) {
                  let savingDBItems = dbitems;
                  if (settingCheckExistDB) {
                    savingDBItems = dbitems.filter((item: any) => {
                      // Get the first key
                      const rowKey = Object.keys(item)[0];
                      const rowValue = item[rowKey];

                      const checkExistDB = existIds.find(
                        (a: any) => String(a.ezyvet_id) === String(rowValue.id)
                      );
                      if (checkExistDB) {
                        return false;
                      } else {
                        return true;
                      }
                    });
                  }
                  itemsNonExisting += savingDBItems.length;
                  if (savingDBItems.length !== 0) {
                    updateMessage(setMessage, `Ready to save page data`);
                    let success = false;
                    let retry_save = RETRY_COUNT;
                    while (!success && retry_save) {
                      let durationTime = await handleStatusChanges();
                      pauseTime = Number(pauseTime) + Number(durationTime);

                      const rspSaveDB = await saveDB(
                        apiUrl,
                        endpoint,
                        savingDBItems
                      );

                      if (rspSaveDB) {
                        setPushPercent(
                          Number(
                            Number(
                              ((pageIndex + 1) / paramsList.length) * 100
                            ).toFixed(1)
                          )
                        );

                        updateMessage(
                          setMessage,
                          `Save the data of ${paramsItem.page}th page to the database.`
                        );

                        success = true;
                      } else {
                        updateMessage(
                          setMessage,
                          `Error: Save the data of ${paramsItem.page}th page to the database.`
                        );

                        await delay(dbDelayMs);
                      }
                      retry_save--;
                    }
                    if (success) {
                      itemsSaved += savingDBItems.length;
                      updateMessage(
                        setMessage,
                        `Success to Save the ${paramsItem.page}th page`
                      );
                    } else {
                      updateMessage(
                        setMessage,
                        `Failed to Save the ${paramsItem.page}th page after retrying ${RETRY_COUNT} times`
                      );
                    }
                  } else {
                    updateMessage(
                      setMessage,
                      `Info: There is no data to insert into the database.`
                    );
                  }

                  // console.log("savingDBItems", savingDBItems);
                } else {
                  updateMessage(
                    setMessage,
                    `Info: There is no data to insert into the database.`
                  );
                }
              }
              const progress = (pageIndex + 1) / paramsList.length;
              setPushPercent(Number(Number(progress * 100).toFixed(1)));
              const end = performance.now();
              setRunTime(end - start - pauseTime);
              // console.log('startTimeDate', startTimeDate)
              if (startTimeDate) {
                // Show estimated FinishTime
                setFinishTime(
                  new Date(
                    startTimeDate.getTime() +
                      pauseTime +
                      (end - start - pauseTime) / progress
                  )
                );
              }
              // console.log("Push data of the page", paramsItem.page);
              const durationAPI = performance.now() - startAPI;
              if (durationAPI < delayMs) {
                await delay(delayMs - durationAPI); // delay between each request
              }
              success = true;
            } catch (error: any) {
              // console.log("error", error);
              if (error.message === THROW_APP_STOP) {
                setLoading(false);
                updateMessage(
                  setMessage,
                  `Idle mode will activate in 3 seconds.`
                );
                await delay(3000);
                setStatus(STATUS_IDLE);
                return;
              } else if (error.response && error.response.status === 429) {
                // console.log("429 error response", error.response);
                // get delays seconds
                const delayTry = extractFirstNumber(error.response.data.error);
                updateMessage(
                  setMessage,
                  `Sorry, We have sent too many request recently. I will try after ${delayTry}.`
                );

                if (delayTry) {
                  await delay(Number((Number(delayTry) + 1) * 1000));
                }
              } else {
                updateMessage(
                  setMessage,
                  `Error: fetching data ${paramsItem.page}.`
                );

                await delay(delayMs);
              }
            }
            retry--;
          }
          if (success) {
            itemsFiltered += filteredCountOneParam;
            updateMessage(
              setMessage,
              `Success to Get and Process the ${paramsItem.page}th page.`
            );
            successPageCount++;
          } else {
            updateMessage(
              setMessage,
              `Failed to Get and Process the ${paramsItem.page}th page after retrying ${RETRY_COUNT} times.`
            );
            failPageCount++;
          }
        }
      };
      const handlePulseAPISubmit = async () => {
        let bearer_token;
        bearer_token = `${localStorage.getItem(PULSE_TOKEN)}`;

        // Get Ids From DB
        let existIds: any[] = [];

        if (settingCheckExistDB) {
          if (byDate === FILTER_BY_DATE_ALL) {
            const perIds = await getIds(
              apiUrl,
              endpoint,
              startDate,
              endDate,
              byDate,
              setMessage
            );
            existIds = [...perIds];
          } else {
            const intervals = splitDateRangeTo10Days(startDate, endDate);
            for (const interval of intervals) {
              let durationTime = await handleStatusChanges();
              pauseTime = Number(pauseTime) + Number(durationTime);

              const perIds = await getIds(
                apiUrl,
                endpoint,
                interval.start,
                interval.end,
                byDate,
                setMessage
              );
              existIds = [...existIds, ...perIds];
            }
          }

          updateMessage(
            setMessage,
            `Total number of items already in the database : ${existIds.length}`
          );
        }

        let durationTime = await handleStatusChanges();
        pauseTime = Number(pauseTime) + Number(durationTime);

        // Get Collect Params
        updateMessage(setMessage, `Getting metadata...`);
        const rspCollectParams = await axios.post(
          PULSE_COLLECT_PARAMS_API_URL,
          {
            token: bearer_token,
            installation: itemValue(STORAGE_PULSE_ENV_INSTALLATION),
            startDate,
            endDate,
            byDate,
            byPage,
            pageSize,
            pageStart,
            pageEnd,
            endpoint,
          }
        );

        setMetaData({
          meta: {
            timestamp: "",
            items_page_total: rspCollectParams.data.items_page_total,
            items_total: rspCollectParams.data.items_total,
          },
        });

        // Get data by per page
        let paramsList = rspCollectParams.data.paramsList;
        let successPageCount = 0,
          failPageCount = 0;
        for (const [pageIndex, paramsItem] of paramsList.entries()) {
          let durationTime = await handleStatusChanges();
          pauseTime = Number(pauseTime) + Number(durationTime);

          // console.log("bear token", bearer_token);
          let success = false;
          let retry = RETRY_COUNT;
          while (!success && retry) {
            let durationTime = await handleStatusChanges();
            pauseTime = Number(pauseTime) + Number(durationTime);

            bearer_token = `${localStorage.getItem(PULSE_TOKEN)}`;
            try {
              let startAPI = performance.now();
              const rspCallPage = await axios.post(PULSE_CALL_PAGE_API_URL, {
                token: bearer_token,
                installation: itemValue(STORAGE_PULSE_ENV_INSTALLATION),
                endpoint: endpoint,
                params: paramsItem,
              });

              updateMessage(
                setMessage,
                `Retrieve page data ${Number(paramsItem.$skip) / Number(pageSize) + 1}`
              );
              // console.log("Retrieve page data", paramsItem.$skip);
              // console.log("Get data", rspCallPage.data.value);

              if (pushToDB) {
                let dbitems = rspCallPage.data.value;

                if (dbitems.length !== 0) {
                  let savingDBItems = dbitems;
                  if (settingCheckExistDB) {
                    savingDBItems = dbitems.filter((item: any) => {
                      const checkExistDB = existIds.find(
                        (a: any) => String(a.pulse_id) === String(item.Id)
                      );
                      if (checkExistDB) {
                        return false;
                      } else {
                        return true;
                      }
                    });
                  }

                  if (savingDBItems.length !== 0) {
                    updateMessage(setMessage, `Ready to save page data`);

                    let success = false;
                    let retry_save = RETRY_COUNT;
                    while (!success && retry_save) {
                      let durationTime = await handleStatusChanges();
                      pauseTime = Number(pauseTime) + Number(durationTime);

                      const rspSaveDB = await saveDB(
                        apiUrl,
                        endpoint,
                        savingDBItems
                      );

                      if (rspSaveDB) {
                        setPushPercent(
                          Number(
                            Number(
                              ((pageIndex + 1) / paramsList.length) * 100
                            ).toFixed(1)
                          )
                        );

                        updateMessage(
                          setMessage,
                          `Save the data of ${Number(paramsItem.$skip) / Number(pageSize) + 1}th page to the database.`
                        );

                        success = true;
                      } else {
                        updateMessage(
                          setMessage,
                          `Error: Save the data of ${Number(paramsItem.$skip) / Number(pageSize) + 1}th page to the database.`
                        );

                        await delay(dbDelayMs);
                      }
                      retry_save--;
                    }
                    if (success) {
                      updateMessage(
                        setMessage,
                        `Success to Save the ${Number(paramsItem.$skip) / Number(pageSize) + 1}th page`
                      );
                    } else {
                      updateMessage(
                        setMessage,
                        `Failed to Save the ${Number(paramsItem.$skip) / Number(pageSize) + 1}th page after retrying ${RETRY_COUNT} times`
                      );
                    }
                  } else {
                    updateMessage(
                      setMessage,
                      `Info: There is no data to insert into the database.`
                    );
                  }

                  // console.log("savingDBItems", savingDBItems);
                } else {
                  updateMessage(
                    setMessage,
                    `Info: There is no data to insert into the database.`
                  );
                }
              }

              const progress = (pageIndex + 1) / paramsList.length;
              setPushPercent(Number(Number(progress * 100).toFixed(1)));
              const end = performance.now();
              setRunTime(end - start - pauseTime);
              // console.log('startTimeDate', startTimeDate)
              if (startTimeDate) {
                // Show estimated FinishTime
                setFinishTime(
                  new Date(
                    startTimeDate.getTime() +
                      pauseTime +
                      (end - start - pauseTime) / progress
                  )
                );
              }
              // console.log("Push data of the page", paramsItem.page);
              const durationAPI = performance.now() - startAPI;
              if (durationAPI < delayMs) {
                await delay(delayMs - durationAPI); // delay between each request
              }
              success = true;
            } catch (error: any) {
              // console.log("error", error);
              if (error.message === THROW_APP_STOP) {
                setLoading(false);
                updateMessage(
                  setMessage,
                  `Idle mode will activate in 3 seconds.`
                );
                await delay(3000);
                setStatus(STATUS_IDLE);
                return;
              } else if (error.response && error.response.status === 429) {
                // console.log("429 error response", error.response);
                // get delays seconds
                const delayTry = extractFirstNumber(error.response.data.error);
                updateMessage(
                  setMessage,
                  `Sorry, We have sent too many request recently. I will try after ${delayTry}.`
                );

                if (delayTry) {
                  await delay(Number((Number(delayTry) + 1) * 1000));
                }
              } else {
                updateMessage(
                  setMessage,
                  `Error: fetching data ${Number(paramsItem.$skip) / Number(pageSize) + 1}.`
                );

                await delay(delayMs);
              }
            }
            retry--;
          }
          if (success) {
            updateMessage(
              setMessage,
              `Success to Get and Process the ${Number(paramsItem.$skip) / Number(pageSize) + 1}th page.`
            );
            successPageCount++;
          } else {
            updateMessage(
              setMessage,
              `Failed to Get and Process the ${Number(paramsItem.$skip) / Number(pageSize) + 1}th page after retrying ${RETRY_COUNT} times.`
            );
            failPageCount++;
          }
        }
        updateMessage(
          setMessage,
          `Successful  Pages:${successPageCount}, Failed Pages: ${failPageCount}`
        );
      };
      if (status === STATUS_PAUSE) {
        setStatus(STATUS_RESUME);
      } else {
        // init variables
        initSubmitVariables();
        setStatus(STATUS_START);
      }

      setLoading(true);
      const checkToken = await tokenCheck();
      if (!checkToken) {
        console.log("Passhere");
        setStatus(STATUS_STOP);
        setLoading(false);
        return;
      }
      const settingCheckExistDB =
        itemValue(STORAGE_SQLSRV_CHECK_EXIST_DB) === "true" || itemValue(STORAGE_SQLSRV_CHECK_EXIST_DB) === "" ? true : false;
      updateMessage(
        setMessage,
        `Ready to get data page of ${endpoint}, Filter by date: ${byDate}, Check Existing DB: ${settingCheckExistDB}, Save to DB: ${pushToDB}`
      );

      if (apiUrl === EZY_VET_API) {
        await handleEzyVetAPISubmit();
      }
      if (apiUrl === PULSE_API) {
        await handlePulseAPISubmit();
      }

      setLoading(false);
      setStatus(STATUS_COMPLETE);
      showStatusMessage();
      //updateMessage(setMessage, `Idle mode will activate in 3 seconds.`);
      //await delay(3000);
    } catch (error: any) {
      setLoading(false);
      if (error.message === THROW_APP_STOP) {
        //updateMessage(setMessage, `Idle mode will activate in 3 seconds.`);
        //await delay(3000);
      } else {
        console.error("Failed to post data:", error.message);
        updateMessage(setMessage, `Failed!: ${error.message}`);
      }
      setStatus(STATUS_STOP);
      showStatusMessage();
    }
  };

  const handlePause = () => {
    setStatus(STATUS_PAUSE);
  };

  const handleResume = () => {
    setStatus(STATUS_RESUME);
  };

  const handleStop = () => {
    setIsOpenEnsureStopModal(true);
  };

  const handleRestart = async () => {
    setIsOpenEnsureRestartModal(true);
  };

  const handleStatusChanges = async (): Promise<any> => {
    const starthandleStatusChanges = performance.now();

    const currentStatus = itemValue(STORE_STATUS);

    if (currentStatus === STATUS_STOP) {
      setLoading(false);

      throw new Error(THROW_APP_STOP);
    }

    while (currentStatus === STATUS_PAUSE) {
      const updateStatus = itemValue(STORE_STATUS);

      if (
        updateStatus === STATUS_RESUME ||
        updateStatus === STATUS_STOP ||
        updateStatus === STATUS_RESTART
      ) {
        break;
      }
      await delay(1000);
    }

    const endhandleStatusChanges = performance.now();

    return endhandleStatusChanges - starthandleStatusChanges;
  };

  // handle Ensure modals
  const closeEnsureStopModal = () => {
    setIsOpenEnsureStopModal(false);
  };

  const handleEnsureStopModal = () => {
    setIsOpenEnsureStopModal(false);

    setStatus(STATUS_STOP);
  };

  const closeEnsureRestartModal = () => {
    setIsOpenEnsureRestartModal(false);
  };

  const handleEnsureRestartModal = async () => {
    setIsOpenEnsureRestartModal(false);

    setStatus(STATUS_RESTART);
  };

  return (
    <>
      <section>
        <div className="flex-col mt-32 mx-auto max-w-screen-2xl items-start">
          <div className="flex m-1">
            <Collapse title="Input to Get Data" open={false}>
              <div className="flex items-start">
                <div className="m-1 w-1/5">
                  <Collapse title="Select API" open={false}>
                    <SelectComponent
                      options={optionsAPIs}
                      name="apis"
                      selected={apiUrl}
                      onChange={(value) => setApiUrl(value)}
                    />
                  </Collapse>
                </div>
                <div className="m-1 w-1/5">
                  <Collapse
                    title={
                      apiUrl === EZY_VET_API ? "EzyVet Client" : "Pulse Client"
                    }
                    open={false}
                  >
                    <SelectComponent
                      options={
                        apiUrl === EZY_VET_API
                          ? clientEzyAccounts
                          : clientPulseAccounts
                      }
                      name="clients"
                      selected={client}
                      onChange={(value) => setClient(value)}
                    />
                  </Collapse>
                </div>
                <div className="m-1 w-1/5">
                  <Collapse title="Endpoints" open={false}>
                    <SelectComponent
                      options={
                        apiUrl === EZY_VET_API
                          ? optionsEzyEndpoints
                          : optionsPulseEndpoints
                      }
                      name="endpoints"
                      selected={endpoint}
                      onChange={(valueEnd) => setEndpoint(valueEnd)}
                    />
                  </Collapse>
                </div>
                <div className="m-1 w-2/5">
                  <Collapse
                    title={`Filter By Date (Time Zone:${timeZone})`}
                    open={false}
                  >
                    <SelectComponent
                      options={
                        endpoint !== EZY_ENP_INVOICELINE
                          ? optionsFilterByDate
                          : optionsInvoiceLinesFilterByDate
                      }
                      name="filterbydate"
                      selected={byDate}
                      onChange={(value) => setDateBy(value)}
                    />
                  </Collapse>
                  {byDate !== FILTER_BY_DATE_ALL && (
                    <Collapse title="Select Range of Data" open={false}>
                      {byDate === FILTER_BY_DATE_DAY && (
                        <Collapse title="Select Day" open={false}>
                          <SelectDay
                            startDate={startDate}
                            onChange={(date) => {
                              setStartDate(date);
                              setEndDate(date);
                            }}
                          />
                        </Collapse>
                      )}
                      {byDate === FILTER_BY_DATE_WEEK && (
                        <Collapse title="Select Week" open={false}>
                          <SelectWeek
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(sDate, eDate) => {
                              setStartDate(sDate);
                              setEndDate(eDate);
                            }}
                          />
                        </Collapse>
                      )}
                      {byDate === FILTER_BY_DATE_MONTH && (
                        <Collapse title="Select Month" open={false}>
                          <SelectMonth
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(sDate, eDate) => {
                              setStartDate(sDate);
                              setEndDate(eDate);
                            }}
                          />
                        </Collapse>
                      )}
                      {byDate === FILTER_BY_DATE_QUARTER && (
                        <Collapse title="Select Quarter" open={false}>
                          <SelectQuarter
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(sDate, eDate) => {
                              setStartDate(sDate);
                              setEndDate(eDate);
                            }}
                          />
                        </Collapse>
                      )}
                      {byDate === FILTER_BY_DATE_YEAR && (
                        <Collapse title="Select Year" open={false}>
                          <SelectYear
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(sDate, eDate) => {
                              setStartDate(sDate);
                              setEndDate(eDate);
                            }}
                          />
                        </Collapse>
                      )}
                      {byDate === FILTER_BY_DATE_RANGE && (
                        <Collapse title="Select Date Range" open={false}>
                          <SelectDateRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(sDate, eDate) => {
                              setStartDate(sDate);
                              setEndDate(eDate);
                            }}
                          />
                        </Collapse>
                      )}
                    </Collapse>
                  )}
                </div>
                <div className="m-1 w-1/5">
                  <Collapse title="Filter By Page" open={false}>
                    <SelectComponent
                      options={optionsFilterByPage}
                      name="filterbyPage"
                      selected={byPage}
                      onChange={(valueEnd) => setSelectPage(valueEnd)}
                    />
                    <div className="mt-3" />
                    {byPage === SELECT_PAGE_NUMBER && (
                      <SelectPage
                        pageSize={pageSize}
                        pageNumber={pageNumber}
                        onChange={(type, value) => {
                          if (type === "page-size") {
                            setPageSize(value);
                          } else {
                            setPageNumber(value);
                            setPageStart(value);
                            setPageEnd(value);
                          }
                        }}
                      />
                    )}
                    {byPage === SELECT_PAGE_RANGE && (
                      <SelectPageRange
                        pageSize={pageSize}
                        pageStart={pageStart}
                        pageEnd={pageEnd}
                        onChange={(type, value) => {
                          if (type === "page-size") {
                            setPageSize(value);
                          } else if (type === "page-start") {
                            setPageStart(value);
                          } else if (type === "page-end") {
                            setPageEnd(value);
                          }
                        }}
                      />
                    )}
                  </Collapse>
                </div>
              </div>
            </Collapse>
          </div>
          <div className="mt-5 px-5 mx-auto max-w-screen-2xl">
            <div className="flex items-center rounded">
              <input
                checked={pushToDB}
                onChange={handlePushToDBStatus}
                id="bordered-checkbox-3"
                type="checkbox"
                value=""
                disabled={loading}
                name="bordered-checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700"
              />
              <label
                htmlFor="bordered-checkbox-3"
                className="w-full py-2 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Save to DB
              </label>
            </div>
          </div>
          <div className="m-5 flex justify-center">
            <ControlButtons
              status={status}
              onPause={handlePause}
              onPlay={() => {
                if (status === STATUS_PAUSE) {
                  handleResume();
                } else {
                  handleSubmit();
                }
              }}
              onStop={handleStop}
              onRestart={handleRestart}
            />
          </div>
          <div className="flex m-1">
            <Collapse title="Output" open={false}>
              <Output
                data={metaData}
                pushPercent={pushPercent}
                startTime={startTime}
                runTime={runTime}
                finishTime={finishTime}
                message={message}
              />
            </Collapse>
          </div>
        </div>
        {isOpenEnsureStopModal && (
          <EnsureStopModal
            onClose={closeEnsureStopModal}
            onEnsure={handleEnsureStopModal}
          />
        )}
        {isOpenEnsureRestartModal && (
          <EnsureRestartModal
            onClose={closeEnsureRestartModal}
            onEnsure={handleEnsureRestartModal}
          />
        )}
      </section>
    </>
  );
}
