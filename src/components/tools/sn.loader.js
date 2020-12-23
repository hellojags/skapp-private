import React from "react"
import { connect } from "react-redux"
import { mapStateToProps } from "./sn.loader.container"
import "./sn.loader.styles.css"

function SnLoader(props) {
  return (
    <>
      {props.isShowing && (
        <div className="sn-loader-overlay">
          <div className="loader" />
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(SnLoader)
