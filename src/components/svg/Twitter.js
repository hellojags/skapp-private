import React from "react"
import PropTypes from "prop-types"

export default function Twitter({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width={32}
      height={36}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 0a4 4 0 014 4v24a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4h24zm-8.7 10.182c-1.73 0-3.131 1.48-3.131 3.304 0 .26.026.512.08.753-2.604-.138-4.912-1.452-6.459-3.453a3.436 3.436 0 00-.424 1.662c0 1.146.554 2.158 1.394 2.751a3.021 3.021 0 01-1.42-.413v.04c0 1.603 1.08 2.938 2.515 3.241-.264.078-.54.116-.827.116-.201 0-.398-.02-.589-.058.399 1.312 1.556 2.269 2.927 2.294a6.083 6.083 0 01-4.639 1.37 8.544 8.544 0 004.803 1.484c5.765 0 8.915-5.036 8.915-9.403 0-.144-.002-.286-.008-.427A6.55 6.55 0 0024 11.73a6.005 6.005 0 01-1.8.52 3.28 3.28 0 001.378-1.827 6.076 6.076 0 01-1.99.802 3.05 3.05 0 00-2.287-1.044z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

Twitter.propTypes = {
  className: PropTypes.string,
}
