import axios from "axios";
import {
  STORAGE_EZY_ENV_CLIENTID,
  STORAGE_EZY_ENV_CLIENTSECRET,
  STORAGE_EZY_ENV_GRATNTYPE,
  STORAGE_EZY_ENV_PARTNERID,
  STORAGE_EZY_ENV_SCOPE,
  EZY_TOKEN,
  EZY_TOKEN_EXPIRE_IN,
  EZY_ENP_INVOICE,
  EZY_ENP_PRODUCT_V2,
  INVOICE_JOIN_DATE,
  STORAGE_SQLSRV_ENV_HOST,
  STORAGE_SQLSRV_ENV_DATABASE,
  STORAGE_SQLSRV_ENV_PASSWORD,
  STORAGE_SQLSRV_ENV_PORT,
  STORAGE_SQLSRV_ENV_USERNAME,
  PREFIX_EZY,
  TABLES_EZY,
  DEFAULT_PREFIX_EZY,
  EZY_VET_API,
  PULSE_API,
  FILTER_BY_DATE_ALL,
  STORAGE_SQLSRV_ENV_DATABASE_PULSE,
  PREFIX_PULSE,
  DEFAULT_PREFIX_PULSE,
} from "./constants";
import {
  delayMs,
  delay,
  extractFirstNumber,
  itemValue,
  getAccountId,
} from "@/utils/utils";

export function isTokenExpired(expirationTime: string | null): boolean {
  try {
    if (Number.isInteger(Number(expirationTime)) && expirationTime !== "") {
      const isExpired = Date.now() > Number(expirationTime);
      // console.log("isExpired", isExpired);
      return isExpired;
    } else {
      // console.log("tokenExprieIn status", expirationTime);
      return true;
    }
  } catch (error) {
    // console.error("Error checking token expiration:", error);
    return true; // Consider the token expired if there is an error
  }
}

export const saveEzyToken = async (): Promise<boolean> => {
  try {
    const rspToken = await axios.post(`/api/third-party/ezy-vet/get-token`, {
      partnerId: itemValue(STORAGE_EZY_ENV_PARTNERID),
      clientId: itemValue(STORAGE_EZY_ENV_CLIENTID),
      clientSecret: itemValue(STORAGE_EZY_ENV_CLIENTSECRET),
      grantType: itemValue(STORAGE_EZY_ENV_GRATNTYPE),
      scope: itemValue(STORAGE_EZY_ENV_SCOPE),
    });

    localStorage.setItem(EZY_TOKEN, rspToken.data.access_token);

    const expiresIn = rspToken.data.expires_in; // Example: token validity in seconds
    const tokenReceivedTime = Date.now(); // Timestamp when token was received
    const expirationTime = tokenReceivedTime + (Number(expiresIn) - 300) * 1000; // Convert to milliseconds 300/60=5min before

    localStorage.setItem(EZY_TOKEN_EXPIRE_IN, String(expirationTime));

    return true;
  } catch (error) {
    // console.log("save token error");
    return false;
  }
};

export const checkEzyENV = async (data: any): Promise<boolean> => {
  try {
    const rspToken = await axios.post(`/api/third-party/ezy-vet/get-token`, {
      partnerId: data.partnerId,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      grantType: data.grantType,
      scope: data.scope,
    });

    return true;
  } catch (error) {
    // console.log("save token error");
    return false;
  }
};

