import { getPublicKeyFromPrivate, lookupProfile } from "blockstack"
import { getUsersCacheInfo } from "../api/sn.api"
import { getInitialDataJSON } from "../db/data/masterdata"
import {
  getAllItemsFromIDB,
  getJSONfromDB,
  setAllinDB,
  setJSONinDB,
} from "../db/indexedDB"
import store from "../reducers"
import { setIsDataOutOfSync } from "../reducers/actions/sn.isDataOutOfSync.action"
import {
  getRegistry,
  snKeyPairFromSeed,
  snSerializeSkydbPublicKey,
} from "../skynet/sn.api.skynet"
import {
  APPSTORE_PROVIDER_MASTER_PUBKEY,
  BLOCKSTACK_CORE_NAMES,
  BROWSER_STORAGE,
  ID_PROVIDER_BLOCKSTACK,
  ID_PROVIDER_SKYDB,
  ID_PROVIDER_SKYID,
  STORAGE_USER_SESSION_KEY,
} from "../sn.constants"
import { getUserSessionType } from "../sn.util"
import {
  createSkylinkIdxObject,
  createSkySpaceIdxObject,
  createSkySpaceObject,
  createUserProfileObject,
  DK_IDB_SKYSPACES,
  FAILED,
  FAILED_DECRYPT_ERR,
  FOLLOWER_PATH,
  FOLLOWING_PATH,
  GAIA_HUB_URL,
  HISTORY_FILEPATH,
  IDB_IS_OUT_OF_SYNC,
  IDB_LAST_SYNC_REVISION_NO,
  IDB_STORE_NAME,
  ID_PROVIDER,
  IGNORE_PATH_IN_BACKUP,
  INITIAL_DATASYNC_PREF_OBJ,
  INITIAL_PORTALS_OBJ,
  INITIAL_SETTINGS_OBJ,
  INITIAL_SKYDB_OBJ,
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
  USERSETTINGS_FILEPATH,
} from "./constants"
import {
  decryptContent,
  deleteFile,
  encryptContent,
  generateSkyhubId,
  getFile,
  getFileUsingPublicKeyStr,
  listFiles,
  putFile,
  putFileForShared,
} from "./utils"

//* * Fetch all users */
// Example API response
// {
//     "publickey": "a3e99a13a249a9eda1df815ba174abb0eabc3b56461a468f349b7f8a1a4c32b0",
//     "datakeys": [
//         "skyx/skyusers/pubkeys.json"
//     ]
// }

// export const fetchUserDataByPubKey_SkyFeed = async (publicKey) => {
//     let session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY);
//     let userData = {};
//     try {
//         // RedSolver
//         // https://skyfeed-beta.hns.siasky.net/#/user/d448f1562c20dbafa42badd9f88560cd1adb2f177b30f0aa048cb243e55d37bd/posts/3/10
//         // Data Key: profile
//         let userProfile = await getFile(session, "profile", { publicKey: publicKey, skydb: true });
//         // SkyFeed App PublicKey
//         let appPublicKey_SkyFeed = userProfile?.dapps?.skyfeed?.publicKey;
//         // SkyFeed App PublicKey
//         if (appPublicKey_SkyFeed) {
//             userProfile = { avatar: userProfile.avatar, username: userProfile.username, aboutme: userProfile.aboutme, location: userProfile.location };
//             let followersJSON = await getFile(session, "skyfeed-followers", { publicKey: appPublicKey_SkyFeed, skydb: true }); // setfile in IDB with revision number
//             let followers = (typeof followersJSON !== 'undefined') ? Object.keys(followersJSON) : [];
//             let followingsJSON = await getFile(session, "skyfeed-following", { publicKey: appPublicKey_SkyFeed, skydb: true,});// setfile in IDB with revision number
//             let followings = (typeof followingsJSON !== 'undefined') ? Object.keys(followingsJSON) : [];
//             let connections = [...new Set([...followers, ...followings])];

//             userData = { [appPublicKey_SkyFeed+"#following"] : followings, [appPublicKey_SkyFeed+"#followers"] : followers}
//         }
//     }
//     catch (e) {
//         console.log(e);
//     }
//     return userData;

// }

export const fetchAllUsersPubKeys = async () => {
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  let result = []
  let usersPubKeyList = []

  try {
    let usersPubKeyCache = []
    // Step1: get UserCache PublicKey and DataKey
    const cacheKeyValueJSON = await getUsersCacheInfo()
    if (cacheKeyValueJSON.publickey && cacheKeyValueJSON.datakeys[0]) {
      // Step2: Fetch all PublicKeys from Cache
      usersPubKeyCache = await getFile(session, cacheKeyValueJSON.datakeys[0], {
        publicKey: cacheKeyValueJSON.publickey,
        skydb: true,
      })
      usersPubKeyList =
        typeof usersPubKeyCache !== "undefined" ? usersPubKeyCache.publickeys : []
    }
    // Pull
    // Fetch follower.json keys
    // Fetch following.json keys
    const followersJSON = await getFile(session, FOLLOWER_PATH)
    const followersPublicKeyList =
      typeof followersJSON !== "undefined" ? followersJSON.publicKeyList : []
    const followingsJSON = await getFile(session, FOLLOWING_PATH)
    const followingsPublicKeyList =
      typeof followingsJSON !== "undefined" ? followingsJSON.publicKeyList : []
    // Merge all PublicKey.
    result = [
      ...new Set([
        ...usersPubKeyList,
        ...followersPublicKeyList,
        ...followingsPublicKeyList,
      ]),
    ]
    const index = result.indexOf(session?.person?.appPublicKey)
    if (index > -1) {
      result.splice(index, 1)
    }
  } catch (e) {
    console.log(e)
  }
  return result
}

// NOTE THIS IS MASTER PUBLICKEY
export const fetchUserDataByPubKey = async (masterPublicKey) => {
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  // If PubKey is valid fetch users Profile.json, follower.json, following.json.
  // Use loggedIn user's follower list to populate followerFlag
  // Prepare Data for table.
  let userData = null
  try {
    if (session && masterPublicKey && masterPublicKey.length == 64) {
      // Get Users Master Profile
      let userMasterProfileObj = null
      const userMasterProfile = await getFile(session, SKYID_PROFILE_PATH, {
        publicKey: masterPublicKey,
        skydb: true,
      })
      if (
        userMasterProfile &&
        userMasterProfile !== "" &&
        userMasterProfile !== "undefined"
      ) {
        // file not found
        userMasterProfileObj = JSON.parse(userMasterProfile)
      }

      // check If Skapp User
      if (userMasterProfileObj?.dapps?.skapp?.publicKey) {
        // Get users App specific PublicKey
        const userAppPublicKey = userMasterProfileObj.dapps.skapp.publicKey
        // Get app specific Profile
        // fetch users database from SkyDB
        const userSkyDB = await getFileFromSkyDBFolder(
          session,
          userAppPublicKey,
          null
        )
        // get user Profile
        // const userProfile = await getFile(session, SKAPP_PROFILE_PATH, { publicKey: publicKey, skydb: true });
        const userAppProfile = userSkyDB[SKAPP_PROFILE_PATH]

        // If both profiles are available(AppSpecific and Master Profile) that means user is Skapp developer.
        if (userAppProfile && userMasterProfileObj) {
          // userData = { avatar: userProfile.avatar, username: userProfile.username, aboutme: userProfile.aboutme, git: userProfile.git, publicKey };
          userData = {
            username: userMasterProfileObj.username,
            aboutMe: userMasterProfileObj.aboutMe,
            location: userMasterProfileObj.location,
            avatar: userMasterProfileObj.avatar,
            devName: userAppProfile.devName,
            devGitId: userAppProfile.devGitId,
            devGitRepo: userAppProfile.devGitRepo,
            devInfo: userAppProfile.devInfo,
            createTS: userAppProfile.createTS,
            lastUpdateTS: userAppProfile.lastUpdateTS,
            appPublicKey: userAppPublicKey,
            masterPublicKey,
          }
          // get user Follower
          // const userFollowers = await getFile(session, FOLLOWER_PATH, { publicKey: publicKey, skydb: true });
          const userFollowers = userSkyDB[FOLLOWER_PATH]
          if (userFollowers) {
            userData.noOffollowers = userFollowers.publicKeyList.length
            userData.followers = userFollowers.publicKeyList
          }
          // get user Following
          // const userFollowings = await getFile(session, FOLLOWING_PATH, { publicKey: publicKey, skydb: true });
          const userFollowings = userSkyDB[FOLLOWING_PATH]
          if (userFollowings) {
            userData.noOffollowings = userFollowings.publicKeyList.length
            userData.followings = userFollowings.publicKeyList
          }
          // get Published Apps
          // const userPublishedApps = await getFile(session, SKYSPACE_PATH + "publishedapps.json", { publicKey: publicKey, skydb: true });
          const userPublishedApps = userSkyDB[`${SKYSPACE_PATH}publishedapps.json`]
          if (userPublishedApps) {
            userData.noOfPublishedApps = userPublishedApps.skhubIdList.length
            // need to add logic here to get list of apps from skylink
          }
        } else if (userMasterProfileObj && !userAppProfile) {
          // Skynet user but not Skapp developer yet
        } else {
          userData = null
        }
      } else {
        userData = null
      }
    }
  } catch (error) {
    console.log(error)
    userData = null
  }
  return userData
}

