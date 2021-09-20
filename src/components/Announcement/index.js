import {useState} from 'react'
import { ReactComponent as RightArrowGreen } from '../../assets/img/icons/rightArrowGreen.svg'
import { ReactComponent as DiscordGreen } from '../../assets/img/icons/discordGreen.svg'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    lightAnnouncementBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        height: 60,
        margin: 'auto 0',
        transition: '0.2s all'
    },
    darkAnnouncementBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#2A2C34',
        height: 60,
        margin: 'auto 0'
    },
    leftSide: {
        display: 'flex',
        paddingLeft: 30,
        '& > .iconWithText': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        '& > .iconWithText .icon1': {
            margin: '0px 15px',
            paddingTop: 5,
            color: '#1DBF73',
            '&:hover': {
                cursor: 'pointer'
            }
        },
        '& > .iconWithText .text': {
            color: '#9E9E9E'
        }
    },
    rightSide: {
        display: 'flex',
        paddingRight: 30,
        '& > .iconWithText': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        '& > .iconWithText .icon': {
            margin: '0px 15px',
            paddingTop: 5
        },
        '& > .iconWithText .text': {
            color: '#9E9E9E'
        }
    },
    xicon: {
        color: '#9E9E9E',
        paddingLeft: '20px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
}))

const Announcement = ({toggle}) => {
    const [checkClicked, setCheckClicked] = useState(false)

    const classes = useStyles();

    const handleSubmit = () => {
        setCheckClicked(true)
    }

    const displayNone = {
        display: 'none',
    }

    return (
        <div className={toggle ? classes.darkAnnouncementBar : classes.lightAnnouncementBar} style={checkClicked ? displayNone : null}>
            <div className={classes.leftSide}>
                <div className="iconWithText">
                    <div className='icon1'><RightArrowGreen /></div>
                    <div className='text'>Build to Explore: The Skynet Spring 2021 Hackathon</div>
                </div>
            </div>
            <div className={classes.rightSide}>
                <div className="iconWithText">
                    <div className='icon'><DiscordGreen /></div>
                    <div className='text'>Join our Discord</div>
                    <span className={classes.xicon} onClick={() => handleSubmit()}>X</span>
                </div>
            </div>
        </div>
    )
}

export default Announcement;