export const WEBSERVICE_SUCCESS = "success"
export const WEBSERVICE_FAILURE = "failure"
export const APP_TITLE = "SkySpaces"
export const APP_BG_COLOR = "var(--app-bg-color)"
export const ITEMS_PER_PAGE = 9
export const STORAGE_SKYSPACE_APP_COUNT_KEY = "SKYSPACE_APP_COUNT"
export const STORAGE_USER_KEY = "USER"
export const STORAGE_SKYSPACE_LIST_KEY = "SKYSPACELIST"
export const STORAGE_USER_SETTING_KEY = "USER_SETTING"
export const STORAGE_USER_APP_PROFILE_KEY = "USER_APP_PROFILE"
export const STORAGE_USER_MASTER_PROFILE_KEY = "USER_MASTER_PROFILE"
export const STORAGE_PORTALS_LIST_KEY = "PORTALS_LIST"
export const STORAGE_USER_SESSION_KEY = "USER_SESSION"
export const STORAGE_DARK_MODE_KEY = "darkMode"
export const BROWSER_STORAGE = localStorage
export const BLOCKSTACK_CORE_NAMES = "https://core.blockstack.org/v1/names"
export const STORAGE_REDIRECT_POST_LOGIN_KEY = "REDIRECT_POST_LOGIN"
export const STORAGE_SKYAPP_DETAIL_KEY = "SKYAPP_DETAIL"
export const STORAGE_SKYSPACE_DETAIL_KEY = "STORAGE_SKYSPACE_DETAIL_KEY"

export const ID_PROVIDER_BLOCKSTACK = "BLOCKSTACK_ID"
export const ID_PROVIDER_SKYID = "SKYID"
export const ID_PROVIDER_CERAMIC = "CERAMIC_ID"

export const ADD_SKYSPACE = "ADD_SKYSPACE"
export const RENAME_SKYSPACE = "RENAME_SKYSPACE"
export const DELETE = "DELETE"

export const ADD_PORTAL = "ADD_PORTAL"
export const EDIT_PORTAL = "RENAME_PORTAL"
export const DELETE_PORTAL = "DELETE_PORTAL"

export const APP_SKYDB_SEED = "THE_SKYSPACES_APP_SKYDB_SEED"
export const SKYDB_SERIALIZATION_SEPERATOR = "."

export const UPLOAD = "Upload"
export const DOWNLOAD = "Download"
export const PUBLIC_IMPORT = "Public Import"
export const DEFAULT_PORTAL = "https://siasky.net/"
// export const PUBLIC_SHARE_BASE_URL = "https://siasky.net/AAB-SesrL4TJn8l6F0besVVWYCK8axTjTmffFK4WTBPLWA/?#/";
export const PUBLIC_SHARE_BASE_URL = "https://skyspace.hns.siasky.net/?#/"
export const PUBLIC_SHARE_APP_HASH = "AACUSyTS5w3gcQ21_h0WTviSXt9laQggkBl5TWEYY_ZwKA"
export const PUBLIC_SHARE_ROUTE = "public-skapps/"
// export const DOWNLOAD_PORTAL = process.env.REACT_APP_SIASKYNET_HOST;
// export const SKYNETHUB_PORTAL = process.env.REACT_APP_SKYNETHUB_HOST;
export const SKYSPACE_DEFAULT_PATH = "https://skyspace.hns.siasky.net/#/upload"
export const SKYSPACE_HOSTNAME = "https://skyspace.hns.siasky.net/skapp/index.html"
export const PUBLIC_TO_ACC_QUERY_PARAM = "sharedhash"
export const MUSIC_SVG_BASE64_DATA =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjUgMjUiID48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7fTwvc3R5bGU+PGc+PHBhdGggY2xhc3M9InN0MCIgZD0iTTEyIDNsLjAxIDEwLjU1Yy0uNTktLjM0LTEuMjctLjU1LTItLjU1QzcuNzkgMTMgNiAxNC43OSA2IDE3czEuNzkgNCA0LjAxIDRTMTQgMTkuMjEgMTQgMTdWN2g0VjNoLTZ6bS0xLjk5IDE2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMiAyIC45IDIgMi0uOSAyLTIgMnoiLz48L2c+PC9zdmc+"
export const APPSTORE_PROVIDER_MASTER_PUBKEY =
  "7555d3153fab77242f6ab85f6a9d66811eeb93e29673402574f49d057ee373b1"
export const APPSTORE_PROVIDER_APP_PUBKEY =
  "c3bfbcb6e2fc64af8408512ddef155a470641ca6beb030154ca4e315be2f94d7"
export const MUI_THEME_LIGHT = "light"
export const MUI_THEME_DARK = "dark"


// From Blockstack

// File names in GAIA Storage
// /skhub/skylink/data/{skhubId}.json // content of "skhub.json"
// /skhub/skylink/skylinkIdx.json

// /skhub/skyspaces/{skyspace 1}.json
// /skhub/skyspaces/{skyspace 2}.json
// /skhub/skyspaces/skyspaceIdx.json

// /skhub/history/data/history.json
// /skhub/usersettings.json
// import { UserSession, AppConfig } from "blockstack"
// import { DEFAULT_PORTAL } from "../sn.constants"

