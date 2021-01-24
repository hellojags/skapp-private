import React, { useState } from 'react'
import { Box, Button, makeStyles, Grid, TextareaAutosize } from '@material-ui/core'
import Select from 'react-select'
import { Add } from '@material-ui/icons'
import styles from '../../assets/jss/app-details/SubmitAppStyles'
// img icon
import { ReactComponent as ImgIcon } from '../../assets/img/icons/image.svg'

const useStyles = makeStyles(styles)
const optionsVersion = [
    { value: '1.0', label: '1.0' },
    { value: '1.01', label: '1.01' },
    { value: '1.02', label: '1.02' },
]
const optionsAge = [
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
]
const socialOption = [
    { value: 'facebook', label: 'facebook' },
    { value: 'Reddit', label: 'Reddit' },
    { value: 'Twitter', label: 'Twitter' },
]

const reactSelectStyles = {
    control: styles => ({
        ...styles, backgroundColor: 'white', height: 55, boxShadow: 0, borderColor: '#D9E1EC', color: '#000', borderRadius: 8,
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            fontSize: 16,

        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: 14,

        },
        '&:hover': {
            borderColor: '#1DBF73'
        }
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
        ...styles, backgroundColor: isSelected ? '#1DBF73' : '#fff',
        '&:foucs': {
            backgroundColor: '#1DBF73'
        }
    }),
}
export default function AddNewSite (){
    const [selectedOption, setSelectedOption] = useState(null)


    const classes = useStyles()
    return (
        <Box >
            <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                <h1 className={classes.h1}>Add New Site</h1>
                <Box className={classes.btnBox}>
                    <Button className={classes.cancelBtn}>Cancel </Button>
                    <Button className={classes.submitBtn}><Add /> Submit </Button>
                </Box>
            </Box>

            <Box component="form">
                {/* < */}
                <Box>
                    <label className={classes.label}>Site Logo</label>
                    <div className={classes.siteLogo}>
                        <ImgIcon />
                    </div>
                    <div className={classes.inputGuide}>
                        Max. size of 5 MB in: JPG or PNG. 300x500 or larger recommended
                </div>
                    <input type="text" hidden />
                </Box>
                <Box display='flex' className={`${classes.formRow} ${classes.formRow1}`}>
                    <Box className={`${classes.inputContainer} ${classes.max33}`} flex={1} >
                        <label>Storage Gateway</label>
                        <input name="storageGateway" className={classes.input} value="Skylink" />
                    </Box>
                    <Box className={classes.inputContainer} flex={1}>
                        <label>HNS</label>
                        <input name="hns" className={classes.input} value="https://www.demo.com/UJJ5Rgbu2TM" />
                    </Box>
                </Box>
                <Box display='flex' className={`${classes.formRow} ${classes.formRow2}`}>
                    <Box className={classes.inputContainer} flex={1}>
                        <label>Skylink</label>
                        <input skylink="skylink" className={classes.input} value="https://www.skapp.com/UJJ5Rgbu2TM" />
                    </Box>
                    <Box className={classes.inputContainer} flex={1}>
                        <label>Default Path</label>
                        <input name="defaultPath" className={classes.input} value="https://www.demo.com/UJJ5Rgbu2TM" />
                    </Box>
                    <Box className={classes.inputContainer} flex={1}>
                        <label>Minimum Portal Version</label>
                        <input name="portalMinVersion" className={classes.input} value="https://www.demo.com/UJJ5Rgbu2TM" />
                    </Box>
                </Box>
                <Box display='flex' className={`${classes.formRow} ${classes.formRow4}`}>
                    <Box className={classes.inputContainer} flex={1}>
                        <label>Github</label>
                        <input name="sourceCode" className={classes.input} value="Skylink" />
                    </Box>
                </Box>
                <div className={classes.OneRowInput}>
                    <Box position="relative">
                    <Grid container spacing={2}>
                        <Grid item md={6} lg={4} style={{alignSelf: 'center'}}>
                        <Button className={classes.button}>Submit</Button>
                        </Grid>
                       
                    </Grid>
                    </Box>
                </div>
            </Box>

        </Box >
    )
};