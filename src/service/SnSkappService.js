// This JS file will list app methods consumed by components

// ### User Profile Functionality ###

// null or publicKey
export const getProfile = (publicKey) => {
    //set options
}

// set Profile
export const setProfile = (profileJSON) => {}

// ### Following/Followers Functionality ###

// null or publicKey
export const getFollwers = (publicKey) => {}

// list of publicKeys
export const setFollwers = (publicKeys) => {}

// null or publicKey
export const getFollwings = (publicKey) => {}

// list of publicKeys
export const setFollwings = (publicKeys) => {}

// ### Published Apps Functionality ###

// get my all published apps. Returns List of JSONS. if appIds (List) is empty or null, return all apps JSON 
export const getMyPublishedApps = (appIds) => {}

//Update published app data
export const setMyPublishedApp = (appJSON) => {}
// get apps stats - 
export const setAppStats = (statsJSON) => {}
// pass list of appIds to get AppStats. Fav, Viewed, liked, accessed
export const getAppStats = (appIds) => {}

// ### AppStore Functionality ###

// Returns all Apps data(JSON) from List of Devs I am Following
export const getMyAppStore = () => {}

// Returns all Apps data(JSON) from "Skapp Developer"
export const getDefaultAppStore = () => {}

// ### Hosting Functionality ###

// get my all hosted apps. Returns List of JSONS
export const getMyHostedApps = (appIds) => {}

//Update published app data
export const setMyHostedApp = (appJSON) => {}