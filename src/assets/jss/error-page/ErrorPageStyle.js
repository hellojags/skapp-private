const errorPageStyle = {
    text: {
        color: '#1DBF73',
        fontSize: 26,
        fontWeight: 700,
        marginTop: '2rem',
        '@media only screen and (max-width: 1440px)': {
            fontSize: 22,
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: 20,
            marginTop: '1rem',
        }

    },
    lighth1: {
        fontSize: 82,
        color: '#2A2C34',
        marginTop: '-80px',
        '@media only screen and (max-width: 1440px)': {
            marginTop: '-90px',
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: '-100px',
            fontSize: 42,
        }
    },
    darkh1: {
        fontSize: 82,
        color: '#fff',
        marginTop: '-80px',
        '@media only screen and (max-width: 1440px)': {
            marginTop: '-90px',
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: '-100px',
            fontSize: 42,
        }
    },
    lighth2: {
        color: '#2A2C34'
    },
    darkh2: {
        color: '#fff'
    },
    small: {
        fontSize: 14,
        // color: '#242F57',
        color: 'grey',
        marginTop: '10px',
        '& > a': {
            color: '#1DBF73',
            textDecoration: 'none',
        }
    },

    errorIcon: {
        '@media only screen and (max-width: 1440px)': {
            width: '330px'
        },
        '@media only screen and (max-width: 575px)': {
            width: '230px'
        }
    }

}
export default errorPageStyle