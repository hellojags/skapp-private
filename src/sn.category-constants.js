import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import CasinoOutlinedIcon from "@material-ui/icons/CasinoOutlined";
import SportsEsportsOutlinedIcon from "@material-ui/icons/SportsEsportsOutlined";
import MenuBookTwoToneIcon from "@material-ui/icons/MenuBookTwoTone";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import LiveTvOutlinedIcon from "@material-ui/icons/LiveTvOutlined";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import PermDeviceInformationOutlinedIcon from "@material-ui/icons/PermDeviceInformationOutlined";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import SnImages from "./components/categories/images/sn.images";
import SnVideo from "./components/categories/video/sn.video";
import SnAudio from "./components/categories/audio/sn.audio";

export const CATEGORY_OBJ = {
  all: {
    getLogo: () => <AllInclusiveIcon />,
    heading: "All",
  },
  social: {
    getLogo: (className) => <PermDeviceInformationOutlinedIcon className={className ? className : ""} />,
    heading: "Social",
  },
  video: {
    getLogo: (className) => <FontAwesomeIcon icon="video" className={className ? className : ""}></FontAwesomeIcon>,
    heading: "Videos",
    
  },
  pictures: {
    getLogo: (className) => <CameraAltOutlinedIcon className={className ? className : ""} />,
    heading: "Pictures",
  },
  music: {
    getLogo: (className) => <FontAwesomeIcon icon="headphones" className={className ? className : ""}></FontAwesomeIcon>,
    heading: "Music",
  },
  productivity: {
    getLogo: (className) => <DescriptionOutlinedIcon className={className ? className : ""} />,
    heading: "Productivity",
  },
  utilities: {
    getLogo: (className) => <BusinessCenterOutlinedIcon className={className ? className : ""} />,
    heading: "Utilities",
  },
  games: {
    getLogo: (className) => <SportsEsportsOutlinedIcon className={className ? className : ""} />,
    heading: "Games",
  },
  blogs: {
    getLogo: (className) => <FontAwesomeIcon icon="blog" className={className ? className : ""}></FontAwesomeIcon>,
    heading: "Blogs",
  },
  software: {
    getLogo: (className) => <CasinoOutlinedIcon className={className ? className : ""} />,
    heading: "Software",
  },
  livestream: {
    getLogo: (className) => <LiveTvOutlinedIcon className={className ? className : ""} />,
    heading: "LiveStream",
  },
  books: {
    getLogo: (className) => <MenuBookTwoToneIcon className={className ? className : ""} />,
    heading: "Books",
  },
  marketplace: {
    getLogo: (className) => <PermDeviceInformationOutlinedIcon className={className ? className : ""} />,
    heading: "Marketplace",
  },
  finance: {
    getLogo: (className) => <PermDeviceInformationOutlinedIcon className={className ? className : ""} />,
    heading: "Finance",
  },
  portal: {
    getLogo: (className) => <PermDeviceInformationOutlinedIcon className={className ? className : ""} />,
    heading: "Skynet Portal",
  },
};

export const getCategoryObjWithoutAll = () => {
  const categoryObjCopy = JSON.parse(JSON.stringify(CATEGORY_OBJ));
  delete categoryObjCopy.all;
  return categoryObjCopy;
};

export const getCategoryObjWithoutAllAsArray = () => {
  const categoryObjCopy = JSON.parse(JSON.stringify(CATEGORY_OBJ));
  delete categoryObjCopy.all;
  const categoryArr = [];
  for (const key in categoryObjCopy) {
    if (categoryObjCopy.hasOwnProperty(key)) {
      const obj = {
        key,
        label: categoryObjCopy[key].heading,
      };
      categoryArr.push(obj);
    }
  }
  return categoryArr;
};
