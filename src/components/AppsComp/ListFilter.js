import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, ClickAwayListener, FormControl, Grow, InputLabel, MenuItem, MenuList, Paper, Popper, Select } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { ReactComponent as FilterIcon } from '../../assets/img/icons/Filter, Settings, Sort.svg'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { getAllPublishedAppsAction } from '../../redux/action-reducers-epic/SnAllPublishAppAction'
const useStyles = makeStyles(theme => ({
    dropArrow: {
        color: '#323232'
    },
    utilBtn: {
        background: '#fff',
        textTransform: 'none',
        minWidth: '175px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px 1px 2px #15223214',
        border: '1px solid #7070701A;',
        '&:hover': {
            background: '#fff'
        },
        '@media only screen and (max-width: 1249px)': {
            marginLeft: '1rem'
        }
    },
    textColor: {
        color: '#7E84A3'
    },
    popper: {
        zIndex: 9
    }
}))
function ListFilter() {
    const { width } = useWindowDimensions()
    const classes = useStyles()
    const dispatch = useDispatch()
    // const [open, setOpen] = React.useState(false)
    const [filterVal, setFilterVal] = useState('ACCESS DESC')
    const [open, setOpen] = React.useState(false)
    useEffect(() => {
        if (filterVal) {
            const filterBy = filterVal.split(" ")
            console.log('split ', filterBy)
            dispatch(getAllPublishedAppsAction(filterBy[0], filterBy[1], 0))
        }
    }, [filterVal])

    // const [open, setOpen] = React.useState(false)

    const handleChange = (event) => {
        setFilterVal(event.target.value)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    // function handleListKeyDown(event) {
    //     if (event.key === 'Tab') {
    //         event.preventDefault()
    //         setOpen(false)
    //     }
    // }
    // return focus to the button when we transitioned from !open -> open
    // const prevOpen = React.useRef(open)
    // React.useEffect(() => {
    //     if (prevOpen.current === true && open === false) {
    //         anchorRef.current.focus()
    //     }

    //     prevOpen.current = open
    // }, [open])

    return (

        < Fragment >
            <div>
                {/* <Button className={classes.button} onClick={handleOpen}>
                    Open the select
      </Button> */}
                <FormControl className={classes.formControl}>
                    {/* <InputLabel id="demo-controlled-open-select-label"></InputLabel> */}
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={filterVal}
                        onChange={handleChange}
                    >
                        {/* <MenuItem value="">
                            <em>Sort By
                            </em>
                        </MenuItem> */}
                        <MenuItem value="ACCESS DESC" onClick={handleClose}>Access Count (Highest first)</MenuItem>
                        <MenuItem value="VIEWS DESC" onClick={handleClose}>View Count (Highest first)</MenuItem>
                        <MenuItem value="LIKES DESC" onClick={handleClose}>Like Count (Highest first)</MenuItem>
                        <MenuItem value="FAVORITES DESC" onClick={handleClose}>Favorite Count (Highest first)</MenuItem>
                        {/* <MenuItem onClick={handleClose}>Published Date (Latest first)</MenuItem>
                        <MenuItem onClick={handleClose}>Update Date (Latest first)</MenuItem> */}
                        <MenuItem value="ACCESS ASC" onClick={handleClose}>Access Count (lowest first)</MenuItem>
                        <MenuItem value="VIEWS ASC" onClick={handleClose}>View Count (lowest first)</MenuItem>
                        <MenuItem value="LIKES ASC" onClick={handleClose}>Like Count (lowest first)</MenuItem>
                        <MenuItem value="FAVORITES ASC" onClick={handleClose}>Favorite Count (lowest first)</MenuItem>
                        {/* <MenuItem onClick={handleClose}>Published Date (Oldest first)</MenuItem>
                        <MenuItem onClick={handleClose}>Update Date (Oldest first)</MenuItem> */}
                    </Select>
                </FormControl>
            </div>

            {/* <Button
                className={`${classes.utilBtn} ${classes.textColor}`}
                // ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
            // onClick={handleToggle}
            >
                <FilterIcon> </FilterIcon>

                <span className="secon-nav__ItemText">

                    {width <= 575 ? 'Sort' : 'Most Accessed First'}

                </span>

                {open ? <ExpandLess className={classes.dropArrow} /> : <ExpandMore className={classes.dropArrow} />}
            </Button>


            <Popper className={classes.popper} open={open} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                {/* <InputLabel id="demo-controlled-open-select-label">Age</InputLabel> */}
            {/* <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={filterVal}
                onChange={handleChange}
            >
                <MenuItem data-sort="ACESS DESC" onClick={handleClose}>Access Count (Highest first)</MenuItem>
                <MenuItem onClick={handleClose}>View Count (Highest first)</MenuItem>
                <MenuItem onClick={handleClose}>Like Count (Highest first)</MenuItem>
                <MenuItem onClick={handleClose}>Favorite Count (Highest first)</MenuItem>
                <MenuItem onClick={handleClose}>Published Date (Latest first)</MenuItem>
                <MenuItem onClick={handleClose}>Update Date (Latest first)</MenuItem>
                <MenuItem onClick={handleClose}>Access Count (lowest first)</MenuItem>
                <MenuItem onClick={handleClose}>View Count (lowest first)</MenuItem>
                <MenuItem onClick={handleClose}>Like Count (lowest first)</MenuItem>
                <MenuItem onClick={handleClose}>Favorite Count (lowest first)</MenuItem>
                <MenuItem onClick={handleClose}>Published Date (Oldest first)</MenuItem>
                <MenuItem onClick={handleClose}>Update Date (Oldest first)</MenuItem>
            </Select>
                            </ClickAwayListener>
                        </Paper > */}
        </Fragment >
    )
}

export default ListFilter
