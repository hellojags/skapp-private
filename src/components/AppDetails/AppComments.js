import React, { Fragment } from "react";
import AppComment from "./AppComment";
import CommentForm from "./CommentForm";

const AppComments = ({uid,version}) => {
  return (
    <Fragment>
      <AppComment />
      {/* <AppComment />

      <AppComment />

      <AppComment />

      <AppComment /> */}
      <CommentForm uid={uid} version={version} />
    </Fragment>
  );
};

export default AppComments;