export const getFollowersJSON = async (publicKey) => {
  let followersJSON = []
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  try {
    if (publicKey) {
      followersJSON = await getFile(session, FOLLOWER_PATH, {
        publicKey,
        skydb: true,
      })
    } else {
      followersJSON = await getFile(session, FOLLOWER_PATH)
    }
  } catch (e) {}
  return typeof followersJSON !== "undefined" ? followersJSON : { publicKeyList: [] }
}

export const getFollowingsJSON = async (publicKey) => {
  let followingsJSON = { publicKeyList: [] }
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  try {
    if (publicKey) {
      followingsJSON = await getFile(session, FOLLOWING_PATH, {
        publicKey,
        skydb: true,
      })
    } else {
      followingsJSON = await getFile(session, FOLLOWING_PATH)
    }
  } catch (e) {}
  return typeof followingsJSON !== "undefined"
    ? followingsJSON
    : { publicKeyList: [] }
}
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

export const getFileFromSkyDBFolder = async (session, publicKey, fileName) => {
  // if fileName is null, It will return entire User DB.
  // TODO, need to change this to Directory so that I dont need to pull entire IDB data
  let resultJSON = {}
  const skydbJSON = await getFile(session, DK_IDB_SKYSPACES, {
    publicKey,
    skydb: true,
  })

  if (skydbJSON && skydbJSON != "undefined" && skydbJSON.db) {
    if (fileName) {
      resultJSON = skydbJSON.db.filter((item) => Object.keys(item)[0] === fileName)
    } else {
      await skydbJSON.db.forEach((item) => {
        const key = Object.keys(item)[0]
        const value = item[key]
        // 2. update IndexedDB Store
        resultJSON[key] = value
      })
    }
  }
  return resultJSON
}

// get app list of all users you are following.
export const bsfetchDefaultAppStore = async (publicKey) => {
  const skylinkArr = []
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)

  let userMasterProfileObj = null
  const userMasterProfile = await getFile(session, SKYID_PROFILE_PATH, {
    publicKey,
    skydb: true,
  })
  if (
    userMasterProfile &&
    userMasterProfile !== "" &&
    userMasterProfile !== "undefined"
  ) {
    // file not found
    userMasterProfileObj = JSON.parse(userMasterProfile)
  }
  const appPublicKey = userMasterProfileObj?.dapps?.skapp?.publicKey
  const appsProviderIDB = await getFileFromSkyDBFolder(session, appPublicKey, null)
  const userAppProfile = appsProviderIDB[SKAPP_PROFILE_PATH]
  const skyspaceObj = appsProviderIDB[`${SKYSPACE_PATH}appstore.json`]
  const loop = skyspaceObj?.skhubIdList.map((skhubId) => {
    const skylinkFilePath = `${SKYLINK_PATH + skhubId}.json`
    const skylinkObj = appsProviderIDB[skylinkFilePath]
    // skylinkObj.publicKey = publicKey;
    skylinkObj.appPublicKey = appPublicKey
    skylinkObj.masterPublicKey = publicKey
    skylinkObj.username = userMasterProfileObj.username
    skylinkObj.avatar = userMasterProfileObj.avatar
    skylinkObj.devName = userAppProfile.devName
    skylinkArr.push(skylinkObj)
  })
  return skylinkArr
}
// get app list of all users you are following.
export const bsfetchPublisherAppList = async () => {
  const promises = []
  const skylinkArr = []
  try {
    const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
    const followingsJSON = await getFile(session, FOLLOWING_PATH)
    if (followingsJSON && followingsJSON.publicKeyList) {
      const { publicKeyList } = followingsJSON
      // fetch Published app list for each developer/pubKey
      for (const publicKey of publicKeyList) {
        // TODO, need to change this to Directory so that I dont need to pull entire IDB data
        let userMasterProfileObj = null
        const userMasterProfile = await getFile(session, SKYID_PROFILE_PATH, {
          publicKey,
          skydb: true,
        })
        if (
          userMasterProfile &&
          userMasterProfile !== "" &&
          userMasterProfile !== "undefined"
        ) {
          // file not found
          userMasterProfileObj = JSON.parse(userMasterProfile)
        }
        const appPublicKey = userMasterProfileObj?.dapps?.skapp?.publicKey
        const appPublisherIDB = await getFileFromSkyDBFolder(
          session,
          appPublicKey,
          null
        )
        // let skydbJSON = await getFile(session, DK_IDB_SKYSPACES, { publicKey: publicKey, skydb: true });
        // if (skydbJSON && skydbJSON != 'undefined' && skydbJSON.db) {
        //     await skydbJSON.db.forEach((item) => {
        //         let key = Object.keys(item)[0];
        //         let value = item[key];
        //         //2. update IndexedDB Store
        //         appPublisherIDB[key] = value;
        //     });
        // }
        //
        const userAppProfile = appPublisherIDB[SKAPP_PROFILE_PATH]
        const skyspaceObj = appPublisherIDB[`${SKYSPACE_PATH}publishedapps.json`]
        const loop = skyspaceObj?.skhubIdList.map((skhubId) => {
          const skylinkFilePath = `${SKYLINK_PATH + skhubId}.json`
          const skylinkObj = appPublisherIDB[skylinkFilePath]
          skylinkObj.publicKey = publicKey
          skylinkObj.appPublicKey = appPublicKey
          skylinkObj.masterPublicKey = publicKey
          skylinkObj.username = userMasterProfileObj.username
          skylinkObj.avatar = userMasterProfileObj.avatar
          skylinkObj.devName = userAppProfile.devName
          skylinkArr.push(skylinkObj)
        })
      }
    }
  } catch (e) {
    console.log(`bsfetchPublisherAppList${e.message}`)
  }
  return skylinkArr
}

export const firstTimeUserSetup = async (session) => {
  try {
    // (check IndexedDB and registry for any data, if no data that means firsttime user) -->
    let idbLastRegistryEntry = await getJSONfromDB(IDB_LAST_SYNC_REVISION_NO)
    if (idbLastRegistryEntry && idbLastRegistryEntry != null) {
      // if entry is present in IndexedDB user is existing user.
      return false // not firsttime user
    }

    let skydbEntry = await getRegistry(
      session?.person?.appPublicKey,
      DK_IDB_SKYSPACES
    )

    if (skydbEntry && skydbEntry != "undefined") {
      return false // not firsttime user
    }

    let dataJSON = JSON.parse(getInitialDataJSON)
    // 1.
    // 2.
    // create Inital sample data (esp in case of SkySpaces) - Images, video, Audio files...etc
    // user check
    // add here initial load of Skapps
    // read space data from initialData folder and load it for user.
    // TODO: Ideally we shall fetch it from Skapp dataKey. "skhub/skapp/initialdata.json"
    // call dataSync

    // Step1: load Initial data from InitialData.json to IndexedDB.  Metadata files (appstore, myapps, hosting)
    await setAllinDB(dataJSON.data)
    // Step2: Create Initial entry for follower and following
    await setFollowersJSON({ publicKeyList: [] })
    await setFollowingsJSON({ publicKeyList: [] })
    // Step3: update revision number to 1
    await setJSONinDB(IDB_LAST_SYNC_REVISION_NO, { revision: "1" })
    // Sync Data with SkyDB
    await syncData(session)
    return true // Yes, firsttime user
  } catch (error) {
    console.log("error" + error)
  }
}

export const syncData = async (session, skyDBdataKey, idbStoreName) => {
  try {
    // fetch registryEntry
    const registryEntry = await getRegistry(
      session?.person?.appPublicKey,
      DK_IDB_SKYSPACES
    )

    // check revision number
    const skyDBRevisionNo =
      registryEntry && registryEntry != "undefined" ? registryEntry.revision : 0
    const idbLastRegistryEntry = await getJSONfromDB(IDB_LAST_SYNC_REVISION_NO)
    const isOutofSync = await getJSONfromDB(IDB_IS_OUT_OF_SYNC)
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
          setJSONinDB(key, value)
        })
        await setJSONinDB(IDB_LAST_SYNC_REVISION_NO, skyDBRevisionNo)
      } else {
        return FAILED
      }
      // or status = CONFLICT;
      // This must be last step
      await setJSONinDB(IDB_IS_OUT_OF_SYNC, false) // Data is in sync. set flag in Indexed DB.
      store.dispatch(setIsDataOutOfSync(false)) // Data is in sync. set flag in store.
    }
    // SkyDB Out-of-Sync Scenario: If revision number is larger in IndexedDB, fetch data from IndexedDB and update SkyDB
    else if (isOutofSync || parseInt(skyDBRevisionNo) < parseInt(idbRevisionNo)) {
      // Get all IndexedDB data
      const { recordCount, keys, result } = await getAllItemsFromIDB(IDB_STORE_NAME)
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
      await setJSONinDB(IDB_LAST_SYNC_REVISION_NO, { revision: skyDBRevisionNo + 1 }) // we are doing plus one since we uploaded file to Skynet and revision is incremented.
      // This must be last step
      await setJSONinDB(IDB_IS_OUT_OF_SYNC, false) // Data is in sync. set flag in IDB.
      store.dispatch(setIsDataOutOfSync(false)) // Data is in sync. set flag in store.
    } else {
      console.log("Data is already in sync")
    }
  } catch (error) {
    return FAILED
  }
  return SUCCESS
}

