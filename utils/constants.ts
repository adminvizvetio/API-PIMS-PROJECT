export const VIZVET_APP_VERSION = "0.2.2";
export const EZY_VET_API = "ezyvet";
export const PULSE_API = "pulse";

export const CLIENT_DEFAULT = "default";
export const CLIENT_EZYVET_CLIENT1 = "ezyvet_client1";
export const CLIENT_EZYVET_CLIENT2 = "ezyvet_client2";

export const EZY_ENP_ANIMAL = "animal";
export const EZY_ENP_CONTACT = "contact";
export const EZY_ENP_INVOICE = "invoice";
export const EZY_ENP_INVOICELINE = "invoiceline";
export const EZY_ENP_RESOURCE = "resource";
export const EZY_ENP_PRODUCT = "product";
export const EZY_ENP_PRODUCT_V2 = "product";
export const EZY_ENP_PRODUCTGROUP = "productgroup";
export const EZY_ENP_SEPARATION = "separation";
export const EZY_ENP_SEX = "sex";
export const EZY_ENP_SPECIES = "species";

export const EZY_ENP_LBL_ANIMAL = "Animal";
export const EZY_ENP_LBL_CONTACT = "Contact";
export const EZY_ENP_LBL_INVOICE = "Invoice";
export const EZY_ENP_LBL_INVOICELINE = "InvoiceLine";
export const EZY_ENP_LBL_RESOURCE = "Resource";
export const EZY_ENP_LBL_PRODUCT = "Product";
export const EZY_ENP_LBL_PRODUCT_V2 = "Product V2";
export const EZY_ENP_LBL_PRODUCTGROUP = "ProductGroup";
export const EZY_ENP_LBL_SEPARATION = "Separation";
export const EZY_ENP_LBL_SEX = "Sex";
export const EZY_ENP_LBL_SPECIES = "Species";

export const PULSE_ENP_CLIENTS = "Clients";
export const PULSE_ENP_CODES = "Codes";
export const PULSE_ENP_INVOICES = "Invoices";
export const PULSE_ENP_PATIENTS = "Patients";
export const PULSE_ENP_SITES = "Sites";
export const PULSE_ENP_TRANSACTIONS = "Transactions";
export const PULSE_ENP_ClientPatientRelationships =
  "ClientPatientRelationships";

export const FILTER_BY_DATE_ALL = "all";
export const FILTER_BY_DATE_DAY = "day";
export const FILTER_BY_DATE_WEEK = "week";
export const FILTER_BY_DATE_MONTH = "month";
export const FILTER_BY_DATE_QUARTER = "quarter";
export const FILTER_BY_DATE_YEAR = "year";
export const FILTER_BY_DATE_RANGE = "datarange";

export const SELECT_PAGE_ALL = "all";
export const SELECT_PAGE_NUMBER = "page_number";
export const SELECT_PAGE_RANGE = "page_range";

export const YEAR_ALL = 0;
export const QUARTER_1 = 1;
export const QUARTER_2 = 2;
export const QUARTER_3 = 3;
export const QUARTER_4 = 4;

export const ITEM_MAX_LIMIT = 200;
export const RETRY_COUNT = 5;

export const STORAGE_EZY_ENV_CLIENT_NAME = "ezy_env_clientName";
export const STORAGE_EZY_ENV_ACCOUNT_ID = "ezy_env_accountId";
export const STORAGE_EZY_ENV_PARTNERID = "ezy_env_partnerId";
export const STORAGE_EZY_ENV_CLIENTID = "ezy_env_clientId";
export const STORAGE_EZY_ENV_CLIENTSECRET = "ezy_env_clientSecret";
export const STORAGE_EZY_ENV_GRATNTYPE = "ezy_env_grantType";
export const STORAGE_EZY_ENV_SCOPE = "ezy_env_scope";
export const STORAGE_EZY_ENV_FILTER_INVOICELINES =
  "ezy_env_filter_invoicelines";
export const STORAGE_EZY_INVOICE_JOIN = "ezy_invoice_join";
export const STORAGE_EZY_ACCOUNTS = "ezy_accounts";

