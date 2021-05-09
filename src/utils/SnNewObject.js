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


export const createSkylinkIdxObject = () => ({
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  skhubIdList: [],
})

export const getPortalList = () => ["siasky.net", "skyportal.xyz"];