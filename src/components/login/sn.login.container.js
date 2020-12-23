import { bindActionCreators } from "redux";
import { setMobileMenuDisplay,
        toggleMobileMenuDisplay 
        } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchSkyspaceList } from "../../reducers/actions/sn.skyspace-list.action";
import { toggleDesktopMenuDisplay, setDesktopMenuState } from "../../reducers/actions/sn.desktop-menu.action";
import {setUserSession } from "../../reducers/actions/sn.user-session.action";
import { fetchBlockstackPerson,
    logoutPerson,setPerson,
    setPersonGetOtherData } from "../../reducers/actions/sn.person.action";
import { setImportedSpace } from "../../reducers/actions/sn.imported-space.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import {getUserMasterProfileAction} from "../../reducers/actions/sn.usermasterprofile.action";
import {getUserProfileAction} from "../../reducers/actions/sn.userprofile.action";
import {getMyFollowersAction} from "../../reducers/actions/sn.myFollower.action";
import {getMyFollowingsAction} from "../../reducers/actions/sn.myFollowing.action";
import {setPublicHash} from "../../reducers/actions/sn.public-hash.action";
    
export function matchDispatcherToProps(dispatcher){
    return bindActionCreators({ 
        setMobileMenuDisplay,
        setLoaderDisplay,
        toggleMobileMenuDisplay,
        setUserSession,
        setPerson,
        logoutPerson,
        setPersonGetOtherData,
        setImportedSpace,
        setPublicHash,
        toggleDesktopMenuDisplay,
        setDesktopMenuState,
        getUserProfileAction,
        getMyFollowersAction,
        getMyFollowingsAction,
        getUserMasterProfileAction
    }, dispatcher);
}

export function mapStateToProps(state) {
    return { 
        showMobileMenu: state.snShowMobileMenu,
        showDesktopMenu: state.snShowDesktopMenu,
        userSession: state.userSession,
        person: state.person,
        userProfile : state.snUserProfile
    };
}  
