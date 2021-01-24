import {
  APPSTORE_PROVIDER_MASTER_PUBKEY,
  BLOCKSTACK_CORE_NAMES,
  BROWSER_STORAGE,
  ID_PROVIDER_BLOCKSTACK,
  ID_PROVIDER_SKYDB,
  ID_PROVIDER_SKYID,
  STORAGE_USER_SESSION_KEY,
  DK_IDB_SKYSPACES,
  FAILED,
  FAILED_DECRYPT_ERR,
  FOLLOWER_PATH,
  FOLLOWING_PATH,
  GAIA_HUB_URL,
  HISTORY_FILEPATH,
  IDB_IS_OUT_OF_SYNC,
  IDB_LAST_SYNC_REVISION_NO,
  ID_PROVIDER,
  IGNORE_PATH_IN_BACKUP,
  PUBLIC_KEY_PATH,
  SHARED_BY_USER_FILEPATH,
  SHARED_PATH_PREFIX,
  SHARED_WITH_FILE_PATH,
  SKAPP_PROFILE_PATH,
  SKYID_PROFILE_PATH,
  SKYLINK_IDX_FILEPATH,
  SKYLINK_PATH,
  SKYNET_PORTALS_FILEPATH,
  SKYSPACE_IDX_FILEPATH,
  SKYSPACE_PATH,
  SUCCESS,
  USERSETTINGS_FILEPATH
} from '../utils/SnConstants';
import {
  getAllItemsFromIDB,
  getJSONfromIDB,
  setAllinIDB,
  setJSONinIDB,
  IDB_STORE_SKAPP,
} from "../service/SnIndexedDB"
import { getRegistryEntry, putFile, getFile, snKeyPairFromSeed } from './SnSkynet'
import { INITIAL_SKYDB_OBJ } from '../utils/SnNewObject'
import store from "../redux"

// This JS file will list app methods consumed by components

// ### User Profile Functionality ###

// null or publicKey
export const getProfile = (publicKey) => {
  //set options
}
export const bsGetProfileInfo = (profile) => {
  const recipientIdStr = profile?.appsMeta?.[document.location.origin]?.storage
    ?.replace(GAIA_HUB_URL, "")
    ?.replace("/", "")
  const recipientId = recipientIdStr?.replace("/", "")
  return {
    key: profile?.appsMeta?.[document.location.origin]?.publicKey,
    storage: profile?.appsMeta?.[document.location.origin]?.storage,
    storageId: recipientId,
  }
}

// set Profile
export const setProfile = (profileJSON) => { }

// ### Following/Followers Functionality ###

// null or publicKey
export const getFollwers = (publicKey) => { }

// list of publicKeys
export const setFollwers = (publicKeys) => { }
export const setFollowersJSON = async (followersJSON, options) => {
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  try {
    if (followersJSON) {
      await putFile(session, FOLLOWER_PATH, followersJSON, options)
    }
  } catch (e) {
    return e
  }
  return ""
}

// null or publicKey
export const getFollwings = (publicKey) => { }

// list of publicKeys
export const setFollwings = (publicKeys) => { }
export const setFollowingsJSON = async (followingsJSON, options) => {
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  try {
    if (followingsJSON) {
      await putFile(session, FOLLOWING_PATH, followingsJSON, options)
    }
  } catch (e) {
    return e
  }
  return ""
}

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

// ########## Page Specific Service

export const firstTimeUserSetup = async (session) => {
  try {
    // (check IndexedDB and registry for any data, if no data that means firsttime user) -->
    let idbLastRegistryEntry = await getJSONfromIDB(IDB_LAST_SYNC_REVISION_NO, {
      store: IDB_STORE_SKAPP,
    })
    if (idbLastRegistryEntry && idbLastRegistryEntry != null) {
      // if entry is present in IndexedDB user is existing user.
      return false // not firsttime user
    }

    let skydbEntry = await getRegistryEntry(
      session?.person?.appPublicKey,
      DK_IDB_SKYSPACES
    )

    if (skydbEntry && skydbEntry != "undefined") {
      return false // not firsttime user
    }

    //let dataJSON = JSON.parse(getInitialDataJSON)
    let dataJSON = "";
    // 1.
    // 2.
    // create Inital sample data (esp in case of SkySpaces) - Images, video, Audio files...etc
    // user check
    // add here initial load of Skapps
    // read space data from initialData folder and load it for user.
    // TODO: Ideally we shall fetch it from Skapp dataKey. "skhub/skapp/initialdata.json"
    // call dataSync

    // Step1: load Initial data from InitialData.json to IndexedDB.  Metadata files (appstore, myapps, hosting)
    await setAllinIDB(dataJSON.data, { store: IDB_STORE_SKAPP })
    // Step2: Create Initial entry for follower and following
    await setFollowersJSON({ publicKeyList: [] })
    await setFollowingsJSON({ publicKeyList: [] })
    // Step3: update revision number to 1
    await setJSONinIDB(
      IDB_LAST_SYNC_REVISION_NO,
      { revision: "1" },
      { store: IDB_STORE_SKAPP }
    )
    // Sync Data with SkyDB
    await syncData(session)
    return true // Yes, firsttime user
  } catch (error) {
    console.log("error" + error)
  }
}

