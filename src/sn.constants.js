export const getCompatibleTags = (resCategory) => {
  let category = [];
  if (resCategory != null) {
    if (Array.isArray(resCategory)) {
      category = resCategory.map((cat) => cat.toLowerCase());
    } else {
      category = [resCategory.toLowerCase()];
    }
  }
  return JSON.parse(JSON.stringify(category));
};

export const getSkyspaceListForCarousalMenu = (snSkyspaceList) => {
  if (snSkyspaceList != null) {
    const carousalMenuObj = {};
    snSkyspaceList.forEach((skyspace) => {
      carousalMenuObj[skyspace] = {
        label: skyspace,
      };
    });
    return carousalMenuObj;
  }
};

export const WEBSERVICE_SUCCESS = "success";
export const WEBSERVICE_FAILURE = "failure";
export const APP_TITLE = "SkySpaces";
export const APP_BG_COLOR = "var(--app-bg-color)";
export const ITEMS_PER_PAGE = 9;
export const STORAGE_SKYSPACE_APP_COUNT_KEY = "SKYSPACE_APP_COUNT";
export const STORAGE_USER_KEY = "USER";
export const STORAGE_SKYSPACE_LIST_KEY = "SKYSPACELIST";
export const STORAGE_USER_SETTING_KEY = "USER_SETTING";
export const STORAGE_USER_APP_PROFILE_KEY = "USER_APP_PROFILE";
export const STORAGE_USER_MASTER_PROFILE_KEY = "USER_MASTER_PROFILE";
export const STORAGE_PORTALS_LIST_KEY = "PORTALS_LIST";
export const STORAGE_USER_SESSION_KEY = "USER_SESSION";
export const STORAGE_DARK_MODE_KEY = "darkMode";
export const BROWSER_STORAGE = localStorage;
export const BLOCKSTACK_CORE_NAMES = "https://core.blockstack.org/v1/names";
export const STORAGE_REDIRECT_POST_LOGIN_KEY = "REDIRECT_POST_LOGIN";
export const STORAGE_SKYAPP_DETAIL_KEY = "SKYAPP_DETAIL";
export const STORAGE_SKYSPACE_DETAIL_KEY = "STORAGE_SKYSPACE_DETAIL_KEY";

export const ID_PROVIDER_BLOCKSTACK = "BLOCKSTACK_ID";
export const ID_PROVIDER_SKYDB = "SKYDB_ID";
export const ID_PROVIDER_SKYID = "SKYID";
export const ID_PROVIDER_CERAMIC = "CERAMIC_ID";

export const ADD_SKYSPACE = "ADD_SKYSPACE";
export const RENAME_SKYSPACE = "RENAME_SKYSPACE";
export const DELETE = "DELETE";

export const ADD_PORTAL = "ADD_PORTAL";
export const EDIT_PORTAL = "RENAME_PORTAL";
export const DELETE_PORTAL = "DELETE_PORTAL";

export const APP_SKYDB_SEED = "THE_SKYSPACES_APP_SKYDB_SEED";
export const SKYDB_SERIALIZATION_SEPERATOR = ".";

export const UPLOAD = "Upload";
export const DOWNLOAD = "Download";
export const PUBLIC_IMPORT = "Public Import";
export const DEFAULT_PORTAL = "https://siasky.net/";
//export const PUBLIC_SHARE_BASE_URL = "https://siasky.net/AAB-SesrL4TJn8l6F0besVVWYCK8axTjTmffFK4WTBPLWA/?#/";
export const PUBLIC_SHARE_BASE_URL = "https://skyspace.hns.siasky.net/?#/";
export const PUBLIC_SHARE_APP_HASH = "AACUSyTS5w3gcQ21_h0WTviSXt9laQggkBl5TWEYY_ZwKA";
export const PUBLIC_SHARE_ROUTE = "public-skapps/";
//export const DOWNLOAD_PORTAL = process.env.REACT_APP_SIASKYNET_HOST;
//export const SKYNETHUB_PORTAL = process.env.REACT_APP_SKYNETHUB_HOST;
export const SKYSPACE_DEFAULT_PATH = "https://skyspace.hns.siasky.net/#/upload";
export const SKYSPACE_HOSTNAME = "https://skyspace.hns.siasky.net/skapp/index.html";
export const PUBLIC_TO_ACC_QUERY_PARAM = "sharedhash";
export const MUSIC_SVG_BASE64_DATA = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjUgMjUiID48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7fTwvc3R5bGU+PGc+PHBhdGggY2xhc3M9InN0MCIgZD0iTTEyIDNsLjAxIDEwLjU1Yy0uNTktLjM0LTEuMjctLjU1LTItLjU1QzcuNzkgMTMgNiAxNC43OSA2IDE3czEuNzkgNCA0LjAxIDRTMTQgMTkuMjEgMTQgMTdWN2g0VjNoLTZ6bS0xLjk5IDE2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMiAyIC45IDIgMi0uOSAyLTIgMnoiLz48L2c+PC9zdmc+';
export const APPSTORE_PROVIDER_MASTER_PUBKEY = "7555d3153fab77242f6ab85f6a9d66811eeb93e29673402574f49d057ee373b1";
export const APPSTORE_PROVIDER_APP_PUBKEY = "c3bfbcb6e2fc64af8408512ddef155a470641ca6beb030154ca4e315be2f94d7";
export const MUI_THEME_LIGHT = "light";
export const MUI_THEME_DARK = "dark";
