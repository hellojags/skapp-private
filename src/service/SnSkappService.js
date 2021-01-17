// This JS file will list app methods consumed by components

// ### User Profile Functionality ###

// null or publicKey
export const getProfile = (publicKey) => {
    //set options
}

// set Profile
export const setProfile = (profileJSON) => { }

// ### Following/Followers Functionality ###

// null or publicKey
export const getFollwers = (publicKey) => { }

// list of publicKeys
export const setFollwers = (publicKeys) => { }

// null or publicKey
export const getFollwings = (publicKey) => { }

// list of publicKeys
export const setFollwings = (publicKeys) => { }

// ### Published Apps Functionality ###

// get my all published apps. Returns List of JSONS. if appIds (List) is empty or null, return all apps JSON 
export const getMyPublishedApps = (appIds) => { }
//Update published app data
export const setMyPublishedApp = (appJSON) => { }

// ### Apps Stats and comments Functionality ###

// get apps stats - 
export const setAppStats = (statsJSON) => { }
// pass list of appIds to get AppStats. Fav, Viewed, liked, accessed
export const getAppStats = (appIds) => { }

// get apps comments - 
export const setAppComments = (commentsJSON) => { }
// pass list of appIds to get App Comments.
export const getAppComments = (appIds) => { }

// ### AppStore Functionality ###

// Returns all Apps data(JSON) from List of Devs I am Following
export const getMyAppStore = () => { }

// Returns all Apps data(JSON) from "Skapp Developer"
export const getDefaultAppStore = () => { }

// ### Hosting Functionality ###

// get my all hosted apps. Returns List of JSONS
export const getMyHostedApps = (appIds) => { }

//Update published app data
export const setMyHostedApp = (appJSON) => { }

//set HNS Entry. Everytime app is deployed this method must be called. else handshake name wont be updated with new skylink
export const setHNSEntry = (hnsName, skylink) => { }

//get HNS URL for TXT record
export const getHNSSkyDBURL = (hnsName) => { }


export const initializeLocalDatabaseFromBackup = async () => {
    try {
    } catch (e) { }
}

export const backupLocalDatabaseOnSkyDB = async () => {
    try {
    } catch (e) { }
}