// get {senderToSpacesMap={}, sharedByUserList=[]} in sharedByUserObj
export const bsGetImportedSpacesObj = async (session, opt = {}) => {
  // reading a file containing shared spaces information. senders information.
  // can we now directly read all data from below method? do we need to call bsGetSpacesFromUserList ??
  const sharedByUserObj = await bsGetSharedByUser(session)
  opt.sharedByUserObj = sharedByUserObj
  return bsGetSpacesFromUserListV2(session, sharedByUserObj?.sharedByUserList, opt)
}
export const bsGetSharedByUser = async (session) => {
  const sharedByUserObj = await getFile(session, SHARED_BY_USER_FILEPATH)
  return sharedByUserObj
}
// TODO: This method pulls ALL shared spaces by ALL senders. Its using senders (sender's storage path) / (in case of skyDB sender's public key) to pull this data
// This method includes design imporvement while importing shared space
export const bsGetSpacesFromUserListV2 = async (session, senderIdList, opt) => {
  const promises = []
  const senderListWithNoShare = []
  // get existing shared spaces data. senderList and sender-space mapping
  // if "sharedByUserObj" present, that means its getting loaded during login ELSE its call is from sn.import-shared-space-modal
  const sharedByUserObj = opt.sharedByUserObj || (await bsGetSharedByUser(session))
  // sharedByUserObj
  const { senderToSpacesMap = {}, sharedByUserList = [] } = sharedByUserObj || {}
  senderIdList &&
    senderIdList.forEach(async (senderId) => {
      // loggedInUserStorageId = snSerializeSkydbPublicKey(snKeyPairFromSeed(session.skydbseed).publicKey);
      let sharedSpaceIdxPromise = bsGetShrdSkyspaceIdxFromSenderV2(
        session,
        senderId,
        session?.person?.appPublicKey,
        { skydb: true }
      )
      const promise = sharedSpaceIdxPromise
        .then((sharedSpaceIdxObj) => {
          senderToSpacesMap[senderId] = sharedSpaceIdxObj
          sharedByUserList.indexOf(senderId) === -1 &&
            sharedByUserList.push(senderId)
        })
        .catch((err) => {
          console.log(err)
          senderListWithNoShare.push(senderId)
        })
      promises.push(promise)
    })
  await Promise.all(promises)
  opt?.isImport &&
    (await putFile(session, SHARED_BY_USER_FILEPATH, {
      sharedByUserList,
      senderToSpacesMap,
    }))
  return {
    sharedByUserList,
    senderToSpacesMap,
  }
}

export const bsGetShrdSkyspaceIdxFromSenderV2 = async (
  session,
  senderPublicKey,
  loggedInUserPublicKey
) => {
  const promises = []
  const skylinkArr = []
  try {
    const SHARED_FILEPATH = SHARED_PATH_PREFIX + loggedInUserPublicKey
    // read Shared encrypted file from sender SkyDB registry,  // get unencrypted file as JSON
    const masterSharedFileJSON = await getFile(SHARED_FILEPATH, { publicKey: senderPublicKey, decrypt: true }) // await fetch(`${senderStorage}${SHARED_SKYSPACE_FILEPATH}`).then(res => res.json());
    const skylinkObj = null
    // If valid JSON...
    if (masterSharedFileJSON && masterSharedFileJSON != "undefined") {
      // get Space object from master file
      const skyspaceObj = masterSharedFileJSON[SKYSPACE_IDX_FILEPATH]
      return JSON.parse(skyspaceObj)
    }
  } catch (e) {
    return null
  }
  return null
}

export const getUserProfile = async (session) => {
  // let profileJSON = await getFile(session, SKYID_PROFILE_PATH);
  let personObj = null
  const response = await getFile(session.skyid.userId, SKYID_PROFILE_PATH, { skydb: true, })
  if (response == "" || response == "undefined" ) {
    // file not found
    console.log("Profile not found;, please check your connection and retry")
  } else {
    // success
    let skyIdProfileObj = JSON.parse(response)
    const { publicKey, privateKey } = snKeyPairFromSeed(session.skyid.seed)
    personObj = {
      masterPublicKey: session.skyid.userId, // public key derived from "master seed". we pull profile using this public key
      appSeed: session.skyid.seed, // App specific seed derived from "Master Seed"
      appId: session.skyid.appId,
      appImg: session.skyid.appImg,
      appPublicKey: publicKey,
      appPrivateKey: privateKey,
      profile: {
        username: skyIdProfileObj.username, // user name is associated with master Key
        did: skyIdProfileObj.username, // this is place holder for Decentralized Id (DID)
        aboutme: skyIdProfileObj.aboutMe,
        location: skyIdProfileObj.location,
        avatar: skyIdProfileObj.avatar,
        profilePicture: skyIdProfileObj.profilePicture,
      },
    }
  }
  return personObj
}