// Add OR Update skylink Object
export const bsAddSkylinkOnly = async (session, skylinkObj, person) => {
  if (person == null) {
    return
  }
  let { skhubId } = skylinkObj
  if (skylinkObj && (skylinkObj.skhubId == null || skylinkObj.skhubId === "")) {
    skhubId = generateSkyhubId(
      `${ID_PROVIDER}:${person.profile.did}:${skylinkObj.skylink}`
    )
    skylinkObj.skhubId = skhubId
  }
  const SKYLINK_FILEPATH = `${SKYLINK_PATH + skhubId}.json`
  await putFile(session, SKYLINK_FILEPATH, skylinkObj)
  return skhubId
}

export const bsAddSkhubListToSkylinkIdx = async (session, skhubIdList) => {
  let skylinkIdxObj = await getFile(session, SKYLINK_IDX_FILEPATH)
  if (skylinkIdxObj === FAILED) {
    return skylinkIdxObj
  }
  if (!skylinkIdxObj) {
    skylinkIdxObj = createSkylinkIdxObject()
  }
  skylinkIdxObj.skhubIdList = [
    ...new Set([...skylinkIdxObj.skhubIdList, ...skhubIdList]),
  ]
  return putFile(session, SKYLINK_IDX_FILEPATH, skylinkIdxObj)
}

export const bsAddSkylink = async (session, skylinkObj, person) => {
  // console.log("person", person)
  // check if skhubId is present. If new Object, this value will be empty
  if (person == null) {
    return
  }
  let { skhubId } = skylinkObj
  if (skylinkObj && (skylinkObj.skhubId == null || skylinkObj.skhubId === "")) {
    skhubId = generateSkyhubId(
      `${ID_PROVIDER}:${person.profile.did}:${skylinkObj.skylink}`
    )
    skylinkObj.skhubId = skhubId
  }
  const SKYLINK_FILEPATH = `${SKYLINK_PATH + skhubId}.json`
  return putFile(session, SKYLINK_FILEPATH, skylinkObj)
    .then((status) => {
      if (status === FAILED) {
        return status
      }
      // Step2: add Skylink reference to SkylinkIdx JSON file
      return getFile(session, SKYLINK_IDX_FILEPATH)
    })
    .then((skylinkIdxObj) => {
      if (skylinkIdxObj === FAILED) {
        return skylinkIdxObj
      }
      if (!skylinkIdxObj) {
        // empty
        skylinkIdxObj = createSkylinkIdxObject()
      } else if (skylinkIdxObj.skhubIdList.indexOf(skhubId) > -1) {
        return FAILED
      }
      skylinkIdxObj.skhubIdList.push(skhubId)
      return putFile(session, SKYLINK_IDX_FILEPATH, skylinkIdxObj)
    })
    .then((res) => skhubId)
    .catch((err) => FAILED)
}

export const getSkyLinkIndex = (session) =>
  getFile(session, SKYLINK_IDX_FILEPATH).catch((err) => null)

export const addAllSkylinks = (skylinkObjList) => {
  // TODO
}

export const getSkylink = (session, skhubId) => {
  const SKYLINK_FILEPATH = `${SKYLINK_PATH + skhubId}.json`
  return getFile(session, SKYLINK_FILEPATH).then((res) => res)
}

export const getSkylinkIdxObject = (session) =>
  getFile(session, SKYLINK_IDX_FILEPATH).then((res) => res)

export const getAllSkylinks = (session) =>
  // TODO: its temp solution, need to apply proper logic. We can directly use Apps Array in SnCards and may not require this call.
  // return bsfetchDefaultAppStore("f9ab764658a422c061020ca0f15048634636c6000f7f884b16fafe5552d2de08");
  bsfetchDefaultAppStore(APPSTORE_PROVIDER_MASTER_PUBKEY)
// const skapps = [];
// return getFile(session, SKYLINK_IDX_FILEPATH)
//     .then(skylinkIdxObj => {
//         if (skylinkIdxObj && skylinkIdxObj.skhubIdList && skylinkIdxObj.skhubIdList.length > 0) {
//             const promises = [];
//             skylinkIdxObj.skhubIdList.forEach(skhubId => {
//                 promises.push(
//                     getSkylink(session, skhubId)
//                         .then(skapp => {
//                             skapps.push(skapp)
//                         }))
//             });
//             return Promise.all(promises)
//                 .then(() => {
//                     return skapps;
//                 });
//         } else {
//             return [];
//         }
//     })
//     .catch(err => []);

export const bsDeleteSkylink = (session, skhubId) => {
  // Step1: delete Skylink JSON
  const SKYLINK_FILEPATH = `${SKYLINK_PATH + skhubId}.json`
  return deleteFile(session, SKYLINK_FILEPATH)
    .then((status) => getFile(session, SKYLINK_IDX_FILEPATH))
    .then((skylinkIdxObj) => {
      if (skylinkIdxObj && skylinkIdxObj.skhubIdList.indexOf(skhubId) > -1) {
        const idx = skylinkIdxObj.skhubIdList.indexOf(skhubId)
        skylinkIdxObj.skhubIdList.splice(idx, 1)
        return putFile(session, SKYLINK_IDX_FILEPATH, skylinkIdxObj)
      }
      return FAILED
    })
    .catch((err) => FAILED)
}
/*
export const deleteAllSkylinks = (skyhubIdList) => {
    // TODO
}
 */
// #######################################################################
// ##################### SkySpace, SkySPaceList  #########################
// addSkySpace
// renameSkySpace
// getAllSkySpaceNames
// getSkySpace
// addToSkySpaceList
// removeFromSkySpaceList
// #######################################################################

export const putDummyFile = (session) => {
  const SKYSPACE_FILEPATH = `${SKYSPACE_PATH}dummy.json`
  return putFile(session, SKYSPACE_FILEPATH, { props: "1" })
    .then((res) => res)
    .catch((err) => {})
}

export const deleteDummyFile = (session) => {
  const SKYSPACE_FILEPATH = `${SKYSPACE_PATH}dummy.json`
  return deleteFile(session, SKYSPACE_FILEPATH)
    .then((res) => res)
    .catch((err) => {})
}

export const bsAddBulkSkyspace = async (session, skyspaceList) => {
  const promises = []
  skyspaceList.map((space) => {
    const skyspaceObj = createSkySpaceObject()
    skyspaceObj.skyspace = space
    const SKYSPACE_FILEPATH = `${SKYSPACE_PATH + space}.json`
    promises.push(putFile(session, SKYSPACE_FILEPATH, skyspaceObj))
  })
  await Promise.all(promises)
  let skyspaceIdxObj = await getFile(session, SKYSPACE_IDX_FILEPATH)
  skyspaceIdxObj = skyspaceIdxObj || createSkySpaceIdxObject()
  skyspaceIdxObj.skyspaceList = [
    ...new Set([...skyspaceIdxObj.skyspaceList, ...skyspaceList]),
  ]
  await putFile(session, SKYSPACE_IDX_FILEPATH, skyspaceIdxObj)
}

export const bsAddDeleteSkySpace = async (session, skyspaceName, isDelete) => {
  try {
    // Step 1: Add SkySpace entry in skyspaceIdx file
    const SKYSPACE_FILEPATH = `${SKYSPACE_PATH + skyspaceName}.json`
    let skyspaceIdxObj = await getFile(session, SKYSPACE_IDX_FILEPATH)
    if (!skyspaceIdxObj) {
      skyspaceIdxObj = createSkySpaceIdxObject()
      if (isDelete == null) {
        skyspaceIdxObj.skyspaceList.push(skyspaceName)
      }
    } else if (
      skyspaceIdxObj &&
      skyspaceIdxObj.skyspaceList.indexOf(skyspaceName) > -1
    ) {
      // SKySpace already present and we dont want to overwrite. USe 'Update' method for overwrite
      if (isDelete == null) {
        return FAILED
      }
      const idx = skyspaceIdxObj.skyspaceList.indexOf(skyspaceName)
      skyspaceIdxObj.skyspaceList.splice(idx, 1)
    } else if (isDelete == null) {
      skyspaceIdxObj.skyspaceList.push(skyspaceName)
    } else {
      return FAILED
    }
    await putFile(session, SKYSPACE_IDX_FILEPATH, skyspaceIdxObj)
    if (isDelete == null) {
      const skyspaceObj = createSkySpaceObject()
      skyspaceObj.skyspace = skyspaceName
      await putFile(session, SKYSPACE_FILEPATH, skyspaceObj)
    } else {
      await deleteFile(session, SKYSPACE_FILEPATH)
    }
    return SUCCESS
  } catch (err) {
    return FAILED
  }
}