export const joinInvoicelineWithInvoice = async (
  invoicelineItems: Array<any>,
  setMessage: any
) => {
  let dbitems = [];
  const invoiceIds = invoicelineItems.map((a: any) => a.invoiceline.invoice_id);
  console.log("init invoiceIds", invoiceIds);
  const uniqueInvoiceIdsArray = invoiceIds.filter(
    (value: any, index: number, self: any) => {
      return self.indexOf(value) === index;
    }
  );
  console.log("uniqueInvoiceIds", uniqueInvoiceIdsArray);

  let relactedInvoiceIds: any[] = [];

  for (const uniqueInvoiceItem of uniqueInvoiceIdsArray) {
    let success = false;
    while (!success) {
      await delay(delayMs);
      let bearer_token;
      bearer_token = `${localStorage.getItem(EZY_TOKEN)}`;
      try {
        // get all invoice data whose invoice_id
        let invoice_date: string; // date of invoice
        const invoiceDateTime: number =
          new Date(INVOICE_JOIN_DATE, 0, 1).getTime() / 1000;
        invoice_date = encodeURIComponent(
          JSON.stringify({ ">=": invoiceDateTime })
        );

        console.log(
          "rspInvoiceIdCallPage id, date",
          uniqueInvoiceItem,
          invoice_date
        );

        const rspInvoiceIdCallPage = await axios.post(
          `/api/third-party/ezy-vet/call-page`,
          {
            token: bearer_token,
            endpoint: EZY_ENP_INVOICE,
            params: {
              id: Number(uniqueInvoiceItem),
              date: invoice_date,
            },
          }
        );

        if (rspInvoiceIdCallPage.data.items.length !== 0) {
          relactedInvoiceIds.push(uniqueInvoiceItem);
          setMessage(
            (state: any) =>
              `${state}\nAdd to Related Invoice ID ${uniqueInvoiceItem}`
          );
        } else {
          setMessage(
            (state: any) =>
              `${state}\nRemove from Related Invoice ID ${uniqueInvoiceItem}`
          );
        }
        success = true;
      } catch (error: any) {
        // console.log("error", error);
        if (error.response && error.response.status === 429) {
          // console.log("429 error response", error.response);
          // get delays seconds
          const delayTry = extractFirstNumber(error.response.data.error);
          setMessage(
            (state: any) =>
              `${state}\nSorry, We have sent too many request recently. We need to try after ${delayTry}s`
          );
          if (delayTry) {
            await delay(Number((Number(delayTry) + 1) * 1000));
          }
        } else {
          setMessage(
            (state: any) =>
              `${state}\nerror: Related Invoice ID ${uniqueInvoiceItem}: ${error.toString()}`
          );
        }
      }
    }
  }

  //console.log("rspCallPage data items", invoicelineItems);
  dbitems = invoicelineItems.filter((item: any) => {
    const existInvoiceItem = relactedInvoiceIds.find(
      (a: string) => Number(a) === item.invoiceline.invoice_id
    );

    if (existInvoiceItem) {
      return true;
    } else {
      return false;
    }
  });
  return dbitems;
};

