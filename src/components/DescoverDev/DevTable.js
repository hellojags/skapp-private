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
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ReactComponent as ArrowsLight } from '../../assets/img/icons/arrows-diagrams-02-light.svg'
import { ReactComponent as ArrowsDark } from '../../assets/img/icons/arrows-diagrams-02-dark.svg'
import { getPortalUrl } from '../../service/skynet-api'

const useStyles = makeStyles(({ palette }) => ({
  table: {
    minWidth: 850,
  },
  lightPaper: {
    marginTop: 10,
      "& th, & td": {
      border: 0,
      },
    '& tbody tr th ~ td:not(:last-child)': {
      color: '#6E77AA',
        fontWeight: 'normal'
    },
    '& tbody th': {
      fontWeight: 700
    },
    '& thead': {

      '& th': {
        padding: 0,
          color: '#2A2C34',
            // lineHeight: '',
            background: '#F0F5F7',
              '& svg': {
          marginLeft: '5px',
            width: 18,
              },
        '&:first-child': {
          borderRadius: '5px 0 0px 5px',
            paddingLeft: 5
        },
        '&:last-child': {
          paddingRight: 10,
            borderRadius: '0px 5px 5px 0px'
        }
      }
    },
    '& tr th, & tr td': {
      padding: '10px 0',
        fontSize: 18,
          '@media only screen and (max-width: 1440px)': {
        fontSize: 16
      },
    },
    '& tr th': {
      '&:first-child': {
        borderRadius: '5px 0 0px 5px'
      },
      '&:last-child': {
        borderRadius: '0px 5px 5px 0px'
      }
    },
    '& tr td': {
      borderBottom: '1px solid #7070702b',
        '&:first-child': {

        paddingLeft: 5
      },
      '&:last-child': {
        paddingRight: 10,

          }
    },
    '& table': {
      borderCollapse: 'separate',
        borderSpacing: '0 8px'
    },
    '& tbody tr td,& tbody tr th': {
      background: '#fff',
        color: '#2A2C34'
    },
    '& tbody th svg': {
      marginRight: 10
    }
  },
  darkPaper: {
    marginTop: 10,
      "& th, & td": {
      border: 0,
      },
    '& tbody tr th ~ td:not(:last-child)': {
      color: '#6E77AA',
        fontWeight: 'normal'
    },
    '& tbody th': {
      fontWeight: 700
    },
    '& thead': {
      color: '#fff',
        '& th': {
        padding: 0,
          color: '#fff',
            // lineHeight: '',
            background: '#1E2029',
              '& svg': {
          marginLeft: '5px',
            width: 18,
              },
        '&:first-child': {
          borderRadius: '5px 0 0px 5px',
            paddingLeft: 5
        },
        '&:last-child': {
          paddingRight: 10,
            borderRadius: '0px 5px 5px 0px'
        }
      }
    },
    '& tr th, & tr td': {
      padding: '10px 0',
        fontSize: 18,
          '@media only screen and (max-width: 1440px)': {
        fontSize: 16
      },
    },
    '& tr th': {
      '&:first-child': {
        borderRadius: '5px 0 0px 5px'
      },
      '&:last-child': {
        borderRadius: '0px 5px 5px 0px'
      }
    },
    '& tr td': {
      borderBottom: '1px solid #7070702b',
        '&:first-child': {

        paddingLeft: 5
      },
      '&:last-child': {
        paddingRight: 10,

          }
    },
    '& table': {
      borderCollapse: 'separate',
        borderSpacing: '0 8px'
    },
    '& tbody tr td,& tbody tr th': {
      color: '#fff',
        background: '#2A2C34',
      },
    '& tbody th svg': {
      marginRight: 10
    }
  },

  statusWorking: {
    color: '#1DBF73'
  },
  statusError: {
    color: '#FF6060'
  },
  arrow: {
    marginLeft: 10
  },
  menuAction: {
    marginTop: '3.4rem',
      '& ul': {
      minWidth: 230,
        '& li': {
        fontSize: 18,
          paddingBottom: 12,
            '@media only screen and (max-width: 1440px)': {
          fontSize: 16
        }
      }
    },
    '& .MuiPaper-root': {
      background: '#2A2C34',
        boxShadow: '0px 3px 6px #00000029',
          border: '1px solid #7070704F', overflow: 'visible'
    },
    '& .MuiPaper-root::before': {
      content: '""',
        width: 0,
          height: 0,
            borderTop: '14px solid transparent',
              borderBottom: '14px solid transparent',
                borderRight: '14px solid #70707057',
                  position: 'absolute',
                    top: '-22px',
                      right: 19,
                        transform: 'rotate(90deg)'
    },
    '& .MuiPaper-root::after': {
      content: '""',
        width: 0,
          height: 0,
            borderTop: '14px solid transparent',
              borderBottom: '14px solid transparent',
                borderRight: '14px solid #fff',
                  // position: 'relative',
                  position: 'absolute',
                    top: '-21px',
                      right: 19,
                        transform: 'rotate(90deg)'
    }
  },
  lightCheckBox: {
    color: '#4B5060'
  },
  darkCheckBox: {
    color: '#fff'
  },
  colorDanger: {
    color: '#FF6060'
  },
  devAvtar: {
    borderRadius: '50%',
      border: '1px solid rgba(0,0,0,0.3)'
  },
  followBtn: {
      width: 110,
      background: '#1DBF73!important',
      color: '#fff',

      '&:hover': {
          background: '#2A2C34!important',
          color: '#1DBF73',
          border: '1px solid #1DBF73!important'
      }
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
    transform: 'rotate(90deg)'
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
const DevTable = ({ toggle, userList = [], followingList = [], toggleFollowing }) => {
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
    let skyUrl = getPortalUrl() + `${siaUrl.slice(6)}`;
    return skyUrl;
  };

  useEffect(() => {
    loadMoreUserDetails();
  }, [loadMoreUserDetails]);

  console.log(userList.length);
  console.log(items.length);

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
        <TableContainer className={toggle ? classes.darkPaper : classes.lightPaper}>
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
                    <span>UserName </span>{toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Location </span>{toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Git ID </span>{toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Following </span>{toggle ? <ArrowsLight /> : <ArrowsDark />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Apps </span>{toggle ? <ArrowsLight /> : <ArrowsDark />}
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
        user={user}
        followingList={followingList}
        handleClose={handleDialogClose}
        handleFollowing={handleFollowing}
      />
    </Fragment>
  );
};

export default DevTable;

const dummyList = [
  "00ccb974591621494f2c4302261c13dfac017f3ff9206c657713ec5f3ecb52ff",
  "d88144039b7e605de05836febb0d184899b7556133e0bd568b56d54f1545fe69",
  "6873b70f00d1234124dc55cc1e1642e0c43804445a113ae9c76c15e38a5e0571",
  "c39da7010692d55a6550aebd6f5f2b2a23e7d26280621367a447628c544053e3",
  "5a27a1c4eec1cb0a55d910ce0eff4073f7ddd58d37de0a64f92c2356d61a8a94",
  "4bd7c9b9d3fc03dfcdbd14590fac9e6f97801c87a38bfcc262d86fba5b9439a6",
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