export const bsRenameSkySpace = (session, oldSkyspaceName, newSkyspaceName) => {
  const SKYSPACE_FILEPATH = `${SKYSPACE_PATH + oldSkyspaceName}.json`
  const SKYSPACE_FILEPATH_NEW = `${SKYSPACE_PATH + newSkyspaceName}.json`
  return getFile(session, SKYSPACE_IDX_FILEPATH)
    .then((skyspaceIdxObj) => {
      if (
        skyspaceIdxObj &&
        skyspaceIdxObj.skyspaceList.indexOf(oldSkyspaceName) > -1
      ) {
        const idx = skyspaceIdxObj.skyspaceList.indexOf(oldSkyspaceName)
        skyspaceIdxObj.skyspaceList.splice(idx, 1, newSkyspaceName)
        return putFile(session, SKYSPACE_IDX_FILEPATH, skyspaceIdxObj)
        // SKySpace already present and we dont want to overwrite. USe 'Update' method for overwrite
      }

      // Couldn't find oldSkyspaceName in Idx
      return FAILED
    })
    .then((res) => {
      if (res === FAILED) {
        return FAILED
      }

      return getFile(session, SKYSPACE_FILEPATH)
    })
    .then((skyspaceObj) => {
      if (skyspaceObj == null || skyspaceObj === FAILED) {
        return FAILED
      }
      skyspaceObj.skyspace = newSkyspaceName
      return putFile(session, SKYSPACE_FILEPATH_NEW, skyspaceObj)
    })
    .then((status) => deleteFile(session, SKYSPACE_FILEPATH))
    .catch((err) => {})
}
// fetches all SkySpaces names. this method gets called during login
export const bsGetAllSkySpaceNames = (session) =>
  getFile(session, SKYSPACE_IDX_FILEPATH)
    .then((skyspaceIdxObj) => {
      if (skyspaceIdxObj && skyspaceIdxObj.skyspaceList) {
        return skyspaceIdxObj.skyspaceList
      }
      if (skyspaceIdxObj && skyspaceIdxObj.name === FAILED_DECRYPT_ERR) {
        return deleteFile(session, SKYSPACE_IDX_FILEPATH).then(() => [])
      } else {
        return []
      }
    })
    .catch((err) => [])

export const bsGetSkyspaceAppCount = (session) => {
  const skyspaceAppCountObj = {}
  return bsGetAllSkySpaceNames(session).then((skyspaceList) => {
    const promises = []
    skyspaceList.forEach((skyspaceName) => {
      promises.push(
        getSkySpace(session, skyspaceName).then((skyspaceObj) => {
          if (skyspaceObj != null && skyspaceObj.skhubIdList != null) {
            skyspaceAppCountObj[skyspaceName] = skyspaceObj.skhubIdList.length
          }
        })
      )
    })
    return Promise.all(promises).then(() => skyspaceAppCountObj)
  })
}

export const bsGetAllSkyspaceObj = async (session) => {
  const skyspaceObjList = {}
  const skyspaceList = await bsGetAllSkySpaceNames(session)
  const promises = []
  skyspaceList.forEach((skyspaceName) => {
    promises.push(
      getSkySpace(session, skyspaceName).then((skyspaceObj) => {
        skyspaceObjList[skyspaceName] = skyspaceObj.skhubIdList
      })
    )
  })
  await Promise.all(promises)
  return skyspaceObjList
}

export const bsRemoveSkylinkFromSkyspaceList = (session, skhubId, skyspaceList) => {
  const promises = []
  skyspaceList.forEach((skyspaceName) => {
    promises.push(
      bsRemoveSkappFromSpace(session, skyspaceName, skhubId).catch((err) => "")
    )
  })
  return Promise.all(promises).then(() => {})
}
// Add SkhubId to List of SkySpaces
export const bsAddSkylinkFromSkyspaceList = async (
  session,
  skhubId,
  skyspaceList
) => {
  const promises = []
  skyspaceList.forEach((skyspaceName) => {
    promises.push(
      addToSkySpaceList(session, skyspaceName, skhubId).catch((err) => "")
    )
  })
  await Promise.all(promises)
}

export const bsGetSkyspaceNamesforSkhubId = (session, skhuId) => {
  const skyspaceForSkhubIdList = []
  return bsGetAllSkySpaceNames(session)
    .then((skyspaceList) => {
      const promises = []
      skyspaceList.forEach((skyspace) => {
        promises.push(
          getSkySpace(session, skyspace).then((skyspaceObj) => {
            if (
              skyspaceObj != null &&
              skyspaceObj.skhubIdList.indexOf(skhuId) > -1
            ) {
              skyspaceForSkhubIdList.push(skyspace)
            }
          })
        )
      })
      return Promise.all(promises).then(() => skyspaceForSkhubIdList)
    })
    .then((skyspaceForSkhubIdList) => {
      let isAppOwner = false
      return getSkyLinkIndex(session).then((skylinkIndex) => {
        if (skylinkIndex != null && skylinkIndex.skhubIdList.includes(skhuId)) {
          isAppOwner = true
        }
        return { skyspaceForSkhubIdList, isAppOwner }
      })
    })
}
// fetch all Skylinks in a Space
export const getSkyspaceApps = (session, skyspaceName) => {
  const skapps = []
  return getSkySpace(session, skyspaceName).then((skyspaceObj) => {
    const { skhubIdList } = skyspaceObj
    if (skhubIdList == null) {
      return []
    }
    const promises = []
    skhubIdList.forEach((skhubId) => {
      promises.push(
        getSkylink(session, skhubId).then((skapp) => {
          skapps.push(skapp)
        })
      )
    })
    return Promise.all(promises).then(() => skapps)
  })
}

export const getSkySpace = (session, skyspaceName) => {
  const SKYSPACE_FILEPATH = `${SKYSPACE_PATH + skyspaceName}.json`
  return getFile(session, SKYSPACE_FILEPATH).then((skyspaceObj) => skyspaceObj)
}

export const bsPutSkyspaceInShared = (
  session,
  encryptedContent,
  skyspaceName,
  shareToId
) => {
  const SHARED_SKYSPACE_FILEPATH = `${
    SHARED_PATH_PREFIX + shareToId
  }/${SKYSPACE_PATH}${skyspaceName}.json`
  return putFileForShared(session, SHARED_SKYSPACE_FILEPATH, encryptedContent)
  // return deleteFile(session, SHARED_SKYSPACE_FILEPATH);
}

// not in use
// export const bsGetSharedSkyspaceIdxFromSender = async (session, senderStorageId, skyspaceName) => {
//     const myPublicKey = getPublicKeyFromPrivate(session.loadUserData().appPrivateKey);
//     const encryptedContent = await fetch(`${GAIA_HUB_URL}/${senderStorageId}/skhub/shared/${myPublicKey}/${SKYSPACE_PATH}${skyspaceName}.json`)
//         .then(res => res.json());
//     const decryptedContent = await decryptContent(session, JSON.stringify(encryptedContent));
// }

// Add SkhubId to SkySpaces
export const addToSkySpaceList = (session, skyspaceName, skhubId) =>
  getSkySpace(session, skyspaceName).then((skyspaceObj) => {
    const SKYSPACE_FILEPATH = `${SKYSPACE_PATH + skyspaceName}.json`
    skhubId = Array.isArray(skhubId) ? skhubId : [skhubId]
    skyspaceObj.skhubIdList = [...new Set([...skyspaceObj.skhubIdList, ...skhubId])]
    return putFile(session, SKYSPACE_FILEPATH, skyspaceObj)
  })

export const bsRemoveSkappFromSpace = (session, skyspaceName, skhubId) =>
  getSkySpace(session, skyspaceName)
    .then((skyspaceObj) => {
      if (skyspaceObj && skyspaceObj.skhubIdList.indexOf(skhubId) > -1) {
        const idx = skyspaceObj.skhubIdList.indexOf(skhubId)
        skyspaceObj.skhubIdList.splice(idx, 1)
        const SKYSPACE_FILEPATH = SKYSPACE_PATH + skyspaceName + ".json"
        return putFile(session, SKYSPACE_FILEPATH, skyspaceObj)
      }
      return FAILED
    })
    .catch((err) => FAILED)

export const getUserHistory = (session) =>
  getFile(session, HISTORY_FILEPATH)
    .then((historyObj) => {
      if (historyObj == null) {
        return []
      }
      if (historyObj && historyObj.name === FAILED_DECRYPT_ERR) {
        return deleteFile(session, HISTORY_FILEPATH).then(() => [])
      } else {
        return historyObj
      }
    })
    .catch((err) => [])

