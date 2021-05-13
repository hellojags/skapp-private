import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import moment from "moment";
import React from "react";

const useStyles = makeStyles({
  ratingDiv: {
    marginLeft: "1rem",
    "& svg": {
      color: "#FFD700",
      "@media only screen and (max-width: 575px)": {
        fontSize: "10px",
      },
    },
  },
  AppComment: {
    display: "flex",
    maxWidth: 715,
    marginBottom: 10,
    color: (props) => (props.toggle ? "white" : "inherit"),
  },
  opcity60: {
    opacity: ".60",
    "@media only screen and (max-width: 575px)": {
      fontSize: "10px",
    },
  },
  commenterName: {
    "@media only screen and (max-width: 575px)": {
      fontSize: "14px",
    },
  },
  ratingAndName: {
    marginLeft: "1.1rem",
    "@media only screen and (max-width: 575px)": {
      marginLeft: "10px",
    },
  },
  commenterImg: {
    maxWidth: 80,
    "@media only screen and (max-width: 575px)": {
      minWidth: 80,
    },
    "& > img": {
      borderRadius: 5,
      width: "100%",
    },
  },
});

const AppComment = ({ uid: id, commentList, toggle, handleDeleteComment }) => {
  const classes = useStyles({ toggle });
  // const dispatch = useDispatch();
  // const { appCommentsStore } = useSelector(
  //   (state) => state.snPublishedAppsStore
  // );
  // const [data, setData] = React.useState();

  // React.useEffect(() => {
  //   if (id) {
  //     dispatch(getAppCommentAction(id));
  //   }
  // }, [dispatch, id]);

  // React.useEffect(() => {
  //   if (appCommentsStore) {
  //     setData(appCommentsStore);
  //   }
  // }, [appCommentsStore]);

  // console.log("=========>", data);

  return (
    <div>
      {commentList?.map((i, index) => {
        return (
          <Box key={index} display="flex" className={classes.AppComment}>
            <Box
              className={classes.commenterImg}
              borderRadius="5px"
              overflow="hidden"
            >
              <img src="https://i.pravatar.cc/80" alt="" />
            </Box>
            <Box className={classes.ratingAndName}>
              <Box display="flex" alignItems="center">
                <h3 className={classes.commenterName}>Marquise Vasquez</h3>
              </Box>
              <Box>
                <Typography variant="caption" className={classes.opcity60}>
                  {moment(i.timestamp).format("MMMM D, YYYY | hh:mm A")}
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  className={classes.opcity60}
                >
                  {i.comment}
                </Typography>
              </Box>
            </Box>

            <Box height="100%" ml="2rem">
              <IconButton
                color="inherit"
                size="small"
                onClick={handleDeleteComment(index)}
              >
                <Close fontSize="small" color="error" />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </div>
  );
};

export default AppComment;
