import React from "react"
import { useTheme } from "@material-ui/core/styles"
import Popover from "@material-ui/core/Popover"
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined"
import useStyles from "./sn.view-more.styles"

export default function SnViewMore(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  return (
    <div className="most_main_grid_gallery">
      {/* <IconButton> */}
      <MoreVertOutlinedIcon
        onClick={handleClick}
        style={{ color: "#1ed660", cursor: "pointer" }}
      />
      {/* </IconButton> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {props.children}
      </Popover>
    </div>
  )
}
