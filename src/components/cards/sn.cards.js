import React from "react";
import { Redirect } from "react-router-dom";
import useStyles from "./sn.cards.styles";
import "./sn.cards.styles.css";
import FormHelperText from "@material-ui/core/FormHelperText";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import GamesOutlinedIcon from "@material-ui/icons/GamesOutlined";
import PlaylistAddOutlinedIcon from "@material-ui/icons/PlaylistAddOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import AppsIcon from "@material-ui/icons/Apps";
import ReorderIcon from "@material-ui/icons/Reorder";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import SnConfirmationModal from "../modals/sn.confirmation.modal";
import LowPriorityIcon from "@material-ui/icons/LowPriority";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PublishIcon from "@material-ui/icons/Publish";
import HeadsetIcon from "@material-ui/icons/Headset";
import { INITIAL_PORTALS_OBJ } from "../../blockstack/constants";
import SnUpload from "../new/sn.upload";
import { v4 as uuidv4 } from 'uuid';
import { SkynetClient, parseSkylink } from "skynet-js";
import { getEmptyHistoryObject, getEmptySkylinkObject } from "../new/sn.new.constants";
import BlockIcon from '@material-ui/icons/Block';
import { Button, FormControlLabel, Hidden, Switch, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Avatar from '@material-ui/core/Avatar';
import Tooltip from "@material-ui/core/Tooltip";
import { green } from "@material-ui/core/colors";
import { subtractSkapps, getPortalFromUserSetting, setTypeFromFile, getAllPublicApps } from "../../sn.util";
import SnInfoModal from "../modals/sn.info.modal";
import SnAppCard from "./sn.app-card";
import {
  ITEMS_PER_PAGE,
  getCompatibleTags,
  APP_BG_COLOR,
  DEFAULT_PORTAL,
  PUBLIC_SHARE_BASE_URL,
  PUBLIC_SHARE_ROUTE,
  PUBLIC_SHARE_APP_HASH, PUBLIC_TO_ACC_QUERY_PARAM, SKYSPACE_HOSTNAME, UPLOAD
} from "../../sn.constants";
import {
  CATEGORY_OBJ,
  getCategoryObjWithoutAll,
} from "../../sn.category-constants";
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.cards.container";
import { bsGetSkyspaceNamesforSkhubId, bsRemoveSkylinkFromSkyspaceList, bsDeleteSkylink, bsGetAllSkyspaceObj, bsfetchDefaultAppStore, bsAddToHistory, bsGetSharedSpaceAppListV2, bsAddSkylinkFromSkyspaceList, bsRemoveSkappFromSpace, bsAddSkylink, bsfetchPublisherAppList } from "../../blockstack/blockstack-api";
import SnPagination from "../tools/sn.pagination";
import { INITIAL_SETTINGS_OBJ } from "../../blockstack/constants";
import Chip from '@material-ui/core/Chip';
import UploadProgress from "../upload/UploadProgress/UploadProgress";
import { getPublicApps, getSkylinkPublicShareFile, savePublicSpace } from "../../skynet/sn.api.skynet";
import AudioPlayer from "../categories/audio/sn.audio-player";
import SnFooter from "../footer/sn.footer";
import SnViewMore from "../tools/sn.view-more";
import SnAddToSkyspaceModal from "../modals/sn.add-to-skyspace.modal";
import { async } from "rxjs";
import RecipeReviewCard from "./sn.new-app-card"
import {APPSTORE_PROVIDER_MASTER_PUBKEY, APPSTORE_PROVIDER_APP_PUBKEY} from "../../sn.constants";


const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "white",
    color: theme.palette.linksColor,
    //   border: '1px solid #ced4da',
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    //   transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    "&:focus": {
      // borderRadius: 4,
      // borderColor: '#80bdff',
      backgroundColor: "white",
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);


class SnCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goToApp: false,
      senderId: null,
      loadingAllSpacesInfo: true,
      showAddToSkyspace: false,
      showMoveToSkyspace: false,
      skyappId: "",
      skyappPublicKey: "",
      apps: [],
      allSpacesObj: null,
      error: null,
      fetchAllSkylinks: false,
      category: null,
      skyspace: null,
      searchKey: "",
      filteredApps: [],
      tagFilterList: [],
      filterCriteria: {
        searchString: "",
        page: 1,
        tagFilterList: [],
        switchFilterList: [],
      },
      isSelect: false,
      arrSelectedAps: [],
      hash: null,
      showInfoModal: false,
      showConfirmModal: false,
      infoModalContent: null,
      isDir: false,
      portalHost: "siasky.net",



      //new UI START
      activeStep: 0,
      filterSelection: "emp",
      isTrue: true,
      GridUi: false,

      //card buttons
      displayEditBtn:false,
      displayInfoBtn:false,

      //new UI END

    };
    this.openSkyApp = this.openSkyApp.bind(this);
    this.handleSrchSbmt = this.handleSrchSbmt.bind(this);
    this.handleSrchKeyChng = this.handleSrchKeyChng.bind(this);
    this.getFilteredApps = this.getFilteredApps.bind(this);
    this.uploadEleRef = React.createRef();
  }
  //new ui start
  setActiveStep = (activeStep) => this.setState({ activeStep });
  setFilterSelection = (filterSelection) => this.setState({ filterSelection });
  setGridUi = (GridUi) => this.setState({ GridUi });
  handleUploadSection = (value) => {
    this.setIsTrue(value);
  };
  handleChange = (event) => {
    this.setFilterSelection(event.target.value);
  };

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return {/* <AllSpaces /> */ };
      case 1:
        return {/* <ImagesGallery handleUploadSection={handleUploadSection} /> */ };
      case 2:
        return {/* <AudioSpaces /> */ };
      case 3:
        return {/* <EditFile /> */ };
      default:
        return "unknown step";
    }
  }
  getStepContentForList = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return {/* <AllSpacesListView /> */ };
      case 1:
        return {/* <ImagesGallery handleUploadSection={handleUploadSection} /> */ };
      case 2:
        return {/* <AudioSpacesListView /> */ };
      case 3:
        return {/* <EditFile /> */ };
      default:
        return "unknown step";
    }
  }
  //new ui end

  updateSwitches = (switchFilterList) => {
    const { filterCriteria } = this.state;
    filterCriteria.switchFilterList = switchFilterList;
    this.setState({ filterCriteria });
  };

  updateTagFilterList = (tagFilterList) => {
    const { filterCriteria } = this.state;
    filterCriteria.tagFilterList = tagFilterList;
    filterCriteria.page = 1;
    this.setState({ filterCriteria });
  };

  udpdatePage = (page) => {
    const { filterCriteria } = this.state;
    filterCriteria.page = page;
    this.setState({ filterCriteria });
  };

  handleSrchSbmt(evt) {
    evt.preventDefault();
  }

  handleSrchKeyChng(evt, val) {
    evt != null && evt.preventDefault();
    const { filterCriteria } = this.state;
    filterCriteria.page = 1;
    this.setState({
      searchKey: evt != null ? evt.target.value : val,
      filterCriteria,
    });
  }

  searchFilter(skyApp, searchKey) {
    if (searchKey && searchKey.trim() !== "") {
      for (const skyAppKey in skyApp) {
        if (
          skyApp[skyAppKey] &&
          skyApp[skyAppKey].toLowerCase().equals(searchKey.toLowerCase())
        ) {
          return skyApp;
        }
      }
    } else {
      return skyApp;
    }
  }

  openSkyApp(skapp) {
    const category = this.state.category;
    const skyspace = this.state.skyspace;
    let skyappId = "";
    let skyappPublicKey="";
    if (category != null && category.trim() !== "") {
      skyappId = skapp.id;
      skyappPublicKey = skapp.appPublicKey;
    } else if (
      (skyspace != null && skyspace.trim() !== "") ||
      this.state.fetchAllSkylinks
    ) {
      skyappId = skapp.skhubId;
      skyappPublicKey = skapp.appPublicKey;
    }
    else
    {
      skyappId = skapp.skhubId;
      skyappPublicKey = skapp.appPublicKey;
    }

    this.setState({
      goToApp: true,
      skyappId: encodeURIComponent(skyappId),
      skyappPublicKey,
    });
  }

  getSearchKeyFromQuery = () => {
    const pathSrch = this.props.location.search;
    return decodeURIComponent(pathSrch.replace("?query=", ""));
  };

  getCategoryWiseCount = () => {
    const categoryCountObj = {};
    this.props.snApps?.length > 0 && this.props.snApps.forEach((app) => {
      if (app) {
        categoryCountObj[app.type] = categoryCountObj[app.type]
          ? categoryCountObj[app.type] + 1
          : 1;
      }
    });
    return categoryCountObj;
  };

  async getAppList(category, skyspace, fetchAllSkylinks, hash) {
    const senderId = this.getSenderId();
    category != null && this.props.fetchApps(category);
    if (skyspace != null) {
      if (senderId != null) {
        this.props.setLoaderDisplay(true);
        //const appListFromSharedSpace = await bsGetSharedSpaceAppList(this.props.userSession, decodeURIComponent(senderId), skyspace);
        let appListFromSharedSpace =[];
        if(senderId === "myappstore")
        {
          appListFromSharedSpace = await bsfetchPublisherAppList();
        }
        else if(senderId === "appstore")
        {
          // Default AppProvider publickey hard coded.
          // appListFromSharedSpace =await bsfetchDefaultAppStore("a625dbfa6bcb973f49b366b5ef6dd1b745dc6c97971f0e80d6d69e6122a6e26e");
          //appListFromSharedSpace =await bsfetchDefaultAppStore("f9ab764658a422c061020ca0f15048634636c6000f7f884b16fafe5552d2de08");
          appListFromSharedSpace =await bsfetchDefaultAppStore(APPSTORE_PROVIDER_MASTER_PUBKEY);
        }
        this.props.setLoaderDisplay(false);
        this.props.setApps(appListFromSharedSpace);
      } else {
        this.props.fetchSkyspaceApps({
          session: this.props.userSession,
          skyspace: skyspace,
        });
      }
    }
    if (hash != null) {
      this.props.setDesktopMenuState(false);
      this.props.setPortalsListAction(INITIAL_PORTALS_OBJ);
      this.props.fetchPublicApps(hash);
    }

    if (fetchAllSkylinks === true) {
      this.handleSrchKeyChng(null, this.getSearchKeyFromQuery());
      this.props.fetchAllSkylinks({
        session: this.props.userSession,
      });
    } else {
      this.handleSrchKeyChng(null, "");
    }
  }

  getSenderId() {
    let senderId = null;
    if (this.props.location.pathname.indexOf("imported-spaces") > -1) {
      senderId = this.props.match.params.sender;
    }
    else if (this.props.location.pathname.indexOf("/myappstore") > -1) {
      senderId = "myappstore";
    }
    else if (this.props.location.pathname.indexOf("/appstore") > -1) {
      senderId = "appstore";
    }
    else if (this.props.location.pathname.indexOf("/public-skapps") > -1) {
      senderId = "public-skapps";
    }
    // /skyapps/
    return senderId;
  }

  getSpaceFromPath() {
    if (this.props.location.pathname.indexOf("/myappstore") > -1) {
      return "myappstore";
    }
    if (this.props.location.pathname.indexOf("/appstore") > -1) {
      return "appstore";
    }
  }
  displayEditBtnFlag = () =>{
    if (this.props.location.pathname.indexOf("/publishedapps") > -1) {
      return true;
    }
    return false;
  }
  displayInfoBtnFlag = () =>{
    if (this.props.location.pathname.indexOf("/publishedapps") > -1) {
      return false;
    }
    return true;
  }
  componentDidMount() {
    let skyspace = this.props.match.params.skyspace;
    const category = this.props.match.params.category;
    const senderId = this.getSenderId();
    if (skyspace === null || skyspace === undefined) {
      skyspace = this.getSpaceFromPath();
    }
    const queryHash = this.props.location.search.indexOf("?provider=") > -1 ? this.props.location.search.replace("?provider=", "").trim() : "";
    const hash = queryHash === "" ? null : queryHash;
    hash && this.props.setPublicHash(hash);
    const fetchAllSkylinks = this.props.match.path === "/skylinks";
    const portalHost = this.props.snUserSetting ? this.getLocation(this.props.snUserSetting.setting.portal).host : "siasky.net";
    const displayEditBtn = this.displayEditBtnFlag();
    const displayInfoBtn = this.displayInfoBtnFlag();
    this.setState({
      skyspace,
      category,
      fetchAllSkylinks: fetchAllSkylinks,
      page: 1,
      hash,
      senderId,
      portalHost,
      displayEditBtn,
      displayInfoBtn
    });
    this.props.fetchSkyspaceDetail();
    this.getAppList(category, skyspace, fetchAllSkylinks, hash, senderId);
  }

  getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let skyspace = this.props.match.params.skyspace;
    const category = this.props.match.params.category;
    const senderId = this.getSenderId();
    if (!skyspace) {
      skyspace = this.getSpaceFromPath();
    }
    const queryHash = this.props.location.search.indexOf("?provider=") > -1 ? this.props.location.search.replace("?provider=", "").trim() : "";
    const hash = queryHash === "" ? null : queryHash;
    const fetchAllSkylinks = this.props.match.path === "/skylinks";
    const displayEditBtn = this.displayEditBtnFlag();
    const displayInfoBtn = this.displayInfoBtnFlag();
    if (
      this.state.category !== category ||
      this.state.hash !== hash ||
      this.state.skyspace !== skyspace ||
      this.state.fetchAllSkylinks !== fetchAllSkylinks ||
      this.state.senderId !== senderId ||
      (fetchAllSkylinks &&
        this.getSearchKeyFromQuery() !== this.state.searchKey)
    ) {
      this.props.fetchSkyspaceDetail();
      this.updateTagFilterList([]);
      this.setState({
        skyspace,
        hash,
        fetchAllSkylinks: fetchAllSkylinks,
        category,
        arrSelectedAps: [],
        isSelect: false,
        page: 1,
        senderId,
        displayEditBtn,
        displayInfoBtn
      });
      hash && this.props.setPublicHash(hash);
      this.getAppList(category, skyspace, fetchAllSkylinks, hash, senderId);
    }
  }

  tagFilter = (app) => {
    if (app && this.state.filterCriteria.tagFilterList.length !== 0) {
      const appTagList = getCompatibleTags(app.type);
      return (
        appTagList.filter(
          (appTag) =>
            this.state.filterCriteria.tagFilterList.indexOf(appTag) > -1
        ).length > 0
      );
    } else {
      return true;
    }
  };

  getFilteredApps() {
    const searchKey = this.state.searchKey;
    const filteredApps = this.props.snApps
      .filter(this.tagFilter)
      .filter((app) => {
        if (searchKey && searchKey.trim() !== "") {
          for (const skyAppKey in app) {
            if (
              app.hasOwnProperty(skyAppKey) &&
              skyAppKey !== "category" &&
              app[skyAppKey] != null &&
              app[skyAppKey]
                .toString()
                .toLowerCase()
                .indexOf(searchKey.toLowerCase()) > -1
            ) {
              return app;
            }
          }
        } else {
          return app;
        }
        return "";
      });
    return filteredApps;
  }

  handleSkyspaceAdd = (app) => {
    const skhubId = app.skhubId;
    bsGetSkyspaceNamesforSkhubId(this.props.userSession, skhubId)
      .then((skyspacesForApp) => {
        console.log("skyspacesForApp ", skyspacesForApp);
        if (skyspacesForApp == null) {
          skyspacesForApp = [];
        }
        return this.props.snSkyspaceList.filter(
          (skyspace) => !skyspacesForApp.includes(skyspace)
        );
      })
      .then((availableSkyspaces) => {
        console.log("availableSkyspaces", availableSkyspaces);
        if (availableSkyspaces != null && availableSkyspaces.length > 0) {
          this.setState({
            showAddToSkyspace: true,
            availableSkyspaces,
          });
        } else {
          console.log("NO new skyspace available");
        }
      });
  };

  selectApp = (app, isDeselection) => {
    const arrSelectedAps = this.state.arrSelectedAps;
    if (isDeselection) {
      const idx = arrSelectedAps.indexOf(app);
      idx > -1 && arrSelectedAps.splice(idx, 1);
    } else {
      arrSelectedAps.push(app);
    }
    this.setState({ arrSelectedAps });
  }

  renderCards = (filteredApps, page, cardCount, skyspace) => {
    const filterList = this.state.filterCriteria.tagFilterList;
    let filterCriteria = "";
    if (filterList != null && filterList.length > 0) {
      filterCriteria = filterList[0];
    }

    if (
      CATEGORY_OBJ[filterCriteria] != null &&
      CATEGORY_OBJ[filterCriteria]["cards"] != null
    ) {
      return CATEGORY_OBJ[filterCriteria]["cards"](
        page,
        filteredApps,
        skyspace,
        ITEMS_PER_PAGE,
        this.openSkyApp,
        (app, isDeselection) => this.selectApp(app, isDeselection),
        this.state.isSelect,
        this.state.arrSelectedAps,
        this.state.hash,
        () =>
          this.getAppList(
            this.state.category,
            this.state.skyspace,
            this.state.fetchAllSkylinks
          ),
        this.state.senderId,
        this.state.GridUi
      );
    } else {
      return (
        
         <Grid container spacing={3} style={{ width: "100%", margin: "auto" }} alignItems="stretch">
          {filteredApps
            .slice(
              (page - 1) * ITEMS_PER_PAGE,
              (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
            )
            .map((app, i) => {
              cardCount = cardCount + 1;
              return (
                <SnAppCard
                  key={i}
                  app={app}
                  // GridUi={this.state.GridUi}
                  GridUi="true"
                  hash={this.state.hash}
                  isSelect={this.state.isSelect}
                  arrSelectedAps={this.state.arrSelectedAps}
                  skyspace={skyspace}
                  displayEditBtn={this.state.displayEditBtn}
                  displayInfoBtn={this.state.displayInfoBtn}
                  senderId={this.state.senderId}
                  allSpacesObj={this.props.snSkyspaceDetail}
                  cardCount={filteredApps.length}
                  onSelection={(app, isDeselection) => this.selectApp(app, isDeselection)}
                  onOpenSkyApp={this.openSkyApp}
                  onDelete={() => {
                    this.props.fetchSkyspaceDetail();
                    this.getAppList(
                      this.state.category,
                      this.state.skyspace,
                      this.state.fetchAllSkylinks
                    );
                  }
                  }
                />
              );
            })
          }
        </Grid>
      );
    }
  };

  createSkylinkPublicShare = async () => {
    if (this.state.arrSelectedAps.length !== 0) {

      this.props.setLoaderDisplay(true);
      const skylinkListFile = getSkylinkPublicShareFile({
        data: this.state.arrSelectedAps,
        history: [{
          creationDate: new Date()
        }]
      });
      const portal = this.props.snUserSetting?.setting?.portal || DEFAULT_PORTAL;
      let uploadedContent = await new SkynetClient(portal).uploadFile(skylinkListFile);
      if (uploadedContent) {
        uploadedContent = {
          skylink: parseSkylink(uploadedContent)
        };
      }
      let historyObj = getEmptyHistoryObject();
      historyObj.fileName = "Public Share";
      historyObj.skylink = uploadedContent.skylink;
      historyObj.action = "Public Share";
      bsAddToHistory(this.props.userSession, historyObj);
      this.setState({
        showInfoModal: true,
        onInfoModalClose: () => this.setState({ showInfoModal: false }),
        // infoModalContent: `${this.props.snUserSetting.setting.portal}${PUBLIC_SHARE_APP_HASH}/#/${PUBLIC_SHARE_ROUTE}?sialink=${uploadedContent.skylink}`
        infoModalContent: `https://skyspace.hns.${this.state.portalHost}/skapp/index.html#/${PUBLIC_SHARE_ROUTE}?provider=${uploadedContent.skylink}`
      })
      this.props.setLoaderDisplay(false);
    }
  }

  deleteFromPublic = (evt) => {
    evt.preventDefault();
    if (this.state.isSelect && this.state.arrSelectedAps.length > 0) {
      console.log("public apps to delete ", this.state.arrSelectedAps);
      const inMemObj = this.props.snPublicInMemory;
      inMemObj.deletedSkapps = [...new Set([...inMemObj.deletedSkapps, ...this.state.arrSelectedAps])];
      this.props.setApps(getAllPublicApps(this.props.snApps, inMemObj.addedSkapps, inMemObj.deletedSkapps));
    }
  }


  onPublicUpload = (uploadObj) => {
    const app = { ...getEmptySkylinkObject(), ...uploadObj };
    setTypeFromFile(app.contentType, app)
    app.skhubId = uuidv4();
    const inMemObj = this.props.snPublicInMemory;
    inMemObj.addedSkapps = [...new Set([app, ...inMemObj.addedSkapps])];
    this.props.setApps(getAllPublicApps(this.props.snApps, inMemObj.addedSkapps, inMemObj.deletedSkapps));
  }

  onUpload = async (uploadObj) => {
    if (this.state.hash != null) {
      this.onPublicUpload(uploadObj)
    } else {
      const app = { ...getEmptySkylinkObject(), ...uploadObj };
      app.skyspaceList = [this.state.skyspace];
      setTypeFromFile(app.contentType, app)
      const skhubId = await bsAddSkylink(this.props.userSession, app, this.props.snPerson);
      await bsAddSkylinkFromSkyspaceList(this.props.userSession, skhubId, [this.state.skyspace]);
      this.getAppList(this.state.category, this.state.skyspace, this.state.fetchAllSkylinks, this.state.hash, this.state.senderId);
      this.props.fetchSkyspaceAppCount();
      let historyObj = { ...getEmptyHistoryObject(), ...app };
      historyObj.fileName = app.name;
      historyObj.action = UPLOAD;
      historyObj.skyspaces = app.skyspaceList;
      historyObj.savedToSkySpaces = true;
      historyObj.skhubId = skhubId;
      await bsAddToHistory(this.props.userSession, historyObj);
    }
  }

  addPublicSpaceToAccount = async (evt) => {
    evt.preventDefault();
    let publicUpload = null;
    this.props.setLoaderDisplay(true);
    publicUpload = await savePublicSpace(this.state.hash, this.props.snPublicInMemory);
    this.props.setLoaderDisplay(false);
    const redirectToRoute = "/login" + "?" + PUBLIC_TO_ACC_QUERY_PARAM + "=" + (publicUpload?.skylink || this.state.hash);
    if (process.env.NODE_ENV === 'production') {
      document.location.href = SKYSPACE_HOSTNAME + "#" + redirectToRoute;
    } else {
      this.props.setPublicHash(null);
      this.props.history.push(redirectToRoute);
    }
  }

  savePublicSpace = async (evt) => {
    evt.preventDefault();
    this.props.setLoaderDisplay(true);
    const publicHashData = await getPublicApps(this.state.hash);
    const skappListToSave = getAllPublicApps(publicHashData.data, this.props.snPublicInMemory.addedSkapps, this.props.snPublicInMemory.deletedSkapps);
    publicHashData.history[publicHashData.history.length - 1].skylink = this.state.hash;
    publicHashData.history.push({
      creationDate: new Date()
    });
    publicHashData.data = skappListToSave;
    const skylinkListFile = getSkylinkPublicShareFile(publicHashData);
    const portal = document.location.origin.indexOf("localhost") === -1 ? document.location.origin : DEFAULT_PORTAL;
    const uploadedContent = await new SkynetClient(portal).uploadFile(skylinkListFile);
    this.props.setLoaderDisplay(false);
    const newUrl = document.location.href.replace(
      this.state.hash,
      parseSkylink(uploadedContent)
    );
    this.setState({
      showInfoModal: true,
      infoModalContent: newUrl,
      onInfoModalClose: () => {
        this.setState({ showInfoModal: false });
        document.location.href = newUrl;
      }
    });
  }

  selectPublicAll = (evt, filteredApps) => {
    evt.preventDefault();
    this.setState({ isSelect: true, arrSelectedAps: filteredApps })
  }

  cancelPublicSelect = (evt) => {
    evt.preventDefault();
    this.setState({ isSelect: false, arrSelectedAps: [] });
  }

  publicSelect = (evt) => {
    evt.preventDefault();
    this.setState({ isSelect: true, arrSelectedAps: [] });
  }

  addSelectedAppsToSpaces = async (selectedApps, skyspaceList) => {
    this.props.setLoaderDisplay(true);
    for (const app of selectedApps) {
      await bsAddSkylinkFromSkyspaceList(
        this.props.userSession,
        app.skhubId,
        skyspaceList
      );
    }
    this.props.fetchSkyspaceAppCount();
    this.setState({ showAddToSkyspace: false });
    this.props.setLoaderDisplay(false);
  };

  deleteSelectedApps = async (selectedApps) => {
    this.props.setLoaderDisplay(true);
    for (const app of selectedApps) {
      const spaceListForApp = (await bsGetSkyspaceNamesforSkhubId(this.props.userSession, app.skhubId)).skyspaceForSkhubIdList;
      await bsRemoveSkylinkFromSkyspaceList(this.props.userSession, app.skhubId, spaceListForApp);
      await bsDeleteSkylink(this.props.userSession, app.skhubId);
    }
    this.setState({
      arrSelectedAps: []
    });
    const { skyspace, category, fetchAllSkylinks, page, hash, senderId } = this.state;
    await this.getAppList(category, skyspace, fetchAllSkylinks, hash, senderId);
    this.props.fetchSkyspaceAppCount();
    this.setState({ showConfirmModal: false })
    this.props.setLoaderDisplay(false);
  }
  handleAppStoreProvider = async (appstoreProvider) => {
    alert("appstoreProvider" + appstoreProvider);
  }
  //TODO: modify code to perform task in single loop of selectedApps
  moveSelectedAppsToSpaces = async (selectedApps, skyspaceList) => {
    this.props.setLoaderDisplay(true);
    for (const app of selectedApps) {
      await bsRemoveSkappFromSpace(
        this.props.userSession,
        this.state.skyspace,
        app.skhubId
      )
    }
    this.props.setLoaderDisplay(false);
    await this.addSelectedAppsToSpaces(selectedApps, skyspaceList);
    this.props.setLoaderDisplay(true);
    const { skyspace, category, fetchAllSkylinks, page, hash, senderId } = this.state;
    await this.getAppList(category, skyspace, fetchAllSkylinks, hash, senderId);
    this.setState({
      showMoveToSkyspace: false,
      arrSelectedAps: []
    });
    this.props.setLoaderDisplay(false);
  }

  isUploadProgress = () => {
    const isProgress = false;
    for (const uploadItem of this.props.snUploadList) {
      if (uploadItem.status !== 'complete') {
        return true;
      }
    }
    return isProgress;
  }

  totalProgress = () => {

  }
  pageTitle = () => {
    let title = "Skynet App Store";
    if (this.props.location.pathname.indexOf("/myappstore") > -1) {
      title = "My App Store";
    }
    if (this.props.location.pathname.indexOf("/appstore") > -1) {
      title = "Skynet App Store";
    }
    if (this.props.location.pathname.indexOf("/publishedapps") > -1) {
      title = "My Published Apps";
    }
    if (this.props.location.pathname.indexOf("/hosting") > -1) {
      title = "Web Hosting (Coming soon...)";
    }
    return title;
  }
  render() {
    const { goToApp, skyappId,skyappPublicKey, fetchAllSkylinks } = this.state;
    const { classes } = this.props;
    const page = this.state.filterCriteria.page;
    const filterList = this.state.filterCriteria.tagFilterList;
    let filterCriteria = "";
    if (filterList != null && filterList.length > 0) {
      filterCriteria = filterList[0];
    }

    let cardCount = 0;
    const categoryWiseCount = this.getCategoryWiseCount();

    const skyspace = this.state.skyspace;
    if (goToApp) {
      const category = this.state.category;
      let source = "";
      if (category != null && category.trim() !== "") {
        source = "category";
      } else if (
        (skyspace != null && skyspace.trim() !== "") ||
        fetchAllSkylinks
      ) {
        source = "skyspace";
      }
      if(this.state.senderId != null && this.state.senderId === "myappstore")
      {
        return <Redirect to={"/myskyapps/" + skyappId + "?source=" + source +"&publickey="+ skyappPublicKey}  />;
      }
      else if(this.state.senderId != null && this.state.senderId === "appstore")
      {
        return <Redirect to={"/providerskyapps/" + skyappId + "?source=" + source +"&publickey="+APPSTORE_PROVIDER_APP_PUBKEY }  />;
      }
      else if(this.state.senderId != null && this.state.senderId === "public-skapps")
      {
        return <Redirect to={"/public-skappinfo/" + skyappId + "?source=" + source +"&publickey="+APPSTORE_PROVIDER_APP_PUBKEY }  />;
      }
      else {
        return <Redirect to={"/skyapps/" + skyappId + "?source=" + source }  />;
      }
    }
    let filteredApps = this.getFilteredApps();


    return (
      <main className={this.state.hash ? classes.publicContent : classes.content}>
        <div style={{ paddingTop: 50, minHeight: "calc(100vh - 100px)" }}>
          <Grid
            container
            className="most_main_grid_gallery"
            spacing={3}
            style={{ width: "99%", margin: "auto" }}
          >
            <Grid item lg={3} md={6} sm={10} xs={12}>
              <Typography className={classes.gallery_title}>{this.pageTitle()}</Typography>
              <Typography className={classes.gallery_subTitle}>
                {skyspace === "appstore" && "Managed By: Skapp Developer"}
                {/* {this.state.hash == null && skyspace}
                {this.state.hash != null && "Public Space"} */}
              </Typography>
            </Grid>
            {/* #### Start:: Apps Category Filter ##### */}
            {filteredApps.length > 0 &&
              <>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={12}
                  xs={12}
                  className={`filter-grid ${classes.gallery_title_btns_grid
                    } ${"most_main_grid_gallery_style"}`}
                >
                  {/*  All */}
                  <Typography
                    onClick={() => this.updateTagFilterList([])}
                    variant="span"
                    className={`gallery_title_head_Alltext ${classes.gallery_title_head_Alltext} ${this.state.filterCriteria?.tagFilterList?.length === 0 && "active"}`}
                    style={
                      this.state.filterCriteria != null &&
                        this.state.filterCriteria.tagFilterList.length === 0
                        ? { backgroundColor: "APP_BG_COLOR" }
                        : {}
                    }
                  >
                    All
                    <Typography variant="span" className={classes.innerValue_All}>
                      {" "}
                      {this.props.snApps && this.props.snApps.length}
                    </Typography>
                  </Typography>
                  {Object.keys(getCategoryObjWithoutAll())
                    .filter(key => categoryWiseCount[key] && categoryWiseCount[key] != "0")
                    .map((key, idx) => idx < 4 && (
                      <Typography
                        onClick={() => this.updateTagFilterList([key])}
                        variant="span"
                        key={idx}
                        className={`gallery_title_head_image_text ${classes.gallery_title_head_image_text} ${this.state.filterCriteria?.tagFilterList && this.state.filterCriteria?.tagFilterList[0] === key && "active"}`}
                      >
                        {/* <CameraAltOutlinedIcon style={{ fontSize: "20px" }} /> */}
                        {/* <span style={{ fontSize: "20px" }}>{CATEGORY_OBJ[key].getLogo(classes.categoryFilterLogo)}</span>&nbsp;  */}
                        {getCategoryObjWithoutAll()[key].heading}
                        <Typography variant="span" className={classes.innerValue_All}>
                          {categoryWiseCount[key]
                            ? categoryWiseCount[key]
                            : 0}
                        </Typography>
                      </Typography>
                    ))}
                  <div className={`${classes.menuverticalIcon_div} ${"menu_icon_top"}`}>
                    <SnViewMore
                      onItemClick={key => this.updateTagFilterList([key])}
                      itemLabel={key => getCategoryObjWithoutAll()[key].heading}
                      showCount={true}
                    >

                      {Object.keys(getCategoryObjWithoutAll())
                        .filter(key => categoryWiseCount[key] && categoryWiseCount[key] != "0")
                        .map((key, idx) => idx >= 4 && (
                          <div
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                              cursor: "pointer",
                            }}
                          >
                            <Typography
                              onClick={() => this.updateTagFilterList([key])}
                              variant="span"
                              className={`gallery_title_head_Alltext ${classes.gallery_title_head_Alltext_menu}`}
                            >
                              {getCategoryObjWithoutAll()[key].heading}
                              <Typography variant="span" className={classes.innerValue_All}>
                                {categoryWiseCount[key]
                                  ? categoryWiseCount[key]
                                  : 0}
                              </Typography>
                            </Typography>
                          </div>

                        ))}
                    </SnViewMore>
                  </div>
                </Grid>
                 {/* #### END:: Apps Category Filter ##### */}

                {/* If its NOT from "PublicShare" and "senderId" is NULL and isSelect is TRUE */}
                {this.state.hash == null && filteredApps.length > 0 && this.state.senderId == null && this.state.isSelect &&
                  <Grid container spacing={3} style={{ margin: "0px" }}>
                    <Grid
                      item
                      xs={12}
                      className={classes.titleBar_onSelect_img_grid_gallery}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => this.setState({ arrSelectedAps: filteredApps })}
                            startIcon={<DoneAllIcon style={{ color: "#1ed660" }} />}
                            size="small"
                            style={{
                              background: "transparent",
                              color: "#636f70",
                              boxShadow: "none",
                            }}
                          >
                            Select all
                      </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => this.state.arrSelectedAps.length > 0 && this.setState({ showConfirmModal: true })}
                            className={classes.button}
                            startIcon={
                              <DeleteOutlineIcon style={{ color: "#ff3d3d" }} />
                            }
                            size="small"
                            style={{
                              background: "transparent",
                              color: "#636f70",
                              boxShadow: "none",
                              marginLeft: "15px",
                            }}
                          >
                            Delete
                      </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => this.state.arrSelectedAps.length > 0 && this.createSkylinkPublicShare()}
                            startIcon={
                              <ShareOutlinedIcon style={{ color: "#1ed660" }} />
                            }
                            size="small"
                            style={{
                              background: "transparent",
                              color: "#636f70",
                              boxShadow: "none",
                              marginLeft: "15px",
                            }}
                          >
                            Public Share
                      </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => { alert('Try Private-Share from left navigation,\n This feature will be enabled on this icon soon') }}
                            startIcon={
                              // <ShareOutlinedIcon style={{ color: "#1ed660" }} />
                              <i class="fas fa-people-arrows icon_private_share"></i>
                            }
                            size="small"
                            style={{
                              background: "transparent",
                              color: "#636f70",
                              boxShadow: "none",
                              marginLeft: "15px",
                            }}
                          >
                            Private Share
                      </Button>

                          <Button
                            variant="contained"
                            onClick={() => this.state.arrSelectedAps.length > 0 && this.setState({ showMoveToSkyspace: true })}
                            color="secondary"
                            className={classes.button}
                            startIcon={
                              <GamesOutlinedIcon style={{ color: "#1ed660" }} />
                            }
                            size="small"
                            style={{
                              background: "transparent",
                              color: "#636f70",
                              boxShadow: "none",
                              marginLeft: "15px",
                            }}
                          >
                            Move to
                      </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => this.state.arrSelectedAps.length > 0 && this.setState({ showAddToSkyspace: true })}
                            startIcon={
                              <PlaylistAddOutlinedIcon
                                style={{ color: "#1ed660" }}
                              />
                            }
                            size="small"
                            style={{
                              background: "transparent",
                              color: "#636f70",
                              boxShadow: "none",
                              marginLeft: "15px",
                            }}
                          >
                            Add to
                      </Button>
                        </div>

                        <div style={{ textAlign: "right" }} className={classes.selected_count}>
                          {this.state.arrSelectedAps.length} Selected
                      <ClearOutlinedIcon
                            onClick={() => this.setState({ isSelect: false, arrSelectedAps: [] })}
                            style={{
                              color: "#1ed660",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>}


              </>} {/* END:: Apps Category Filter */}
            {/* ####################### Start: All Buttons ####################### */}
            {/* Upload Button and Grid/List View Icons  */}
            {this.state.isTrue ? null : (
              <>
                <Grid
                  item
                  lg={this.state.hash != null ? 12 : 6}
                  md={this.state.hash != null ? 12 : 6}
                  sm={12}
                  xs={12}
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  {/* Display is NONE for below element */}
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                  />
                  {/* Display is NONE for below element */}
                  <div className="d-none">
                    <SnUpload
                      name="files"
                      ref={this.uploadEleRef}
                      directoryMode={this.state.isDir}
                      onUpload={this.onUpload}
                      portal={getPortalFromUserSetting(this.props.snUserSetting)}
                    />
                  </div>

                  {/* If NOT from PUBLIC_SHARING */}
                  {this.state.hash == null &&
                    <label htmlFor="contained-button-file">
                      <Button
                        onClick={(evt) => evt.preventDefault() || evt.stopPropagation() || this.uploadEleRef.current.gridRef.current.click()}
                        variant="contained"
                        color="primary"
                        style={{ color: "white", borderRadius: 10 }}
                        component="span"
                        type="button"
                        startIcon={<PublishIcon style={{ color: "white" }} />}
                      >
                        Upload
                      </Button>
                    </label>
                  }

                  {/* IF PUBLIC_SHARING Page, show below list of buttons */}
                  {this.state.hash != null && filteredApps.length > 0 &&
                    (
                      <label htmlFor="contained-button-file" className="public-btn">
                        <Button
                          onClick={() => this.uploadEleRef.current.gridRef.current.click()}
                          variant="contained"
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          type="button"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Upload
                        </Button>
                        <Button
                          variant="contained"
                          type="button"
                          onClick={this.addPublicSpaceToAccount}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Add To Skyspaces
                        </Button>

                        <Button
                          variant="contained"
                          onClick={(evt) => this.selectPublicAll(evt, filteredApps)}
                          color="primary"
                          type="button"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Select All
                        </Button>
                        {!this.state.isSelect && (<Button
                          variant="contained"
                          onClick={this.publicSelect}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Select
                        </Button>)}
                        {this.state.isSelect && (<Button
                          onClick={this.cancelPublicSelect}
                          variant="contained"
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Cancel Select
                        </Button>)}

                        <Button
                          variant="contained"
                          type="button"
                          disabled={(this.props.snPublicInMemory?.addedSkapps?.length === 0 && this.props.snPublicInMemory?.deletedSkapps?.length === 0)}
                          onClick={this.savePublicSpace}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Save
                        </Button>
                        {this.state.isSelect && (<Button
                          variant="contained"
                          type="button"
                          onClick={this.deleteFromPublic}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Delete
                        </Button>)}
                      </label>
                    )
                  }
                  {/* Grid UI vs List UI */}
                  {filteredApps.length > 0 &&
                    <Hidden xsDown>
                      <span style={{ marginLeft: 20 }}></span>
                      <IconButton aria-label="delete"
                        onClick={() => this.setGridUi(true)}
                        style={this.state.hash ? { "margin-left": "auto" } : {}}>
                        <AppsIcon className={classes.appsIcon} />
                      </IconButton>

                      <IconButton aria-label="delete" onClick={() => this.setGridUi(false)}>
                        <ReorderIcon className={classes.reOrdered} />
                      </IconButton>
                    </Hidden>
                  }
                </Grid>

                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* <LowPriorityIcon className={classes.lowPriorIcon} />
                  <FormControl className={classes.formControl}>
                    <Select
                      input={<BootstrapInput />}
                      inputProps={{
                        classes: {
                          icon: classes.icon,
                        },
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={this.filterSelection}
                      disableUnderline={true}
                      onChange={this.handleChange}
                    >
                      <MenuItem value={"emp"} className={classes.menuColor}>
                        Latest filter
                  </MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl> */}
                  {this.state.hash == null && filteredApps.length > 0 && this.state.senderId == null && (
                    <>
                      {!this.state.isSelect &&
                        <Button
                          variant="contained"
                          onClick={() => this.setState({ isSelect: true, arrSelectedAps: [] })}
                          color="primary"
                          className={classes.sharedSpaceButn}
                          startIcon={<CheckCircleIcon style={{ color: "white" }} />}
                        >
                          Select
                        </Button>
                      }
                    </>
                  )}
                </Grid>
              </>
            )}
          </Grid>
          {/* ####################### END: All Buttons ####################### */}
          {/* ######### RENDER ALL Cards in main Area ######## */}
          {this.renderCards(filteredApps, page, cardCount, skyspace)}
          
          {/* #### Start: only for AUDIO Cards #### */}
          <Grid item xs={12} style={{ display: "flex" }}>
            {false && filterCriteria === 'audio' ?
              <AudioPlayer /> :
              <SnPagination
                page={page}
                totalCount={filteredApps.length}
                onChange={this.udpdatePage}
              />}
          </Grid>
          <Grid item xs={12} style={{ display: "flex" }}>
            {filterCriteria === 'audio' &&
              <AudioPlayer />
            }
          </Grid>
           {/* #### END: only for AUDIO Cards #### */}
        </div>
        {/* ######### Start : ALL Modals ######## */}
        <SnConfirmationModal
          title={"Confirm Delete Skapps"}
          content={"Are you sure you want to permanently delete this Skapp?"}
          open={this.state.showConfirmModal}
          onNo={() => this.setState({ showConfirmModal: false })}
          onYes={() => this.deleteSelectedApps(this.state.arrSelectedAps)}
        />
        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={this.state.onInfoModalClose}
          title="Public Share Link"
          type="public-share"
          content={this.state.infoModalContent}
        />
        <SnAddToSkyspaceModal
          userSession={this.props.userSession}
          open={this.state.showAddToSkyspace}
          availableSkyspaces={this.props.snSkyspaceList?.filter(skyspace => skyspace !== this.state.skyspace)}
          onClose={() => this.setState({ showAddToSkyspace: false })}
          onSave={(skyspaceList) =>
            this.addSelectedAppsToSpaces(this.state.arrSelectedAps, skyspaceList)
          }
        />
        <SnAddToSkyspaceModal
          userSession={this.props.userSession}
          title={"Select Skyspaces To Move To"}
          open={this.state.showMoveToSkyspace}
          availableSkyspaces={this.props.snSkyspaceList?.filter(skyspace => skyspace !== this.state.skyspace)}
          onClose={() => this.setState({ showMoveToSkyspace: false })}
          onSave={(skyspaceList) =>
            this.moveSelectedAppsToSpaces(this.state.arrSelectedAps, skyspaceList)
          }
        />
         {/* ######### END : ALL Modals ######## */}
        <div>
          <UploadProgress />
          <SnFooter />
        </div>
      </main>
    );
  }
}
export default withStyles(useStyles)(
  connect(mapStateToProps, matchDispatcherToProps)(SnCards)
);
