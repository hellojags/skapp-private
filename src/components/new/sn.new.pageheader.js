import React from "react"

const getPageHeader = (isRegister, isEdit) => {
  if (isRegister) {
    return <div className="mb-0 text-gray-800">Register</div>
  }
  if (isEdit) {
    return <div className="mb-0 text-gray-800">Edit</div>
  }
  return <div className="mb-0 text-gray-800">View</div>
}

const SNNewPageheader = (props) => (
  <div className="mb-4 register-header-container center-xs-dn">
    {getPageHeader(props.isRegister, props.edit)}
  </div>
)

export default SNNewPageheader
