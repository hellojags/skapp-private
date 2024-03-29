
const addNewSiteStyle = {
    lightRoot: {
        boxShadow: '0px 1px 2px #15223214',
        border: '1px dashed #1DBF73',
        borderRadius: 15,
        minHeight: 170,
        color: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        '@media only screen and (max-width: 575px)': {
            minHeight: 90,
        }
    },
    darkRoot: {
        boxShadow: '0px 1px 2px #15223214',
        border: '1px dashed #1DBF73',
        borderRadius: 15,
        minHeight: 170,
        backgroundColor: '#1E2029',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        '@media only screen and (max-width: 575px)': {
            minHeight: 90,
        }
    }
}
export default addNewSiteStyle