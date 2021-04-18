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
  USERSETTINGS_FILEPATH,
  DK_HOSTED_APPS,
  DK_PUBLISHED_APPS,
  DK_INSTALLED_APPS,
  SKAPP_FOLLOWING_FILEPATH,
  SKAPP_SHARED_APPS_FILEPATH,
  SKAPP_SHARED_APPS_KEY_SEPERATOR,
  EVENT_PUBLISHED_APP,
  EVENT_APP_VIEWED,
  EVENT_APP_ACCESSED,
  EVENT_APP_LIKED,
  EVENT_APP_LIKED_REMOVED,
  EVENT_APP_FAVORITE,
  EVENT_APP_FAVORITE_REMOVED,
  EVENT_APP_COMMENT,
  FAVORITE_REMOVED,
  EVENT_APP_INSTALLED,
  EVENT_APP_UNINSTALLED,
  ANONYMOUS,
} from '../utils/SnConstants';
import {
  getAllItemsFromIDB,
  getJSONfromIDB,
  setAllinIDB,
  setJSONinIDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKAPP_AGGREGATED_DATA,
} from "../service/SnIndexedDB"
import { getUserPublicKey, getUserPrivateKey, getProviderKeysByType, uploadFile, getRegistryEntry, putFile, getFile, snKeyPairFromSeed, getRegistryEntryURL, setRegistryEntry } from './SnSkynet'
import { INITIAL_SKYDB_OBJ } from '../utils/SnNewObject'
import store from "../redux"
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { emitEvent } from "./SnSkyMQEventEmitter";
var _ = require('lodash');

// TODO: implement actual logic
function generateSkappId(prop) {
  return uuidv4();
}
// Provider Type: GEQ Provider, Aggregator, Validator, Moderator, Blocklist Manager
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

export const getPublishedApp = async (appId) => {
  let publishedAppJSON = await getJSONfromIDB(appId, { store: IDB_STORE_SKAPP, });
  return publishedAppJSON;
}

