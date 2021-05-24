import GraphIcon from '../../img/icons/grahpIcon.svg'
const SubmitAppStyles = () => ({
    lighth1: { 
        fontSize: '28px',
        color: '#2A2C34',
        '@media only screen and (max-width: 575px)': {
            fontSize: 18
        }
    },
    darkh1: { 
        fontSize: '28px',
        color: '#fff',
        '@media only screen and (max-width: 575px)': {
            fontSize: 18
        }
    },
    btnBox: {
    },
    lightOkBtn: {
        border: '1px solid #ea052f',
        marginRight: '10px',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px #15223221',
        height: 48,
        marginTop: '2rem',
        textTransform: 'none',
        color: '#2A2C34'
    },
    darkOkBtn: {
        border: '1px solid #ea052f',
        marginRight: '10px',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px #15223221',
        height: 48,
        marginTop: '2rem',
        textTransform: 'none',
        color: '#fff'
    },
    lightModalTitle: {
        fontSize: 32,
        color: '#333333',
        fontWeight: 700,
        marginBottom: '1rem'
    },
    darkModalTitle: {
        fontSize: 32,
        color: '#ffffff',
        fontWeight: 700,
        marginBottom: '1rem'
    },
    lightShareCardContainer: {
        background: '#fff',
        boxShadow: '0px 2px 5px #15223221',
        borderRadius: 15,
        padding: '48px 60px',
        '@media only screen and (max-width: 575px)': {
            padding: '40px 20px',
            paddingTop: '50px'
        },
        '&:focus': {
            outline: 0,
            border: 0
        },
        width: '90%',
        maxWidth: 500,
        '& p': {
            color: '#5A607F',
            marginBottom: '5px'
        },
        '& .s-links-title': {
            marginTop: '.4rem'
        },
        '& a': {
            marginRight: '1rem',
            '&:focus': {
                textDecoration: 'none',
                opacity: .8,
                transition: '.25s ease'
            }
        }
    },
    darkShareCardContainer: {
        background: '#1E2029',
        boxShadow: '0px 2px 5px #15223221',
        borderRadius: 15,
        padding: '48px 60px',
        '@media only screen and (max-width: 575px)': {
            padding: '40px 20px',
            paddingTop: '50px'
        },
        '&:focus': {
            outline: 0,
            border: 0
        },
        width: '90%',
        maxWidth: 500,
        '& p': {
            color: '#5A607F',
            marginBottom: '5px'
        },
        '& .s-links-title': {
            marginTop: '.4rem'
        },
        '& a': {
            marginRight: '1rem',
            '&:focus': {
                textDecoration: 'none',
                opacity: .8,
                transition: '.25s ease'
            }
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightCloseBtn: {
        border: '1px solid #1DBF73',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px #15223221',
        height: 48,
        marginTop: '2rem',
        textTransform: 'none',
        color: '#2A2C34'
    },
    darkCloseBtn: {
        border: '1px solid #1DBF73',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px #15223221',
        height: 48,
        marginTop: '2rem',
        textTransform: 'none',
        color: '#fff'
    },
    cancelBtn: {
        background: '#FF6060!important',
        color: '#fff',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        minWidth: 130,
        marginRight: '1rem',
        '@media only screen and (max-width: 575px)': {
            fontSize: '12px',
            marginRight: '.4rem',
            paddingLeft: '.5rem',
            paddingRight: '.5rem',
            minWidth: 70,
        }
    },
    submitBtn: {
        background: '#1DBF73!important',
        color: '#fff',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        display: 'inlin-flex',
        alignItems: 'center',
        minWidth: 130,
        '& svg': {
            fontSize: '19px',
            marginRight: '5px'
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: '12px',

            paddingLeft: '.5rem',
            paddingRight: '.5rem',
            minWidth: 70,
        }
    },
    lightSiteLogo: {
        background: '#fff',
        cursor: 'pointer',
        height: 160,
        width: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #D9E1EC',
        borderRadius: 8,
        marginBottom: 10,
        '@media only screen and (max-width: 575px)': {
            width: "100%",
            maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    darkSiteLogo: {
        background: '#1E2029',
        cursor: 'pointer',
        height: 160,
        width: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #48494E',
        borderRadius: 8,
        marginBottom: 10,
        '@media only screen and (max-width: 575px)': {
            width: "100%",
            maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    label: {
        display: 'block',
        color: '#5A607F',
        marginBottom: 8,
        fontSize: 18,
        '@media only screen and (max-width: 575px)': {
            fontSize: 16,
        }
    },
    inputGuide: {
        color: '#5C757D',
        '@media only screen and (max-width: 575px)': {
            fontSize: 12,
        }
    },
    lightInput: {
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        padding: 20,
        color: '#2A2C34',
        border: '1px solid #1DBF73',
        '&:hover, &:focus' :{
            borderColor: '#1DBF73'
        },
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            fontSize: 16,
            padding: 15,
            color: '#2A2C34',
            border: '1px solid #1DBF73',
        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: '14px !important',
            padding: 10,
            color: '#2A2C34',
            border: '1px solid #1DBF73',
        }
    },
    darkInput: {
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        padding: 20,
        color: '#fff',
        backgroundColor: '#1E2029',
        border: '1px solid #1DBF73',
        '&:hover, &:focus' :{
            borderColor: '#1DBF73'
        },
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            fontSize: 16,
            padding: 15,
            color: '#fff',
            backgroundColor: '#1E2029',
            border: '1px solid #1DBF73',
        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: '14px !important',
            padding: 10,
            color: '#fff',
            backgroundColor: '#1E2029',
            border: '1px solid #1DBF73',
        }
    },
    lightInputTag: {
        color: '#000',
        background: '#fff',
        border: '1px solid #D9E1EC',
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        padding: 10,
        '&:hover, &:focus' :{
            borderColor: '#1DBF73'
        },
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            color: '#000',
            fontSize: 16,
            padding: 10,
        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: '14px !important',
            padding: 10,
        }
    },
    darkInputTag: {
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        padding: 10,
        color: '#fff',
        background: '#1E2029',
        border: '1px solid #48494E',
        '&:hover, &:focus' :{
            borderColor: '#1DBF73'
        },
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            fontSize: 16,
            padding: 10,
            color: '#fff',
            background: '#1E2029',
            border: '1px solid #48494E',
        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: '14px !important',
            padding: 10,
            color: '#fff',
            background: '#1E2029',
            border: '1px solid #48494E',
        }
    },
    lightInputContainer: {
        '& > label': {
            display: 'block',
            color: '#5A607F',
            marginBottom: 7
        },
        '& input': {
            border: '1px solid #D9E1EC',
            background: '#fff',
        },
        '& input:focus, & select:focus': {
            outline: 'none!important',
            color: '#2A2C34',
            border: '1px solid #1DBF73',
            background: '#fff',
        },
        marginTop: '25px',
        '&': {
            marginRight: '1rem'
        },
        '& input, & input': {
            fontSize: 18
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: '16px',
            marginRight: '10px'
        },
    },
    darkInputContainer: {
        '& > label': {
            display: 'block',
            color: '#5A607F',
            marginBottom: 7
        },
        '& input': {
            border: '1px solid #48494E',
            background: '#1E2029',
        },
        '& input:focus, & select:focus': {
            outline: 'none!important',
            color: '#fff',
            border: '1px solid #1DBF73',
            background: '#1E2029',
        },
        marginTop: '25px',
        '&': {
            marginRight: '1rem'
        },
        '& input, & input': {
            fontSize: 18
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: '16px',
            marginRight: '10px'
        },
    },
    inputContainerTag: {
        '& > label': {
            display: 'block',
            color: '#5A607F',
            marginBottom: 7
        },
        '& input:focus, & select:focus': {
            outline: 'none!important',
        },
        marginTop: '25px',
        '&': {
            marginRight: '1rem'
        },
        '& input, & input': {
            fontSize: 16
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: '16px',
            marginRight: '10px'
        },
    },
    iconWithField: {
        fontSize: 18
    },
    max33: {
        maxWidth: 'calc(33.33% - 1rem)',

    },
    '@media only screen and (max-width: 575px)': {

        maxWidth: 'calc(33.33% - 10px)',

    },
    darkCustomSelectStyling: {
        '& .css-1uccc91-singleValue': {
            color:'#fff!important'
        }
    },
    select: {
        // background: '#fff',
        // border: '1px solid #D9E1EC',
        // borderRadius: 8,
        // height: 55,
        // // width: '100%',
        // fontSize: 18,
        // padding: 20,
        // paddingRight: 40,
        // '@media only screen and (max-width: 1440px)': {
        //     height: 50,
        //     // width: '100%',
        //     fontSize: 16,
        //     padding: 15,
        // },
        // '@media only screen and (max-width: 575px)': {
        //     height: 40,
        //     // width: '100%',
        //     fontSize: 14,
        //     padding: 10,
        // },
        // '-webkit-appearance': 'none',
        // '-moz-appearance': 'none',
        // 'appearance': 'none',
        // textIndent: 1,
        // textOverflow: '',
        // minWidth: '160px',
        // position: 'relative',
        // '&::after': {
        //     content: '',
        //     position: 'absolute',
        //     right: 15,
        //     top: '50%',
        //     transform: 'translateY(-50%)',

    },
    reactSelect: {
        // '& .css-yk16xz-control, & .css-1pahdxg-control': {
        //     background: '#fff',
        //     border: '1px solid #D9E1EC',
        //     borderRadius: 8,
        //     height: 55,
        //     boxShadow: 'none',

        // },
        // '& .css-yk16xz-control:focus, & .css-1pahdxg-control:focus, & .css-yk16xz-control:hover, & .css-1pahdxg-control:hover': {
        //     background: '#fff',
        //     border: '1px solid #D9E1EC',
        //     borderRadius: 8,
        //     height: 55,
        //     boxShadow: '1px solid #D9E1EC'
        // },
    },
    selectVersion: {
        maxWidth: '150px',
        minWidth: '150px'
    },
    formRow: {
        maxWidth: '1500px',
        marginRight: '-1rem',
        // '@media only screen and (max-width: 575px)': {
        //     flexWrap: "wrap",
        //     '& > div:first-child, & > div:nth-child(3)': {
        //         maxWidth: '100%',
        //         flex: '100%'
        //     }
        //     ,
        //     '& > div:nth-child(3)': {
        //         order: 4,

        //     },
        //     '& > div:nth-child(2), & > div:nth-child(4)': {
        //         maxWidth: 'calc(50% - 1rem)',
        //         flex: 'calc(50% - 1rem)'
        //     }
        // }
        // },
        // '@media only screen and (max-width: 575px)': {
        //     '&:first-child':
        // }
    },
    formRow1: {
        '@media only screen and (max-width: 575px)': {
            flexWrap: "wrap",
            '& > div': {
                maxWidth: 'calc(100% - 1rem)',
                flex: 'calc(100% - 1rem)'
            }
        }
    },
    formRow2: {
        '@media only screen and (max-width: 575px)': {
            flexWrap: "wrap",
            '& > div': {
                maxWidth: 'calc(100% - 1rem)',
                flex: 'calc(100% - 1rem)'
            }

        }
    },
    formRow4: {
        '@media only screen and (max-width: 575px)': {
            flexWrap: "wrap",
            '& > div': {
                maxWidth: 'calc(100% - 1rem)',
                flex: 'calc(100% - 1rem)'
            },
            '& > div:last-child': {
                order: -1
            }

        }
    },
    previewImgLabel: {
        display: 'block',
        color: '#5A607F',
        marginBottom: 8,
        fontSize: '18px',
        '& > span': {
            color: '#1DBF73',
            fontSize: '16px'
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: '16px',
            '& > span': {

                fontSize: '12px'
            },
        }
    },
    lightPlaceholderImg: {
        background: '#ffff',
        width: '100%',
        height: '160px',
        borderRadius: '8px',
        border: '1px dashed #5C5D5E',
        // border: '1px dashed rgba(0, 0, 0, 0.6)',
        '@media only screen and (max-width: 575px)': {
            height: '150px'
        }
    },
    darkPlaceholderImg: {
        background: '#1E2029',
        width: '100%',
        height: '160px',
        borderRadius: '8px',
        border: '1px dashed #5C5D5E',
        // border: '1px dashed rgba(0, 0, 0, 0.6)',
        '@media only screen and (max-width: 575px)': {
            height: '150px'
        }
    },
    lightPreviewImg: {
        background: '#fff',
        cursor: 'pointer',
        height: 160,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #D9E1EC',
        borderRadius: 8,
        marginBottom: 0,
        '& .MuiDropzoneArea-root': {
            background: '#fff'
        },
        '@media only screen and (max-width: 575px)': {
            height: '150px'
        }
    },
    darkPreviewImg: {
        background: '#1E2029',
        cursor: 'pointer',
        height: 160,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #48494E',
        borderRadius: 8,
        marginBottom: 0,
        '& .MuiDropzoneArea-root': {
            background: '#1E2029'
        },
        '@media only screen and (max-width: 575px)': {
            height: '150px'
        }
    },
    lightTextarea: {
        background: '#fff',
        boxShadow: '0px 1px 2px #15223214',
        border: '1px solid #7070701A',
        borderRadius: '8px',
        // minHeight: '90px',
        width: `100%`,
        maxWidth: '100%',
        resize: 'none',
        padding: "1rem",
        fontSize: 18,
        color: '#2A2C34',
        '&:hover' :{
            borderColor: '#1DBF73'
        },
        '&:focus': {
            color: '#2A2C34',
            outline: 'none!important',
            border: '1px solid #1DBF73',
        },
        '&:placeholder': {
            color: 'rgba(126, 132, 163 , .32)'
        },
        '&::-webkit-input-placeholder': {
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        "&:-moz-placeholder": { /* Firefox 18- */
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        "&::-moz-placeholder": {  /* Firefox 19+ */
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        " &:-ms-input-placeholder": {
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        "&::placeholder": {
            color: 'rgba(126, 132, 163 , .32)'
        },
        marginTop: '0',
        '@media only screen and (max-width: 575px)': {
            padding: "10px"
        }
    },
    darkTextarea: {
        background: '#1E2029',
        boxShadow: '0px 1px 2px #15223214',
        border: '1px solid #48494E',
        color: '#fff',
        borderRadius: '8px',
        // minHeight: '90px',
        width: `100%`,
        maxWidth: '100%',
        resize: 'none',
        padding: "1rem",
        fontSize: 18,
        '&:hover' :{
            borderColor: '#1DBF73'
        },
        '&:focus': {
            color: '#fff',
            outline: 'none!important',
            border: '1px solid #1DBF73',
        },
        '&:placeholder': {
            color: 'rgba(126, 132, 163 , .32)'
        },
        '&::-webkit-input-placeholder': {
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        "&:-moz-placeholder": { /* Firefox 18- */
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        "&::-moz-placeholder": {  /* Firefox 19+ */
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        " &:-ms-input-placeholder": {
            color: 'rgba(126, 132, 163 , .32)'
        }
        ,
        "&::placeholder": {
            color: 'rgba(126, 132, 163 , .32)'
        },
        marginTop: '0',
        '@media only screen and (max-width: 575px)': {
            padding: "10px"
        }
    },
    textareaLabel: {
        display: 'block',
        color: '#5A607F',
        marginBottom: 8,
        fontSize: '18px',
        '& > span': {
            opacity: '.52',
            fontSize: '12px',
            paddingLeft: '8px'
        }
    },
    maxChar: {
        position: 'absolute',
        right: 14,
        bottom: 14,
        fontSize: 12,
        letterSpacing: 0,
        color: '#5A607F',
        opacity: 0.84,
        '@media only screen and (max-width: 575px)': {
            display: 'none'
        }
    },
    OneRowInput: {
        marginTop: '25px',
        '@media only screen and (max-width: 575px)': {
            marginTop: '16px',
        }
    },
    lightSocilaMediaSelect: {
        maxWidth: 120,
        minWidth: 120,
        '& .socialMedia__control, & ~ input': {
            border: 0,
            borderRadius: 8,
            height: '100%'
        },
        '& ~ input': {
            width: '100%',
            paddingRight: 10
        },
        '& ~ input:hover, & ~ input:focus': {
            border: 0,
            outline: 0
        },
        '& .socialMedia__indicator-separator': {
            display: 'none'
        },
        '@media only screen and (max-width: 575px)': {
            margin: 'auto',
            maxWidth: 100,
            minWidth: 100,
        },
    },
    darkSocilaMediaSelect: {
        maxWidth: 120,
        minWidth: 120,
        '& .socialMedia__control, & ~ input': {
            border: 0,
            borderRadius: 8,
            height: '100%'
        },
        '& ~ input': {
            width: '100%',
            paddingRight: 10,
            color: '#fff',
            background: '#1E2029',
        },
        '& ~ input:hover, & ~ input:focus': {
            border: 0,
            outline: 0
        },
        '& .socialMedia__indicator-separator': {
            display: 'none'
        },
        '@media only screen and (max-width: 575px)': {
            margin: 'auto',
            maxWidth: 100,
            minWidth: 100,
        },
    },
    lightSocialOptionContainer: {
        border: '1px solid #D9E1EC',
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        '&:hover, &:focus' :{
            borderColor: '#1DBF73 !important'
        },
        '@media only screen and (max-width: 1440px)': {
            fontSize: 16,
            height: 50,
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: 14,
            height: 43,
        },
    },
    darkSocialOptionContainer: {
        background: '#1E2029',
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        border: '1px solid transparent',
        '&:hover, &:focus' :{
            borderColor: '#1DBF73 !important'
        },
        '@media only screen and (max-width: 1440px)': {
            fontSize: 16,
            height: 50,
            background: '#1E2029!important',
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: 14,
            height: 43,
            background: '#1E2029!important',
        },
    },

    button: {
        background: '#1DBF73!important',
        boxShadow: '0px 1px 2px #00000029',
        borderRadius: 4,
        color: '#fff',
        display: 'block',
        minWidth: 180,
        maxWidth: 200,
        paddingTop: 7,
        paddingBottom: 7,
        fontSize: '16px',

        '@media only screen and (max-width: 575px)': {
            margin: 'auto',

        },
    },
    settingBtn: {
        background: '#fff!important',
        color: '#1DBF73',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        minWidth: 130,
        border: '1px solid #7070701a',
        fontSize: 16,
        '& svg': {
            marginRight: 7
        }
    },
    lightUploadBtn: {
        border: '1px solid #4E4E4E',
        color: '#4E4E4E',
        minWidth: 250,
        marginTop: '1rem',
        height: 45
    },
    darkUploadBtn: {
        border: '1px solid #4E4E4E',
        color: '#5C757D',
        minWidth: 250,
        marginTop: '1rem',
        height: 45
    },
    h4: {
        color: '#5A607F',
        fontWeight: 'normal',
        marginBottom: 7

    },
    GridContainer: {
        marginTop: 15
    },
    lightDNSContainer: {
        background: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: '45px 35px',
        '@media only screen and (max-width: 1440px)': {
            padding: '35px 25px',
        },
        '@media only screen and (max-width: 575px)': {
            padding: '20px 15px'
        },
        minHeight: 190,
    },
    darkDNSContainer: {
        background: '#1E2029',
        border: '1px solid rgba(0, 0, 0, 0.4)',
        borderRadius: 8,
        padding: '45px 35px',
        '@media only screen and (max-width: 1440px)': {
            padding: '35px 25px',
        },
        '@media only screen and (max-width: 575px)': {
            padding: '20px 15px'
        },
        minHeight: 190,
    },
    ContentItemTitle: {
        color: '#7E84A3',
        fontSize: 16,
        '@media only screen and (max-width: 575px)': {
            fontSize: 14,
        }

    },
    lightSiteLink: {
        fontWeight: 'bold',
        color: '#131523',
        marginTop: 2,
        wordBreak: 'break-word'
    },
    darkSiteLink: {
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 2,
        wordBreak: 'break-word'
    },
    changeBtnLink: {
        color: '#1DBF73',
        cursor: 'pointer'
    },
    lightDevelopmentsContainer: {
        minHeight: 190,
        height: 200,
        overflowY: 'auto',
        background: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: '15px 0',
        '@media only screen and (max-width: 1440px)': {
            padding: '15px 0',
        }
    },
    darkDevelopmentsContainer: {
        minHeight: 190,
        height: 200,
        overflowY: 'auto',
        background: '#1E2029',
        // border: '1px solid #D9E1EC',
        border: '1px solid rgba(0, 0, 0, 0.4)',
        borderRadius: 8,
        padding: '15px 0',
        '@media only screen and (max-width: 1440px)': {
            padding: '15px 0',
        }
    },
    ListRoot: {
        // "& .MuiListItem-button": {
        //     background: 'rgba(0, 0, 0, 0.04)'
        // },
        '& .MuiListItemIcon-root': {
            height: '17px',
            minWidth: '17px',
            width: '17px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: "center",
            borderRadius: '50%',
            background: '#1dbf734d'
        },
        '& svg': {
            fontSize: 13,
            color: '#1DBF73'
        },
        '& p': {
            color: '#1DBF73',
            fontSize: 15,
            marginLeft: 10
        },
        "& span": {
            fontSize: '15px',
            color: '#7E84A3'
        }
    },
    lightGraphText: {
        fontSize: 14,
        color: '#1DBF73'
    },
    darkGraphText: {
        fontSize: 14,
        color: '#fff'
    },
    lightStatValue: {
        fontSize: 32,
        color: '#242F57',
        fontWeight: 'bold'
    },
    darkStatValue: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold'
    },
    StatTitle: {
        color: '#97A0C3',
        marginBottom: 10
    },
    statCol: {
        background: `url(${GraphIcon})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right bottom',
    },
    lightStatsContainer: {
        minHeight: 190,
        background: '#FFFFFF',
        // border: '1px solid #D9E1EC',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: '30px 15px',
        '@media only screen and (max-width: 1440px)': {
            padding: '30px 15px',
        },
        '@media only screen and (max-width: 659px)': {
            minHeight: 'auto'
        },

    },
    darkStatsContainer: {
        minHeight: 190,
        background: '#1E2029',
        border: '1px solid rgba(0, 0, 0, 0.4)',
        borderRadius: 8,
        padding: '30px 15px',
        '@media only screen and (max-width: 1440px)': {
            padding: '30px 15px',
        },
        '@media only screen and (max-width: 659px)': {
            minHeight: 'auto'
        },

    },
    paddingLeft: {
        marginLeft: '1rem',
        '@media only screen and (max-width: 659px)': {
            marginLeft: 0,
            marginTop: 15
        },
    }
})
export default SubmitAppStyles;