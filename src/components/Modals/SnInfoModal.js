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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function SnInfoModal({ open, onClose, type, title, content, showClipboardCopy=false, clipboardCopyTooltip, ...props }) {
  // class SnInfoModal extends React.Component {
  const displayContent = () => {
    switch (type) {
      case 'public-share':
        return (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Skylinks are available at the following public link :
          </DialogContentText>
            <DialogContentText>
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
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
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
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {displayContent()}
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          variant="contained"
          color="primary"
          className="btn-bg-color"
          startIcon={<DoneIcon />}
        >
          OK
          </Button>
      </DialogActions>
    </Dialog>
  );
};