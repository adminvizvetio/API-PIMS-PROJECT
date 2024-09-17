import {
  DEFAULT_ACCOUNT,
  DEFAULT_ACCOUNT_ID,
  EZY_VET_API,
  INVOICELINE_STATUS_FILALISED,
  PULSE_API,
  STORAGE_EZY_ENV_ACCOUNT_ID,
  STORAGE_PULSE_ENV_ACCOUNT_ID,
} from "./constants";

export const getDate = (now: Date): any => {
  const year = now.getFullYear(); // e.g., 2024
  const month = now.getMonth() + 1; // e.g., 8 (Months are 0-indexed)
  const day = now.getDate(); // e.g., 8

  const datetime = `${year}/${month}/${day}`;

  return datetime;
};

export const delayMs = 6000;
export const dbDelayMs = 2000;
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function extractFirstNumber(str: string): number | null {
  const match = str.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function itemValue(key: string): string {
  const value = localStorage.getItem(key);
  return value === null ? "" : value;
}

export function splitDateRangeToMonths(startDate: any, endDate: any) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  let current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    let nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    let rangeEnd: any = nextMonth <= end ? nextMonth : new Date(end);

    dates.push({
      start: new Date(current),
      end: new Date(rangeEnd - 1),
    });

    current = nextMonth;
  }

  return dates;
}

export function splitDateRangeTo10Days(startDate: any, endDate: any) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result = [];

  while (start <= end) {
    const chunkStart = new Date(start);
    start.setDate(start.getDate() + 9); // Add 9 days
    const chunkEnd = new Date(start < end ? start : end);
    result.push({ start: chunkStart, end: chunkEnd });
    start.setDate(start.getDate() + 1); // Move to the next day
  }

  return result;
}

export function escapeSQL(value: string) {
  if (typeof value === "string") {
    return value
      .replace(/\\/g, "\\\\") // Escapes backslashes
      .replace(/'/g, "''") // Escapes single quotes
      .replace(/"/g, '\\"') // Escapes double quotes
      .replace(/\0/g, "\\0") // Escapes NULL characters
      .replace(/\n/g, "\\n") // Escapes newlines
      .replace(/\r/g, "\\r") // Escapes carriage returns
      .replace(/\x1a/g, "\\Z"); // Escapes EOF characters
  }
  return value;
}
export function escapeSQLWithLimitLength(value: string, length: number = 255) {
  if (!value) return value;
  return escapeSQL(value.substring(0, length)).substring(0, length);
}
export const getDateTimeString = (date: Date | undefined): any => {
  if (!date) return "";
  const now = date;

  const year = now.getFullYear(); // e.g., 2024
  const month = now.getMonth() + 1; // e.g., 8 (Months are 0-indexed)
  const day = now.getDate(); // e.g., 8

  const hours = now.getHours(); // e.g., 14 (24-hour format)
  const minutes = now.getMinutes(); // e.g., 30
  const seconds = now.getSeconds(); // e.g., 15

  const datetime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

  return datetime;
};

export function msToTime(ms: number) {
  let days = Math.floor(ms / (24 * 60 * 60 * 1000));
  let daysMs = ms % (24 * 60 * 60 * 1000);
  let hours = Math.floor(daysMs / (60 * 60 * 1000));
  let hoursMs = ms % (60 * 60 * 1000);
  let minutes = Math.floor(hoursMs / (60 * 1000));
  let minutesMs = ms % (60 * 1000);
  let seconds = Math.floor(minutesMs / 1000);

  if (days !== 0) {
    return `${days} days, ${hours}:${minutes}:${seconds} s`;
  } else {
    if (hours !== 0) {
      return `${hours}:${minutes}:${seconds} s`;
    } else {
      if (minutes !== 0) {
        return `${minutes}:${seconds} s`;
      } else {
        if (seconds !== 0) {
          return `${seconds} s`;
        } else {
          return "";
        }
      }
    }
  }
}

export function getNextDay(date: any) {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

export function dateToSQLTime(date: any) {
  return new Date(date).getTime() / 1000;
}

export function setTimeToMidnight(dateString: any) {
  // Parse the input date string into a Date object
  let date = new Date(dateString);

  // Create a new Date object with the same date but with time set to midnight
  let midnightDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0
  );

  // Format the date manually
  let year = midnightDate.getFullYear();
  let month = String(midnightDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  let day = String(midnightDate.getDate()).padStart(2, "0");
  let hours = String(midnightDate.getHours()).padStart(2, "0");
  let minutes = String(midnightDate.getMinutes()).padStart(2, "0");
  let seconds = String(midnightDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function updateMessage(setMessage: any, msg: string) {
  setMessage((state: any) => `${state}\n${msg}`);
}

export const defaultEzyAccounts = [
  {
    id: 0,
    clientName: DEFAULT_ACCOUNT,
    clientAccountId: DEFAULT_ACCOUNT_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    grantType: process.env.GRANT_TYPE,
    partnerId: process.env.PARTNER_ID,
    scope: process.env.SCOPE,
    invoice_join: false,
    pass: false,
    newAccount: false,
    filterInvoiceLines: INVOICELINE_STATUS_FILALISED,
  },
];

export const defaultPulseAccounts = [
  {
    id: 0,
    clientName: DEFAULT_ACCOUNT,
    clientAccountId: DEFAULT_ACCOUNT_ID,
    userName: process.env.PULSE_USER_NAME,
    password: process.env.PULSE_PASSWORD,
    installation: process.env.PULSE_INSTALLATION,
  },
];

export function getAccountId(apiType: any) {
  let accountId;

  if (apiType === EZY_VET_API) {
    accountId = itemValue(STORAGE_EZY_ENV_ACCOUNT_ID);
  }

  if (apiType === PULSE_API) {
    accountId = itemValue(STORAGE_PULSE_ENV_ACCOUNT_ID);
  }

  return accountId;
}
