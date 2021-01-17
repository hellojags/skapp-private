export const getCompatibleTags = (resCategory) => {
    let category = []
    if (resCategory != null) {
      if (Array.isArray(resCategory)) {
        category = resCategory.map((cat) => cat.toLowerCase())
      } else {
        category = [resCategory.toLowerCase()]
      }
    }
    return JSON.parse(JSON.stringify(category))
  }
  
  export const getSkyspaceListForCarousalMenu = (snSkyspaceList) => {
    if (snSkyspaceList != null) {
      const carousalMenuObj = {}
      snSkyspaceList.forEach((skyspace) => {
        carousalMenuObj[skyspace] = {
          label: skyspace,
        }
      })
      return carousalMenuObj
    }
  }
/** Start : Skynet Methods * */
const getPortal = () => {
  let skynetPortal = store.getState().snUserSetting?.setting?.portal
  skynetPortal =
    skynetPortal && skynetPortal.trim() !== "" ? skynetPortal : DEFAULT_PORTAL
  return skynetPortal
}

// It will generate base32 url for any Skapp
const getbase32URlForSkapp = (skylink) => {
  let base32URL = null;
  return base32URL;
}