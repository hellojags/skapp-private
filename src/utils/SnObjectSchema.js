export const appDetails = {
    name: "SkySpaces",
    icon: "https://skyspaces.io/logo192.png",
  }
  const appConfig = new AppConfig(["store_write", "publish_data"])
  export const userSession = new UserSession({ appConfig })
  
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
  
  export const createPersonObject = () => ({
    name() {
      return "Anonymous"
    },
    avatarUrl() {
      return avatarFallbackImage
    },
  })
  
  export const createHistoryObject = () => {}
  
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