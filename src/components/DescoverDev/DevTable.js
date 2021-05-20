import { Avatar, Box, Button, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { PersonOutline } from "@material-ui/icons";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactComponent as ArrowsDark } from "../../assets/img/icons/arrows-diagrams-02-dark.svg";
import { ReactComponent as ArrowsLight } from "../../assets/img/icons/arrows-diagrams-02-light.svg";
import {
  follow,
  getFollowingCountForUser,
  getGithubUrl,
  getProfile,
  getUsersPublishedAppsCount,
  transformImageUrl,
  unfollow,
} from "../../service/SnSkappService";
import Spiner from "../AppsComp/Spiner";
import UserCard from "./UserCard";

const useStyles = makeStyles(({ palette }) => ({
  table: {
    minWidth: 850,
  },
  lightPaper: {
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
        color: "#2A2C34",
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
      color: "#2A2C34",
    },
    "& tbody th svg": {
      marginRight: 10,
    },
  },
  darkPaper: {
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
      color: "#fff",
      "& th": {
        padding: 0,
        color: "#fff",
        // lineHeight: '',
        background: "#1E2029",
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
      color: "#fff",
      background: "#2A2C34",
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
      background: "#2A2C34",
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
  lightCheckBox: {
    color: '#4B5060'
  },
  darkCheckBox: {
    color: '#fff'
  },
  colorDanger: {
    color: "#FF6060",
  },
  devAvtar: {
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.3)",
  },
  followBtn: {
    width: 110,
    background: "#1DBF73!important",
    color: "#fff",

    "&:hover": {
      background: "#2A2C34!important",
      color: "#1DBF73",
      border: "1px solid #1DBF73!important",
    },
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
  // followBtn: {
  //   width: 110,
  //     background: palette.primary.main,
  //       color: palette.primary.contrastText,
  //         "&:hover": {
  //     background: palette.primary.main,
  //       color: palette.primary.contrastText,
  //   },
  // },
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
const DevTable = ({
  toggle,
  userList = [],
  followingList = [],
  toggleFollowing,
}) => {
  const [items, setItems] = useState([]);
  // const [alldata, setAlldata] = useState([]);
  const [user, setUser] = useState(null);
  const pageNumberRef = useRef(0);
  const prevPageNumberRef = useRef(undefined);
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

  const loadMoreUserDetails = useCallback(async () => {
    const pageNumber = pageNumberRef.current;
    const prevPageNumber = prevPageNumberRef.current;

    if (prevPageNumber === pageNumber || !userList.length) return;

    const idList = userList.slice(
      pageNumber * userPerPage,
      (pageNumber + 1) * userPerPage
    );

    const promiseList = idList.map(
      async (id) =>
        await Promise.all([
          getProfile(id),
          getFollowingCountForUser(id),
          getUsersPublishedAppsCount(id),
          Promise.resolve(id),
        ])
    );

    const results = await Promise.all(promiseList);

    const list = results.map((item) => {
      const profile = item[0] || {};
      profile.following = item[1] || 0;
      profile.appCount = item[2] || 0;
      profile.uid = item[3];

      return { ...profile };
    });

    pageNumberRef.current = pageNumber + 1;
    prevPageNumberRef.current = pageNumber;

    setItems((items) => [...items, ...list]);
  }, [userList]);

  const handleFollowing = (actionType, uid) => async () => {
    if (actionType === "follow") await follow(uid);
    else await unfollow(uid);

    toggleFollowing(uid);
  };

  const handleUserClick = (data) => () => {
    console.log(data);
    setUser(data);
  };

  useEffect(() => {
    loadMoreUserDetails();
  }, [loadMoreUserDetails]);

  return (
    <Fragment>
      <InfiniteScroll
        scrollableTarget="app-content"
        dataLength={items.length}
        next={loadMoreUserDetails}
        hasMore={userList.length > items.length}
        loader={<Spiner />}
        style={{ overflow: "none" }}
      >
        <TableContainer
          className={toggle ? classes.darkPaper : classes.lightPaper}
        >
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    color="primary"
                    className={toggle ? classes.darkCheckBox : classes.lightCheckBox}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>UserId</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>UserName </span>
                    {toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Location </span>
                    {toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Git ID </span>
                    {toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Following </span>
                    {toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Apps </span>
                    {toggle ? <ArrowsLight /> : <ArrowsDark />}
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
                      className={toggle ? classes.darkCheckBox : classes.lightCheckBox}
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
                      {/* <IconButton size="small">
                        <FontAwesomeIcon
                          className={classes.moreIconV}
                          size="small"
                          icon={MoreIcon}
                        />
                      </IconButton> */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteScroll>

      <UserCard
        toggle={toggle} 
        user={user}
        followingList={followingList}
        handleClose={handleDialogClose}
        handleFollowing={handleFollowing}
      />
    </Fragment>
  );
};

export default DevTable;