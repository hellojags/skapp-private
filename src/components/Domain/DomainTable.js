import React, { Fragment } from 'react'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH as MoreIcon } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as DomainListIcon } from '../../assets/img/icons/listicon.svg'
import { ReactComponent as Arrow } from '../../assets/img/icons/arrowdow.svg'
import { faTrashAlt as DeleteIcon } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as CopyIcon } from '../../assets/img/icons/copy.svg'

import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import { Box, IconButton, MenuItem, Tooltip, Button } from '@material-ui/core'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    lightPaper: {
        marginTop: 10,
        "& th, & td": {
            border: 0
        },
        '& tbody tr th ~ td:not(:last-child)': {
            color: '#6E77AA',
            fontWeight: 'normal'
        },
        '& tbody th': {
            fontWeight: 700
        },
        '& thead': {

            '& th': {
                color: '#fff',
                lineHeight: '.8rem',
                background: '#1DBF73',

            }
        },
        '& tr th, & tr td': {
            fontSize: 18,
            '@media only screen and (max-width: 1440px)': {
                fontSize: 16
            },
            '&:first-child': {
                borderRadius: '5px 0 0px 5px'
            },
            '&:last-child': {
                borderRadius: '0px 5px 5px 0px'
            }
        },
        '& table': {
            borderCollapse: 'separate',
            borderSpacing: '0 8px'
        },
        '& tbody tr td,& tbody tr th': {
            background: '#fff',
            color: '#2A2C34'
        },
        '& tbody th svg': {
            marginRight: 10
        }
    },
    darkPaper: {
        marginTop: 10,
        "& th, & td": {
            border: 0
        },
        '& tbody tr th ~ td:not(:last-child)': {
            color: '#6E77AA',
            fontWeight: 'normal'
        },
        '& tbody th': {
            fontWeight: 700
        },
        '& thead': {

            '& th': {
                color: '#fff',
                lineHeight: '.8rem',
                background: '#1DBF73',

            }
        },
        '& tr th, & tr td': {
            fontSize: 18,
            '@media only screen and (max-width: 1440px)': {
                fontSize: 16
            },
            '&:first-child': {
                borderRadius: '5px 0 0px 5px'
            },
            '&:last-child': {
                borderRadius: '0px 5px 5px 0px'
            }
        },
        '& table': {
            borderCollapse: 'separate',
            borderSpacing: '0 8px'
        },
        '& tbody tr td,& tbody tr th': {
            color: '#fff',
            background: '#2A2C34'
        },
        '& tbody th svg': {
            marginRight: 10
        }
    },
    statusWorking: {
        color: '#1DBF73'
    },
    statusError: {
        color: '#FF6060'
    },
    arrow: {
        marginLeft: 10
    },
    lightMenuAction: {
        marginTop: '3.4rem',
        border: '1px solid #D9E1EC',
        '& ul': {
            background: '#fff',
            color: '#2A2C34',
            minWidth: 230,
            '& li': {
                fontSize: 18,
                paddingBottom: 12,
                '@media only screen and (max-width: 1440px)': {
                    fontSize: 16
                }
            }
        },
        '& .MuiPaper-root': {
            boxShadow: '0px 3px 6px #00000029',
            border: '1px solid #7070704F',
            overflow: 'visible'
        },
        '& .MuiPaper-root::before': {
            content: '""',
            width: 0,
            height: 0,
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            borderRight: '14px solid #70707057',
            position: 'absolute',
            top: '-22px',
            right: 19,
            transform: 'rotate(90deg)'
        },
        '& .MuiPaper-root::after': {
            content: '""',
            width: 0,
            height: 0,
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            borderRight: '14px solid #fff',
            // position: 'relative',
            position: 'absolute',
            top: '-21px',
            right: 19,
            transform: 'rotate(90deg)'
        }
    },
    darkMenuAction: {
        marginTop: '3.4rem',
        '& ul': {
            background: '#1E2029',
            color: '#fff',
            minWidth: 230,
            '& li': {
                fontSize: 18,
                paddingBottom: 12,
                '@media only screen and (max-width: 1440px)': {
                    fontSize: 16
                }
            }
        },
        '& .MuiPaper-root': {
            boxShadow: '0px 3px 6px #00000029',
            border: '1px solid #48494E',
            overflow: 'visible'
        },
        '& .MuiPaper-root::before': {
            content: '""',
            width: 0,
            height: 0,
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            borderRight: '14px solid #70707057',
            position: 'absolute',
            top: '-22px',
            right: 19,
            transform: 'rotate(90deg)'
        },
        '& .MuiPaper-root::after': {
            content: '""',
            width: 0,
            height: 0,
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            borderRight: '14px solid #fff',
            // position: 'relative',
            position: 'absolute',
            top: '-21px',
            right: 19,
            transform: 'rotate(90deg)'
        }
    },
    colorDanger: {
        color: '#FF6060'
    }
})

