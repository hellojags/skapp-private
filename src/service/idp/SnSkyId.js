import { bsGetImportedSpacesObj, getUserProfile, syncData, firstTimeUserSetup } from '../SnSkappService';
import { ID_PROVIDER_SKYID } from "../../utils/SnConstants";
import { clearAllfromIDB, IDB_STORE_SKAPP } from "../SnIndexedDB"
import { useHistory } from "react-router-dom"
//Action
import { logoutPerson, setPersonGetOtherData } from "../../redux/action-reducers-epic/SnPersonAction"
import { getUserProfileAction } from "../../redux/action-reducers-epic/SnUserProfileAction"
import { getUserPreferencesAction } from "../../redux/action-reducers-epic/SnUserPreferencesAction"
import { getMyFollowersAction } from "../../redux/action-reducers-epic/SnMyFollowerAction"
import { getMyFollowingsAction } from "../../redux/action-reducers-epic/SnMyFollowingAction"
import { setUserSession } from "../../redux/action-reducers-epic/SnUserSessionAction"
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction"
//Store
import store from "../../redux"
import SkyID from "skyid";

function SkyIdHook() {
    //let history = useHistory();
    //history.push('/appdetail');
    this.props.history.push("/apps");

  }

const serialize = require("serialize-javascript");
let devMode = false;
if (window.location.hostname == 'idtest.local' || window.location.hostname == 'localhost' || window.location.protocol == 'file:') {
    devMode = true
} else {
    devMode = false
}
let skyId = new SkyID('skapp', skyidEventCallback, { devMode: process.env.NODE_ENV !== 'production' });
function skyidEventCallback(message) {
    switch (message) {
        case 'login_fail':
            console.log('Login failed')
            onSkyIdFailed(); 
            break;
        case 'login_success':
            console.log('Login succeed!')
            onSkyIdSuccess();
            break;
        case 'destroy':
            console.log('Logout succeed!');
            onSkyIdLogout();
            break;
        default:
            console.log(message)
            onSkyIdDefault(); 
            break;
    }
}
const onSkyIdLogout = async () => {
    try {
        store.dispatch(logoutPerson(null))
        clearAllfromIDB({ store: IDB_STORE_SKAPP })
        store.dispatch(setLoaderDisplay(false))
        window.location.href = window.location.origin
    } catch (e) {
        console.log("Error during logout process.")
        store.dispatch(setLoaderDisplay(false))
    }
}
const onSkyIdFailed = async () => {
    store.dispatch(setLoaderDisplay(false));
}
const onSkyIdDefault = async () => {
    store.dispatch(setLoaderDisplay(false));
}
const onSkyIdSuccess = async () => {
    try {
        // create userSession Object
        let userSession = { idp: ID_PROVIDER_SKYID, skyid: skyId };
        const personObj = await getUserProfile(userSession);// dont proceed without pulling profile
        userSession = { ...userSession, person: personObj };
        store.dispatch(setUserSession(userSession));
        // For first time user only 
        //let isFirstTime = await firstTimeUserSetup(userSession);
        //if (!isFirstTime)//if not firsttime call data sync 
        //{
            // call dataSync
            //await syncData(userSession);
        //}
        store.dispatch(setPersonGetOtherData(personObj));
        //dispatch(setImportedSpace(await bsGetImportedSpacesObj(userSession)));
        // get app profile
        store.dispatch(getUserProfileAction(userSession));
        store.dispatch(getUserPreferencesAction(userSession));
        // get userFollowers
        store.dispatch(getMyFollowersAction(null));
        // get userFollowings
        store.dispatch(getMyFollowingsAction(null));
        store.dispatch(setLoaderDisplay(false));
        //window.history.pushState({}, '', '/appdetail')

    }
    catch (error) {
        console.log("Error during login process. login failed");
        store.dispatch(setLoaderDisplay(false));
    }
}
export default skyId;