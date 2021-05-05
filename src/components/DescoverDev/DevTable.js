import { faEllipsisH as MoreIcon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Button, Checkbox, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { PersonOutline } from "@material-ui/icons";
import React, { Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import { ReactComponent as DomainListIcon } from '../../assets/img/icons/listicon.svg'
import { ReactComponent as Arrows } from "../../assets/img/icons/arrows-diagrams-02.svg";
import {
  follow,
  getFollowingCountForUser,
  getProfile,
  getUsersPublishedAppsCount,
  unfollow,
} from "../../service/SnSkappService";
import Spiner from "../AppsComp/Spiner";
import UserCard from "./UserCard";

const useStyles = makeStyles(({ palette }) => ({
  table: {
    minWidth: 850,
  },
  paper: {
    marginTop: 10,
    "& th, & td": {
      border: 0,
    },
    "& tbody tr th ~ td:not(:last-child)": {
      color: "#6E77AA",
      fontWeight: "normal",
    },
    "& tbody th": {
      fontWeight: 700,
    },
    "& thead": {
      "& th": {
        padding: 0,
        color: "#000",
        // lineHeight: '',
        background: "#F0F5F7",
        "& svg": {
          marginLeft: "5px",
          width: 18,
        },
        "&:first-child": {
          borderRadius: "5px 0 0px 5px",
          paddingLeft: 5,
        },
        "&:last-child": {
          paddingRight: 10,
          borderRadius: "0px 5px 5px 0px",
        },
      },
    },
    "& tr th, & tr td": {
      padding: "10px 0",
      fontSize: 18,
      "@media only screen and (max-width: 1440px)": {
        fontSize: 16,
      },
    },
    "& tr th": {
      "&:first-child": {
        borderRadius: "5px 0 0px 5px",
      },
      "&:last-child": {
        borderRadius: "0px 5px 5px 0px",
      },
    },
    "& tr td": {
      borderBottom: "1px solid #7070702b",
      "&:first-child": {
        paddingLeft: 5,
      },
      "&:last-child": {
        paddingRight: 10,
      },
    },
    "& table": {
      borderCollapse: "separate",
      borderSpacing: "0 8px",
    },
    "& tbody tr td,& tbody tr th": {
      background: "#fff",
    },
    "& tbody th svg": {
      marginRight: 10,
    },
  },
  statusWorking: {
    color: "#1DBF73",
  },
  statusError: {
    color: "#FF6060",
  },
  arrow: {
    marginLeft: 10,
  },
  menuAction: {
    marginTop: "3.4rem",
    "& ul": {
      minWidth: 230,
      "& li": {
        fontSize: 18,
        paddingBottom: 12,
        "@media only screen and (max-width: 1440px)": {
          fontSize: 16,
        },
      },
    },
    "& .MuiPaper-root": {
      boxShadow: "0px 3px 6px #00000029",
      border: "1px solid #7070704F",
      overflow: "visible",
    },
    "& .MuiPaper-root::before": {
      content: '""',
      width: 0,
      height: 0,
      borderTop: "14px solid transparent",
      borderBottom: "14px solid transparent",
      borderRight: "14px solid #70707057",
      position: "absolute",
      top: "-22px",
      right: 19,
      transform: "rotate(90deg)",
    },
    "& .MuiPaper-root::after": {
      content: '""',
      width: 0,
      height: 0,
      borderTop: "14px solid transparent",
      borderBottom: "14px solid transparent",
      borderRight: "14px solid #fff",
      // position: 'relative',
      position: "absolute",
      top: "-21px",
      right: 19,
      transform: "rotate(90deg)",
    },
  },
  colorDanger: {
    color: "#FF6060",
  },
  devAvtar: {
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.3)",
  },
  unfollowBtn: {
    width: 110,
    background: palette.error.main,
    color: palette.error.contrastText,
    "&:hover": {
      background: palette.error.main,
      color: palette.error.contrastText,
    },
  },
  followBtn: {
    width: 110,
    background: palette.primary.main,
    color: palette.primary.contrastText,
    "&:hover": {
      background: palette.primary.main,
      color: palette.primary.contrastText,
    },
  },
  moreIconV: {
    transform: "rotate(90deg)",
  },
  ellipsis: {
    maxWidth: 100,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

// function createData(domainName, type, status, action) {
//     return { domainName, type, status, action }
// }

// const rows = [
//     // createData('skyspaces.io', 'External DNS', true, { actionType: '' }),
//     // createData('cloudean.com', 'External DNS', false,),
//     // createData('mysite.net', 'External DNS', true,),
// ]

const DevTable = ({ userList = [], followingList = [], toggleFollowing }) => {
  const [items, setItems] = useState([]);
  // const [alldata, setAlldata] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [user, setUser] = useState(null);

  const userPerPage = 10;
  const classes = useStyles();

  // useEffect(() => {
  //     // console.log(items.length);
  //     if (items.length && newData) {
  //       const indexOfLastTodo = 1 * items.length
  //       const indexOfFirstTodo = indexOfLastTodo - items.length
  //       const currentTodos = newData?.slice(indexOfFirstTodo, indexOfLastTodo)
  //       setAlldata(currentTodos)
  //     }
  //   }, [items.length, newData])

  const handleDialogClose = async () => {
    setUser(null);
  };

  const loadMoreUserDetails = async () => {
    const idList = userList.slice(
      pageNumber * userPerPage,
      (pageNumber + 1) * userPerPage
    );

    const promiseList = idList.map(async (id) => {
      let [profile = {}, following, appCount] = await Promise.all([
        getProfile(id),
        getFollowingCountForUser(id),
        getUsersPublishedAppsCount(id),
      ]);

      if (!profile) {
        profile = {};
      }

      profile.following = following || 0;
      profile.appCount = appCount || 0;
      profile.uid = id;

      return profile;
    });

    const list = await Promise.all(promiseList);

    setItems((items) => [...items, ...list.filter((i) => i)]);
  };

  const handleFollowing = (actionType, uid) => async () => {
    if (actionType === "follow") await follow(uid);
    else await unfollow(uid);

    toggleFollowing(uid);
  };

  const handleLoadMore = () => {
    setPageNumber((num) => num + 1);
    loadMoreUserDetails();
  };

  const handleUserClick = (data) => () => {
    console.log(data);
    setUser(data);
  };

  const getGithubUrl = (list = []) => {
    let gitID = "";

    if (!list) return gitID;

    list.map((item) => {
      if (Object.keys(item)[0] === "github") gitID = item.github;
      return item;
    });

    return gitID;
  };

  const transformImageUrl = (siaUrl) => {
    let skyUrl = `https://siasky.net/${siaUrl.slice(6)}`;
    console.log(skyUrl);
    return skyUrl;
  };

  useEffect(() => {
    console.log("running......");
    setItems([]);
    setPageNumber(0);
    loadMoreUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userList.length]);

  console.log(items);

  return (
    <Fragment>
      <InfiniteScroll
        scrollableTarget="app-content"
        dataLength={items.length}
        next={handleLoadMore}
        hasMore={userList.length > items.length}
        loader={<Spiner />}
        // style={{ overflow: "none" }}
      >
        <TableContainer className={classes.paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>UserId</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>UserName </span>
                    <Arrows />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Location </span>
                    <Arrows />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Git ID </span>
                    <Arrows />
                  </Box>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Following </span>
                    <Arrows />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Apps </span>
                    <Arrows />
                  </Box>
                </TableCell>

                <TableCell> Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, ind) => (
                <TableRow key={item.uid}>
                  <TableCell scope="row">
                    <Checkbox
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                  <TableCell>
                    {item.avatar && item.avatar[0] ? (
                      <img
                        className={classes.devAvtar}
                        src={transformImageUrl(item.avatar[0].url)}
                        alt=""
                        height="40px"
                        width="40px"
                      />
                    ) : (
                      <Avatar className={classes.devAvtar}>
                        <PersonOutline />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box
                      className={classes.ellipsis}
                      title={item.uid}
                      style={{ cursor: "pointer" }}
                      onClick={handleUserClick(item)}
                    >
                      {item.uid}
                    </Box>
                  </TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{getGithubUrl(item?.connections)}</TableCell>
                  <TableCell>{item.following}</TableCell>
                  <TableCell>{item.appCount}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="space-between">
                      {followingList.includes(item.uid) ? (
                        <Button
                          className={classes.unfollowBtn}
                          onClick={handleFollowing("unfollow", item.uid)}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          className={classes.followBtn}
                          onClick={handleFollowing("follow", item.uid)}
                        >
                          Follow
                        </Button>
                      )}
                      <IconButton size="small">
                        <FontAwesomeIcon
                          className={classes.moreIconV}
                          size="small"
                          icon={MoreIcon}
                        />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteScroll>

      <UserCard
        user={user}
        followingList={followingList}
        handleClose={handleDialogClose}
        handleFollowing={handleFollowing}
      />
    </Fragment>
  );
};

export default DevTable;
