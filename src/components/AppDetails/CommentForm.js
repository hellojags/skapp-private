import { Box, Button, CircularProgress, makeStyles } from "@material-ui/core";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import React, { useState } from "react";

const useStyles = makeStyles({
  lightTextarea: {
    fontSize: "18px",
    background: "#fff",
    boxShadow: "0px 1px 2px #15223214",
    border: "1px solid #7070701A",
    borderRadius: "5px",
    // minHeight: '90px',
    width: `100%`,
    maxWidth: "740px",
    resize: "none",
    padding: "1rem",
    color: "rgba(126, 132, 163 , 1)",
    "&:focus": {
      outline: "none!important",
      border: "1px solid #1DBF73",
    },
    "&:placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    "&::-webkit-input-placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    "&:-moz-placeholder": {
      /* Firefox 18- */ color: "rgba(126, 132, 163 , .32)",
    },
    "&::-moz-placeholder": {
      /* Firefox 19+ */ color: "rgba(126, 132, 163 , .32)",
    },
    " &:-ms-input-placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    "&::placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    marginTop: "1rem",
  },
  darkTextarea: {
    fontSize: "18px",
    background: "#2A2C34",
    boxShadow: "0px 1px 2px #15223214",
    border: "1px solid #7070701A",
    borderRadius: "5px",
    // minHeight: '90px',
    width: `100%`,
    maxWidth: "740px",
    resize: "none",
    padding: "1rem",
    color: "rgba(126, 132, 163 , 1)",
    "&:focus": {
      outline: "none!important",
      border: "1px solid #1DBF73",
    },
    "&:placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    "&::-webkit-input-placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    "&:-moz-placeholder": {
      /* Firefox 18- */ color: "rgba(126, 132, 163 , .32)",
    },
    "&::-moz-placeholder": {
      /* Firefox 19+ */ color: "rgba(126, 132, 163 , .32)",
    },
    " &:-ms-input-placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    "&::placeholder": {
      color: "rgba(126, 132, 163 , .32)",
    },
    marginTop: "1rem",
  },
  button: {
    background: "#1DBF73!important",
    boxShadow: "0px 1px 2px #00000029",
    borderRadius: 4,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    minWidth: 180,
    maxWidth: 200,
    paddingTop: 7,
    paddingBottom: 7,
    fontSize: "16px",
    marginTop: "1rem",
    "@media only screen and (max-width: 575px)": {
      margin: "auto",
      marginTop: ".2rem",
    },
  },
});

const CommentForm = ({ uid, version, handleAddComment, toggle }) => {
  const classes = useStyles();
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = useState(false);

  // const dispatch = useDispatch();

  const submitComment = async () => {
    if (comment === "") {
    } else {
      setLoading(true);
      await handleAddComment(comment);
      setLoading(false);
      // let obj = {
      //   $type: "skapp",
      //   $subType: "comments",
      //   id: uid,
      //   version: version,
      //   prevSkylink: "",
      //   content: {
      //     comments: [{ timestamp: new Date(), comment: comment }],
      //   },
      //   ts: "1610328319",
      // };
      // dispatch(setAppCommentAction(obj));
      setComment("");
    }
  };

  return (
    <form>
      <TextareaAutosize
        className={toggle ? classes.darkTextarea : classes.lightTextarea}
        aria-label="minimum height"
        rowsMin={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your Comment"
      />
      <Button className={classes.button} onClick={submitComment}>
        {loading && (
          <Box display="flex" alignItems="center" mr="0.5rem">
            <CircularProgress color="secondary" size={18} />
          </Box>
        )}
        Submit
      </Button>
    </form>
  );
};

export default CommentForm;
