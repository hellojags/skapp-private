import {DEFAULT_PORTAL} from './SnConstants'
// TODO: Need review and cleanup on this JS

export const SKYLINK_TYPE_FILEUPLOAD = 0
export const SKYLINK_TYPE_DIRUPLOAD = 1
export const SKYLINK_TYPE_SKYLINK = 2

// app stats object
export const  createAppStatsObj = (appId) => ({
    $type: "skapp",
    $subType: "stats",
    id: appId,
    version: "v1",
    prevSkylink: "",
    content: {
      favorite: 0,
      viewed: 0,
      liked: 0,
      accessed: 0,
    },
    ts: new Date(),
});


export const createUserProfileObject = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  // avatar:"https://siasky.net/vAFBYRw1s7WmWhYoXOiF2HDX2_2hEJXtLiLQA1YDeB6WOA",
  // username: "Test User",
  // aboutme:"Sample Text",
  // git:"https://github.com",
  devName: "",
  devGitId: "", // GitHub or GitLab handle
  devInfo: "",
  devGitRepo: "",
})

export const createHistoryObject = () => { }

// skylinkIdx.json file will have array of SkylinkIdxObj
export const createSkylinkIdxObject = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  skhubIdList: [],
})

export const createSkySpaceIdxObject = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  skyspaceList: [], // "name" of skyspace
})

export const createSkySpaceObject = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  skyspace: "", //  "Name" of skyspace -> "SkySpace1,SkySpace2..etc"
  skhubIdList: [], // All bookmarked Skylinks
})

export const INITIAL_SETTINGS_OBJ = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  setting: {
    portal: DEFAULT_PORTAL,
    backupList: [],
    dataSyncPref: "Every 10 Minutes",
  },
})

export const INITIAL_SKYDB_OBJ = () => ({
  version: "v1",
  prevSkylink: "",
  recordCount: 0,
  createTS: new Date(),
  lastUpdateTS: new Date(),
  db: [],
  keys: [],
})

export const INITIAL_DATASYNC_PREF_OBJ = {
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  dataSyncPrefList: [
    {
      name: "Every 5 Minutes",
      value: 5,
      desc: "Every 5 minutes Sync data with SkyDB (one read and write)",
    },
    {
      name: "Every 10 Minutes",
      value: 10,
      desc: "Every 5 minutes Sync data with SkyDB (one read and write)",
    },
    {
      name: "Every 15 Minutes",
      value: 15,
      desc: "Every 5 minutes Sync data with SkyDB (one read and write)",
    },
    {
      name: "Every 20 Minutes",
      value: 20,
      desc: "Every 5 minutes Sync data with SkyDB (one read and write)",
    },
    {
      name: "Every 25 Minutes",
      value: 25,
      desc: "Every 5 minutes Sync data with SkyDB (one read and write)",
    },
    {
      name: "Every 30 Minutes",
      value: 30,
      desc: "Every 5 minutes Sync data with SkyDB (one read and write)",
    },
    {
      name: "RealTimeSync",
      value: 0,
      desc:
        "Update SkySpaces metadata realtime on SkyDB as local changes are happening. This will cost you more since every change in SkySpace metadata will result in SkyDB write.",
    },
  ],
}

export const INITIAL_PORTALS_OBJ = {
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  portals: [
    {
      // portalId: 1,
      createTS: new Date(),
      name: "SkynetHub.io",
      url: "https://skynethub.io/",
      // priority: "1",
      type: "public",
      selected: 1,
      // usage: "UPLOAD/DOWNLOAD",
      // subscription: "Free"
    },
    {
      // portalId: 2,
      createTS: new Date(),
      name: "SiaSky.net",
      url: "https://siasky.net/",
      // priority: "2",
      type: "public",
      selected: 0,
      // usage: "UPLOAD/DOWNLOAD",
      // subscription: "Paid"
    },
    {
      // portalId: 3,
      createTS: new Date(),
      name: "skyportal.xyz",
      url: "https://skyportal.xyz",
      // priority: "3",
      type: "public",
      selected: 0,
      // usage: "UPLOAD/DOWNLOAD",
      // subscription: "Paid"
    },
  ],
}

export const HISTORY_DATA = [
  {
    skhubId: "sfhskdfhksdfhskadfhaskf",
    skylink: "_B3VrECGOHPEAFknVQwj_vWsyaX_8iIRuB_TL09cuj9uZQ",
    fileName: "",
    size: "",
    contentType: "",
    action: "up",
    timestamp: "2020-03-12T13:37:27+00:00", // ISO 8601
  },
]


export const getEmptySkylinkObject = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  skhubId: "", // hash(provider | userid | skylink) only on creation time
  skylink: "",
  id: null, // not sure why we need this ?
  name: "",
  title: "",
  filename: "",
  description: "",
  type: null, // this field is used to store category. its duplicate with "category" field.
  // merkleroot: "", //from response or response header
  // bitfield: "",//from response or response header
  contentLength: "", // from response header
  contentType: "", // from response or response header
  httpMetadata: "", // Response Header "Skynet-File-Metadata"
  redirect: false, // new feature in Sia 1.5. "redirect" query parameter that disables the redirect to the "defaultPath" when set to true
  defaultPath: "", // new feature in Sia 1.5.
  linkType: SKYLINK_TYPE_FILEUPLOAD, // file, folder or Skapp ?
  category: SKYLINK_TYPE_FILEUPLOAD, // its duplicate with "type" field. currently this field is not used
  skyspaceList: [],
  tags: [], // max 5
  userId: "",
  permission: false,
  ageRating: "", // # applicable only for skapp
  price: "", // # applicable only for skapp
  support: "", // # applicable only for skapp
  git_url: "", // # applicable only for skapp
  demo_url: "", // # applicable only for skapp
  developer: "", // # applicable only for skapp
  appStatus: "", // Alpha/Beta/Live // # applicable only for skapp
  blacklist: "",
  blacklistDate: "",
  blacklistReason: "",
  auth_code: "", // # applicable only for skapp
  fileKey: null,
})

export const getEmptyHistoryObject = () => ({
  skylink: "",
  fileName: "",
  contentLength: "",
  contentType: "",
  httpMetadata: "",
  action: "",
  skhubId: "",
  skyspaces: [],
  savedToSkySpaces: false,
})

export const createEmptyErrObj = () => {
  const errObj = {}
  for (const key in getEmptySkylinkObject()) {
    if (getEmptySkylinkObject().hasOwnProperty(key)) {
      errObj[key] = false
      errObj[`${key}.errorMsg`] = ""
    }
  }
  return errObj
}

export const getSkylinkTypeObj = () => {
  const skylinkTypeObj = {}
  skylinkTypeObj[SKYLINK_TYPE_SKYLINK] = {
    label: "SkyApp URL",
  }
  skylinkTypeObj[SKYLINK_TYPE_FILEUPLOAD] = {
    label: "Upload File",
  }
  skylinkTypeObj[SKYLINK_TYPE_DIRUPLOAD] = {
    label: "Upload Directory",
  }
  return JSON.parse(JSON.stringify(skylinkTypeObj))
}

export const getSkylinkTypeObjForHome = () => {
  const skylinkTypeObj = {}
  skylinkTypeObj[SKYLINK_TYPE_FILEUPLOAD] = {
    label: "Upload File",
  }
  skylinkTypeObj[SKYLINK_TYPE_DIRUPLOAD] = {
    label: "Upload Directory",
  }
  return JSON.parse(JSON.stringify(skylinkTypeObj))
};

export const getPortalList = () => ["siasky.net", "skyportal.xyz"];