export const getIds = async (
  apiType: string,
  endpoint: string,
  fromDate: Date,
  toDate: Date,
  byDate: string,
  setMessage: any
): Promise<any> => {
  try {
    if (byDate !== FILTER_BY_DATE_ALL) {
      setMessage(
        (state: any) =>
          `${state}\nGet existing Ids within ${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
      );
    } else {
      setMessage((state: any) => `${state}\nGet existing Ids`);
    }

    let config: any;
    let prefix;

    if (apiType === EZY_VET_API) {
      config = {
        sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
        sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE),
        sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
        sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
        sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
      };

      prefix =
        itemValue(PREFIX_EZY) === ""
          ? DEFAULT_PREFIX_EZY
          : itemValue(PREFIX_EZY);
    }

    if (apiType === PULSE_API) {
      config = {
        sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
        sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE_PULSE),
        sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
        sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
        sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
      };

      prefix =
        itemValue(PREFIX_PULSE) === ""
          ? DEFAULT_PREFIX_PULSE
          : itemValue(PREFIX_PULSE);
    }

    let useLocalEvn = false;
    if (
      config.sqlsrv_env_host === "" ||
      config.sqlsrv_env_database === "" ||
      config.sqlsrv_env_username === "" ||
      config.sqlsrv_env_password === "" ||
      config.sqlsrv_env_port === ""
    ) {
      useLocalEvn = true;
    }

    let accountId = getAccountId(apiType);
    let rspIdsDB: any;

    if (apiType === EZY_VET_API) {
      rspIdsDB = await axios.post(`/api/viz-vet-db/get-ids/ezyvet`, {
        config,
        useLocalEvn,
        endpoint,
        accountId,
        fromDate,
        toDate,
        prefix,
        byDate,
      });
    }

    if (apiType === PULSE_API) {
      rspIdsDB = await axios.post(`/api/viz-vet-db/get-ids/pulse`, {
        config,
        useLocalEvn,
        endpoint,
        accountId,
        fromDate,
        toDate,
        prefix,
        byDate,
      });
    }

    return rspIdsDB?.data;
  } catch (error: any) {
    setMessage((state: any) => `${state}\nError: Get Ids ${error.toString()}`);
    // console.log("save token error");
  }
};

export const checkEzyDBEnv = async (): Promise<boolean> => {
  try {
    const config = {
      sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
      sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE),
      sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
      sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
      sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
    };

    const rspSaveDB = await axios.post(`/api/viz-vet-db/check-db-env`, {
      config,
    });

    return true;
  } catch (error) {
    // console.log("save db error");
    return false;
  }
};

export const checkEzyPrefixDB = async (): Promise<boolean> => {
  try {
    const config = {
      sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
      sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE),
      sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
      sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
      sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
      prefix: itemValue(PREFIX_EZY),
    };

    const rspEzyPrefixDB = await axios.post(`/api/viz-vet-db/check-db-prefix`, {
      config,
    });

    if (rspEzyPrefixDB.data.length > 0) {
      let success = 0;
      for (let i = 0; i < TABLES_EZY.length; i++) {
        const existTable = rspEzyPrefixDB.data.find(
          (item: any) =>
            item.name === `${itemValue(PREFIX_EZY)}${TABLES_EZY[i]}`
        );
        if (existTable) {
          success++;
        } else {
          console.log(`there is no ${itemValue(PREFIX_EZY)}${TABLES_EZY[i]}`);
        }
      }

      if (TABLES_EZY.length === success) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // console.log("save db error");
    return false;
  }
};

export const saveDB = async (
  apiType: string,
  endpoint: string,
  items: []
): Promise<boolean> => {
  try {
    let config: any;
    let prefix;

    if (apiType === EZY_VET_API) {
      config = {
        sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
        sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE),
        sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
        sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
        sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
      };

      prefix =
        itemValue(PREFIX_EZY) === ""
          ? DEFAULT_PREFIX_EZY
          : itemValue(PREFIX_EZY);
    } else if (apiType === PULSE_API) {
      config = {
        sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
        sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE_PULSE),
        sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
        sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
        sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
      };

      prefix =
        itemValue(PREFIX_PULSE) === ""
          ? DEFAULT_PREFIX_PULSE
          : itemValue(PREFIX_PULSE);
    }

    let useLocalEvn = false;

    if (
      config.sqlsrv_env_host === "" ||
      config.sqlsrv_env_database === "" ||
      config.sqlsrv_env_username === "" ||
      config.sqlsrv_env_password === "" ||
      config.sqlsrv_env_port === ""
    ) {
      useLocalEvn = true;
    }

    let accountId = getAccountId(apiType);
    let rspSaveDB;

    if (apiType === EZY_VET_API) {
      const endpoint_path =
        endpoint === EZY_ENP_PRODUCT_V2 ? "product_v2" : endpoint;
      rspSaveDB = await axios.post(
        `/api/viz-vet-db/savedb/ezyvet/${endpoint_path}`,
        {
          content: items,
          config,
          useLocalEvn,
          prefix,
          accountId,
        }
      );
    } else if (apiType === PULSE_API) {
      rspSaveDB = await axios.post(`/api/viz-vet-db/savedb/pulse/${endpoint}`, {
        content: items,
        config,
        useLocalEvn,
        prefix,
        accountId,
      });
    }

    return true;
  } catch (error) {
    console.log("save db error", error);
    return false;
  }
};
