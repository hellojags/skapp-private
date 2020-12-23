/* eslint-disable no-use-before-define */
import React, { useEffect } from "react"
import useAutocomplete from "@material-ui/lab/useAutocomplete"
import NoSsr from "@material-ui/core/NoSsr"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import styled from "styled-components"
import { useTheme } from "@material-ui/core"

const InputWrapper = styled("div")`
  width: 300px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`

const Listbox = styled("ul")`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`
/*
props : {
  list <input list> : [],
  onChange <method that gets invoked on value change> : ()
  titleKey <key of the list object that will be displayed on the box. do not enter any value if list of string> : string
  labelKey <> :  string
}
*/
export default function AutoFieldsCustomizedHook(props) {
  const theme = useTheme()

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    defaultValue: props.defaultValue ? [props.defaultValue] : [],
    multiple: true,
    options: props.list,
    getOptionLabel: (option) => option,
  })

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [props, value])

  return (
    <NoSsr>
      <div className="AF_main_div">
        <div {...getRootProps()}>
          <InputWrapper
            ref={setAnchorEl}
            className={focused ? "focused" : ""}
            style={{
              borderRadius: "100px",
              width: "100%",
              padding: "5px 10px",
              backgroundColor: theme.palette.headerBgColor,
            }}
          >
            {value.map((option, index) => (
              <Tag
                label={props.titleKey ? option[props.titleKey] : option}
                {...getTagProps({ index })}
                style={{
                  background: "#DAFDE7",
                  color: "#636f70",
                  fontSize: "10px",
                  borderRadius: "50px",
                }}
              />
            ))}

            <input
              {...getInputProps()}
              placeholder="Select Spaces"
              style={{
                borderRadius: "100px",
                backgroundColor: theme.palette.headerBgColor,
                color: theme.palette.linksColor,
              }}
            />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>
                <span>{props.labelKey ? option[props.labelKey] : option}</span>
                <CheckIcon fontSize="small" />
              </li>
            ))}
          </Listbox>
        ) : null}
      </div>
    </NoSsr>
  )
}
