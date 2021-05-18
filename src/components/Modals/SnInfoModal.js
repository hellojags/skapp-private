import React from "react";
import Dialog from "@material-ui/core/Dialog";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  lightRoot: {
    background: '#fff',
  },
  darkRoot: {
    background: '#2A2C34',
  },
  lightText: {
    background: '#fff',
    color: '#2A2C34'
  },
  darkText: {
    background: '#2A2C34',
    color: '#fff'
  },
  submitBtn: {
    background: '#1DBF73!important',
    color: '#fff',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    display: 'inlin-flex',
    alignItems: 'center',
    minWidth: 130,
    '& svg': {
      fontSize: '19px',
      marginRight: '5px'
    },
    '@media only screen and (max-width: 575px)': {
      fontSize: '12px',

      paddingLeft: '.5rem',
      paddingRight: '.5rem',
      minWidth: 70,
    }
  },
}));

export default function SnInfoModal({ open, onClose, type, title, content, showClipboardCopy = false, clipboardCopyTooltip, toggle, ...props }) {
  // class SnInfoModal extends React.Component {
  const classes = useStyles();
  const displayContent = () => {
    switch (type) {
      case 'public-share':
        return (
          <DialogContent className={toggle ? classes.darkRoot : classes.lightRoot}>
            <DialogContentText id="alert-dialog-description">
              Skylinks are available at the following public link :
          </DialogContentText>
            <DialogContentText className={toggle ? classes.darkText : classes.lightText}>
              <>
                {content}<Tooltip title="Copy Skylink to clipboard" arrow>
                  <FileCopyOutlinedIcon
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="cursor-pointer"
                    style={{ paddingLeft: 5 }}
                  />
                </Tooltip>
              </>
            </DialogContentText>
          </DialogContent>
        );
      default:
        return (
          <DialogContent className={toggle ? classes.darkRoot : classes.lightRoot}>
            <DialogContentText id="alert-dialog-description" className={toggle ? classes.darkText : classes.lightText}>
              {content}{showClipboardCopy && (
                <Tooltip title={clipboardCopyTooltip || "Copy To Clipboard"} arrow>
                  <FileCopyOutlinedIcon
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="cursor-pointer"
                    style={{ paddingLeft: 5 }}
                  />
                </Tooltip>)}
            </DialogContentText>
          </DialogContent>
        );
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="lg"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={toggle ? classes.darkText : classes.lightText}>{title}</DialogTitle>
      {displayContent()}
      <DialogActions className={toggle ? classes.darkRoot : classes.lightRoot}>
        <Button
          onClick={onClose}
          autoFocus
          variant="contained"
          className={classes.submitBtn}
          startIcon={<DoneIcon />}
        >
          OK
          </Button>
      </DialogActions>
    </Dialog>
  );
};