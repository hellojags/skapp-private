import { Box, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as UserProfileBackIcon } from "../../assets/img/icons/user-profile-back.svg";
import { ReactComponent as UserProfileIcon } from "../../assets/img/icons/user-profile-message.svg";
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction";
import {
  getAggregatedUserIDs,
  getFollowingForUser,
} from "../../service/SnSkappService";
import DevTable from "./DevTable";
// import UserCard from "./UserCard";

const useStyles = makeStyles((theme) => ({
  pageHeading: {
    color: "#131523",
    fontSize: "28px",
  },
  UserProfile: {
    width: 50,
    height: 50,
    background: "rgb(29 191 115 / 20%)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
  },
  p: {
    fontSize: 14,
    color: "#5A607F",
  },
  boxHalf: {
    boxShadow: "0px 1px 3px #00000012",
    background: "#fff",
    padding: " 10px 1.5rem",
    "& ._details": {
      marginLeft: "1rem",
    },
    borderRadius: 6,
    width: 300,
    maxWidth: "100%",
  },
  // search
  search: {
    position: "relative",
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    color: "#7E84A3",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    background: "#f0f5f78a",
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "22ch",
      "&:focus": {
        width: "25ch",
      },
    },
    borderRadius: 4,
  },
  tableSearch: {
    background: "#fff",
  },
  tableContent: {
    background: "#fff",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  WraperUserFollowing: {
    "@media (max-width: 400px)": {
      flexDirection: "column",
      "& .MuiBox-root": {
        marginLeft: 0,
        marginBottom: 10,
      },
    },
  },
}));

const DescoverDev = () => {
  const classes = useStyles();
  const [followingList, setFollowingList] = useState([]);
  // const [searchData, setSearchData] = useState([]);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();

  const userSession = useSelector((state) => state.userSession);
  const userID = userSession?.userID || null;

  // Effects, empty array will render only once at initialization
  useEffect(() => {
    // setUserKeys(fetchAllUsersPubKeys());
    fetchUsersSocialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  // useEffect(() => {

  //     setSearchData(publishedAppsStore)

  // }, [setSearchData, publishedAppsStore])

  // fetch all users data
  const fetchUsersSocialData = async () => {
    if (!userID) return;

    dispatch(setLoaderDisplay(true));

    const allUserIDs = await getAggregatedUserIDs(null);
    const followingList = await getFollowingForUser(userID);

    console.log(followingList);
    console.log("############### allUserIDs ########### " +allUserIDs);
    // setSearchData(allUserIDs);

    setUserList(allUserIDs);
    setFollowingList(followingList);
    dispatch(setLoaderDisplay(false));
  };

  const toggleFollowing = async (id) => {
    if (followingList.includes(id))
      setFollowingList(followingList.filter((item) => item !== id));
    else setFollowingList([...followingList, id]);
  };

  const searchHandler = (e) => {
    // const options = {
    //     isCaseSensitive: false,
    //     // includeScore: false,
    //     shouldSort: true,
    //     // includeMatches: false,
    //     findAllMatches: true,
    //     minMatchCharLength: 0,
    //     // location: 0,
    //     threshold: 0.0,
    //     // distance: 100,
    //     // useExtendedSearch: false,
    //     // ignoreLocation: false,
    //     // ignoreFieldNorm: false,
    //     includeScore: true,
    //     keys: [
    //         "username",
    //         "location",
    //         "userid"
    //     ]
    // }
    // const fuse = new Fuse(publishedAppsStore, options)
    // // Change the pattern
    // const pattern = e.target.value
    // console.log(pattern)
    // if (pattern) {
    //     let _newD = fuse.search(pattern)
    //     _newD = _newD.map(_ => _.item)
    //     setSearchData(_newD)
    //     console.log(_newD)
    // } else {
    //     setSearchData(publishedAppsStore)
    // }
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        className={`${classes.margnBottomMediaQuery} ${classes.MobileFontStyle}`}
      >
        <h1 className={classes.pageHeading}>User Discovery</h1>
      </Box>

      <Box
        className={classes.WraperUserFollowing}
        display="flex"
        marginTop="1rem"
      >
        <Box className={classes.boxHalf} display="flex" alignItems="center">
          <div className={classes.UserProfile}>
            <UserProfileIcon />
          </div>
          <div className="_details">
            <h3 className={classes.h3}>Coming Soon</h3>
            <p className={classes.p}>Followers</p>
          </div>
        </Box>
        <Box
          className={classes.boxHalf}
          display="flex"
          marginLeft="1rem"
          alignItems="center"
        >
          <div className={classes.UserProfile}>
            <UserProfileBackIcon />
          </div>
          <div className="_details">
            <h3 className={classes.h3}>{followingList?.length}</h3>
            <p className={classes.p}>Following</p>
          </div>
        </Box>
      </Box>

      <div className={classes.tableContent}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.tableSearch}
          marginTop="1rem"
          padding="1rem"
          paddingBottom="0px"
          flexWrap="wrap"
        >
          <p>Search developers to follow</p>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={searchHandler}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Box>

        <DevTable
          userList={userList}
          followingList={followingList}
          toggleFollowing={toggleFollowing}
        />
      </div>
    </div>
  );
};

export default DescoverDev;