export const STORAGE_PULSE_ENV_CLIENT_NAME = "puls_env_clientName";
export const STORAGE_PULSE_ENV_ACCOUNT_ID = "puls_env_accountId";
export const STORAGE_PULSE_ENV_USERNAME = "puls_env_username";
export const STORAGE_PULSE_ENV_PASSWORD = "puls_env_password";
export const STORAGE_PULSE_ENV_INSTALLATION = "puls_env_installation";
export const STORAGE_PULSE_ACCOUNTS = "pulse_accounts";

export const STORAGE_SQLSRV_ENV_HOST = "sqlsrv_evn_host";
export const STORAGE_SQLSRV_ENV_DATABASE = "sqlsrv_evn_database";
export const STORAGE_SQLSRV_ENV_DATABASE_PULSE = "sqlsrv_evn_database_pulse";
export const STORAGE_SQLSRV_ENV_USERNAME = "sqlsrv_evn_username";
export const STORAGE_SQLSRV_ENV_PASSWORD = "sqlsrv_evn_password";
export const STORAGE_SQLSRV_ENV_PORT = "sqlsrv_evn_port";
export const STORAGE_SQLSRV_ACCOUNT_ID = "sqlsrv_account_id";
export const STORAGE_SQLSRV_CHECK_EXIST_DB = "sqlsrv_check_exist_db";

export const EZY_TOKEN_EXPIRE_IN = "ezy_token_expire_in";
export const EZY_TOKEN = "ezy_token";

export const PULSE_TOKEN_EXPIRE_IN = "puls_token_expire_in";
export const PULSE_TOKEN = "puls_token";

export const DEFAULT_ACCOUNT_ID_DEV = "DEV1001";

export const PREFIX_EZY = "prefix_ezy";
export const PREFIX_PULSE = "prefix_pulse";

export const TABLES_EZY = [
  "product_groups",
  "products_v2",
  "separations",
  "sexs",
  "species",
  "animals",
  "resources",
  "contacts",
  "invoice_lines",
  "invoices",
];
export const TABLES_PULSE = ["invoices", "transactions"];

export const DEFAULT_PREFIX_EZY = "";
export const DEFAULT_PREFIX_PULSE = "pulse_";

export const INVOICELINE_STATUS_FILALISED = "Finalised";
export const INVOICELINE_STATUS_NONE_FILALISED = "None_Finalised";
export const INVOICELINE_STATUS_ALL = "All";
export const INVOICE_JOIN_DATE = 2022;

export const PULSE_INVOICE_FILTER_FIELD = "Date";
export const PULSE_TRANSACTION_FILTER_FIELD = "TransactionDate";
export const PULSE_CLIENTS_FILTER_FIELD = "EnteredDate";
export const PULSE_CODES_FILTER_FIELD = "APICreateDate";
export const PULSE_PATIENTS_FILTER_FIELD = "EnteredDate";
export const PULSE_SITES_FILTER_FIELD = "APICreateDate";
export const PULSE_API_VERSION = "v2";

export const EZY_COLLECT_PARAMS_API_URL =
  "/api/third-party/ezy-vet/collect-params";
export const PULSE_COLLECT_PARAMS_API_URL =
  "/api/third-party/pulse/collect-params";
export const PULSE_CALL_PAGE_API_URL = "/api/third-party/pulse/call-page";
export const EZY_CALL_PAGE_API_URL = "/api/third-party/ezy-vet/call-page";

export const STORE_STATUS = "app_status";
export const STATUS_IDLE = "idle";
export const STATUS_START = "start";
export const STATUS_COMPLETE = "complete";
export const STATUS_RESUME = "resume";
export const STATUS_PAUSE = "pause";
export const STATUS_STOP = "stop";
export const STATUS_RESTART = "restart";

export const EZY_TIME_ZONE = "ezy_time_zone";
export const PULSE_TIME_ZONE = "pulse_time_zone";

export const EZY_TIME_ZONE_API_URL = `/api/third-party/ezy-vet/get-timezone`;
export const PULSE_TIME_ZONE_API_URL = `/api/third-party/pulse/get-timezone`;

export const DEFAULT_ACCOUNT = "Default";
export const DEFAULT_ACCOUNT_ID = "Default";

export const THROW_APP_STOP = "AppStop";
