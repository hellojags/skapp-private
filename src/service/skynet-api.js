import { SkynetClient } from "skynet-js";
import { ContentRecordDAC } from "@skynetlabs/content-record-library";
import { UserProfileDAC } from '@skynethub/userprofile-library';
import { SkappDAC } from '@skynethub/skapp-library';
import { SocialDAC } from "social-dac-library";
import { FeedDAC } from "feed-dac-library";
import {
    getJSONfromIDB,
    setJSONinIDB,
    IDB_STORE_SKAPP,
    IDB_STORE_SKYDB_CACHE,
} from "./SnIndexedDB"
import store from "../redux"
import { setUserSession } from "../redux/action-reducers-epic/SnUserSessionAction"

const client = new SkynetClient("https://siasky.net");
//const hostApp = "awesomeskynet.hns";
const hostApp = "localhost";


export const initMySky = async () => {

    let userSession = null
    let loggedIn = false
    try {
        // Initialize MySky.
        const mySky = await client.loadMySky(hostApp, { dev: true, debug: true });
        //const mySky = await client.loadMySky(hostApp);
        const contentDAC = new ContentRecordDAC();
        const userProfileDAC = new UserProfileDAC();
        const socialDAC = new SocialDAC();
        const feedDAC = new FeedDAC();
        const skappDAC = new SkappDAC();
        await mySky.loadDacs(contentDAC, userProfileDAC, feedDAC,socialDAC, skappDAC);
        //await mySky.loadDacs(userProfileDAC);
        // Add additional needed permissions before checkLogin.
        // Can be Permissions object or list of Permissions objects
        //await mySky.addPermissions(new Permission("requestor.hns", "domain.hns/path", PermCategory.Hidden, PermType.Write));
        // Try to login silently, requesting permissions for hostApp HNS.
        loggedIn = await mySky.checkLogin();// check if user is already logged-In
        console.log("checkLogin : loggedIn status: " + loggedIn);
        let portalUrl = await client.portalUrl();
        userSession = { mySky, dacs: { contentDAC, userProfileDAC, feedDAC, socialDAC, skappDAC} };
        //userSession = { mySky, dacs: { userProfileDAC } };
        // if not logged-in
        if (loggedIn) {
            let userID = await mySky.userID();
            userSession = { ...userSession, userID, portalUrl };
        }
        else
        {
          userSession = { ...userSession,portalUrl};
        }
    } catch (e) {
        console.error(e);
        return userSession;
    }
    return { loggedIn, userSession };
}

export const skylinkToUrl = (skyLink) => {
    let link = "";
    try {
      if (skyLink.indexOf("http://") === 0 || skyLink.indexOf("https://") === 0) {
        link = skyLink;
      } else if (skyLink.indexOf("sia://") === 0) {
        link = skyLink.replace("sia://", ""); 
      } else if (skyLink.indexOf("sia:") === 0) {
        link = skyLink.replace("sia:", "");
      }
      else
      {
        link = skyLink;
      }
      link = getPortalUrl() + link;
      return link;
    }
    catch (error) {
      console.log("skylinkToUrl() : error: " + error);
      return link;
    }
  };
export const getPortalUrl = () => {
    // let portalUrl = null;
    // try {
    //   const state = store.getState();
    //   portalUrl = state.userSession.portalUrl + "/";
    // } catch (e) {
    //   return portalUrl;
    // }
    // return portalUrl;
    return "https://siasky.dev/"
  };

export const getUserSession = async () => {
    let session = null;
    try {
        const state = store.getState();
        session = await state.userSession;
    }
    catch (e) {
        return session
    }
    return session
}


export const getUserID = async () => {
    const userSession = await getUserSession();
    return userSession?.userID ?? null
}

export const getMySky = async () => {
    const userSession = await getUserSession();
    return userSession?.mySky ?? null
}
export const getContentDAC = async () => {
    const userSession = await getUserSession();
    return userSession?.dacs?.contentDAC ?? null;
}
export const getSkappDAC = async () => {
    const userSession = await getUserSession();
    return userSession?.dacs?.skappDAC ?? null;
}
export const getProfileDAC = async () => {
    const userSession = await getUserSession();
    return userSession?.dacs?.userProfileDAC ?? null;
}

export const getFeedDAC = async () => {
    const userSession = await getUserSession();
    return userSession?.dacs?.feedDAC ?? null;
}
export const getSocialDAC = async () => {
    const userSession = await getUserSession();
    return userSession?.dacs?.socialDAC ?? null;
}
export const testUserProfile = async (contentRecord) => {
    // PREF_PATH: `${DATA_DOMAIN}/${skapp}/preferences.json`,
    // PROFILE_PATH: `${DATA_DOMAIN}/${skapp}/userprofile.json`,
    // INDEX_PROFILE: `${DATA_DOMAIN}/userprofileIndex.json`,
    // INDEX_PREFERENCE: `${DATA_DOMAIN}/preferencesIndex.json`
    try {
        //const contentRecord = getUserSession().dacs.userProfileDAC;
        let profp = await contentRecord.getProfile();// path -> skyuser.hns/index_profile.json
        console.log("original Profile", profp);
        let profile = {
            username: "c3po",
            aboutMe: "is a droid programmed for etiquette and protocol, built by the heroic Jedi Anakin Skywalker, and a constant companion to astromech R2-D2",
            location: "Tatooine",
            topics: ['War', 'Games']
        }
        console.log('In the method');
        await contentRecord.setProfile(profile);// Path -> skyuser.hns/localhost/user-profile.json 
        let prof = await contentRecord.getProfile();
        console.log("Updated Profile", prof);
        let pref = {
            darkmode: true,
            portal: "siasky.net"
        }
        await contentRecord.setPreference(pref);
        let prefr = await contentRecord.getPreference();
        console.log("preferance", prefr);
        let proHist = await contentRecord.getProfileHistory();
        console.log("profileHistory", proHist);
        let prefHist = await contentRecord.getPreferenceHistory();
        console.log("getPreferanceHistory", prefHist);
    } catch (error) {
        console.log(`error with CR DAC: ${error.message}`);
    }
}

export const getFile_MySky = async (dataKey, options) => {
    let result = null;
    try {
        // Below condition means, we are fetching other user's data
        if (options?.userID) {
            result = await client.file.getJSON(options.userID, dataKey);
        }
        else {
            let mySky = await getMySky();
            result = await mySky.getJSON(dataKey);
        }
        // TODO: decrypt method
        return result;
    } catch (error) {
        // setErrorMessage(error.message);
        console.log(`error.message ${error.message}`)
        return null;
    }
}

// sets JSON file in MySky
export const putFile_MySky = async (dataKey, content, options) => {
    try {
        // get previous skylink 
        // create linked list to track history
        if (options?.historyflag == true) {
            content.prevSkylink = getFile_MySky(dataKey)?.dataLink ?? null;
        }
        // set new data in SkyDB with
        let status = false
        // encrypt it
        if (options?.encrypt == true) {
            //const cypherContent = await encryptData(privateKey, publicKey, JSON.stringify(content))
            //status = await skynetClient.db.setJSON(privateKey, dataKey, cypherContent)
        } else {
            let mySky = await getMySky();
            const result = await mySky.setJSON(dataKey, content)
        }
        await setJSONinIDB(dataKey, content, { store: IDB_STORE_SKAPP })
        return true
    } catch (error) {
        // setErrorMessage(error.message);
        console.log(`error.message ${error.message}`)
        return false
    }
}