function createData(domainName, type, status, action) {
    return { domainName, type, status, action }
}

const rows = [
    createData('skyspaces.io', 'External DNS', true, { actionType: '' }),
    createData('cloudean.com', 'External DNS', false,),
    createData('mysite.net', 'External DNS', true,),
]

const DomainTable = ({ toggle, userDomains, handleDelete, handleEdit }) => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [clicked, setClicked] = React.useState(false)

    const handleClick = (event) => {
        setClicked(true)
        setAnchorEl(event.currentTarget)
    }

    const copyToClipboard = (e) => {
        const el = document.createElement('textarea');
        el.value = e;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }

    const handleClose = () => {
        setClicked(false)
        setAnchorEl(null)
    }
    return (
        <Fragment>
            <TableContainer className={toggle ? classes.darkPaper : classes.lightPaper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Domain
                            <Arrow className={classes.arrow} />
                            </TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>TXT Record</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right"> Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userDomains.map((row, index) => (
                            <TableRow key={row.domainName}>
                                <TableCell component="th" scope="row">
                                    <Box display="flex" component="span" alignItems="center">
                                        <DomainListIcon /> <span>{row.domainName}</span>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.domainType}</TableCell>
                                <TableCell>
                                    <Box display="flex" >
                                        <Box flex={0.1}>
                                            <Button onClick={() => copyToClipboard(row.txtRecord)}>
                                                <CopyIcon />
                                            </Button>
                                        </Box>
                                        <Box flex={0.9}>
                                            <Tooltip title={row.txtRecord}>
                                                <Box textOverflow="ellipsis" overflow="hidden" style={{ width: 200, whiteSpace: 'nowrap' }} >
                                                    {row.txtRecord}
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {row.status
                                        ?
                                        <span className={classes.statusWorking}>Configured and working</span>
                                        :
                                        <span className={classes.statusError}>Error</span>
                                    }
                                </TableCell>
                                {/* <TableCell align="right">
                                    <IconButton size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                        <FontAwesomeIcon color={clicked ? '#1DBF73' : '#7E84A3'} icon={MoreIcon} />
                                    </IconButton>

                                </TableCell> */}
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEdit(index, row)} size="small" style={{ marginRight: '1rem' }} >
                                        {toggle ? <CreateOutlinedIcon style={{ color: '#fff' }} /> : <CreateOutlinedIcon style={{ color: '#323232' }} />}
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(index)} size="small" >
                                        {toggle ? <FontAwesomeIcon color='#fff' icon={DeleteIcon} /> : <FontAwesomeIcon color='#323232' icon={DeleteIcon} />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Menu
                className={toggle ? classes.darkMenuAction : classes.lightMenuAction}
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    getContentAnchorEl: null
                }}
            >
                <MenuItem onClick={handleClose}>Edit Settings</MenuItem>
                <MenuItem onClick={handleClose}>Manage DNS</MenuItem>
                <MenuItem onClick={handleClose}>Setup Email</MenuItem>
                <MenuItem onClick={handleClose}>Create Website</MenuItem>
                <MenuItem onClick={handleClose} className={classes.colorDanger}>Delete Domain</MenuItem>

            </Menu>
        </Fragment>
    )
}
export default DomainTable