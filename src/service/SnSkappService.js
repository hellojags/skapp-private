import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { getPortalUrl } from "../service/skynet-api";
import {
  getJSONfromIDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKAPP_AGGREGATED_DATA,
  setJSONinIDB,
} from "../service/SnIndexedDB";
import {
  ANONYMOUS,
  DK_AGGREGATED_PUBLISHED_APPS,
  DK_AGGREGATED_PUBLISHED_APPS_STATS,
  DK_AGGREGATED_USERIDS,
  DK_HOSTED_APPS,
  DK_INSTALLED_APPS,
  DK_PUBLISHED_APPS,
  EVENT_APP_ACCESSED,
  EVENT_APP_FAVORITE,
  EVENT_APP_FAVORITE_REMOVED,
  EVENT_APP_INSTALLED,
  EVENT_APP_LIKED,
  EVENT_APP_LIKED_REMOVED,
  EVENT_APP_UNINSTALLED,
  EVENT_APP_VIEWED,
  EVENT_PUBLISHED_APP,
  BROWSER_STORAGE
} from "../utils/SnConstants";
import {
  getFile_MySky,
  getProfileDAC,
  getSocialDAC,
  getUserID,
  putFile_MySky,
  getSkappDAC,
  getEntryLink,
  getSkylinkUrl,
  setDataLink
} from "./skynet-api";
import { emitEvent } from "./SnSkyMQEventEmitter";
import {
  getFile,
  getFile_SkyDB,
  getProviderKeysByType,
  getRegistryEntry,
  getRegistryEntryURL,
  setRegistryEntry,
  uploadFile,
  snKeyPairFromSeed
} from "./SnSkynet";
var _ = require("lodash");

// TODO: implement actual logic
function generateSkappId(prop) {
  return uuidv4();
}
// Provider Type: GEQ Provider, Aggregator, Validator, Moderator, Blocklist Manager
// This JS file will list app methods consumed by components

// ### User Profile Functionality ###
// null or publicKey
// export const getProfile = async () => {
//   try {
//     //set options
//     const profileDAC = await getProfileDAC();
//     //return await getFile_MySky("userProfile", { skydb: true })?.data
//     const userID = await getUserID()
//     return await profileDAC.getProfile(userID);
//     //return JSON.parse(BROWSER_STORAGE.getItem('userProfile'));
//   }
//   catch (e) {
//     console.log("profileDAC.getProfile : failed =" + e)
//     return null;
//   }
//   // getFile_MySky( "userProfile", { skydb: true })
// }

