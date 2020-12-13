import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import {
  fetchApps,
  fetchSkyspaceApps,
  fetchAllSkylinks,
  fetchPublicApps,
  setApps
} from "../../reducers/actions/sn.apps.action";
import { fetchSkyspaceDetail } from "../../reducers/actions/sn.skyspace-detail.action";
import { setPublicHash } from "../../reducers/actions/sn.public-hash.action";
import { setDesktopMenuState } from "../../reducers/actions/sn.desktop-menu.action";
import { setPortalsListAction } from "../../reducers/actions/sn.portals.action";
import { setUploadList } from "../../reducers/actions/sn.upload-list.action";
import { setPublicInMemory } from "../../reducers/actions/sn.public-in-memory.action";
import { fetchSkyspaceAppCount } from "../../reducers/actions/sn.skyspace-app-count.action";

export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setLoaderDisplay,
      fetchApps: fetchApps,
      fetchSkyspaceApps,
      fetchAllSkylinks,
      fetchSkyspaceDetail,
      fetchPublicApps,
      setDesktopMenuState,
      setPortalsListAction,
      setPublicHash,
      setPublicInMemory,
      setApps,
      fetchSkyspaceAppCount,
      setUploadList
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    isShowing: state.snLoader,
    snApps: state.snApps,
    snUploadList: state.snUploadList,
    userSession: state.userSession,
    snSkyspaceList: state.snSkyspaceList,
    snSkyspaceDetail: state.snSkyspaceDetail,
    snUserSetting: state.snUserSetting,
    snPublicInMemory: state.snPublicInMemory,
    snPerson: state.person
  };
}
