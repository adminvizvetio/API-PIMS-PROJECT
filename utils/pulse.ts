import axios from "axios";
import {
  PULSE_TOKEN,
  PULSE_TOKEN_EXPIRE_IN,
  STORAGE_PULSE_ENV_PASSWORD,
  STORAGE_PULSE_ENV_USERNAME,
  PREFIX_PULSE,
  STORAGE_SQLSRV_ENV_DATABASE_PULSE,
  STORAGE_SQLSRV_ENV_HOST,
  STORAGE_SQLSRV_ENV_PASSWORD,
  STORAGE_SQLSRV_ENV_PORT,
  STORAGE_SQLSRV_ENV_USERNAME,
  TABLES_PULSE,
  DEFAULT_PREFIX_PULSE,
  PULSE_API,
} from "@/utils/constants";

import { getAccountId, itemValue } from "@/utils/utils";

export const checkPulseENV = async (data: any): Promise<boolean> => {
  try {
    const rspToken = await axios.post(`/api/third-party/pulse/get-token`, {
      userName: data.userName,
      password: data.password,
    });

    return true;
  } catch (error) {
    // console.log("save token error");
    return false;
  }
};

export const savePulseToken = async (): Promise<boolean> => {
  try {
    const rspToken = await axios.post(`/api/third-party/pulse/get-token`, {
      userName: itemValue(STORAGE_PULSE_ENV_USERNAME),
      password: itemValue(STORAGE_PULSE_ENV_PASSWORD),
    });

    localStorage.setItem(PULSE_TOKEN, rspToken.data.access_token);

    const expiresIn = rspToken.data.expires_in; // Example: token validity in seconds
    const tokenReceivedTime = Date.now(); // Timestamp when token was received
    const expirationTime = tokenReceivedTime + (Number(expiresIn) - 300) * 1000; // Convert to milliseconds 300/60=5min before

    localStorage.setItem(PULSE_TOKEN_EXPIRE_IN, String(expirationTime));

    return true;
  } catch (error) {
    // console.log("save token error");
    return false;
  }
};

export const checkPulseDBEnv = async (): Promise<boolean> => {
  try {
    const config = {
      sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
      sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE_PULSE),
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

export const checkPulsePrefixDB = async (): Promise<boolean> => {
  try {
    const config = {
      sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
      sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE_PULSE),
      sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
      sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
      sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
      prefix: itemValue(PREFIX_PULSE),
    };

    const rspPulsePrefixDB = await axios.post(
      `/api/viz-vet-db/check-db-prefix`,
      {
        config,
      }
    );

    if (rspPulsePrefixDB.data.length > 0) {
      let success = 0;
      for (let i = 0; i < TABLES_PULSE.length; i++) {
        const existTable = rspPulsePrefixDB.data.find(
          (item: any) =>
            item.name === `${itemValue(PREFIX_PULSE)}${TABLES_PULSE[i]}`
        );
        if (existTable) {
          success++;
        } else {
          console.log(
            `there is no ${itemValue(PREFIX_PULSE)}${TABLES_PULSE[i]}`
          );
        }
      }

      if (TABLES_PULSE.length === success) {
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
export const savePulseDB = async (
  endpoint: string,
  items: []
): Promise<boolean> => {
  try {
    const config = {
      sqlsrv_env_host: itemValue(STORAGE_SQLSRV_ENV_HOST),
      sqlsrv_env_database: itemValue(STORAGE_SQLSRV_ENV_DATABASE_PULSE),
      sqlsrv_env_username: itemValue(STORAGE_SQLSRV_ENV_USERNAME),
      sqlsrv_env_password: itemValue(STORAGE_SQLSRV_ENV_PASSWORD),
      sqlsrv_env_port: itemValue(STORAGE_SQLSRV_ENV_PORT),
    };
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

    const prefix =
      itemValue(PREFIX_PULSE) === ""
        ? DEFAULT_PREFIX_PULSE
        : itemValue(PREFIX_PULSE);

    let accountId = getAccountId(PULSE_API);

    const updateItems = items.map((item: any) => ({
      ...item,
      customDate: item.Date,
    }));

    const rspSaveDB = await axios.post(
      `/api/viz-vet-db/savedb/pulse/${endpoint}`,
      {
        content: updateItems,
        config,
        useLocalEvn,
        prefix,
        accountId,
      }
    );

    return true;
  } catch (error) {
    // console.log("save db error");
    return false;
  }
};