export const bsAddToHistory = async (session, obj) =>
  getUserHistory(session)
    .then((userHistoryObj) => {
      if (userHistoryObj == null) {
        userHistoryObj = []
      }
      obj.timestamp = new Date()
      // userHistoryObj.push(obj);
      // Need to check if Object already exist in history with skhubId as null or empty
      const idx = userHistoryObj.findIndex((objInList) => {
        let isEqual = false
        // if (objInList.hasOwnProperty("savedToSkySpaces") &&
        //     objInList["skhubId"] &&
        //     (objInList["skhubId"] === obj["skhubId"]) &&
        //     (objInList["savedToSkySpaces"] === false) &&
        //     (objInList["skyspaces"].length === 0)) {
        //     isEqual = true;
        // }
        if (objInList.skhubId && objInList.skhubId === obj.skhubId) {
          isEqual = true
        }
        return isEqual
      })
      if (idx > -1) {
        userHistoryObj[idx].savedToSkySpaces = obj.savedToSkySpaces
        userHistoryObj[idx].skyspaces = obj.skyspaces
      } else {
        userHistoryObj.push(obj)
      }
      return userHistoryObj
    })
    .then((userHistoryObj) => putFile(session, HISTORY_FILEPATH, userHistoryObj))
    .catch((err) => err)

export const bsSetHistory = async (session, historyJsonObj) => {
  await putFile(session, HISTORY_FILEPATH, historyJsonObj)
}

export const bsClearHistory = async (session) => {
  await putFile(session, HISTORY_FILEPATH, [])
}

