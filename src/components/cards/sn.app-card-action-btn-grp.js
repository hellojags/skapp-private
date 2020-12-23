import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import { withStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined"
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline"
import EditOutlinedIcon from "@material-ui/icons/EditOutlined"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined"
import React from "react"
import { CATEGORY_OBJ } from "../../sn.category-constants"
import { getCompatibleTags } from "../../sn.constants"
import useStyles from "./sn.app-card.styles"

class SnAppCardActionBtnGrp extends React.Component {
  render() {
    const { app, classes } = this.props
    return (
      <>
        <div
          style={{
            //   marginTop: 8,
            // marginBottom: 10,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {(this.props.hideTags == null || !this.props.hideTags) &&
            app.tags?.length > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: 10,
                  }}
                >
                  <div>
                    {app.type != null &&
                      getCompatibleTags(app.type).map((category, idx) =>
                        CATEGORY_OBJ[category] != null ? (
                          <Chip label={category} size="small" />
                        ) : (
                          <></>
                        )
                      )}
                  </div>
                </div>
              </>
            )}
          {this.props.hash == null && (
            <div style={{ marginLeft: "auto" }}>
              {false &&
                (this.props.hideAdd == null || this.props.hideAdd === false) && (
                  <Tooltip title="Add to other Spaces" arrow>
                    <IconButton onClick={this.props.onAdd}>
                      <AddCircleOutlineOutlinedIcon
                        className={classes.tagEditIcon}
                      />
                    </IconButton>
                  </Tooltip>
                )}

              <Tooltip title="Mark Favorite" arrow>
                <IconButton onClick={this.props.onFavorite}>
                  <FavoriteBorderIcon className={classes.tagEditIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share with others" arrow>
                <IconButton onClick={this.props.onShare}>
                  <ShareOutlinedIcon className={classes.tagEditIcon} />
                </IconButton>
              </Tooltip>
              {this.props.displayInfoBtn && (
                <Tooltip title="View Details" arrow>
                  <IconButton onClick={this.props.onEdit}>
                    <InfoOutlinedIcon className={classes.tagEditIcon} />
                  </IconButton>
                </Tooltip>
              )}
              {this.props.displayEditBtn && (
                <Tooltip title="Edit Skapp" arrow>
                  <IconButton onClick={this.props.onEdit}>
                    <EditOutlinedIcon className={classes.tagEditIcon} />
                  </IconButton>
                </Tooltip>
              )}
              {this.props.hideDelete === false && false && (
                <Tooltip title="Remove from this Space" arrow>
                  <IconButton onClick={this.props.onDelete} color="secondary">
                    <DeleteOutlineIcon className={classes.tagEditIcon} />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
          {this.props.hash != null && (
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Mark Favorite" arrow>
                <IconButton onClick={this.props.onFavorite}>
                  <FavoriteBorderIcon className={classes.tagEditIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share with others" arrow>
                <IconButton onClick={this.props.onShare}>
                  <ShareOutlinedIcon className={classes.tagEditIcon} />
                </IconButton>
              </Tooltip>
              {this.props.displayInfoBtn && (
                <Tooltip title="View Details" arrow>
                  <IconButton onClick={this.props.onEdit}>
                    <InfoOutlinedIcon className={classes.tagEditIcon} />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </>
    )
  }
}

export default withStyles(useStyles)(SnAppCardActionBtnGrp)
