const sideabrStyle = theme => (
    {
        root: {
            padding: 0,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        sidebarItem: {
            display: 'flex',
            alignItems: 'center',
            // background: '#2A2C34!important',
        },
        darkSidebar: {
            backgroundColor: '#2A2C34!important',
            boxShadow: ' 0px 1px 4px #15223214',
            maxWidth: '250px',
            padding: '1rem',
            paddingRight: '0',
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            '@media (max-width: 1440px)': {
                maxWidth: '230px',
            }
        },
        lightSidebar: {
            backgroundColor: '#fff!important',
            boxShadow: ' 0px 1px 4px #15223214',
            maxWidth: '250px',
            padding: '1rem',
            paddingRight: '0',
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            '@media (max-width: 1440px)': {
                maxWidth: '230px',
            }
        },
        listIcon: {
            minWidth: '40px',

            '&:hover': {
                color: '#fff',
                background: '#1DBF73'
            }
        },
        dropArrow: {
            // color: '#323232'
            color: '#fff'
        },
        promoCard: {
            background: '#1DBF73',
            padding: '1.2rem',
            margin: "1rem",
            marginLeft: '0',
            borderRadius: '5px',
            marginTop: '1.5rem'
        },
        promoTitle: {
            color: '#fff',
            fontSize: '16px',
            marginBottom: '.5rem',
            [theme.breakpoints.up('lg')]: {
                fontSize: '18px',
            },
        },
        promoText: {
            color: '#fff',
            fontSize: '14px',
            [theme.breakpoints.up('lg')]: {
                fontSize: '16px',
            },
        }
    }
)
export default sideabrStyle