export const syncData = async (session, skyDBdataKey, idbStoreName) => {
  try {
    // fetch registryEntry
    const registryEntry = await getRegistryEntry(
      session?.person?.appPublicKey,
      DK_IDB_SKYSPACES
    )
    // check revision number
    const skyDBRevisionNo =
      registryEntry && registryEntry != "undefined" ? registryEntry.revision : 0
    const idbLastRegistryEntry = await getJSONfromIDB(IDB_LAST_SYNC_REVISION_NO, {
      store: IDB_STORE_SKAPP,
    })
    const isOutofSync = await getJSONfromIDB(IDB_IS_OUT_OF_SYNC, {
      store: IDB_STORE_SKAPP,
    })
    const idbRevisionNo = idbLastRegistryEntry ? idbLastRegistryEntry.revision : 0

    // IndexedDB Out-of-Sync Scenario: If revision number is larger in SkyDB, Fetch data from SkyDB and update IndexDB
    // This is possible issue scenario where data is updated using another device or browser instance. what if you have local change? prompt user?
    if (parseInt(skyDBRevisionNo) > parseInt(idbRevisionNo)) {
      // give prompt to user to make decision (data conflict status on UI)
      // OR Just make decision for them to update SkyDB, not good idea but for now lets keep it like this. (TODO: update this logic after Beta)
      // 1. Fetch data from SkyDB
      const skydbJSON = await getFile(session, DK_IDB_SKYSPACES, { skydb: true })
      if (skydbJSON && skydbJSON != "undefined" && skydbJSON.db) {
        await skydbJSON.db.forEach((item) => {
          const key = Object.keys(item)[0]
          const value = item[key]
          // 2. update IndexedDB Store
          setJSONinIDB(key, value, { store: IDB_STORE_SKAPP })
        })
        await setJSONinIDB(IDB_LAST_SYNC_REVISION_NO, skyDBRevisionNo, {
          store: IDB_STORE_SKAPP,
        })
      } else {
        return FAILED
      }
      // or status = CONFLICT;
      // This must be last step
      await setJSONinIDB(IDB_IS_OUT_OF_SYNC, false, { store: IDB_STORE_SKAPP }) // Data is in sync. set flag in Indexed DB.
      //store.dispatch(setIsDataOutOfSync(false)) // Data is in sync. set flag in store.
    }
    // SkyDB Out-of-Sync Scenario: If revision number is larger in IndexedDB, fetch data from IndexedDB and update SkyDB
    else if (isOutofSync || parseInt(skyDBRevisionNo) < parseInt(idbRevisionNo)) {
      // Get all IndexedDB data
      const { recordCount, keys, result } = await getAllItemsFromIDB({
        store: IDB_STORE_SKAPP,
      })
      // create SkyDB JSON
      const skydbJSON = INITIAL_SKYDB_OBJ()
      skydbJSON.db = result
      skydbJSON.keys = keys
      skydbJSON.recordCount = recordCount
      // update SkyDB
      if (registryEntry && registryEntry != "undefined") {
        await putFile(session, DK_IDB_SKYSPACES, skydbJSON, {
          skydb: true,
          historyflag: true,
        })
      } else {
        await putFile(session, DK_IDB_SKYSPACES, skydbJSON, { skydb: true }) // no history flag since its first time call.
      }
      // let skyDBData = await getFile(session, DK_IDB_SKYSPACES, { skydb: true });
      // update IndexedDB with revision number
      await setJSONinIDB(
        IDB_LAST_SYNC_REVISION_NO,
        { revision: skyDBRevisionNo + 1 },
        { store: IDB_STORE_SKAPP }
      ) // we are doing plus one since we uploaded file to Skynet and revision is incremented.
      // This must be last step
      await setJSONinIDB(IDB_IS_OUT_OF_SYNC, false, { store: IDB_STORE_SKAPP }) // Data is in sync. set flag in IDB.
      //store.dispatch(setIsDataOutOfSync(false)) // Data is in sync. set flag in store.
    } else {
      console.log("Data is already in sync")
    }
  } catch (error) {
    return FAILED
  }
  return SUCCESS
}



