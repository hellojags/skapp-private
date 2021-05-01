import React from "react"

import "./SnDisclaimer.css"

function SnDisclaimer(props) {
  return (
    <div className="container-fluid">
      <div className="c2-main-div">
        <div className="icon-c2-main-div">
          <svg
            width="3em"
            height="3em"
            viewBox="0 0 16 16"
            className="bi bi-exclamation-circle"
            fill="darkgray"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
          </svg>
        </div>
        <div className="desc-c2-div">
          Content uploaded using Skapp is not encrypted yet.
        </div>
      </div>
    </div>
  )
}
export default SnDisclaimer
