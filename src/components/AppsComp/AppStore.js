import { Box, Button, InputBase } from '@material-ui/core'
import React, { Fragment, useEffect, useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
// import UtilitiesItem from './UtilitiesItem'
import ListFilter from './ListFilter'
import SelectItem from './SelectItem'
import SubmitBtn from './SubmitBtn'
import AppsList from './AppsList'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import useInterval from "react-useinterval"
// import PerfectScrollbar from 'react-perfect-scrollbar'
// import CustomPagination from './CustomPagination'
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
// import SelectedAppsHeader from './SelectedAppsHeader'
import Slider from "react-slick"
// slick slider css
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SlickNextArrow from '../slickarrows/SlickNextArrow'
import SlickPrevArrow from '../slickarrows/SlickPrevArrow'
import Footer from '../Footer/Footer'
import { getAllPublishedAppsAction } from "../../redux/action-reducers-epic/SnAllPublishAppAction";
import { getMyInstalledAppsAction, installedAppAction, unInstalledAppAction, installedAppActionForLogin } from "../../redux/action-reducers-epic/SnInstalledAppAction";
import {getAggregatedAppStatsAction} from "../../redux/action-reducers-epic/SnAggregatedAppStatsAction"

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Fuse from 'fuse.js'
import styles from "../../assets/jss/apps/AppListStyle"
// import classes from '*.module.css'
// import InfiniteScroll from 'react-infinite-scroll-component'
const useStyles = makeStyles(theme => (
    {
        ...styles,
        lightSearch: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade('#fff', 1),
            '&:hover': {
                backgroundColor: fade("#fff", 0.9),
            },
            marginRight: theme.spacing(2),
            // marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
            color: '#8B9DA5',
            boxShadow: '0px 1px 2px #15223214',
            border: '1px solid #7070701A;',
            // hieght: '41px',
            marginLeft: '16px!important',
            '@media (max-width: 1650px)': {
                width: 'auto'
            },

        },
        darkSearch: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade('#2A2C34', 1),
            '&:hover': {
                backgroundColor: fade("#2A2C34", 0.9),
            },
            marginRight: theme.spacing(2),
            // marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
            color: '#8B9DA5',
            boxShadow: '0px 1px 2px #15223214',
            border: '1px solid rgba(0, 0, 0, 0.8);',
            // hieght: '41px',
            marginLeft: '16px!important',
            '@media (max-width: 1650px)': {
                width: 'auto'
            },

        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B4C6CC',
            // color: '#2A2C34'
        },
        lightInputRoot: {
            // color: 'inherit',
            color: '#2A2C34!important',
        },
        darkInputRoot: {
            color: '#fff!important',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        inputInput: {
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '100%',
            },
            [theme.breakpoints.up('lg')]: {
                width: '50ch',
            },
            paddingTop: '10px',
            paddingBottom: '10px',
            '@media (max-width: 1660px)': {
                width: '34ch'
            },
            '@media (max-width: 1460px)': {
                width: '100%'
            },
            paddingRight: '10px'
        },

        lightPageHeading: {
            // color: '#131523',
            color: '#2A2C34',
            fontSize: '28px',
        },
        darkPageHeading: {
            // color: '#131523',
            color: '#fff',
            fontSize: '28px',
        },
        smallText: {
            alignSelf: "flex-end",
            color: '#5A607F',
            paddingLeft: '1rem',
            fontWeight: '400'
        },
        Media1249: {
            width: '50%',
            marginLeft: 'auto!important',
            marginRight: 0,
            '@media only screen and (max-width: 890px)': {
                width: '100%',
            },

        },
        margnBottomMediaQuery: {
            '@media only screen and (max-width: 1249px)': {
                marginBottom: '.75rem'
            },


        },
        // PerfectScrollbarContainer: {
        //     padding: '1rem 1.4rem',
        //     paddingBottom: '0',
        //     height: 'calc(100vh - 64px)',
        //     '@media only screen and (max-width: 575px)': {
        //         padding: '.5rem',
        //     },
        // },
        // mobileSave: {
        //     padding: '1rem 1.4rem',
        //     paddingBottom: '0',
        //     height: 'calc(100vh - 64px)',
        //     overflow: "auto",
        //     '@media only screen and (max-width: 575px)': {
        //         padding: '.5rem',
        //     },
        // },
        secondNavRow2: {
            '@media only screen and (max-width: 890px)': {
                justifyContent: 'space-between'
            },
            '@media only screen and (max-width: 575px) and (min-width: 509px)': {
                marginBottom: '.6rem'
            }
            , '@media only screen and (max-width: 510px)': {
                flexWrap: 'wrap',
                "& > div": {
                    // width: '50%',
                    // minWidth: '50%',
                    // maxWidth: '50%',
                    marginBottom: '.75rem'
                },
                "& > div:nth-child(odd)": {
                    paddingRight: '1rem'

                }
            },
        },
        MobileFontStyle: {
            '@media only screen and (max-width: 575px) ': {
                marginBottom: '.7rem',
                marginTop: '.4rem',
                '& h1': {
                    fontSize: '18px'
                }
            }
        }

    }
))