export const SKYID_PROFILE_PATH = "profile"
export const SKAPP_PROFILE_PATH = "skhub/skapp/profile.json" // this will be added by "Master Key/Seed" from ID Page. each master key will derive 1 or more child seeds (Pub/Private key).
export const FOLLOWING_PATH = "skhub/following.json" // will contain array of public key[array of Users]. this key will be set by app specific pub key/User
export const FOLLOWER_PATH = "skhub/follower.json" // will contain array of public key[array of Users]. this key will be set by app specific pub key/User
export const PUBLIC_KEY_PATH = "skhub/key/publicKey.json"
export const SKYLINK_PATH = "skhub/skylink/data/"
export const BACKUP_FILEPATH = "skhub/backup/backup.json"
export const SKYLINK_IDX_FILEPATH = "skhub/skylink/skylinkIdx.json"
export const SKYSPACE_PATH = "skhub/skyspaces/"
export const SHARED_PATH_PREFIX = "skhub/shared/"
export const SHARED_BY_USER_FILEPATH = "skhub/shared/sharedByUser.json"
export const SHARED_WITH_FILE_PATH = "skhub/shared/sharedWithUser.json "
export const SKYSPACE_IDX_FILEPATH = "skhub/skyspaces/skyspaceIdx.json"
export const HISTORY_FILEPATH = "skhub/history/history.json"
export const USERSETTINGS_FILEPATH = "skhub/settings/usersetting.json"
export const SKYNET_PORTALS_FILEPATH = "skhub/settings/portals/portals.json"
export const SUBSCRIBED_IDX_FILEPATH = "skhub/subscribed.json"
export const SKAPP_FOLLOWING_FILEPATH = "skhub/skappFollowing.json";
export const SKAPP_SHARED_APPS_FILEPATH = "skhub/skappSharedApps.json";
export const SKAPP_SHARED_APPS_KEY_SEPERATOR = "###";

// IndexedDB metadataKey to maintain local state (not required in SkyDB)
export const IDB_LAST_SYNC_REVISION_NO = "skhub/skyspaces/idb/lastSyncRevNo"
export const IDB_IS_OUT_OF_SYNC = "skhub/skyspaces/idb/isOutOfSync"

// add skyDB datakey name must be prefixed with DK_
export const DK_IDB_SKYSPACES = "skhub/skyspaces/idb"
export const DK_IDB_SYNC_HISTORY = "skhub/skyspaces/idb"

// ** Start : AppStore Specific keys
export const APP_STORE_PROVIDER_FILEPATH = "skyx/skapp/appstoreprovider"
// ** End : AppStore Specific keys
export const SUCCESS = "success"
export const FAILED = "failed"
export const CONFLICT = "conflict"
export const FAILED_DECRYPT_ERR = "FailedDecryptionError"
export const AVATAR_IMAGE_DEFAULT = "https://s3.amazonaws.com/onename/avatar-placeholder.png"
export const IGNORE_PATH_IN_BACKUP = [USERSETTINGS_FILEPATH, SKYNET_PORTALS_FILEPATH]
export const authOrigin = "" 
export const UPLOAD_SOURCE_DEPLOY = "UPLOAD_SOURCE_DEPLOY";
export const UPLOAD_SOURCE_NEW_HOSTING = "UPLOAD_SOURCE_NEW_HOSTING";
export const UPLOAD_SOURCE_NEW_HOSTING_IMG = "UPLOAD_SOURCE_NEW_HOSTING_IMG";

export const STORAGE_SELECTED_HOSTED_APP_KEY = "STORAGE_SELECTED_HOSTED_APP_KEY";


// Skapp SkyDB DataKeys
export const DK_INSTALLED_APPS = "installedApps";
export const DK_PUBLISHED_APPS = "publishedApps";
export const DK_HOSTED_APPS = "hostedApps";

export const DK_AGGREGATED_PUBLISHED_APPS = "aggregatedPublishedApps";
export const DK_AGGREGATED_PUBLISHED_APPS_STATS = "aggregatedPublishedAppsStats";

//Stats Action Type
// export const VIEW_COUNT = "view";
// export const ACCESS_COUNT = "access";
// export const LIKE = "like";
// export const LIKE_REMOVED = "like_removed";
// export const FAVORITE = "favorite";
// export const FAVORITE_REMOVED = "favorite_removed";
export const ANONYMOUS = "anonymous";
// SkyMQ Events
export const EVENT_PUBLISHED_APP = "0";
export const EVENT_PUBLISHED_APP_REMOVED = "1";
export const EVENT_APP_VIEWED = "2";
export const EVENT_APP_ACCESSED = "3";
export const EVENT_APP_LIKED = "4";
export const EVENT_APP_LIKED_REMOVED = "5";
export const EVENT_APP_FAVORITE = "6";
export const EVENT_APP_FAVORITE_REMOVED = "7";
export const EVENT_APP_COMMENT = "8";
export const EVENT_APP_COMMENT_REMOVED = "9";
export const EVENT_APP_INSTALLED = "10";
export const EVENT_APP_UNINSTALLED = "11";

// export const EVENT_APP_LIKED_REMOVED =  'appLikedRemoved';
// export const EVENT_APP_FAVORITE_MARKED =  'FavoriteMarked';
// export const EVENT_APP_FAVORITE_UNMARKED =  'FavoriteUnmarked';
// export const EVENT_APP_COMMENT_ADDED =  'commentAdded';
// export const EVENT_APP_COMMENT_REMOVED =  'commentRemoved';
// export const EVENT_REMOVE_PUBLISHED_APP =  DK_PUBLISHED_APPS + '#REMOVED';
