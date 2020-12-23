import React from "react"
import "./sn.footer.css"
import { Link } from "react-router-dom"

const SnFooter = () => (
  <div className="container-fluid">
    <div className="row c4-row-div">
      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 image-logo_col-footer" />
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-8">
        <div className="ccolm2-main-div">
          {/* donate */}
          <Link
            rel="noopener noreferrer"
            href="https://github.com/skynethubio/skhub-appstore-ui#donation"
            target="_blank"
            className="span-donate"
          >
            Donate
          </Link>
          {/* Privacy */}
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://skyspace.hns.siasky.net/skapp/SkySpaces-Privacy Notice.pdf"
            className="span-privacy"
          >
            Privacy
          </Link>
          {/* Terms */}
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://skyspace.hns.siasky.net/skapp/SkySpaces-Terms.pdf"
            className="span-terms"
          >
            Terms
          </Link>

          {/* twitter icon */}
          <a
            href="https://twitter.com/HelloSkySpaces"
            target="_blank"
            rel="noopener noreferrer"
            className="span-twitter"
          >
            <i className="fab fa-twitter" />
          </a>
          {/* discord */}
          <a
            href="https://discord.gg/w7TWJR"
            target="_blank"
            rel="noopener noreferrer"
            className="span-twitter"
          >
            <i className="fab fa-discord" />
          </a>
          {/* comment icon */}
          <a
            href="https://feedback-skyspaces.herokuapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="span-twitter"
          >
            <i className="far fa-comment" />
          </a>
          {/* envelop icon */}
          <a
            href="mailto:hello@skyspaces.io"
            target="_blank"
            rel="noopener noreferrer"
            className="span-twitter"
          >
            <i className="far fa-envelope" />
          </a>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-2 col-12" />
    </div>
  </div>
)

export default SnFooter
