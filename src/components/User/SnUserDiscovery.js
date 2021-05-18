import { Grid, Paper, Typography, Button, Avatar } from "@material-ui/core"
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import MaterialTable from "material-table"
import Tooltip from "@material-ui/core/Tooltip"

import AddBox from "@material-ui/icons/AddBox"
import ArrowDownward from "@material-ui/icons/ArrowDownward"
import Check from "@material-ui/icons/Check"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import Clear from "@material-ui/icons/Clear"
import DeleteOutline from "@material-ui/icons/DeleteOutline"
import Edit from "@material-ui/icons/Edit"
import FilterList from "@material-ui/icons/FilterList"
import FirstPage from "@material-ui/icons/FirstPage"
import LastPage from "@material-ui/icons/LastPage"
import Remove from "@material-ui/icons/Remove"
import SaveAlt from "@material-ui/icons/SaveAlt"
import Search from "@material-ui/icons/Search"
import ViewColumn from "@material-ui/icons/ViewColumn"
import { createEmptyErrObj } from "../new/sn.new.constants"
import {
  fetchAllUsersPubKeys,
  fetchUserDataByPubKey,
  getFollowersJSON,
  getFollowingsJSON,
  setFollowingsJSON,
} from "../../service/SnSkappService"
import {
  setMyFollowingsAction,
  getMyFollowingsAction,
} from "../../redux/action-reducers-epic/SnMyFollowingAction"
import { getMyFollowersAction } from "../../redux/action-reducers-epic/SnMyFollowerAction"
import useStyles from "./SnProfileStyle"
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction"
import {getPortalUrl} from '../../service/skynet-api'