export const getProfile = async (userID) => {
  try {
    let profile = null;
    //set options
    const profileDAC = await getProfileDAC();
    //return await getFile_MySky("userProfile", { skydb: true })?.data
    if (userID == null || userID === undefined) {
      //If userID is null or empty
      const myUserId = await getUserID();
      profile = await profileDAC.getProfile(myUserId);
      profile["userID"] = myUserId;
    } else {
      profile = await profileDAC.getProfile(userID);
      profile["userID"] = userID;
    }

    //console.log("############# getProfile" + JSON.stringify(profile))
    return profile;
    //return JSON.parse(BROWSER_STORAGE.getItem('userProfile'));
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const getDomains = async (userID) => {
  try {
    const domains = await BROWSER_STORAGE.getItem('domains');
    return domains ? JSON.parse(domains) : [];
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const deleteDomain = async (index) => {
  try {
    const domains = await getDomains();
    domains.splice(index, 1);
    if (domains) {
      await BROWSER_STORAGE.setItem('domains', JSON.stringify(domains));
    } else {
      await BROWSER_STORAGE.removeItem('domains');
    }
    return domains ? domains : [];
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const editDomain = async (payload) => {
  try {

    const domains = await getDomains();
    domains[payload.index] = payload.domain;
    await BROWSER_STORAGE.setItem('domains', JSON.stringify(domains));
    return domains;

  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const setDomain = async (domain) => {
  try {
    //set options
    const domains = await getDomains();
    if (domains) {
      domains.push(domain);
    } else {
      domains = [];
      domains.push(domain);
    }
    await BROWSER_STORAGE.setItem('domains', JSON.stringify(domains));
    return domains;
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};


export const getStorages = async (userID) => {
  try {
    const storages = await BROWSER_STORAGE.getItem('storages');
    return storages ? JSON.parse(storages) : [];
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const deleteStorage = async (index) => {
  try {
    const storages = await getStorages();
    storages.splice(index, 1);
    if (storages) {
      await BROWSER_STORAGE.setItem('storages', JSON.stringify(storages));
    } else {
      await BROWSER_STORAGE.removeItem('storages');
    }
    return storages ? storages : [];
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const editStorage = async (payload) => {
  try {

    const storages = await getStorages();
    storages[payload.index] = payload.storage;
    await BROWSER_STORAGE.setItem('storages', JSON.stringify(storages));
    return storages;

  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};

export const setStorage = async (storage) => {
  try {
    //set options
    const storages = await getStorages();
    if (storages) {
      storages.push(storage);
    } else {
      storages = [];
      storages.push(storage);
    }
    await BROWSER_STORAGE.setItem('storage', JSON.stringify(storages));
    return storages;
  } catch (e) {
    console.log("profileDAC.getProfile : failed =" + e);
    return null;
  }
  // getFile_MySky( "userProfile", { skydb: true })
};



export const setProfile = async (profileJSON) => {
  //set options
  //const resultObj = await putFile_MySky("userProfile", profileJSON, { skydb: true });
  //BROWSER_STORAGE.setItem('userProfile', JSON.stringify(profileJSON));
  let resultObj = null;
  try {
    const profileDAC = await getProfileDAC();
    resultObj = await profileDAC.setProfile(profileJSON);
    const profile = await getProfile();
    console.log("profileDAC.setProfile : After write : =" + profile);
    // const contentDAC = await getContentDAC();
    // await contentDAC.recordNewContent({skylink: resultObj.dataLink,metadata: { contentType: "userprofile", action: "update" },});
    return profileJSON;
  } catch (e) {
    console.log("profileDAC.setProfile : failed =" + e);
  }
  return {};
  // await putFile_MySky("userProfile", profileJSON, { skydb: true });
};

export const getPreferences = async () => {
  //set options
  //return JSON.parse(BROWSER_STORAGE.getItem('userPreferences'));
  // return await getFile_MySky( "userPreferences", { skydb: true })
  try {
    //set options
    const profileDAC = await getProfileDAC();
    //return await getFile_MySky("userProfile", { skydb: true })?.data
    const userID = await getUserID();
    return await profileDAC.getPreferences(userID);
    //return JSON.parse(BROWSER_STORAGE.getItem('userProfile'));
  } catch (e) {
    console.log("profileDAC.getPreferences : failed =" + e);
    return null;
  }
};
export const setPreferences = async (preferencesJSON) => {
  let resultObj = null;
  try {
    const profileDAC = await getProfileDAC();
    //set options
    resultObj = await profileDAC.setPreferences(preferencesJSON);
    // const contentDAC = await getContentDAC();
    // await contentDAC.recordNewContent({skylink: resultObj.dataLink,metadata: { contentType: "preferences", action: "update" },});
    return preferencesJSON;
  } catch (e) {
    console.log("profileDAC.setPreferences : failed =" + e);
  }
  return {};
};
// ### Following/Followers Functionality ###

export const getFollowingForUser = async (userID) => {
  let followingList = [];
  try {
    const socialDAC = await getSocialDAC();
    followingList = await socialDAC.getFollowingForUser(userID);
    console.log(`getFollowingForUser : ${userID} : ` + followingList?.length);
    // try {
    //     // const contentDAC = await getContentDAC();
    //     // await contentDAC.recordNewContent({ skylink: resultObj.dataLink, metadata: { "contentType": "following", "action": "add" } });
    //  } catch (e) {
    //   console.log("contentDAC.recordNewContent : failed =" + e)
    // }
  } catch (e) {
    console.log("Exception : getFollowingForUser() " + e);
  }
  return followingList;
};

export const getFollowingCountForUser = async (userID) => {
  let followingCount = 0;
  try {
    const socialDAC = await getSocialDAC();
    const userId = userID ?? (await getUserID());
    console.log("getFollowingCountForUser:userId" + userId);
    console.log("getFollowingCountForUser:socialDAC" + socialDAC);
    followingCount = await socialDAC.getFollowingCountForUser(userId);
    console.log("getFollowingCountForUser" + followingCount);
    // try {
    //     // const contentDAC = await getContentDAC();
    //     // await contentDAC.recordNewContent({ skylink: resultObj.dataLink, metadata: { "contentType": "following", "action": "add" } });
    //  } catch (e) {
    //   console.log("contentDAC.recordNewContent : failed =" + e)
    // }
  } catch (e) {
    console.log("getFollowingCountForUser: failed =" + e)
    return followingCount;
  }
  return followingCount;
};

export const follow = async (userID) => {
  const socialDAC = await getSocialDAC();
  const res = await socialDAC.follow(userID);
  console.log(`Success: ${res.success}`);
  console.log(`Error (if unsuccessful): ${res.error}`);
  return res;
};
export const unfollow = async (userID) => {
  const socialDAC = await getSocialDAC();
  const res = await socialDAC.unfollow(userID ?? (await getUserID()));
  console.log(`Success: ${res.success}`);
  console.log(`Error (if unsuccessful): ${res.error}`);
  return res;
}; // ### Published Apps Functionality ###
export const getPublishedApp = async (appId) => {
  const skappDAC = await getSkappDAC();
  let publishedAppJSON = await skappDAC.getPublishedApps([appId]);
  //let publishedAppJSON = await getJSONfromIDB(appId, { store: IDB_STORE_SKAPP, });
  return publishedAppJSON[0];
};

export const getMyPublishedApps = async () => {
  //let publishedAppsMap = new Map();
  let publishedAppsMap = [];
  try {
    const skappDAC = await getSkappDAC();
    publishedAppsMap = await skappDAC.getPublishedApps([]);
  } catch (err) {
    console.log(err);
    return publishedAppsMap;
  }
  return publishedAppsMap;
}

//TODO: need to work on it
export const getPublishedAppsCount = async () => {
  let count = 0;
  try {
    const skappDAC = await getSkappDAC();
    if (skappDAC) {
      count = await skappDAC.getPublishedAppsCount();
    }
  }
  catch (e) {
    console.log("Exception : getPublishedAppsCount() " + e);
    return 0;
  }
  return count;
}
// TODO: Since we are getting this value from DAC, Remove below method
export const getUsersPublishedAppsCount = async (userID) => {
  let count = 0;
  try {
    const skappDAC = await getSkappDAC();
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ skappDAC: " +skappDAC);
    let appCountsByAppId = await skappDAC.getPublishedAppsCountByUserIds([userID]);
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UserId: " +userID+" getUsersPublishedAppsCount() " + JSON.stringify(appCountsByAppId) );
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UserId: " +userID+" App Count : " +appCountsByAppId[userID] ); 
    count = appCountsByAppId[userID] ?? 0;

  }
  catch (e) {
    console.log("Exception : getPublishedAppsCount() " + e);
    return 0;
  }
  return count;
};
export const publishApp = async (appJSON) => {
  const skappDAC = await getSkappDAC();
  let result = await skappDAC.publishApp(appJSON.id, appJSON);
  // Emit Event
  try {
    await emitEvent(await getUserID(), appJSON.id, EVENT_PUBLISHED_APP);
  } catch (e) {
    console.log("emitEvent failed: e" + e);
  }
  // Write to contentDAC
  try {
    // const contentDAC = await getContentDAC();
    // await contentDAC.recordNewContent({ skylink: resultObj.dataLink, metadata: {contentType: "skapp", contentSubType: "publishedApp",skappID: appJSON.id,action: "created", },});
    // await contentDAC.recordNewContent({
    //   skylink: resultObj.dataLink,
    //     metadata: {
    //     contentType: "skapp",
    //       contentSubType: "publishedApp",
    //         skappID: appJSON.id,
    //           action: "updated",
    //       },
    // });
  } catch (e) {
    console.log("content record failed: e" + e);
  }
  const publishedAppsMap = await getMyPublishedApps();
  return publishedAppsMap;
};

export const republishApp = async (appJSON) => {
  let { data: publishedAppsIdList } = await getFile_MySky(DK_PUBLISHED_APPS, {
    store: IDB_STORE_SKAPP,
  });
  // check if appid is present in publishedAppsIdList.
  if (publishedAppsIdList && !publishedAppsIdList.includes(appJSON.id)) {
    // update Index value
    // update existing published app
    // add additional logic to link previously published App
    const skappDAC = await getSkappDAC();
    let { data, dataLink } = await skappDAC.publishApp(appJSON.id, appJSON);
    try {
      // const contentDAC = await getContentDAC();
      // await contentDAC.recordNewContent({
      //   skylink: resultObj.dataLink,
      //     metadata: {
      //     contentType: "skapp",
      //       contentSubType: "publishedApp",
      //         skappID: appJSON.id,
      //           action: "updated",
      //     },
      // });
    } catch (e) {
      console.log("content record failed: e" + e);
    }
    try {
      await emitEvent(await getUserID(), appJSON.id, EVENT_PUBLISHED_APP);
    } catch (e) {
      console.log("emitEvent failed: e" + e);
    }
    //await addToSkappUserFollowing(userPubKey);
    //await addToSharedApps(userPubKey, appJSON.id);
  } else {
    console.log(
      "app is not published. first publish app, then only you can EDIT app"
    );
  }
  const publishedAppsMap = await getMyPublishedApps();
  return publishedAppsMap;
};
export const installApp = async (appJSON) => {
  let { data: installedAppsIdList } = await getFile_MySky(DK_INSTALLED_APPS, {
    store: IDB_STORE_SKAPP,
  });
  let firstTime = false;
  if (installedAppsIdList) {
    //app should not already be installed
    if (!installedAppsIdList.includes(appJSON.id)) {
      installedAppsIdList.push(appJSON.id);
      firstTime = true;
    } else {
      const installedAppsMap = await getMyInstalledApps();
      //await addToSkappUserFollowing(userPubKey);
      //await addToSharedApps(userPubKey, appJSON.id);
      return installedAppsMap;
    }
  } else {
    installedAppsIdList = [appJSON.id];
  }
  // update Index value
  await putFile_MySky(DK_INSTALLED_APPS, installedAppsIdList, {
    store: IDB_STORE_SKAPP,
  });
  // update existing published app
  // add additional logic to link previously published App

  const resultObj = await putFile_MySky(`${appJSON.id}#installed`, appJSON, {
    store: IDB_STORE_SKAPP,
  });
  try {
    // const contentDAC = await getContentDAC();
    // await contentDAC.recordNewContent({
    //   skylink: resultObj.dataLink,
    //     metadata: {
    //     contentType: "skapp",
    //       contentSubType: "pinned",
    //         skappID: appJSON.id,
    //           action: "created",
    //     },
    // });
  } catch (e) {
    console.log("content record failed: e" + e);
  }
  try {
    await emitEvent(await getUserID(), appJSON.id, EVENT_APP_INSTALLED);
  } catch (e) {
    console.log("emitEvent failed: e" + e);
  }
  const installedAppsMap = await getMyInstalledApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return installedAppsMap;
};

export const uninstallApp = async (appId) => {
  let { data: installedAppsIdList } = await getFile_MySky(DK_INSTALLED_APPS, {
    store: IDB_STORE_SKAPP,
  });
  if (installedAppsIdList) {
    //app should already be installed for uninstall
    if (installedAppsIdList.includes(appId)) {
      installedAppsIdList.splice(installedAppsIdList.indexOf(appId), 1);
      //set updated list
      await putFile_MySky(DK_INSTALLED_APPS, installedAppsIdList, {
        store: IDB_STORE_SKAPP,
      });
      // update existing published app
      // add additional logic to link previously published App// set empty value
      const resultObj = await putFile_MySky(
        `${appId}#installed`,
        {},
        { store: IDB_STORE_SKAPP }
      );
      try {
        // const contentDAC = await getContentDAC();
        // await contentDAC.recordNewContent({
        //   skylink: resultObj.dataLink,
        //     metadata: {
        //     contentType: "skapp",
        //       contentSubType: "pinned",
        //         skappID: appId,
        //           action: "removed",
        //     },
        // });
      } catch (e) {
        console.log("content record failed: e" + e);
      }
      try {
        await emitEvent(await getUserID(), appId, EVENT_APP_UNINSTALLED);
      } catch (e) {
        console.log("emitEvent failed: e" + e);
      }
    }
  }
  const installedAppsMap = await getMyInstalledApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return installedAppsMap;
};

export const getMyInstalledApps = async () => {
  //let publishedAppsMap = new Map();
  let installedAppsMap = [];
  try {
    let { data: installedAppsIdList } = await getFile_MySky(DK_INSTALLED_APPS, {
      store: IDB_STORE_SKAPP,
    });
    if (installedAppsIdList) {
      await Promise.all(
        installedAppsIdList.map(async (appId) => {
          const resultObj = await getFile_MySky(`${appId}#installed`, {
            store: IDB_STORE_SKAPP,
          });
          installedAppsMap.push(resultObj.data);
          try {
            // const contentDAC = await getContentDAC();
            // await contentDAC.recordInteraction({
            //   skylink: resultObj.dataLink,
            //     metadata: {
            //     contentType: "skapp",
            //       contentSubType: "pinned",
            //         skappID: appId,
            //           action: "view",
            //     },
            // });
          } catch (e) {
            console.log("content record failed: e" + e);
          }
        })
      );
      console.log("getMyInstalledAppsMap: " + installedAppsMap);
    }
  } catch (err) {
    console.log(err);
    return installedAppsMap;
  }
  return installedAppsMap;
};

export const setAppStatsEvent = async (statsEventType, appId) => {
  let resultObj = null;
  const skappDAC = await getSkappDAC();
  try {
    // const contentDAC = await getContentDAC();
    switch (statsEventType) {
      case EVENT_APP_VIEWED:
        resultObj = await skappDAC.viewedApp(appId);
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "viewed",
          //     },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_ACCESSED:
        resultObj = await skappDAC.accessedApp(appId);
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "accessed",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_LIKED:
        resultObj = await skappDAC.likeApp(appId);
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "liked",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_LIKED_REMOVED:
        resultObj = await skappDAC.unlikeApp(appId);
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "unliked",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_FAVORITE:
        resultObj = await skappDAC.favouriteApp(appId);
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "favorite",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_FAVORITE_REMOVED:
        resultObj = await skappDAC.unfavouriteApp(appId);
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "unfavorite",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_INSTALLED:
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "pinned",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      case EVENT_APP_UNINSTALLED:
        try {
          // await contentDAC.recordInteraction({
          //   skylink: resultObj?.dataLink,
          //     metadata: {
          //     contentType: "skapp",
          //       contentSubType: "published",
          //         skappID: appId,
          //           action: "unpinned",
          //             },
          // });
        } catch (e) {
          console.log("content record failed: e" + e);
        }
        break;
      default:
        console.log("In Dafault loop: " + statsEventType);
        break;
    }
    // TODO: need to remove this call and get result in actual action call above.
    resultObj = await skappDAC.getSkappStats(appId)
    // EMIT EVent on GEQ
    try {
      await emitEvent(await getUserID(), appId, statsEventType);
    } catch (e) {
      console.log("emitEvent failed: e" + e);
    }
  } catch (err) {
    console.log(err);
    return resultObj;
  }
  return resultObj;
};

// pass list of appIds to get AppStats. Fav, Viewed, liked, accessed
export const getAppStats = async (appId) => {
  const skappDAC = await getSkappDAC();
  let resultObj = await skappDAC.getSkappStats(appId);
  try {
    // const contentDAC = await getContentDAC();
    // await contentDAC.recordInteraction({
    //   skylink: resultObj.dataLink,
    //     metadata: {
    //     contentType: "skapp",
    //       contentSubType: "published",
    //         skappID: appId,
    //           action: "statsViewed",
    //     },
    // });
  } catch (e) {
    console.log("content record failed: e" + e);
  }
  //let appStatsList = (resultObj?.data?.stats ?? "0#0#0#0#0").split("#");
  return resultObj;
};

// get apps comments -
export const setAppComment = async (appId, comment) => {
  let commentObj = {
    timestamp: new Date(),
    comment,
  };
  let appCommentsJSON = await getJSONfromIDB(`${appId}#appComments`, {
    store: IDB_STORE_SKAPP,
  });
  if (appCommentsJSON === null) {
    //If null or empty
    // TODO: create and return new empty stats object
  }
  appCommentsJSON.content.comments.push(commentObj);
  const resultObj = await setJSONinIDB(`${appId}appComments`, appCommentsJSON, {
    store: IDB_STORE_SKAPP,
  });
  try {
    // const contentDAC = await getContentDAC();
    // await contentDAC.recordNewContent({
    //   skylink: resultObj.dataLink,
    //     metadata: {
    //     contentType: "skapp",
    //       contentSubType: "comments",
    //         skappID: appId,
    //           action: "created",
    //     },
    // });
  } catch (e) {
    console.log("content record failed: e" + e);
  }
};

// pass list of appIds to get App Comments.
export const getAppComments = async (appId) => {
  let appCommentsJSON = await getJSONfromIDB(`${appId}#appComments`, {
    store: IDB_STORE_SKAPP,
  });
  return appCommentsJSON;
};

//action for upload videos and images
export const UploadAppLogo = async (
  file,
  setLogoUploaded,
  logoLoaderHandler
) => {
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

export const UploadVideoAction = async (
  file,
  thumb,
  getUploadedFile,
  videoUploadLoader
) => {
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
export const getMyAppStore = () => { };

// Returns all Apps data(JSON) from "Skapp Developer"
export const getDefaultAppStore = () => { };

// ### Hosting Functionality ###

export const getMyHostedApps = async (appIds) => {
  const hostedAppIdList = { appIdList: [], appDetailsList: {} };
  try {
    const skappDAC = await getSkappDAC();
    let { data } = await skappDAC.getDeployedApps(appIds);
    data.forEach(deployedAppObj => {
      hostedAppIdList.appIdList.push(deployedAppObj.id);
      hostedAppIdList.appDetailsList[deployedAppObj.id] = deployedAppObj;
    });
    return hostedAppIdList;
  } catch (err) {
    console.log(err);
    return hostedAppIdList;
  }
};
export const getMyHostedApps_beforeDAC = async (appIds) => {
  const hostedAppIdList = { appIdList: [], appDetailsList: {} };
  try {
    if (appIds == null || appIds.length === 0) {
      let { data } = await getFile_MySky(DK_HOSTED_APPS, {
        store: IDB_STORE_SKAPP,
      });
      hostedAppIdList.appIdList = data;
      appIds = appIds?.length === 0 ? data : appIds;
    }
    appIds?.length > 0 &&
      (await Promise.all(
        appIds.map(async (appId) => {
          const resultObj = await getFile_MySky(`${appId}#hosted`, {
            store: IDB_STORE_SKAPP,
          });
          hostedAppIdList.appDetailsList[appId] = resultObj.data;
          try {
            // const contentDAC = await getContentDAC();
            // await contentDAC.recordInteraction({
            //   skylink: resultObj.dataLink,
            //     metadata: {
            //     contentType: "skapp",
            //       contentSubType: "hosted",
            //         skappID: appId,
            //           action: "viewed",
            //     },
            // });
          } catch (e) {
            console.log("content record failed: e" + e);
          }
        })
      ));
    return hostedAppIdList;
  } catch (err) {
    console.log(err);
  }
};

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
    previousApp = (await getMyHostedApps([previousId])).appDetailsList[
      previousId
    ];
    appVersion = parseInt(previousApp.version) + 1;
    history = { ...previousApp.content.history, ...history };
  }
  const hostedAppJSON = {
    $type: "skapp",
    $subType: "hosted",
    createdTs: previousApp ? previousApp.createdTs : ts,
    id,
    version: appVersion,
    prevSkylink: previousApp ? previousApp.content.skylink : null,
    content: {
      ...appJSON,
      history,
    },
    ts,
  };
  //alert("previousId" + previousId);
  // const resultObj = await putFile_MySky(`${id}#hosted`, hostedAppJSON, {
  //   store: IDB_STORE_SKAPP,
  // });
  const skappDAC = await getSkappDAC();
  let { data, dataLink } = await skappDAC.deployApp(hostedAppJSON.id, hostedAppJSON);

  try {
    // const contentDAC = await getContentDAC();
    // const status = await contentDAC.recordNewContent({
    //   skylink: resultObj.dataLink,
    //   metadata: {
    //     contentType: "skapp",
    //     contentSubType: "hosted",
    //     skappID: appJSON.id,
    //     action: "created",
    //   },
    // });
  } catch (e) {
    console.log("content record failed: e" + e);
  }
  // if (previousId === "" || previousId === null || previousId === undefined) {
  //   //alert("adding in array" + previousId);
  //   await putFile_MySky(DK_HOSTED_APPS, [...hostedAppIdList, id], {
  //     store: IDB_STORE_SKAPP,
  //   });
  // }
  return hostedAppJSON;
};

export const deleteMyHostedApp = async (appId) => {
  let status = false;
  try {
    const hostedAppIdList = (await getMyHostedApps())?.appIdList || [];
    hostedAppIdList.splice(hostedAppIdList.indexOf(appId), 1);
    const resultObj = await putFile_MySky(
      `${appId}#hosted`,
      {},
      { store: IDB_STORE_SKAPP }
    );
    try {
      // const contentDAC = await getContentDAC();
      // await contentDAC.recordNewContent({
      //   skylink: resultObj.dataLink,
      //     metadata: {
      //     contentType: "skapp",
      //       contentSubType: "hosted",
      //         skappID: appId,
      //           action: "removed",
      //     },
      // });
    } catch (e) {
      console.log("content record failed: e" + e);
    }
    await putFile_MySky(DK_HOSTED_APPS, [...hostedAppIdList], {
      store: IDB_STORE_SKAPP,
    });
    status = true;
  } catch (e) {
    console.log("deleteMyHostedApp : Error deleting  = " + appId);
  }
  return status;
};

//set HNS Entry. Everytime app is deployed this method must be called. else handshake name wont be updated with new skylink
export const setHNSEntry = (hnsName, skylink) => { };

//get HNS URL for TXT record
//export const getHNSSkyDBURL = (hnsName) => getRegistryEntryURL(getUserPublicKey(), hnsName);
export const getHNSSkyDBURL = async (hnsName, dataLink) => {
  let pathUrl = "";
  try {
    //Example: "domain-dac/sites/skyspaces.hns";
    const path = 'domain-dac/sites/' + hnsName;
    const v2 = await getEntryLink(path);// from path its going to give Dynamic link URL. Registry pointer. Skylink V2
    console.log('getEntryLink :: ', v2);
    pathUrl = await getSkylinkUrl(v2, { subdomain: true });
    console.log('pathUrl', pathUrl);
    //set V2 Skylink
    await setDataLink(path, dataLink);
    console.log('wrote', path, dataLink);
  }
  catch (e) {
    console.log("Exception while setting dataLink value in SkyDB daatKey" + e);
    return pathUrl;
  }
  return pathUrl;
}

export const initializeLocalDatabaseFromBackup = async () => {
  try {
  } catch (e) { }
};

export const backupLocalDatabaseOnSkyDB = async () => {
  try {
  } catch (e) { }
};

// export const getUserProfile = async (userSession) => {
//   await userProfileDacTest(userSession)
//   /// LoadDac
//   // let profileJSON = await getFile(session, SKYID_PROFILE_PATH);
//   let userProfileObj = createDummyUserProfileObject();
//   //userProfileObj.userID = userID;
//   //await getContentDAC().recordNewContent({skylink: resultObj.dataLink,metadata: {"contentType":"skapp","contentSubType":"hosted","skappID":appJSON.id,"action":"removed"}});
//   //TODO: KUSHAL - call userprofile DAC

//   //const response = await getFile(session.mySky.userID, SKYID_PROFILE_PATH, { skydb: true })
//   // if (response == "" || response == undefined) {
//   //   // file not found
//   //   console.log("Profile not found;, please check your connection and retry")
//   // } else {
//   //   // success
//   //   //let temp = JSON.stringify(response);
//   //   let skyIdProfileObj = JSON.parse(response);
//   //   const { publicKey, privateKey } = snKeyPairFromSeed(session.skyid.seed)
//   //   personObj = {
//   //     masterPublicKey: session.skyid.userId, // public key derived from "master seed". we pull profile using this public key
//   //     appSeed: session.skyid.seed, // App specific seed derived from "Master Seed"
//   //     appId: session.skyid.appId,
//   //     appImg: session.skyid.appImg,
//   //     appPublicKey: publicKey,
//   //     appPrivateKey: privateKey,
//   //     profile: {
//   //       username: skyIdProfileObj.username, // user name is associated with master Key
//   //       did: skyIdProfileObj.username, // this is place holder for Decentralized Id (DID)
//   //       aboutme: skyIdProfileObj.aboutMe,
//   //       location: skyIdProfileObj.location,
//   //       avatar: skyIdProfileObj.avatar,
//   //       profilePicture: skyIdProfileObj.profilePicture,
//   //     },
//   //   }
//   // }
//   return userProfileObj
// }

//#################### SkyDB Methods #########################
// After SKAPP DAC is integrated, move this methods to DAC setter and getter methods
//########################################################
export const getAllPublishedApps = async (sortOn, orderBy, resultCount) => {
  console.log(
    " ########################### getAllPublishedApps : sortOn " +
    sortOn +
    " : orderBy " +
    orderBy
  );
  const skappDAC = await getSkappDAC();
  // TODO: Check Sorting in App stats first and then load remaining appIDs
  //let publishedAppsMap = new Map();
  let allPublishedApps = [];
  let appIdList = [];
  try {
    //get curator followings (list of userIDs)
    //TODO: Remove curator hard coding
    const userIdList = await getFollowingForUser("724ac6e7e628c79efb647102910a294c04c963641c9aafed8a8b7937c0915237");
    console.log('------userIdList-------------' + userIdList);
    // get {userId: AppIdsArray} MAP
    const appIdListByUserId = await skappDAC.getPublishedAppsByUserIds(userIdList);
    console.log('------appIdListByUserId-------------' + appIdListByUserId);
    //if appID list is not empty. Get AppDetails for each AppId from above step
    // Example: {"userId1" : [appId1, appId2, appId3...], "userId2": [appId4, appId5,....]}
    let appInfoArray = []
    //Below is working but returning array of array instead of oen dimentional array
    // const appInfoPromisesArray = Object.entries(appIdListByUserId).map(async ([userId, appIdList]) => {
    //   console.log(`userId ${userId} : appIdList ${appIdList}`);
    //   // get all promises and resolve it
    //    // for each appId pull apps data, TODO: Introduce pagination here. pull only 12/16 AppData at a time
    //   const promisesArray = appIdList.map(async (appId) => {
    //   return skappDAC.getPublishedAppDetailsByUserId(userId, appId)
    //   });
    //   return await Promise.all(promisesArray);
    //   //appIdList.push(value);
    // });
    const appInfoPromisesArray = Object.entries(appIdListByUserId).map(async ([userId, appIdList]) => {
      console.log(`userId ${userId} : appIdList ${appIdList}`);
      // get all promises and resolve it
      // for each appId pull apps data, TODO: Introduce pagination here. pull only 12/16 AppData at a time
      for (const appId of appIdList) {
        return skappDAC.getPublishedAppDetailsByUserId(userId, appId);
      }
    });
    appInfoArray = await Promise.all(appInfoPromisesArray);
    console.log('------appIdList-------------' + JSON.stringify(appInfoArray));


    // update appdata with aggregated values
    // Move appStats fetching logic here from Individual cards
    for (let i = 0; i < appInfoArray.length; i++) {
      let appInfoObj = appInfoArray[i];
      console.log('------appInfoObj-------------' + JSON.stringify(appInfoObj));
      if (appInfoObj) {
        // TODO: get aggregated Stats from aggregator
        appInfoObj.content.appstats = {
          views: 100,
          access: 200,
          likes: 300,
          favorites: 400,
          installed: 500,
        };
        allPublishedApps.push(appInfoObj);// push AppInfo Object to JSON
      }
    }
    // Set iteratees for Sort operation
    let iteratees = (obj) => -obj.content.appstats.access;
    switch (sortOn) {
      case "VIEWS":
        iteratees = (obj) =>
          orderBy === "ASC"
            ? obj.content.appstats.views
            : -obj.content.appstats.views;
        break;
      case "ACCESS":
        iteratees = (obj) =>
          orderBy === "ASC"
            ? obj.content.appstats.access
            : -obj.content.appstats.access;
        break;
      case "LIKES":
        iteratees = (obj) =>
          orderBy === "ASC"
            ? obj.content.appstats.likes
            : -obj.content.appstats.likes;
        break;
      case "FAVORITES":
        iteratees = (obj) =>
          orderBy === "ASC"
            ? obj.content.appstats.favorites
            : -obj.content.appstats.favorites;
        break;
      default:
        iteratees = (obj) => -obj.content.appstats.views;
        console.log("In Dafault sorting 'Views Desc' ");
        break;
    }
    //actual sort operation
    allPublishedApps = _.orderBy(allPublishedApps, iteratees);
    if (resultCount && resultCount != 0) {
      allPublishedApps = allPublishedApps.slice(0, resultCount);
    }
  } catch (err) {
    console.log("Error in getAllPublishedApps : " + err);
    return allPublishedApps;
  }
  return allPublishedApps;
};

export const getAggregatedAppStatsByAppId = async (appId) => {
  // Get Data from IDX-DB
  let appStatsObj = await getRegistryEntry(
    getProviderKeysByType("AGGREGATOR").publicKey,
    `${appId}#stats`
  );
  // let appStatsObj = await getJSONfromIDB(`${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, });
  let appStatsList = (appStatsObj?.data ?? "0#0#0#0#0").split("#"); // View#access#likes#fav
  // try {
  //   // const contentDAC = await getContentDAC();
  //   // await contentDAC.recordInteraction({skylink: resultObj.dataLink,metadata: {"contentType":"skapp","contentSubType":"published","skappID":appJSON.id,"action":"viewed"}});
  // }
  // catch (e) {
  //   console.log("content record failed: e" + e)
  // }
  return appStatsList;
};

export const getAggregatedAppStats = async (appIds) => {
  let appStatsList = { appIdList: [], appStatsList: {} };
  // get all appId from PublishedApp
  try {
    // we can improve here by pagination
    // Fetch all AppStats
    // ******* ### TODO: here we can directly pull from SkyDB ********
    appStatsList = await getFile(null, DK_AGGREGATED_PUBLISHED_APPS_STATS, {
      store: IDB_STORE_SKAPP_AGGREGATED_DATA,
      publicKey: getProviderKeysByType("AGGREGATOR").publicKey,
    });

    // if (appIds == null || appIds.length === 0) {
    //   let publishedAppsIdList = await getFile(null, DK_AGGREGATED_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });
    //   //let {data} = await getFile_MySky(DK_AGGREGATED_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
    //   appStatsList.appIdList = publishedAppsIdList;
    //   appIds = appIds?.length === 0 ? publishedAppsIdList : appIds;
    // }
    // appIds?.length > 0 && await Promise.all(appIds.map(async (userIDAndAppId) => {
    //   let temp = userIDAndAppId.split('#'); //userID#appId
    //   const aggStatsByAppID = await getFile(null, temp[1] + "#stats", { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });
    //   //appStatsList.appStatsList[temp[1]] = (await getFile_MySky( `${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA }))?.data;
    //   appStatsList.appStatsList[temp[1]] = aggStatsByAppID;
    // }));
    return appStatsList;
  } catch (err) {
    console.log(err);
    return;
  }
};

const test_user_ids = [
  "570980a7f24391a9ced450cd8f22a9d78229c650ad24b7c2686b5bb86915418e",
  "3d4e50cfe857d94403c21f38be21073ecc42c7c828101e26c7628fd0b6fad67f",
  "8b8544d54ecf56da6be887232361eec9f524429c1bd523f4778b20fb9945d15c",
  "d21eb9d8d38e7b495cc47b94a046eab710edf7f1b19d42d5f1b201feb3406a2a",
  "22f91386b2e341edb046ff880a2e817b3b70fdd958113dc93b9b1375880dd5d2",
  "c25858373033e730a5e592cb5fd5b5fa90657da06210886c1f30552796973cb9",
  "73a83de68f07d77a75f3e8d7534f58c2d0a613aeffa2ec4f53238ee5af5a3379",
  "4294b7224a3d19a75abf7970f1bf3213c0370ea36d36a689cbd39e53333ec7f4",
  "5dc982eed6290fbe02f7781ec92051ef12e835a0565885eacfc94a9ee07686f0",
  "b85e1cd34633297d6004446f935d220918a8e2c5b98a5f5cc32c3c6c93f72d6b",
  "2b02efca9ed51cfed5c645eb3c1513d9343207a9e843454de72771e57c805d48",
  "403a35ed6b473518a213d514c3d105471d4bb454b67e4c4db106f061c13cb9a3",
  "dfa6e4e25be41cfe27a4457fab9a162db425cc7d230ff14370f9ae2a86f3a0ec",
  "c4b99808f188174c54edcc3cb1f2b864966911f15682d6fcdf728657c7813a30",
  "ce2df8006eb4a0179a5b1f85a59688b3749bffca91984614b40454dfa7ce3d3c",
];

export const getAggregatedUserIDs = async (pageNumber) => {
  const { data: aggregatedUserIDs } = await getFile_SkyDB(
    getProviderKeysByType("AGGREGATOR").publicKey,
    DK_AGGREGATED_USERIDS
  );
  aggregatedUserIDs.push(...test_user_ids);
  console.log(
    "###########################  aggregatedUserIDs = " +
    aggregatedUserIDs.length
  );
  return aggregatedUserIDs; // list of userIDs
};
// ### Apps Stats and comments Functionality ###

export const getUsersPublishedApps = async (userID) => {
  //let publishedAppsMap = new Map();
  let publishedAppsMap = [];
  try {
    let { data: publishedAppsIdList } = await getFile_MySky(DK_PUBLISHED_APPS, {
      userID,
      store: IDB_STORE_SKAPP,
    });
    if (publishedAppsIdList) {
      await Promise.all(
        publishedAppsIdList.map(async (appId) => {
          const resultObj = await getFile_MySky(appId, {
            userID,
            store: IDB_STORE_SKAPP,
          });
          publishedAppsMap.push(resultObj.data);
          try {
            // const contentDAC = await getContentDAC();
            // await contentDAC.recordInteraction({ skylink: resultObj.dataLink, metadata: { "contentType": "skapp", "contentSubType": "publishedApp", "skappID": appId, "action": "view" } });
          } catch (e) {
            console.log("content record failed: e" + e);
          }
        })
      );
      //console.log("getMyPublishedApps: " + publishedAppsMap);
    }
  } catch (err) {
    console.log(err);
    return publishedAppsMap;
  }
  return publishedAppsMap;
};

export const transformImageUrl = (siaUrl) => {
  if (!siaUrl) return "";

  const regex = /sia:\/?\/?(.*)$/;
  const urlPart = siaUrl?.match(regex)[1];

  let skyUrl = getPortalUrl() + `${urlPart}`;
  return skyUrl;
};

export const getGithubUrl = (list = []) => {
  let gitID = "";

  if (!list) return gitID;

  list.map((item) => {
    if (Object.keys(item)[0] === "github") gitID = item.github;
    return item;
  });

  return gitID;
};

export const setComment = async (comment) => {
  const commentString = JSON.stringify(comment);
  localStorage.setItem(comment.id, commentString);
};

export const getComment = async (appId) => {
  const commentString = localStorage.getItem(appId);
  if (commentString) {
    return JSON.parse(commentString);
  } else return [];
};

export const deleteComment = async (commentIndex) => { };
