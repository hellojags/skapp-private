import React, { Fragment, useEffect, useState } from "react";
import { getComment, setComment } from "../../service/SnSkappService";
import AppComment from "./AppComment";
import CommentForm from "./CommentForm";

const AppComments = ({ uid, version, toggle }) => {
  const [commentList, setCommentList] = useState([]);

  const getCommentObject = (list) => {
    return {
      $type: "skapp",
      $subType: "comments",
      id: uid,
      version: version,
      prevSkylink: "",
      content: {
        comments: list,
      },
      ts: "1610328319",
    };
  };

  const handleAddComment = async (comment) => {
    const list = [...commentList, { timestamp: new Date(), comment }];

    const obj = getCommentObject(list);

    await setComment(obj);
    setCommentList(list);
  };

  const handleDeleteComment = (index) => async () => {
    commentList.splice(index, 1);
    const obj = getCommentObject(commentList);

    await setComment(obj);
    setCommentList([...commentList]);
  };

  useEffect(() => {
    if (uid) {
      getComment(uid).then((data) => {
        if (data) setCommentList(data?.content?.comments || []);
      });
    }
  }, [uid]);

  return (
    <Fragment>
      <AppComment
        uid={uid}
        toggle={toggle}
        commentList={commentList}
        handleDeleteComment={handleDeleteComment}
      />
      <CommentForm
        toggle={toggle}
        uid={uid}
        version={version}
        handleAddComment={handleAddComment}
      />
    </Fragment>
  );
};

export default AppComments;
