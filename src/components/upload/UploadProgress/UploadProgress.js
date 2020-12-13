import React, { useEffect, useState } from 'react';
import MinimizeOutlinedIcon from '@material-ui/icons/MinimizeOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import { connect } from 'react-redux';

// import { uploadFile } from '../../redux/uploadFile/uploadFile.actions'
import UploadItem from '../UploadItem/UploadItem';
import Styles from './UploadProgress.module.css';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.lightGreen}`,
    backgroundColor: theme.palette.headerBgColor,
    color: theme.palette.linksColor
  }
}));

const UploadProgress = props => {
  const { fileProgress, uploadFile } = props;
  const uploadedFileAmount = fileProgress.length;
  const [minimized, setMinimized] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    minimized && setMinimized(false);
  }, [uploadedFileAmount]);

  const toggleMinimize = () => setMinimized(!minimized);

  return uploadedFileAmount > 0 ? (
    <div className={`${Styles.wrapper} ${classes.root}`} style={minimized ? { overflowY: "hidden" } : {}}>
      <div className={Styles.uploadFileStatusTitle + " app-bg-color cursor-pointer"}
        onClick={toggleMinimize}>File Upload
        {!minimized && (<ArrowDropDownOutlinedIcon className="cursor-pointer" />)}
        {minimized && (<ArrowDropUpOutlinedIcon className="cursor-pointer" />)}
      </div>
      <div className={Styles.progressContainer} style={minimized ? { height: 0 } : {}}>
        {fileProgress && fileProgress.length > 0
          ? fileProgress.map((fileObj, i) => <UploadItem key={i} file={fileObj} />)
          : null}
      </div>
    </div>
  ) : null
}

const mapStateToProps = state => ({
  fileProgress: state.snUploadList
})

// const mapDispatchToProps = dispatch => ({
//   uploadFile: files => dispatch(uploadFile(files)),
// })

export default connect(mapStateToProps)(UploadProgress)
