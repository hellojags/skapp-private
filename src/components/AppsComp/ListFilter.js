import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { ReactComponent as FilterIcon } from '../../assets/img/icons/Filter, Settings, Sort.svg'
import { ReactComponent as SortIcon } from '../../svg/sort.svg'

// import ImportExportIcon from '@material-ui/icons/ImportExport'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { getAllPublishedAppsAction } from '../../redux/action-reducers-epic/SnAllPublishAppAction'
const useStyles = makeStyles(theme => ({
    dropArrow: {
        color: '#323232'
    },
    lightUtilBtn: {
        background: '#fff',
        textTransform: 'none',
        minWidth: '175px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px 1px 2px #15223214',
        border: '1px solid #7070701A;',
        '&:hover': {
            background: '#1DBF73',
            color: '#fff'
        },
        '@media only screen and (max-width: 1249px)': {
            marginLeft: '1rem'
        }
    },
    darkUtilBtn: {
        background: '#2A2C34',
        textTransform: 'none',
        minWidth: '175px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px 1px 2px #15223214',
        border: '1px solid #7070701A;',
        '&:hover': {
            background: '#1DBF73',
            color: '#7E84A3'
        },
        '@media only screen and (max-width: 1249px)': {
            marginLeft: '1rem'
        }
    },
    darkLists: {
        background: '#2A2C34',
        color: '#fff'
    },
    lightLists: {
        background: '#fff',
        color: '#000'
    },
    textColor: {
        color: '#7E84A3'
        // color: '#fff'
    },
    popper: {
        zIndex: 9,
    }
}))
function ListFilter({toggle}) {
    const { width } = useWindowDimensions()
    const classes = useStyles()
    const dispatch = useDispatch()
    const [filterVal, setFilterVal] = React.useState('ACCESS DESC')
    const [open, setOpen] = React.useState(false)
    useEffect(() => {
        if (filterVal) {
            const filterBy = filterVal.split(" ")
            console.log('split ', filterBy)
            dispatch(getAllPublishedAppsAction(filterBy[0], filterBy[1], 0))
        }
    }, [filterVal])
    const anchorRef = React.useRef(null)
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }

        setOpen(false)
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault()
            setOpen(false)
        }
    }
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open)
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }

        prevOpen.current = open
    }, [open])
    const handleChange = (event) => {
        setFilterVal(event.target.dataset.value)
        handleClose(event)
    }
    const selectData = {
        'ACCESS DESC': "Access Count (Highest first)",
        'VIEWS DESC': "View Count (Highest first)",
        'LIKES DESC': "Like Count (Highest first)",
        'FAVORITES DESC': "Favorite Count (Highest first)",
        'ACCESS ASC': "Access Count (Lowest first)",
        'VIEWS ASC': "View Count (Lowest first)",
        'LIKES ASC': "Like Count (Lowest first)",
        'FAVORITES ASC': "Favorite Count (Lowest first)"
    }
    return (
        < Fragment >

            <Button
                className={`${toggle ? classes.darkUtilBtn : classes.lightUtilBtn} ${classes.textColor}`}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <span className="sortIcon-container">
                    <SortIcon /></span>

                {/* <FilterIcon> </FilterIcon> */}

                <span className="secon-nav__ItemText">

                    {/* {width <= 575 ? 'Sort' : 'Most Accessed First'}  */}
                    {selectData[filterVal]}

                </span>


            </Button >

            <Popper className={classes.popper} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList className={toggle ? classes.darkLists : classes.lightLists} autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    {/* <MenuItem data-value="">Access Count (Highest first)</MenuItem> */}
                                    <MenuItem data-value="ACCESS DESC" onClick={handleChange}>Access Count (Highest first)</MenuItem>
                                    <MenuItem data-value="VIEWS DESC" onClick={handleChange}>View Count (Highest first)</MenuItem>
                                    <MenuItem data-value="LIKES DESC" onClick={handleChange}>Like Count (Highest first)</MenuItem>
                                    <MenuItem data-value="FAVORITES DESC" onClick={handleChange}>Favorite Count (Highest first)</MenuItem>
                                    {/* <MenuItem  onClick={handleChange}>Published Date (Latest first)</MenuItem>
                        <MenuItem  onClick={handleChange}>Update Date (Latest first)</MenuItem> */}
                                    <MenuItem data-value="ACCESS ASC" onClick={handleChange}>Access Count (lowest first)</MenuItem>
                                    <MenuItem data-value="VIEWS ASC" onClick={handleChange}>View Count (lowest first)</MenuItem>
                                    <MenuItem data-value="LIKES ASC" onClick={handleChange}>Like Count (lowest first)</MenuItem>
                                    <MenuItem data-value="FAVORITES ASC" onClick={handleChange}>Favorite Count (lowest first)</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Fragment >
    )
}

export default ListFilter