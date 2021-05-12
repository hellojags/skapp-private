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
        margin: 'auto 0'
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
        '& > .iconWithText .icon': {
            margin: '0px 15px',
            paddingTop: 5,
            color: '#1DBF73'
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
    
}))

const Announcement = ({toggle}) => {
    const classes = useStyles();

    return (
        <div className={toggle ? classes.darkAnnouncementBar : classes.lightAnnouncementBar}>
            <div className={classes.leftSide}>
                <div className="iconWithText">
                    <div className='icon'><RightArrowGreen /></div>
                    <div className='text'>Build to Explore: The Skynet Spring 2021 Hackathon</div>
                </div>
            </div>
            <div className={classes.rightSide}>
                <div className="iconWithText">
                    <div className='icon'><DiscordGreen /></div>
                    <div className='text'>Join our Discord</div>
                </div>
            </div>
        </div>
    )
}

export default Announcement;