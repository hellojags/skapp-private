const leftMenuStyles = (theme) => ({
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  developerTitle: {
    color: theme.palette.primary.main,
  },
  dashboardCont: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 28,
    marginTop: 25,
    alignItems: "center",
  },
  spaceIcon: {
    color: theme.palette.primary.main,
    fontSize: "20px",
  },
  spacesLink: {
    color: theme.palette.primary.main,
    paddingLeft: 30,
  },
  iconStyling: {
    fontSize: "20px",
  },
  spacesCont: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
  },
  linkName: {
    paddingLeft: 30,
    color: theme.palette.linksColor,
    textDecoration: "none",
  },
  spacelinkName: {
    paddingLeft: 30,
    fontSize: 15,
    color: theme.palette.linksColor,
  },
  editIconStyle: {
    fontSize: 23,
    paddingRight: 5,
    color: theme.palette.mediumGray,
  },
  shareIconStyle: {
    fontSize: 15,
    color: theme.palette.mediumGray,
  },
  shareIconStyleNew: {
    fontSize: 15,
    color: theme.palette.mediumGray,
    paddingLeft: 10,
  },
  list: {
    width: 295,
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
  fullList: {
    width: "auto",
  },
  spaceBookIcon: {
    fontSize: 15,
    color: theme.palette.mediumGray,
    position: "relative",
    left: 12,
  },
  spacesNumber: {
    color: theme.palette.primary.main,
    fontSize: 13,
    paddingLeft: 6,
  },
  spaceLinkStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.palette.linksColor,
    paddingTop: 10,
    paddingBottom: 10,
  },
  linksStyles: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.linksColor,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: "16px",
    fontWeight: "500",
  },
  sideNavContainer: {
    paddingTop: 100,
    margin: "auto",
    width: "80%",
  },
  sideNavContainerForDrawer: {
    paddingTop: 20,
    margin: "auto",
    width: "80%",
  },
  drawerPaper: {
    width: 295,
    borderRight: "none",
    backgroundColor: theme.palette.lightGray,
  },
  mainExampleDrawer: {
    backgroundColor: theme.palette.lightGray,
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${295}px)`,
      marginLeft: 295,
    },
    backgroundColor: theme.palette.whiteBgColor,
    padding: theme.spacing(3),
  },
  contentBgColor: {
    backgroundColor: theme.palette.whiteBgColor,
  },
  content2: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      marginLeft: 0,
    },
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: 295,
      flexShrink: 0,
    },
  },
  sideProf_div: {
    marginTop: "10px",
    height: "180px",
    background: "white",
    overflowY: "scroll",
    paddingBottom: "20px",
    backgroundColor: theme.palette.whiteBgColor,
  },
  innerSideProf_div: {
    display: "flex",
    padding: "20px",
  },
  innerSideProf2_div: {
    display: "flex",
    padding: "0px 20px 0px 20px",
  },
  icon_sub_title_div: {
    fontSize: "12px",
    padding: "3px 0px 0px 20px",
    color: `${theme.palette.primary.textColor}`,
  },
  sharedSpace_names: {
    color: theme.palette.linksColor,
  },
  image_logo_sideBarfooter: {
    display: "flex",
    justifyContent: "center",
  },
})

export default leftMenuStyles