export const getAllPublishedApps = async (sortOn, orderBy, resultCount) => {
  //let publishedAppsMap = new Map();
  let allPublishedApps = [];
  try {
    let publishedAppsIdList = await getFile(getProviderKeysByType("AGGREGATOR").publicKey, DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
    if (publishedAppsIdList) {
      await Promise.all(publishedAppsIdList.map(async (pubkeyAndAppId) => {
        let temp = pubkeyAndAppId.split('#'); //userPubkey#appId
        let appJSON = await getFile(temp[0], temp[1], { store: IDB_STORE_SKAPP_AGGREGATED_DATA })
        if (appJSON) { // if no appJSON found in user SkyDB, skip and move on to next appId
          // Read appStats from Aggregator Storage and update AppJSON
          let appStats = "0#0#0#0";
          let appStatsList = [];
          try {
            let tempEntry = await getRegistryEntry(getProviderKeysByType("AGGREGATOR").publicKey, temp[1] + "#stats");
            appStats = tempEntry ? tempEntry.data : "0#0#0#0";
            appStatsList = appStats.split('#');
            // View#access#likes#fav
            appJSON.content.appstats = { views: parseInt(appStatsList[0]), access: parseInt(appStatsList[1]), likes: parseInt(appStatsList[2]), favorites: parseInt(appStatsList[3]) };
          } catch (e) {
            console.log("getAllPublishedApps: e" + e);
          }
          allPublishedApps.push(appJSON);
        }
      }));
      // Sort list by specific parameter
      let iteratees = obj => -obj.content.appstats.views;
      switch (sortOn) {
        case "VIEWS":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.views : -obj.content.appstats.views;
          break;
        case "ACCESS":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.access : -obj.content.appstats.access;
          break;
        case "LIKES":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.likes : -obj.content.appstats.likes;
          break;
        case "FAVORITES":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.favorites : -obj.content.appstats.favorites;
          break;
        default:
          iteratees = obj => -obj.content.appstats.views;
          console.log("In Dafault sorting 'Views Desc' ");
          break;
      }
      allPublishedApps = _.orderBy(allPublishedApps, iteratees)
      if (resultCount && resultCount != 0) {
        allPublishedApps = allPublishedApps.slice(0, resultCount);
      }
      console.log("allPublishedApps: " + allPublishedApps);
    }
  } catch (err) {
    console.log(err);
    return allPublishedApps;
  }
  return allPublishedApps;
}
export const getMyPublishedApps = async () => {
  //let publishedAppsMap = new Map();
  let publishedAppsMap = [];
  try {
    let publishedAppsIdList = await getFile(getUserPublicKey(), DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
    if (publishedAppsIdList) {
      await Promise.all(publishedAppsIdList.map(async (appId) => {
        publishedAppsMap.push((await getFile(getUserPublicKey(), appId, { store: IDB_STORE_SKAPP })));
      }));
      console.log("getMyPublishedApps: " + publishedAppsMap);
    }
  } catch (err) {
    console.log(err);
    return publishedAppsMap;
  }
  return publishedAppsMap;
}

//Update published app and returns list of all Published apps by loggedin User.
export const publishApp = async (appJSON) => {
  let publishedAppsIdList = await getFile(getUserPublicKey(), DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
  if (publishedAppsIdList) {
    publishedAppsIdList.push(appJSON.id);
  }
  else {
    publishedAppsIdList = [appJSON.id];
  }
  // update Index value
  await putFile(getUserPublicKey(), DK_PUBLISHED_APPS, publishedAppsIdList, { store: IDB_STORE_SKAPP });
  // update existing published app
  // add additional logic to link previously published App
  await putFile(getUserPublicKey(), appJSON.id, appJSON, { store: IDB_STORE_SKAPP })
  await emitEvent(appJSON.id, EVENT_PUBLISHED_APP);
  const publishedAppsMap = await getMyPublishedApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return publishedAppsMap;
}

export const installApp = async (appJSON) => {
  let publishedAppsIdList = await getFile(getUserPublicKey(), DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
  if (publishedAppsIdList) {
    publishedAppsIdList.push(appJSON.id);
  }
  else {
    publishedAppsIdList = [appJSON.id];
  }
  // update Index value
  await putFile(getUserPublicKey(), DK_INSTALLED_APPS, publishedAppsIdList, { store: IDB_STORE_SKAPP });
  // update existing published app
  // add additional logic to link previously published App
  await putFile(getUserPublicKey(), appJSON.id, appJSON, { store: IDB_STORE_SKAPP })
  await emitEvent(appJSON.id, EVENT_APP_INSTALLED);
  const publishedAppsMap = await getMyPublishedApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return publishedAppsMap;
}

// export const addToSkappUserFollowing = async (userPublicKey) => {
//   if (userPublicKey) {
//     let skappFollowingPublicKeyLst = await getFile(getSkappKeys().publicKey, SKAPP_FOLLOWING_FILEPATH, { store: IDB_STORE_SKAPP });
//     skappFollowingPublicKeyLst = skappFollowingPublicKeyLst || [];
//     if (!skappFollowingPublicKeyLst.includes(userPublicKey)) {
//       skappFollowingPublicKeyLst.push(userPublicKey);
//       await putFile(getSkappKeys().publicKey, SKAPP_FOLLOWING_FILEPATH, skappFollowingPublicKeyLst, { store: IDB_STORE_SKAPP, privateKey: getSkappKeys().privateKey })
//     }
//   }
// }

export const newSharedAppValObj = () => {
  return {
    viewCount: 0,
    visitCount: 0
  }
}

// export const addToSharedApps = async (userPublicKey, appId) => {
//   if (userPublicKey && appId) {
//     let sharedAppListObj = await getFile(getSkappKeys().publicKey, SKAPP_SHARED_APPS_FILEPATH, { store: IDB_STORE_SKAPP });
//     sharedAppListObj = sharedAppListObj || {};
//     const currAppKey = appId + SKAPP_SHARED_APPS_KEY_SEPERATOR + userPublicKey;
//     if (!Object.keys(sharedAppListObj).includes(currAppKey)) {
//       sharedAppListObj[currAppKey] = newSharedAppValObj();
//       await putFile(getSkappKeys().publicKey, SKAPP_SHARED_APPS_FILEPATH, sharedAppListObj, { store: IDB_STORE_SKAPP, privateKey: getSkappKeys().privateKey });
//     }
//   }
// }

// ### Apps Stats and comments Functionality ###
export const setAppStatsEvent = async (statsEventType, appId) => {
  let appStatsStr = "0#0#0#0"; // View#access#likes#fav
  let publicKey = getUserPublicKey() ?? ANONYMOUS;
  let appStatsList = null;
  try {
    // Get Data from IDX-DB
    //appStatsJSON = await getFile(getUserPublicKey(),`${appId}#stats`, { store: IDB_STORE_SKAPP, });
    if (publicKey != ANONYMOUS) {
      // STEP1: get current value from Users Storage
      let appStatsEntry = await getRegistryEntry(getUserPublicKey(), `${appId}#stats`, { store: IDB_STORE_SKAPP, });
      appStatsStr = appStatsEntry?.data ?? "0#0#0#0";// View#access#likes#fav
    }
    appStatsList = appStatsStr.split('#');
    switch (statsEventType) {
      case EVENT_APP_VIEWED:
        appStatsList[0] = parseInt(appStatsList[0]) + 1;
        break;
      case EVENT_APP_ACCESSED:
        appStatsList[1] = parseInt(appStatsList[1]) + 1;
        break;
      case EVENT_APP_LIKED:
        appStatsList[2] = 1;
        break;
      case EVENT_APP_LIKED_REMOVED:
        appStatsList[2] = 0;
        break;
      case EVENT_APP_FAVORITE:
        appStatsList[3] = 1;
        break;
      case EVENT_APP_FAVORITE_REMOVED:
        appStatsList[3] = 0;
        break;
      default:
        console.log("In Dafault loop: " + statsEventType)
        break;
    }
    if (publicKey != ANONYMOUS) {
      await setRegistryEntry(`${appId}#stats`, appStatsList.join("#"), { store: IDB_STORE_SKAPP, });
    }
    await emitEvent(appId, statsEventType);
    // if (statsType === LIKES) {
    //   appStatsJSON.content.liked = value;
    //   await setRegistryEntry(`${appId}#${LIKES}`, value, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_LIKED)
    // } if (statsType === FAVORITE) {
    //   appStatsJSON.content.favorite = value;
    //   await setRegistryEntry(`${appId}#${FAVORITE}`, value, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_FAVORITE)
    // } if (statsType === VIEW_COUNT) {
    //   appStatsJSON.content.viewed++;
    //   let entry = await getRegistryEntry(getUserPublicKey(), `${appId}#${VIEW_COUNT}`, {});
    //   await setRegistryEntry(`${appId}#${VIEW_COUNT}`, parseInt(entry?.data ?? "0") + 1, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_VIEWED)
    // } if (statsType === ACCESS_COUNT) {
    //   appStatsJSON.content.accessed++;
    //   let entry = await getRegistryEntry(getUserPublicKey(), `${appId}#${ACCESS_COUNT}`, {});
    //   await setRegistryEntry(`${appId}#${ACCESS_COUNT}`, parseInt(entry?.data ?? "0") + 1, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_ACCESSED)
    // }
    // update IDX-DB with new value
    // await putFile(getUserPublicKey(), `${appId}#stats`, appStatsJSON, { store: IDB_STORE_SKAPP })
    //.then(() => {
    // pushRoute(url);
  } catch (err) {
    console.log(err);
    return appStatsList;
  }
  return appStatsList;
}
// pass list of appIds to get AppStats. Fav, Viewed, liked, accessed
export const getAppStats = async (appId) => {
  // Get Data from IDX-DB
  //let appStatsObj = await getJSONfromIDB(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
  // let appStatsStr = (appStatsObj && appStatsObj[1]) ?? "0#0#0#0"
  // let appStatsList = appStatsStr.split("#"); // View#access#likes#fav

  let appStatsObj = await getRegistryEntry(getUserPublicKey(), `${appId}#stats`);
  let appStatsList = (appStatsObj?.data ?? "0#0#0#0").split("#");
  return appStatsList;
}

export const getAggregatedAppStatsByAppId = async (appId) => {
  // Get Data from IDX-DB
  let appStatsObj = await getRegistryEntry(getProviderKeysByType("AGGREGATOR").publicKey, `${appId}#stats`);
  // let appStatsObj = await getJSONfromIDB(`${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, });
  let appStatsList = (appStatsObj?.data ?? "0#0#0#0").split("#"); // View#access#likes#fav
  return appStatsList;
}

// need to optimize below method
export const getAggregatedAppStats = async (appIds) => {
  // get all appId from PublishedApp
  // Fetch all AppStats

  const appStatsList = { appIdList: [], appStatsList: {} }
  try {
    if (appIds == null || appIds.length === 0) {
      const data = await getFile(getUserPublicKey(), DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
      appStatsList.appIdList = data;
      appIds = appIds?.length === 0 ? data : appIds;
    }
    appIds?.length > 0 && await Promise.all(appIds.map(async (appId) => {
      appStatsList.appStatsList[appId] = (await getFile(getUserPublicKey(), `${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA }));
    }));
    return appStatsList;
  } catch (err) {
    console.log(err);
  }
}

// get apps comments - 
export const setAppComment = async (appId, comment) => {
  let commentObj = {
    timestamp: new Date(),
    comment,
  };
  let appCommentsJSON = await getJSONfromIDB(`${appId}#appComments`, { store: IDB_STORE_SKAPP, });
  if (appCommentsJSON === null) { //If null or empty
    // TODO: create and return new empty stats object
  }
  appCommentsJSON.content.comments.push(commentObj);
  await setJSONinIDB(`${appId}appComments`, appCommentsJSON, { store: IDB_STORE_SKAPP });
}

// pass list of appIds to get App Comments.
export const getAppComments = async (appId) => {
  let appCommentsJSON = await getJSONfromIDB(`${appId}#appComments`, { store: IDB_STORE_SKAPP, });
  return appCommentsJSON;
}

//action for upload videos and images
export const UploadAppLogo = async (file, setLogoUploaded, logoLoaderHandler) => {
  try {
    const getCompressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 256,
      useWebWorker: true,
    });
    const skylinkForCompressed = await uploadFile(getCompressed);
    const skylink = await uploadFile(file);

    let obj = {
      thumbnail: skylinkForCompressed.skylink,
      image: skylink.skylink,
    };
    setLogoUploaded(obj);
    logoLoaderHandler(false);
  } catch (err) {
    logoLoaderHandler(false);
  }
};

export const UploadImagesAction = async (file, getUploadedFile, getFun) => {
  try {
    const getCompressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 256,
      useWebWorker: true,
    });

    const skylinkForCompressed = await uploadFile(getCompressed);

    const skylink = await uploadFile(file);

    let obj = {
      thumbnail: skylinkForCompressed.skylink,
      image: skylink.skylink,
    };

    getUploadedFile(obj);
    getFun(false);
  } catch (err) {
    getFun(false);
    console.log(err);
  }
};

export const UploadVideoAction = async (file, thumb, getUploadedFile, videoUploadLoader) => {
  try {
    const skylinkForCompressed = await uploadFile(thumb);

    const skylink = await uploadFile(file);

    let obj = {
      thumbnail: skylinkForCompressed.skylink,
      video: skylink.skylink,
    };

    getUploadedFile(obj);
    videoUploadLoader(false);
  } catch (err) {
    videoUploadLoader(false);
    console.log(err);
  }
};

// ### AppStore Functionality ###

// Returns all Apps data(JSON) from List of Devs I am Following
export const getMyAppStore = () => { }

// Returns all Apps data(JSON) from "Skapp Developer"
export const getDefaultAppStore = () => { }

// ### Hosting Functionality ###

// get my all hosted apps. Returns List of JSONS
/**
 * 
 * @param { Array } appIds[] Optional. Do not pass argument to get only the list of IDs. Pass a blank array to get list of all hosted apps. 
 * Pass array with values in it get app list of the provided hosted apps.
 * 
 *
 */
export const getMyHostedApps = async (appIds) => {
  const hostedAppIdList = { appIdList: [], appDetailsList: {} }
  try {
    if (appIds == null || appIds.length === 0) {
      const data = await getFile(getUserPublicKey(), DK_HOSTED_APPS, { store: IDB_STORE_SKAPP });
      hostedAppIdList.appIdList = data;
      appIds = appIds?.length === 0 ? data : appIds;
    }
    appIds?.length > 0 && await Promise.all(appIds.map(async (appId) => {
      hostedAppIdList.appDetailsList[appId] = (await getFile(getUserPublicKey(), `hosted${appId}`, { store: IDB_STORE_SKAPP }));
    }));
    return hostedAppIdList;
  } catch (err) {
    console.log(err);
  }
}

//Update published app data
export const setMyHostedApp = async (appJSON, previousId) => {

  const hostedAppIdList = (await getMyHostedApps())?.appIdList || [];
  const ts = new Date().getTime();
  let history = {};
  history[ts] = appJSON.skylink;
  const id = previousId ? previousId : generateSkappId();
  let appVersion = "1";
  let previousApp;
  if (previousId) {
    previousApp = (await getMyHostedApps([previousId])).appDetailsList[previousId];
    appVersion = parseInt(previousApp.version) + 1;
    history = { ...previousApp.content.history, ...history };
  }
  const hostedAppJSON = {
    "$type": "skapp",
    "$subType": "hosted",
    "createdTs": previousApp ? previousApp.createdTs : ts,
    id,
    "version": appVersion,
    "prevSkylink": previousApp ? previousApp.content.skylink : null,
    "content": {
      ...appJSON,
      history
    },
    ts
  };
  await putFile(getUserPublicKey(), `hosted${id}`, hostedAppJSON, { store: IDB_STORE_SKAPP });
  await putFile(getUserPublicKey(), DK_HOSTED_APPS, [...hostedAppIdList, id], { store: IDB_STORE_SKAPP });

  return hostedAppJSON;
}

//set HNS Entry. Everytime app is deployed this method must be called. else handshake name wont be updated with new skylink
export const setHNSEntry = (hnsName, skylink) => { }

//get HNS URL for TXT record
export const getHNSSkyDBURL = (hnsName) => getRegistryEntryURL(getUserPublicKey(), hnsName);


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
  const response = await getFile(session.skyid.userId, SKYID_PROFILE_PATH, { skydb: true })
  if (response == "" || response == undefined) {
    // file not found
    console.log("Profile not found;, please check your connection and retry")
  } else {
    // success
    //let temp = JSON.stringify(response);
    let skyIdProfileObj = JSON.parse(response);
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