const tableIcons = {
  Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: React.forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: React.forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: React.forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

export default function SnUserDiscovery(props) {
  // Hooks
  const classes = useStyles()
  const dispatch = useDispatch()
  // const history = useHistory();

  // States
  // const [userProfile, setUserProfile] = useState(null);
  const [errorObj, setErrorObj] = useState(createEmptyErrObj())
  const [userKeys, setUserKeys] = useState([])
  const [data, setData] = useState([])

  // const [columns, setColumns] = useState([]);
  // const [usersMasterData, setUsersMasterData] = useState([]);

  // Store
  const userProfile = useSelector((state) => state.snUserProfile)
  const userSession = useSelector((state) => state.userSession)
  const myFollowers = useSelector((state) => state.snMyFollowers)
  const myFollowings = useSelector((state) => state.snMyFollowings)

  // Effects, empty array will render only once at initialization
  useEffect(() => {
    // setUserKeys(fetchAllUsersPubKeys());
    fetchUsersMasterData()
  }, [])

  // fetch all users data
  const fetchUsersMasterData = async () => {
    dispatch(setLoaderDisplay(true))
    dispatch(getMyFollowersAction(null))
    dispatch(getMyFollowingsAction(null))
    // Fetch all PublicKeys from Cache
    // Step1: fetch userCache MasterPublicKeys and Profile
    // Step2: using AppSpecific PubKey for SKAPP fetch  [masterKey, masterProfile, appProfile , followers, followings]
    // Step3: fetch Julian's "Followers" and "Follwings" using Preferences. (3 level- Recursive). at the end we shall have
    // [masterKey, masterProfile, followers, followings] for all users connected with Julian at three level in tree
    // combine data and show

    const userMasterPubKeys = await fetchAllUsersPubKeys() // SkyID PublicKey

    // If PubKey is valid fetch users Profile.json, follower.json, following.json.
    const userMasterData = []
    const myFollowersPKList = (await getFollowersJSON(null)).publicKeyList
    const myFollowingPKList = (await getFollowingsJSON(null)).publicKeyList
    for (const userMasterPubKey of userMasterPubKeys) {
      if (userMasterPubKey && userMasterPubKey.length == 64) {
        const tempUserData = await fetchUserDataByPubKey(userMasterPubKey)
        // tempUserData should inlcude master and app profile data combined.
        if (tempUserData) {
          if (myFollowersPKList.includes(userMasterPubKey)) {
            tempUserData.followerFlag = true
          }
          if (myFollowingPKList.includes(userMasterPubKey)) {
            tempUserData.followingFlag = true
          }
          userMasterData.push(tempUserData)
        }
      }
    }
    setData(userMasterData)
    // console.log("userMasterData"+userMasterData);
    // Use loggedIn user's follower list to populate followerFlag
    // Prepare Data for table.
    dispatch(setLoaderDisplay(false))
  }

  const fetchUsersDataBySelection = async (row) => {
    // Fetch all PublicKeys from Cache
    const userPubKeys = await fetchAllUsersPubKeys()
    // If PubKey is valid fetch users Profile.json, follower.json, following.json.
    const userMasterData = []
    const myFollowersPKList = (await getFollowersJSON(null)).publicKeyList
    const myFollowingPKList = (await getFollowingsJSON(null)).publicKeyList
    for (const userPubKey of userPubKeys) {
      const tempUserData = await fetchUserDataByPubKey(userPubKey)
      if (myFollowersPKList.includes(userPubKey)) {
        tempUserData.followerFlag = true
      }
      if (myFollowingPKList.includes(userPubKey)) {
        tempUserData.followingFlag = true
      }
      userMasterData.push(tempUserData)
    }
    // Fetch all follower.json keys
    // Fetch all following.json keys

    // Use loggedIn user's follower list to populate followerFlag
    // Prepare Data for table.

    // Merge all PublicKey.
  }

  const followUser = async (row) => {
    // alert("Inside follow user" + row.publicKey);
    const newFollowings = myFollowings ? { ...myFollowings } : { publicKeyList: [] }
    const newFollowingsPKList = newFollowings?.publicKeyList
    if (!newFollowingsPKList.includes(row.masterPublicKey)) {
      newFollowingsPKList.push(row.masterPublicKey)
      await setFollowingsJSON({ publicKeyList: newFollowingsPKList }) // set updated avlue in IndexedDB
      dispatch(setMyFollowingsAction({ publicKeyList: newFollowingsPKList })) // Update Store
      const newJSON = [...data] // Update UI Table State Variable "Data" for rerendering
      newJSON[row.tableData.id].followingFlag = true
      setData(newJSON)
    }
  }
  const unfollowUser = async (row) => {
    // alert("Inside follow user" + row.publicKey);
    const newFollowings = myFollowings ? { ...myFollowings } : { publicKeyList: [] }
    const newFollowingsPKList = newFollowings?.publicKeyList

    if (newFollowingsPKList.includes(row.masterPublicKey)) {
      const index = newFollowingsPKList.indexOf(row.masterPublicKey)
      if (index > -1) {
        newFollowingsPKList.splice(index, 1)
      }
      await setFollowingsJSON({ publicKeyList: newFollowingsPKList }) // set updated avlue in IndexedDB
      dispatch(setMyFollowingsAction({ publicKeyList: newFollowingsPKList })) // Update Store
      const newJSON = [...data]
      newJSON[row.tableData.id].followingFlag = false
      setData(newJSON)
    }
  }
  // const data = [
  //   { name: 'Mehmet', appscount: 10, follower: 3, following: 3, imageUrl: 'https://avatars0.githubusercontent.com/u/7895451?s=460&v=4', followingflag: true },
  //   { name: 'Zerya Betül', appscount: 3, follower: 6, following: 4, imageUrl: 'https://avatars0.githubusercontent.com/u/7895451?s=460&v=4', followingflag: false },
  // ];
  const columns = [
    {
      // title: 'Avatar', field: 'avatar', render: rowData => <img src={rowData.avatar} style={{ width: 40, borderRadius: '50%' }} />
      title: "Avatar",
      field: "avatar",
      render: (rowData) => (
        <Avatar
          alt={rowData.username}
          src={getPortalUrl() + `${rowData.avatar}`}
          className={classes.large}
        />
      ),
    },
    { title: "SkyID Username", field: "username" },
    { title: "Developer name", field: "devName" },
    { title: "Location", field: "location" },
    { title: "Git Id", field: "devGitId" },
    { title: "No of Apps", field: "noOfPublishedApps", type: "numeric" },
    { title: "Following Count", field: "following", type: "numeric" },

    // { title: 'AboutMe', field: 'aboutme' },
    // { title: 'Followers Count', field: 'follower', type: 'numeric' },
    {
      title: "Action",
      field: "useraction",
      render: (rowData) => loadAvailableAction(rowData),
    },
  ]
  // fetchProfile JSON
  // If not found Initialize it and show on UI

  const loadAvailableAction = (rowData) =>
    rowData.followingFlag === true ? (
      <Tooltip title="Unfollow User" arrow>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          type="submit"
          className={`${classes.button}  ${classes.ef_saveBtn}`}
          onClick={() => unfollowUser(rowData)}
          startIcon={<RemoveCircleOutlineIcon />}
        >
          Unfollow
        </Button>
        {/* <IconButton onClick={() => unfollowUser(rowData)}>
          <AddCircleOutlineOutlinedIcon className={classes.spaceIcon} />
        </IconButton> */}
      </Tooltip>
    ) : (
      <Tooltip title="Follow User" arrow>
        <Button
          variant="contained"
          color="primary"
          size="small"
          type="submit"
          className={`${classes.button}  ${classes.ef_saveBtn}`}
          onClick={() => followUser(rowData)}
          startIcon={<AddCircleOutlineIcon />}
        >
          Follow
        </Button>
        {/* <IconButton onClick={() => followUser(rowData)}>
          <AddCircleOutlineOutlinedIcon className={classes.spaceIcon} />
        </IconButton> */}
      </Tooltip>
    )

  // const columns = [
  //   {
  //     title: 'Avatar', field: 'imageUrl', render: rowData => <img src={rowData.imageUrl} style={{width: 40, borderRadius: '50%'}}/>
  //   },
  //   { title: 'Name', field: 'name'},
  //   { title: 'No of Apps', field: 'appscount' },
  //   { title: 'Following', field: 'following', type: 'numeric' },
  //   { title: 'Follower', field: 'follower', type: 'numeric' },
  //   {
  //     title: 'Action', field: 'useraction',
  //     render: (rowData) => loadAvailableAction(rowData)
  //   }
  // ];

  const onSubmit = async (data) => {
    // let updatedData = { ...userProfile, ...data };
    // dispatch(setUserProfileAction(updatedData));
    // await bsSetUserAppProfile(userSession, updatedData);
    // // call action to Update data
    // //console.log(updatedData);
  }
  return (
    <main className={classes.content}>
      <div style={{ paddingTop: 70, minHeight: "calc(100vh - 100px)" }}>
        <Grid
          container
          spacing={3}
          className={`most_main_grid_ef ${classes.most_main_grid_ef}`}
        >
          <Grid item xs={12} className={classes.main_grid_ef}>
            <Paper className={`${classes.paper} ${classes.MaintabsPaper_ef}`}>
              <Paper className={classes.tabsPaper_ef}>
                <Typography className={classes.title1_ef}>
                  {" "}Discover & Follow Developers{" "}
                </Typography>{" "}
                <br />
                <Grid
                  container
                  spacing={3}
                  style={{ width: "100%", margin: "auto" }}
                  justify="flex-start"
                >
                  {/* <Grid item >
                <Typography className={classes.follower_title}> Followers : {myFollowers?.publicKeyList?.length}</Typography>
                </Grid> */}
                  <Grid item>
                    <Typography className={classes.follower_title}>
                      {" "}
                      Followings :{myFollowings?.publicKeyList?.length}
                    </Typography>
                  </Grid>
                </Grid>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    boxShadow: "0 0 10px rgba(0,0,0,.4)",
                    borderRadius: "10px",
                  }}
                >
                  {/* <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={[
            { title: "Adı", field: "name" },
            { title: "Soyadı", field: "surname" },
            { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
            {
              title: "Doğum Yeri",
              field: "birthCity",
              lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
            },
          ]}
          data={[
            {
              name: "Mehmet",
              surname: "Baran",
              birthYear: 1987,
              birthCity: 63,
            },
          ]}
          title="Demo Title"
        />
      </div> */}
                  <MaterialTable
                    icons={tableIcons}
                    title="Search Developers to Follow"
                    columns={columns}
                    data={data}
                    options={{
                      selection: true,
                      sorting: true,
                      actionsColumnIndex: -1,
                    }}
                    actions={[
                      {
                        tooltip: "Follow User",
                        icon: tableIcons.Delete,
                        onClick: (event, rows) => {
                          followUser(rows)
                        },
                      },
                    ]}
                  />
                </div>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </main>
  )
}
