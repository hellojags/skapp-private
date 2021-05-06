import React, { Fragment } from "react";
import AppComment from "./AppComment";
import CommentForm from "./CommentForm";

const AppComments = ({uid,version, toggle}) => {
  return (
    <Fragment>
      <AppComment />
      {/* <AppComment />

      <AppComment />

      <AppComment />

      <AppComment /> */}
      <CommentForm toggle={toggle} uid={uid} version={version} />
    </Fragment>
  );
};

export default AppComments;