// get div with
function AppStore({toggle}) {
    const dispatch = useDispatch();
    const classes = useStyles();
    let publishedAppsStore = useSelector((state) => state.snAllPublishedAppsStore);
    const { installedAppsStore, installedAppsStoreForLogin } = useSelector((state) => state.snInstalledAppsStore);
    let tags = []
    const [searchData, setSearchData] = useState([])
    const [selectedTag, setSelectedTag] = useState('All')



    useEffect(async () => {
        // console.log("came here");
        //await dispatch(getAllPublishedAppsAction());
        //dispatch(getAllPublishedAppsAction("ACCESS", "DESC", 0))
        dispatch(getAggregatedAppStatsAction()) // I can do pagination here
        setSearchData(publishedAppsStore)
        dispatch(getMyInstalledAppsAction());
        if (installedAppsStoreForLogin) {
            dispatch(installedAppAction(installedAppsStoreForLogin));
        }
    }, []);

    useEffect(() => {

        setSearchData(publishedAppsStore)

    }, [setSearchData, publishedAppsStore])
    // publishedAppsStore.filter(item => {
    //     if (item.content.category) {

    //         tags = [...tags, ...tempTags]

    //     }
    // })
    // tags = [...new Set(tags)]
    let tagsWithCount = tags.reduce(function (obj, b) {
        obj[b] = ++obj[b] || 1
        return obj
    }, {})

    // const [state, setstate] = useState(initialState)

    // console.log(newD)

    tagsWithCount = Object.keys(tagsWithCount)

    tagsWithCount = Object.values(tagsWithCount)

    tagsWithCount = Object.entries(tagsWithCount)

    const history = useHistory();
    const stUserSession = useSelector((state) => state.userSession);

    const handleInstall = async (item, key) => {
        if (stUserSession) {
            if (key == "install") {
                dispatch(installedAppAction(item));
            } else {
                dispatch(unInstalledAppAction(item.id));
            }
        } else {
            if (key == "install") {
                await dispatch(installedAppActionForLogin(item));
                history.push('/login');
            }
        }
    }
    // temp var for selected page
    // const selectedPage = true
    // This page code
    const { width } = useWindowDimensions()



    // console.log(width)

    // useInterval(async () => {
    //     dispatch(getAllPublishedAppsAction());
    // }, 30000);

    const searchHandler = (e) => {
        const options = {
            isCaseSensitive: false,
            // includeScore: false,
            shouldSort: true,
            // includeMatches: false,
            findAllMatches: true,
            minMatchCharLength: 0,
            // location: 0,
            threshold: 0.0,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            includeScore: true,
            keys: [
                "content.appname",
                "content.category",
                "content.tags"
            ]
        }

        const fuse = new Fuse(publishedAppsStore, options)

        // Change the pattern
        const pattern = e.target.value
        console.log(pattern)
        if (pattern) {
            let _newD = fuse.search(pattern)
            _newD = _newD.map(_ => _.item)
            setSearchData(_newD)
            console.log(_newD)
        } else {
            setSearchData(publishedAppsStore)
        }
    }


    // app list code
    // const tagClickHandler = (e) => {
    //     let storeApps = publishedAppsStore

    //     if (selectedTag === e.target.dataset.tag) {
    //         setSelectedTag("")
    //         e.target.classList.remove("selected")
    //         e.target.classList.add("notselected")
    //         setSearchData(publishedAppsStore)
    //     } else {
    //         setSelectedTag(e.target.dataset.tag)
    //         // selectedTag ? document.querySelector(`[data-value="${selectedTag}"]`).style.background = 'red' : null

    //         storeApps = storeApps.filter(item => item.content.tags.includes(e.target.dataset.tag))
    //         // e.target.classList
    //         setSearchData(storeApps)
    //         e.target.classList.add("selected")
    //         // console.log("cls ", )
    //         e.target.classList.remove("notselected")
    //         // setSearchData 
    //         // console.log()
    //     }

    // }
    // catogires click handlers
    document.querySelector(`button[data-cat="All"]`) && document.querySelector(`button[data-cat=${selectedTag}]`).classList.add('selected')

    const catClickHandler = (e) => {
        let storeApps = publishedAppsStore
        if (e.target.dataset.cat == 'All') {
            setSelectedTag('All')
            setSearchData(publishedAppsStore)
            Array.from(document.querySelectorAll('.tagButton')).forEach((el) => el.classList.remove('selected'))
            e.target.classList.add("selected")
            return 0
        }
        if (e.target.dataset.cat !== selectedTag && document.querySelector(".tagButton")) {
            setSelectedTag(e.target.dataset.cat)
            storeApps = storeApps.filter(item => item.content.category == e.target.dataset.cat)
            setSearchData(storeApps)

            Array.from(document.querySelectorAll('.tagButton')).forEach((el) => el.classList.remove('selected'))
            e.target.classList.add("selected")
            return 0
        }
        if (selectedTag === e.target.dataset.cat) {
            setSelectedTag("All")
            e.target.classList.remove("selected")
            setSearchData(publishedAppsStore)

        } else {

            setSelectedTag(e.target.dataset.tag)

            storeApps = storeApps.filter(item => item.content.category == e.target.dataset.cat)
            setSearchData(storeApps)
            e.target.classList.add("selected")
        }
    }
    let categories = []
    publishedAppsStore.filter(item => categories.push(item.content.category))
    //console.log("cates", categories)
    let catWithCount = categories.reduce(function (obj, b) {
        obj[b] = ++obj[b] || 1
        return obj
    }, {})


    catWithCount = Object.entries(catWithCount)
    catWithCount.unshift(['All', categories.length])
    // console.log("catwithcount", catWithCount)

    let sliderContainerWidth
    if (document.querySelector('.appTagsButtons')) {
        sliderContainerWidth = document.querySelector('.appTagsButtons').clientWidth
    }
    // enabling the slicker slider logically 
    const sliderRef = React.createRef()
    const [showSlider, setShowSlider] = React.useState(false)

    React.useLayoutEffect(() => {
        if (sliderRef.current.clientWidth < sliderRef.current.scrollWidth) {
            setShowSlider(true)
        }
    }, [sliderRef])
    // console.log(sliderRef.current.clientWidth, sliderRef.current.scrollWidth)
    let showSlides = width > 1600 ? 1600 / 140 : width / 140
    //console.log("slided to show " + showSlides + "Width " + width)
    let slicky = 133 * catWithCount.length <= sliderContainerWidth ? 'unslick' : 'slick'
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        // slidesToShow: Math.floor(width / 140),
        // slidesToShow: Math.floor(width / 140),
        slidesToShow: width > 890 ? Math.round(showSlides) - 2 : showSlides,
        slidesToScroll: 2,
        nextArrow: <SlickNextArrow toggle={toggle} />,
        prevArrow: <SlickPrevArrow toggle={toggle} />,
        responsive: [

            {
                breakpoint: 10000, // a unrealistically big number to cover up greatest screen resolution
                settings: slicky
            }
        ]
    }

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

    return (
        // (width < 575)
        //     ? <div className={classes.mobileSave}>{AppsComp}</div>
        //     : < PerfectScrollbar className={classes.PerfectScrollbarContainer} >{AppsComp}</PerfectScrollbar>
        <>
        <div><Fragment >
            <Box display="flex" className='second-nav' alignItems="center">
                <Box display="flex" alignItems="center" className={`${classes.margnBottomMediaQuery} ${classes.MobileFontStyle}`}>
                    <h1 className={`${toggle ? classes.darkPageHeading : classes.lightPageHeading}`}>Skynet AppStore</h1>
                </Box>
                {width < 1050 && <div className={`${toggle ? classes.darkSearch : classes.lightSearch} ${classes.Media1249} ${classes.margnBottomMediaQuery}`}>
                    <Box>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                    </Box>
                    <InputBase

                        onChange={searchHandler}
                        placeholder="Search Apps"
                        classes={{
                            root: toggle ? classes.darkInputRoot : classes.lightInputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        type="search"

                    />
                </div>}
                <Box className={classes.secondNavRow2} display="flex" alignItems="center" flex={1} justifyContent='flex-end'>


                    {width > 1049 && <div className={`${toggle ? classes.darkSearch : classes.lightSearch}`}>
                        <Box>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                        </Box>
                        <InputBase
                            onChange={searchHandler}
                            placeholder="Search Apps"
                            classes={{
                                root: toggle ? classes.darkInputRoot : classes.lightInputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            type="search"

                        />
                    </div>}
                    <Box>
                        <ListFilter toggle={toggle} />
                    </Box>
                    {/* <Box>
                        <SelectItem />
                    </Box> */}
                    {/* <Box>
                    <SubmitBtn >
                        Add App
                    </SubmitBtn>
                </Box> */}
                </Box>
            </Box>

            {/* <div >
            <Button className="tagButton">
                Art & Design (5)
            </Button>
        </div> */}
            <div ref={sliderRef}>
                <Slider {...settings} id="appTagsButtons" className="appTagsButtons" >
                    {/* {tagsWithCount.map((tag, index) => tag[1] >= 2 && <div key={index}>
                    <Button data-tag={tag[0]} onClick={tagClickHandler} className="tagButton">
                        {tag[0]} ({tag[1]})
                    </Button>
                </div>)} */}

                    {catWithCount.map((tag, index) => tag[1] >= 1 && <div key={index}>
                        <Button data-cat={tag[0]} onClick={catClickHandler} className={toggle ? 'darkTagButton' : 'lightTagButton'}>
                            <span className='value-cat'>{tag[0]}</span> <span className='count-cat'>{tag[1]}</span>
                        </Button>
                    </div>)}
                </Slider>
            </div>
            <div style={{ marginBottom: '2rem' }}>
                <AppsList toggle={toggle} newData={searchData} installedApps={installedAppsStore} handleInstall={handleInstall} />
                <Footer toggle={toggle}/>
            </div>
        </Fragment>
        </div>
        </>
    )
}
export default AppStore