export const bsGetUserSetting = async (session) => {
  const userSetting = await getFile(session, USERSETTINGS_FILEPATH)
  return userSetting || INITIAL_SETTINGS_OBJ()
}
export const bsSetUserSetting = async (session, userSettingObj) => {
  await putFile(session, USERSETTINGS_FILEPATH, userSettingObj)
}
export const bsGetSkyIDProfile = async (session) => {
  // let profileJSON = await getFile(session, SKYID_PROFILE_PATH);
  let personObj = null
  const response = await getFile(session, SKYID_PROFILE_PATH, {
    publicKey: session.skyid.userId,
    skydb: true,
  })
  if (response == "") {
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
// This user profile is appspecific profile
export const bsGetUserMasterProfile = async (userSession) => {
  let userProfileObj = {}
  try {
    const response = await getFile(null, SKYID_PROFILE_PATH, {
      publicKey: userSession?.person?.masterPublicKey,
      skydb: true,
    })
    // Profile found in SkyDB
    if (response && response !== "" && response !== "undefined") {
      // file not found
      userProfileObj = response
    }
  } catch (error) {
    console.error(`bsGetUserMasterProfile:${error}`)
  }
  return userProfileObj
}
// This user profile is appspecific profile
export const bsGetUserAppProfile = async (session) => {
  let userProfileObj = null
  try {
    const response = await getFile(session, SKAPP_PROFILE_PATH)
    // Profile found in SkyDB
    if (response && response !== "" && response !== "undefined") {
      // file not found
      userProfileObj = response
    } else {
      // Profile not found, Initialize with default values
      userProfileObj = createUserProfileObject()
      console.log("Profile not found;, please check your connection and retry")
    }
  } catch (error) {
    console.error(`bsGetUserAppProfile:${error}`)
    userProfileObj = createUserProfileObject()
  }
  return userProfileObj
}

// This user profile is appspecific profile
export const bsSetUserAppProfile = async (session, appProfile) => {
  const userProfileObj = null
  await putFile(session, SKAPP_PROFILE_PATH, appProfile)
}

export const bsGetPortalsList = async (session) => {
  let portalsJSON = await getFile(session, SKYNET_PORTALS_FILEPATH)
  if (portalsJSON == null) {
    portalsJSON = INITIAL_PORTALS_OBJ
  } else if (portalsJSON.portals == null || portalsJSON.portals.length === 0) {
    portalsJSON.portals = INITIAL_PORTALS_OBJ.portals
  }
  return portalsJSON
}

export const bsGetDataSyncPrefList = (session) => {
  // we may need to add more logic here in future
  const dataSyncPrefJSON = INITIAL_DATASYNC_PREF_OBJ
  return dataSyncPrefJSON.dataSyncPrefList
}

export const bsSetPortalsList = async (session, portalsObj) => {
  await putFile(session, SKYNET_PORTALS_FILEPATH, portalsObj)
}

export const bsDeletePortal = (session, portalName) =>
  bsGetPortalsList(session)
    .then((portalsListObj) => {
      if (portalsListObj == null) {
        portalsListObj = []
      }
      const idx = portalsListObj.findIndex(
        (portalObj) =>
          portalObj.hasOwnProperty("name") && portalObj.name === portalName
      )
      if (idx > -1) {
        portalsListObj.splice(idx, 1)
      }
      return portalsListObj
    })
    .then((portalsListObj) =>
      putFile(session, SKYNET_PORTALS_FILEPATH, portalsListObj)
    )
    .catch((err) => err)

export const bsAddPortal = (session, obj) =>
  bsGetPortalsList(session)
    .then((portalsListObj) => {
      if (portalsListObj == null) {
        portalsListObj = []
      }
      obj.createTS = new Date()
      portalsListObj.portals.push(obj)
      return portalsListObj
    })
    .then((portalsListObj) =>
      putFile(session, SKYNET_PORTALS_FILEPATH, portalsListObj)
    )
    .catch((err) => err)

export const bsGetBackupObjFile = async (session) => {
  const filePathList = await listFiles(session)
  const promises = []
  const backupObjList = []
  filePathList.forEach((filePath) => {
    IGNORE_PATH_IN_BACKUP.indexOf(filePath) === -1 &&
      promises.push(
        getFile(session, filePath).then((content) => {
          const backupObj = {
            path: filePath,
            contentStr: JSON.stringify(content),
          }
          backupObjList.push(backupObj)
        })
      )
  })
  await Promise.all(promises)
  const encryptedContent = await encryptContent(
    session,
    JSON.stringify(backupObjList)
  )
  return new File([encryptedContent], `backup${new Date()}.txt`, {
    type: "text/plain",
    lastModified: new Date(),
  })
}

export const retrieveBackupObj = async (session, skylinkUrl) => {
  const res = await fetch(skylinkUrl)
  const txt = await res.text()
  const decryptedTxt = await decryptContent(session, txt)
  return JSON.parse(decryptedTxt)
}

export const restoreBackup = async (session, backupObj) => {
  const promises = []
  const currentfilePathList = await listFiles(session)
  backupObj.forEach((obj, idx) => {
    if (IGNORE_PATH_IN_BACKUP.indexOf(obj.path) === -1) {
      if (currentfilePathList && currentfilePathList.indexOf(obj.path) > -1) {
        currentfilePathList.splice(currentfilePathList.indexOf(obj.path), 1)
      }
      promises.push(putFile(session, obj.path, JSON.parse(obj.contentStr)))
    }
  })
  currentfilePathList.forEach((path) => {
    IGNORE_PATH_IN_BACKUP.indexOf(path) === -1 &&
      promises.push(deleteFile(session, path))
  })
  await Promise.all(promises)
  return SUCCESS
}

export const bsClearStorage = async (session) => {
  const promises = []
  await listFiles(session).then((filePathList) =>
    filePathList.forEach((path) => promises.push(deleteFile(session, path)))
  )
  await Promise.all(promises)
}

export const bsSavePublicKey = async (session) => {
  let publicKey = null
  try {
    publicKey = await getFile(session, PUBLIC_KEY_PATH, { decrypt: false })
    if (publicKey == null) {
      publicKey = getPublicKeyFromPrivate(session.loadUserData().appPrivateKey)
      await putFile(session, PUBLIC_KEY_PATH, publicKey, { encrypt: false })
    }
  } catch (err) {
    console.log(err)
  }
}
// Get the file that contains all existing List of users with whom spaces are shared so far.
export const bsGetSharedWithObj = async (session) => {
  try {
    return getFile(session, SHARED_WITH_FILE_PATH)
  } catch (e) {}
}

export const bsSaveSharedWithObj = async (session, sharedWithObj) =>
  putFile(session, SHARED_WITH_FILE_PATH, sharedWithObj)
// This method is getting called from Modal to import user spaces. This is coming from sn.import-shared-space-modal (input)
export const importSpaceFromUserList = async (session, senderIdList) =>
  bsGetSpacesFromUserListV2(session, senderIdList, { isImport: true })

// TODO: This method pulls ALL shared spaces by ALL senders. Its using senders (sender's storage path) / (in case of skyDB sender's public key) to pull this data
export const bsGetSpacesFromUserList = async (session, senderIdList, opt) => {
  const promises = []
  const senderListWithNoShare = []
  // get existing shared spaces data. senderList and sender-space mapping
  // if "sharedByUserObj" present, that means its getting loaded during login ELSE its call is from sn.import-shared-space-modal
  const sharedByUserObj = opt.sharedByUserObj || (await bsGetSharedByUser(session))
  // sharedByUserObj
  const { senderToSpacesMap = {}, sharedByUserList = [] } = sharedByUserObj || {}
  senderIdList &&
    senderIdList.forEach(async (senderId) => {
      const sessionType = getUserSessionType(session)
      let loggedInUserStorageId
      let sharedSpaceIdxPromise
      switch (sessionType) {
        case ID_PROVIDER_SKYID:
          // loggedInUserStorageId = snSerializeSkydbPublicKey(snKeyPairFromSeed(session.skydbseed).publicKey);
          sharedSpaceIdxPromise = bsGetShrdSkyspaceIdxFromSender(
            session,
            senderId,
            session?.person?.appPublicKey,
            { skydb: true }
          )
          break
        case ID_PROVIDER_SKYDB:
          loggedInUserStorageId = snSerializeSkydbPublicKey(
            snKeyPairFromSeed(session.skydbseed).publicKey
          )
          sharedSpaceIdxPromise = bsGetShrdSkyspaceIdxFromSender(
            session,
            senderId,
            loggedInUserStorageId,
            { skydb: true }
          )
          break
        case ID_PROVIDER_BLOCKSTACK:
        default:
          const loggedInUserProfile = JSON.parse(
            localStorage.getItem("blockstack-session")
          ).userData?.profile
          loggedInUserStorageId = bsGetProfileInfo(loggedInUserProfile).storageId
          sharedSpaceIdxPromise = lookupProfile(
            senderId,
            BLOCKSTACK_CORE_NAMES
          ).then((senderProfile) => {
            // get sender's storage location
            const senderStorage = bsGetProfileInfo(senderProfile).storage
            // get SkyspacesIDX object from senders storage location. in case of SkyDB. storageId is basically PublicKey, and path is DataKey
            return bsGetShrdSkyspaceIdxFromSender(
              session,
              senderStorage,
              loggedInUserStorageId
            )
          })
      }
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
      const sessionType = getUserSessionType(session)
      let loggedInUserStorageId
      let sharedSpaceIdxPromise
      switch (sessionType) {
        case ID_PROVIDER_SKYID:
          // loggedInUserStorageId = snSerializeSkydbPublicKey(snKeyPairFromSeed(session.skydbseed).publicKey);
          sharedSpaceIdxPromise = bsGetShrdSkyspaceIdxFromSenderV2(
            session,
            senderId,
            session?.person?.appPublicKey,
            { skydb: true }
          )
          break
        case ID_PROVIDER_SKYDB:
          loggedInUserStorageId = snSerializeSkydbPublicKey(
            snKeyPairFromSeed(session.skydbseed).publicKey
          )
          sharedSpaceIdxPromise = bsGetShrdSkyspaceIdxFromSenderV2(
            session,
            senderId,
            loggedInUserStorageId,
            { skydb: true }
          )
          break
        case ID_PROVIDER_BLOCKSTACK:
        default:
          const loggedInUserProfile = JSON.parse(
            localStorage.getItem("blockstack-session")
          ).userData?.profile
          loggedInUserStorageId = bsGetProfileInfo(loggedInUserProfile).storageId
          sharedSpaceIdxPromise = lookupProfile(
            senderId,
            BLOCKSTACK_CORE_NAMES
          ).then((senderProfile) => {
            // get sender's storage location
            const senderStorage = bsGetProfileInfo(senderProfile).storage
            // get SkyspacesIDX object from senders storage location. in case of SkyDB. storageId is basically PublicKey, and path is DataKey
            return bsGetShrdSkyspaceIdxFromSenderV2(
              session,
              senderStorage,
              loggedInUserStorageId
            )
          })
      }
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

// Sharing functionality: This method is fetching "all SHARED skylink JSON objects" from sender storage.
// For SkyDB, we will only need "Public Key" of "sender" and "DataKey" of shared Object
// 1. NO STORAGE ID logic required for skyDB, Since we just need "public Key" and "dataKey" of sender to fetch data
// 2. With SKYDB , Sender will need to create one entry in skydb while sharing with other user. DataKey["receiver's pubkey"] -> "list of all files shared by sender. key of ...spaceIDX, skylinkindex, skhub.json "
// 3. receiver when imports "senders pubKey", he will be able to fetch complete list by doing getJSON(sender's PubKey, dataKey[receiver(or loggedin user) PubKey] ). You will get list of all files.
// 4. Now receiver will be able to fetch each files using  "senders pubKey" and file path from file fetched in steps #3

// OR

// You can use Public key instead of stoarge ID.

export const bsGetSharedSpaceAppList = async (session, senderId, skyspace) => {
  // for skyDB we can do IF consition here
  // if (skydb)
  // {
  //     call skyDbGetSharedSpaceAppList()
  // }else
  // { below
  const { senderStorage, loggedInUserStorageId } = await getStorageIds(
    session,
    senderId
  )
  const SHARED_SKYSPACE_FILEPATH = `${
    SHARED_PATH_PREFIX + loggedInUserStorageId
  }/${SKYSPACE_PATH}${skyspace}.json`
  const encSkyspaceObj = await getEncDataFromSenderStorage(
    session,
    SHARED_SKYSPACE_FILEPATH,
    senderStorage
  ) // await fetch(`${senderStorage}${SHARED_SKYSPACE_FILEPATH}`).then(res => res.json());
  const skyspaceObj = JSON.parse(
    await decryptContent(session, JSON.stringify(encSkyspaceObj))
  )
  const promises = []
  const skylinkArr = []
  const loop = skyspaceObj?.skhubIdList.map((skhubId) => {
    const SHARED_SKYLINK_FILE_PATH = `${
      SHARED_PATH_PREFIX + loggedInUserStorageId
    }/${SKYLINK_PATH}${skhubId}.json`
    promises.push(
      getEncDataFromSenderStorage(session, SHARED_SKYLINK_FILE_PATH, senderStorage)
        .then((encSkylinkObj) =>
          decryptContent(session, JSON.stringify(encSkylinkObj))
        )
        .then((skylinkObjStr) => {
          skylinkArr.push(JSON.parse(skylinkObjStr))
        })
    )
  })
  await Promise.all(promises)
  return skylinkArr
}

// This method is includes design imporvement to get all metadata as one file. and reading it.
export const bsGetSharedSpaceAppListV2 = async (session, senderId, skyspace) => {
  const promises = []
  const skylinkArr = []
  const { senderStorage, loggedInUserStorageId } = await getStorageIds(
    session,
    senderId
  )
  const SHARED_FILEPATH = SHARED_PATH_PREFIX + loggedInUserStorageId
  const SHARED_SKYSPACE_FILEPATH = `${SKYSPACE_PATH + skyspace}.json`
  // read Shared encrypted file from sender SkyDB registry
  const encMasterSharedFileObj = await getEncDataFromSenderStorage(
    session,
    SHARED_FILEPATH,
    senderStorage
  ) // await fetch(`${senderStorage}${SHARED_SKYSPACE_FILEPATH}`).then(res => res.json());
  // get unencrypted file as JSON
  const masterSharedFileJSON = JSON.parse(
    await decryptContent(session, JSON.stringify(encMasterSharedFileObj))
  )
  let skylinkStr = null
  let skylinkObj = null
  // If valid JSON...
  if (masterSharedFileJSON && masterSharedFileJSON != "undefined") {
    // get Space object from master file
    const skyspaceStr = masterSharedFileJSON[SHARED_SKYSPACE_FILEPATH]
    const skyspaceObj = skyspaceStr ? JSON.parse(skyspaceStr) : null
    // get all Skylink associated with this Space.
    const loop = skyspaceObj?.skhubIdList.map((skhubId) => {
      const SHARED_SKYLINK_FILE_PATH = `${SKYLINK_PATH + skhubId}.json`
      skylinkStr = masterSharedFileJSON[SHARED_SKYLINK_FILE_PATH]
      skylinkObj = skylinkStr ? JSON.parse(skylinkStr) : null
      skylinkArr.push(skylinkObj)
    })
  }
  return skylinkArr
}

export const getEncDataFromSenderStorage = async (
  session,
  filePath,
  senderStorage
) => {
  const sessionType = getUserSessionType(session)
  let encSharedSkyspaceIdx
  switch (sessionType) {
    case ID_PROVIDER_SKYID:
      encSharedSkyspaceIdx = await getFileUsingPublicKeyStr(senderStorage, filePath)
      break
    case ID_PROVIDER_SKYDB:
      encSharedSkyspaceIdx = await getFileUsingPublicKeyStr(senderStorage, filePath)
      break
    case ID_PROVIDER_BLOCKSTACK:
    default:
      encSharedSkyspaceIdx = await fetch(`${senderStorage}${filePath}`).then((res) =>
        res.json()
      )
  }
  return encSharedSkyspaceIdx
}

export const getStorageIds = async (session, senderId) => {
  const sessionType = getUserSessionType(session)
  let senderStorage
  let loggedInUserStorageId
  let remoteUserStorage
  switch (sessionType) {
    case ID_PROVIDER_SKYID:
      loggedInUserStorageId = session?.person?.appPublicKey
      senderStorage = senderId
      remoteUserStorage = senderId
      break
    case ID_PROVIDER_SKYDB:
      loggedInUserStorageId = snSerializeSkydbPublicKey(
        snKeyPairFromSeed(session.skydbseed).publicKey
      )
      senderStorage = senderId
      remoteUserStorage = senderId
      break
    case ID_PROVIDER_BLOCKSTACK:
    default:
      const loggedInUserProfile = JSON.parse(
        localStorage.getItem("blockstack-session")
      ).userData?.profile
      loggedInUserStorageId = bsGetProfileInfo(loggedInUserProfile).storageId
      const senderProfile = await lookupProfile(senderId, BLOCKSTACK_CORE_NAMES)
      senderStorage = bsGetProfileInfo(senderProfile).storage
      remoteUserStorage = bsGetProfileInfo(senderProfile).storageId
  }
  return {
    loggedInUserStorageId,
    senderStorage,
    remoteUserStorage,
    sessionType,
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

export const bsGetShrdSkyspaceIdxFromSender = async (
  session,
  senderStorage,
  loggedInUserStorageId
) => {
  const SHARED_SKYSPACE_IDX_FILEPATH = `${
    SHARED_PATH_PREFIX + loggedInUserStorageId
  }/${SKYSPACE_IDX_FILEPATH}`
  const encSharedSkyspaceIdx = await getEncDataFromSenderStorage(
    session,
    SHARED_SKYSPACE_IDX_FILEPATH,
    senderStorage
  )
  const sharedSkyspaceIdx = await decryptContent(
    session,
    JSON.stringify(encSharedSkyspaceIdx)
  )
  return JSON.parse(sharedSkyspaceIdx)
}

export const getSharedMasterJSONFromSkyDB = async (publicKey) => {
  const strUserSession = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  let session = null
  let masterSharedFileJSON = {}
  if (strUserSession != null) {
    session = JSON.parse(strUserSession)
    try {
      const SHARED_FILEPATH = SHARED_PATH_PREFIX + publicKey
      // read Shared encrypted file from sender SkyDB registry
      const encMasterSharedFileObj = await getFile(session, SHARED_FILEPATH, {
        skydb: true,
      })
      // get unencrypted file as JSON
      masterSharedFileJSON = JSON.parse(
        await decryptContent(session, JSON.stringify(encMasterSharedFileObj))
      )
    } catch (e) {
      return {}
    }
  }
  return masterSharedFileJSON
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
    // read Shared encrypted file from sender SkyDB registry
    const encMasterSharedFileObj = await getEncDataFromSenderStorage(
      session,
      SHARED_FILEPATH,
      senderPublicKey
    ) // await fetch(`${senderStorage}${SHARED_SKYSPACE_FILEPATH}`).then(res => res.json());
    // get unencrypted file as JSON
    const masterSharedFileJSON = JSON.parse(
      await decryptContent(session, JSON.stringify(encMasterSharedFileObj))
    )
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

export const bsGetSharedSkappListFromSender = async (
  session,
  senderId,
  skhubIdList
) => {
  const { senderStorage, loggedInUserStorageId } = await getStorageIds(
    session,
    senderId
  )
  const skappList = []
  const promises = []
  skhubIdList.forEach((skhubId) => {
    // const SHARED_SKYLINK_PATH = SHARED_PATH_PREFIX + loggedInUserStorageId + "/" + SKYLINK_PATH + skhubId + ".json";
    const SHARED_SKYLINK_PATH = `${SKYLINK_PATH + skhubId}.json`
    promises.push(
      getEncDataFromSenderStorage(session, SHARED_SKYLINK_PATH, senderStorage)
        .then((encSharedSkapp) =>
          decryptContent(session, JSON.stringify(encSharedSkapp))
        )
        .then((sharedSkappStr) => {
          skappList.push(JSON.parse(sharedSkappStr))
        })
    )
  })
  await Promise.all(promises)
  return skappList
}

export const bsSetSharedSkylinkIdx = async (
  session,
  recipientId,
  skylinkList,
  sharedWithObj
) => {
  const sharedSkylinkIdxObj = createSkylinkIdxObject()
  const recipientPathPrefix = `${SHARED_PATH_PREFIX + recipientId}/`
  let publicKey
  const sessionType = getUserSessionType(session)
  switch (sessionType) {
    case ID_PROVIDER_SKYID:
      publicKey = recipientId
      break
    case ID_PROVIDER_SKYDB:
      publicKey = recipientId
      break
    case ID_PROVIDER_BLOCKSTACK:
    default:
      const profile = await lookupProfile(
        sharedWithObj[recipientId].userid,
        BLOCKSTACK_CORE_NAMES
      )
      publicKey = profile?.appsMeta?.[document.location.origin]?.publicKey
  }
  sharedSkylinkIdxObj.skhubIdList = skylinkList
  const encSharedSkylinkIdxObj = await encryptContent(
    session,
    JSON.stringify(sharedSkylinkIdxObj),
    {
      publicKey,
    }
  )
  const SHARED_SKYLINK_IDX_FILEPATH = recipientPathPrefix + SKYLINK_IDX_FILEPATH
  await putFileForShared(
    session,
    SHARED_SKYLINK_IDX_FILEPATH,
    encSharedSkylinkIdxObj
  )
}
// update Skylink sharing with new Skylink list (Added/deleted)
export const bsSetSharedSkylinkIdxV2 = async (
  session,
  recipientId,
  skylinkList,
  sharedWithObj
) => {
  const sharedSkylinkIdxObj = createSkylinkIdxObject()
  // const recipientPathPrefix = SHARED_PATH_PREFIX + recipientId + "/";
  let publicKey
  const sessionType = getUserSessionType(session)
  switch (sessionType) {
    case ID_PROVIDER_SKYID:
      publicKey = recipientId
      break
    case ID_PROVIDER_SKYDB:
      publicKey = recipientId
      break
    case ID_PROVIDER_BLOCKSTACK:
    default:
      const profile = await lookupProfile(
        sharedWithObj[recipientId].userid,
        BLOCKSTACK_CORE_NAMES
      )
      publicKey = profile?.appsMeta?.[document.location.origin]?.publicKey
  }
  sharedSkylinkIdxObj.skhubIdList = skylinkList
  const encSharedSkylinkIdxObj = await encryptContent(
    session,
    JSON.stringify(sharedSkylinkIdxObj),
    {
      publicKey,
    }
  )
  // await putFileForShared(session, SKYLINK_IDX_FILEPATH, encSharedSkylinkIdxObj);
  return [SKYLINK_IDX_FILEPATH, encSharedSkylinkIdxObj]
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

// this method is not required anymore
export const bsUnshareSpaceFromRecipientLst = async (
  session,
  recipientIdStrgLst,
  skyspaceName,
  sharedWithObj
) => {
  const promises = []
  const rslt = recipientIdStrgLst?.map((recipientIdStrg) => {
    promises.push(
      getStorageIds(session, sharedWithObj[recipientIdStrg].userid)
        .then((storageObj) => storageObj.remoteUserStorage)
        .then((recipientStorage) => {
          const recipientPathPrefix = `${SHARED_PATH_PREFIX + recipientStorage}/`
          const SHARED_SKYSPACE_FILEPATH = `${
            recipientPathPrefix + SKYSPACE_PATH + skyspaceName
          }.json`
          return deleteFile(session, SHARED_SKYSPACE_FILEPATH)
        })
        .then(
          () =>
            bsShareSkyspaceV2(
              session,
              sharedWithObj[recipientIdStrg].spaces,
              sharedWithObj[recipientIdStrgLst].userid
            ),
          sharedWithObj
        )
    )
  })
  await Promise.all(promises)
}

// const getBlockStackIdList = (sharedWithObjKeyLst) => sharedWithObjKeyLst.map(sharedWithObjKey=> props.sharedWithObj[sharedWithObjKey].userid);
// This method is getting called from share-skyspace.Modal
export const bsShareSkyspace = async (
  session,
  skyspaceList,
  recipientId,
  sharedWithObj
) => {
  // let recipientId;
  let key
  const sessionType = getUserSessionType(session)
  switch (sessionType) {
    // in case of SkyDB and SkyID, recipientId is publick Key. In case of blockstack its UserID
    case ID_PROVIDER_SKYID:
      // recipientId = blockstackId;
      key = recipientId
      break
    case ID_PROVIDER_SKYDB:
      // recipientId = blockstackId;
      key = recipientId
      break
    case ID_PROVIDER_BLOCKSTACK:
    default:
      // blockstackId='block_antares_va.id.blockstack';
      const profile = await lookupProfile(recipientId, BLOCKSTACK_CORE_NAMES)
      // const key = await fetch(`${GAIA_HUB_URL}/${recipientId}/${PUBLIC_KEY_PATH}`).then(res=>res.json());
      key = profile?.appsMeta?.[document.location.origin]?.publicKey
      const recipientIdStr = profile?.appsMeta?.[document.location.origin]?.storage
        ?.replace(GAIA_HUB_URL, "")
        ?.replace("/", "")
      recipientId = recipientIdStr?.replace("/", "")
      if (key == null || recipientId == null) {
        console.log("User not setup for skyspace")
        throw "User not setup for skyspace"
      }
  }
  if (sharedWithObj == null) {
    sharedWithObj = (await bsGetSharedWithObj(session)) || {}
  }
  sharedWithObj[recipientId] = sharedWithObj[recipientId] ?? {}
  sharedWithObj[recipientId].userid = recipientId
  sharedWithObj[recipientId].spaces = sharedWithObj[recipientId].spaces ?? []
  sharedWithObj[recipientId].skylinks = sharedWithObj[recipientId].skylinks ?? []
  const recipientPathPrefix = `${SHARED_PATH_PREFIX + recipientId}/`
  sharedWithObj[recipientId].spaces = [
    ...new Set([...sharedWithObj[recipientId].spaces, ...skyspaceList]),
  ]

  const sharedSkyspaceIdxObj = createSkySpaceIdxObject()
  sharedSkyspaceIdxObj.skyspaceList = sharedWithObj[recipientId].spaces
  const encSharedSkyspaceIdxObj = await encryptContent(
    session,
    JSON.stringify(sharedSkyspaceIdxObj),
    { publicKey: key }
  )
  const SHARED_SKYSPACE_IDX_FILEPATH = recipientPathPrefix + SKYSPACE_IDX_FILEPATH
  await putFileForShared(
    session,
    SHARED_SKYSPACE_IDX_FILEPATH,
    encSharedSkyspaceIdxObj
  )

  const promises = []
  const skhubIdList = []
  skyspaceList.map((skyspaceName) => {
    const SHARED_SKYSPACE_FILEPATH = `${
      recipientPathPrefix + SKYSPACE_PATH + skyspaceName
    }.json`
    promises.push(
      getSkySpace(session, skyspaceName)
        .then((skyspaceObj) => {
          skhubIdList.push(...skyspaceObj.skhubIdList)
          return encryptContent(session, JSON.stringify(skyspaceObj), {
            publicKey: key,
          })
        })
        .then((encSkyspaceObj) =>
          putFileForShared(session, SHARED_SKYSPACE_FILEPATH, encSkyspaceObj)
        )
    )
  })
  await Promise.all(promises)

  sharedWithObj[recipientId].skylinks = [
    ...new Set([...sharedWithObj[recipientId].skylinks, ...skhubIdList]),
  ]

  const sharedSkylinkIdxObj = createSkylinkIdxObject()
  sharedSkylinkIdxObj.skhubIdList = sharedWithObj[recipientId].skylinks
  const encSharedSkylinkIdxObj = await encryptContent(
    session,
    JSON.stringify(sharedSkylinkIdxObj),
    { publicKey: key }
  )
  const SHARED_SKYLINK_IDX_FILEPATH = recipientPathPrefix + SKYLINK_IDX_FILEPATH
  await putFileForShared(
    session,
    SHARED_SKYLINK_IDX_FILEPATH,
    encSharedSkylinkIdxObj
  )

  promises.length = 0
  ;[...new Set([...skhubIdList])].map((skhubId) => {
    const SHARED_SKYLINK_PATH = `${
      recipientPathPrefix + SKYLINK_PATH + skhubId
    }.json`
    promises.push(
      getSkylink(session, skhubId)
        .then((skylink) =>
          encryptContent(session, JSON.stringify(skylink), { publicKey: key })
        )
        .then((encSkylink) =>
          putFileForShared(session, SHARED_SKYLINK_PATH, encSkylink)
        )
    )
  })
  await Promise.all(promises)
  // once all the files are shared with recipent, update loggedIn users shared list
  await bsSaveSharedWithObj(session, sharedWithObj)
  // call data sync
}
// const getBlockStackIdList = (sharedWithObjKeyLst) => sharedWithObjKeyLst.map(sharedWithObjKey=> props.sharedWithObj[sharedWithObjKey].userid);
// This method is getting called from share-skyspace.Modal

// This is design improvement version where only one SkyDB entry is used per user.
export const bsShareSkyspaceV2 = async (
  session,
  skyspaceList,
  recipientId,
  sharedWithObj
) => {
  const sharedSpaceMasterList = {}
  const sharedSpacesDataKey4Recipient = SHARED_PATH_PREFIX + recipientId
  // let recipientId;
  let key
  const sessionType = getUserSessionType(session)
  switch (sessionType) {
    // in case of SkyDB and SkyID, recipientId is publick Key. In case of blockstack its UserID
    case ID_PROVIDER_SKYID:
      // recipientId = blockstackId;
      key = recipientId
      break
    case ID_PROVIDER_SKYDB:
      // recipientId = blockstackId;
      key = recipientId
      break
    case ID_PROVIDER_BLOCKSTACK:
    default:
      // blockstackId='block_antares_va.id.blockstack';
      const profile = await lookupProfile(recipientId, BLOCKSTACK_CORE_NAMES)
      // const key = await fetch(`${GAIA_HUB_URL}/${recipientId}/${PUBLIC_KEY_PATH}`).then(res=>res.json());
      key = profile?.appsMeta?.[document.location.origin]?.publicKey
      const recipientIdStr = profile?.appsMeta?.[document.location.origin]?.storage
        ?.replace(GAIA_HUB_URL, "")
        ?.replace("/", "")
      recipientId = recipientIdStr?.replace("/", "")
      if (key == null || recipientId == null) {
        console.log("User not setup for skyspace")
        throw "User not setup for skyspace"
      }
  }
  if (sharedWithObj == null) {
    sharedWithObj = (await bsGetSharedWithObj(session)) || {}
  }
  sharedWithObj[recipientId] = sharedWithObj[recipientId] ?? {}
  sharedWithObj[recipientId].userid = recipientId
  sharedWithObj[recipientId].spaces = sharedWithObj[recipientId].spaces ?? []
  sharedWithObj[recipientId].skylinks = sharedWithObj[recipientId].skylinks ?? []
  // const recipientPathPrefix = SHARED_PATH_PREFIX + recipientId + "/";
  sharedWithObj[recipientId].spaces = [
    ...new Set([...sharedWithObj[recipientId].spaces, ...skyspaceList]),
  ]

  const sharedSkyspaceIdxObj = createSkySpaceIdxObject()
  sharedSkyspaceIdxObj.skyspaceList = sharedWithObj[recipientId].spaces
  const encSharedSkyspaceIdxObj = await encryptContent(
    session,
    JSON.stringify(sharedSkyspaceIdxObj),
    { publicKey: key }
  )
  // const SHARED_SKYSPACE_IDX_FILEPATH = recipientPathPrefix + SKYSPACE_IDX_FILEPATH;
  // await putFileForShared(session, SHARED_SKYSPACE_IDX_FILEPATH, encSharedSkyspaceIdxObj);
  sharedSpaceMasterList[SKYSPACE_IDX_FILEPATH] = encSharedSkyspaceIdxObj

  const promises = []
  const skhubIdList = []
  skyspaceList.map((skyspaceName) => {
    // const SHARED_SKYSPACE_FILEPATH = recipientPathPrefix + SKYSPACE_PATH + skyspaceName + '.json';
    const SHARED_SKYSPACE_FILEPATH = `${SKYSPACE_PATH + skyspaceName}.json`
    promises.push(
      getSkySpace(session, skyspaceName)
        .then((skyspaceObj) => {
          skhubIdList.push(...skyspaceObj.skhubIdList)
          return encryptContent(session, JSON.stringify(skyspaceObj), {
            publicKey: key,
          })
        })
        .then((encSkyspaceObj) => {
          // putFileForShared(session, SHARED_SKYSPACE_FILEPATH, encSkyspaceObj);
          sharedSpaceMasterList[SHARED_SKYSPACE_FILEPATH] = encSkyspaceObj
        })
    )
  })
  await Promise.all(promises)

  sharedWithObj[recipientId].skylinks = [
    ...new Set([...sharedWithObj[recipientId].skylinks, ...skhubIdList]),
  ]

  const sharedSkylinkIdxObj = createSkylinkIdxObject()
  sharedSkylinkIdxObj.skhubIdList = sharedWithObj[recipientId].skylinks
  const encSharedSkylinkIdxObj = await encryptContent(
    session,
    JSON.stringify(sharedSkylinkIdxObj),
    { publicKey: key }
  )
  // const SHARED_SKYLINK_IDX_FILEPATH = recipientPathPrefix + SKYLINK_IDX_FILEPATH;
  // await putFileForShared(session, SHARED_SKYLINK_IDX_FILEPATH, encSharedSkylinkIdxObj);
  sharedSpaceMasterList[SKYLINK_IDX_FILEPATH] = encSharedSkylinkIdxObj

  promises.length = 0
  ;[...new Set([...skhubIdList])].map((skhubId) => {
    const SHARED_SKYLINK_PATH = `${SKYLINK_PATH + skhubId}.json`
    promises.push(
      getSkylink(session, skhubId)
        .then((skylink) =>
          encryptContent(session, JSON.stringify(skylink), { publicKey: key })
        )
        .then((encSkylink) => {
          // putFileForShared(session, SHARED_SKYLINK_PATH, encSkylink);
          sharedSpaceMasterList[SHARED_SKYLINK_PATH] = encSkylink
        })
    )
  })
  await Promise.all(promises)

  await putFileForShared(
    session,
    sharedSpacesDataKey4Recipient,
    sharedSpaceMasterList
  )
  // once all the files are shared with recipent, update loggedIn users shared list
  await bsSaveSharedWithObj(session, sharedWithObj)
  // call data sync
}
