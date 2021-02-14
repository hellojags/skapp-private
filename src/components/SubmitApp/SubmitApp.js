import React, { useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import Select from "react-select";
import { Add } from "@material-ui/icons";
import styles from "../../assets/jss/app-details/SubmitAppStyles";
// img icon
import { ReactComponent as ImgIcon } from "../../assets/img/icons/image.svg";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
// importing action
import {
  publishAppAction,
} from "../../redux/action-reducers-epic/SnPublishAppAction";
import {
  UploadImagesAction,
  UploadVideoAction,
  UploadAppLogo,
} from "../../service/SnSkappService";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import imageCompression from "browser-image-compression";
import Alert from "@material-ui/lab/Alert";
import Loader from "react-loader-spinner";

const useStyles = makeStyles(styles);
const optionsVersion = [
  { value: "1.0", label: "1.0" },
  { value: "1.01", label: "1.01" },
  { value: "1.02", label: "1.02" },
];

const appCatOptions = [
  { value: "all", label: "all" },
  { value: "social", label: "social" },
  { value: "video", label: "video" },
  { value: "pictures", label: "pictures" },
  { value: "music", label: "music" },
  { value: "productivity", label: "productivity" },
  { value: "utilities", label: "utilities" },
  { value: "games", label: "games" },
  { value: "blogs", label: "blogs" },
  { value: "software", label: "software" },
  { value: "livestream", label: "livestream" },
  { value: "books", label: "books" },
  { value: "marketplace", label: "marketplace" },
  { value: "finance", label: "finance" },
  { value: "portal", label: "portal" },
];

const optionsAge = [
  { value: "7", label: "7" },
  { value: "13", label: "13" },
  { value: "18", label: "18" },
  { value: "general", label: "general" },
];

const appStatus = [
  { value: "Alpha", label: "Alpha" },
  { value: "Beta", label: "Beta" },
  { value: "Live", label: "Live" },
];

const socialOption = [
  { value: "facebook", label: "facebook" },
  { value: "Reddit", label: "Reddit" },
  { value: "Twitter", label: "Twitter" },
];

const reactSelectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    height: 55,
    boxShadow: 0,
    borderColor: "#D9E1EC",
    color: "#000",
    borderRadius: 8,
    "@media only screen and (max-width: 1440px)": {
      height: 50,
      // width: '100%',
      fontSize: 16,
    },
    "@media only screen and (max-width: 575px)": {
      height: 43,
      // width: '100%',
      fontSize: 14,
    },
    "&:hover": {
      borderColor: "#1DBF73",
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#1DBF73" : "#fff",
    "&:foucs": {
      backgroundColor: "#1DBF73",
    },
  }),
};

let forImagesPreview = [];
const SubmitApp = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const dispatch = useDispatch();

  const [verson, setVersion] = useState("");
  const [tags, setTags] = useState([]);
  const { register, handleSubmit, control } = useForm();
  const classes = useStyles();

  // state for social links according to format
  const [firstSocialLinkTitle, setfirstSocialLinkTitle] = useState("");
  const [secondSocialLinkTitle, setSecondSocialLinkTitle] = useState("");
  const [thirdSocialLinkTitle, setThirdSocialLinkTitle] = useState("");

  const [firstSocialLink, setfirstSocialLink] = useState("");
  const [secondSocialLink, setSecondSocialLink] = useState("");
  const [thirdSocialLink, setThirdSocialLink] = useState("");

  const [videoObjt, setVideoObj] = useState({});

  const [mandatory, setMandatory] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isImageUploadFirst, setIsImageUploadingFirst] = useState(false);
  const [isImageUploadSecond, setIsImageUploadingSecond] = useState(false);
  const [isImageUploadThird, setIsImageUploadingThird] = useState(false);

  const [appLogo, setAppLogo] = useState("");
  const [isLogoUploaded, setIsLogoUploaded] = useState(false);

  //require
  const [isAppLogoTrue, setIsAppLogoTrue] = useState(false);
  const [isAppNameTrue, setIsAppNameTrue] = useState(false);
  const [isAppVersionTrue, setIsAppVersionTrue] = useState(false);
  const [isAppUrlTrue, setIsAppUrlTrue] = useState(false);
  const [isAppCatTrue, setIsAppCatTrue] = useState(false);
  const [isAppDetailDesTrue, setIsAppDetailDesTrue] = useState(false);

  //manage submit loader
  const manageSubmitLoader = (val) => {
    setIsSubmit(val);
  };

  //manage loader to upload images
  //form submit function
  const onSubmit = (data) => {
    if (appLogo === "") {
      setIsAppLogoTrue(true);
      // setMandatory(true);
    } else if (data.appname === "") {
      setIsAppNameTrue(true);
    } else if (verson === "") {
      setIsAppVersionTrue(true);
    } else if (data.appUrl === "") {
      setIsAppUrlTrue(true);
    } else if (data.category === null) {
      setIsAppCatTrue(true);
    } else if (data.appDescription === "") {
      setIsAppDetailDesTrue(true);
    } else {
      setIsSubmit(true);
      let obj = {
        $type: "publishedSkapp",
        id: uuidv4(),
        version: "v1",
        ts: "1610328319",
        content: data,
      };

      let imagesPrevieObj = {
        aspectRatio: 0.5625,
        images: forImagesPreview,
      };
      obj.content.skappLogo = appLogo;
      obj.content.category = obj.content.category && obj.content.category.value;
      obj.content.defaultPath = "index.html or EMPTY";
      obj.content.age = obj.content.age && obj.content.age.value;
      obj.content.previewVideo = videoObjt;
      obj.content.appStatus =
        obj.content.appStatus &&
        obj.content.appStatus.map((i) => {
          return i.value;
        });
      obj.content.tags = tags;
      obj.content.previewImages = imagesPrevieObj;
      obj.content.history = ["list of skylinks"];
      obj.content.supportDetails = "";

      obj.content.connections = {
        [firstSocialLinkTitle]: firstSocialLink,
        [secondSocialLinkTitle]: secondSocialLink,
        [thirdSocialLinkTitle]: thirdSocialLink,
      };

      dispatch(publishAppAction(obj));
      setMandatory(false);
    }
  };

  const getUploadedFile = (file) => {
    forImagesPreview.push(file);
  };

  const [isVideoUploaded, setIsVideoUploaded] = useState(false);

  //manage loader for videoUpload
  const videoUploadLoader = (val) => {
    setIsVideoUploaded(val);
  };

  //manage image upload loaders

  const firstImageLoader = (val) => {
    setIsImageUploadingFirst(val);
  };

  const secondImageLoader = (val) => {
    setIsImageUploadingSecond(val);
  };

  const thirdImageLoader = (val) => {
    setIsImageUploadingThird(val);
  };

  //for uploading images and videos
  const onChangeHandlerForImages = (file, id) => {
    if (id === "img1") {
      setIsImageUploadingFirst(true);
    } else if (id === "img2") {
      setIsImageUploadingSecond(true);
    } else {
      setIsImageUploadingThird(true);
    }

    var image = document.getElementById(id);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (oFREvent) {
      var img = document.createElement("img");
      img.setAttribute("width", "100%");
      img.setAttribute("height", "160px");
      image.append(img);
      img.src = oFREvent.target.result;
    };

    UploadImagesAction(file, getUploadedFile, 
      id === "img1"
        ? firstImageLoader
        : id === "img2"
          ? secondImageLoader
          : thirdImageLoader
    );
  };

  //
  const getUploadVideoFile = (file) => {
    setVideoObj(file);
  };

  const onChangeHandlerForVideos = (file) => {
    var fileReader = new FileReader();
    setIsVideoUploaded(true);
    fileReader.onload = function () {
      var blob = new Blob([fileReader.result], { type: file.type });
      var url = URL.createObjectURL(blob);
      var video = document.createElement("video");
      var timeupdate = function () {
        if (snapImage()) {
          video.removeEventListener("timeupdate", timeupdate);
          video.pause();
        }
      };
      video.addEventListener("loadeddata", function () {
        if (snapImage()) {
          video.removeEventListener("timeupdate", timeupdate);
        }
      });
      var snapImage = async function () {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL();

        const thumb = await imageCompression.canvasToFile(canvas, "image/jpeg");

        
        UploadVideoAction(file, thumb, getUploadVideoFile, videoUploadLoader)
        
        var success = image.length > 100000;
        if (success) {
          var img = document.createElement("img");
          img.src = image;
          document.getElementById("vid").appendChild(img);
          URL.revokeObjectURL(url);
        }
        return success;
      };
      video.addEventListener("timeupdate", timeupdate);
      video.preload = "metadata";
      video.src = url;
      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;
      video.play();
    };
    fileReader.readAsArrayBuffer(file);
  };

  const setLogoUploaded = (file) => {
    setAppLogo(file);
  };

  const logoLoaderHandler = (val) => {
    setIsLogoUploaded(val);
  };

  const UploadLogoFunction = (file) => {
    setIsLogoUploaded(true);
    var image = document.getElementById("logo");
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (oFREvent) {
      var img = document.createElement("img");
      img.setAttribute("width", "100%");
      img.setAttribute("height", "160px");
      image.append(img);
      img.src = oFREvent.target.result;
    };
    UploadAppLogo(file, setLogoUploaded, logoLoaderHandler);
  };

  return (
    <Box>
      {mandatory ? <Alert severity="error">Fill all fields!</Alert> : null}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop="7px"
      >
        <h1 className={classes.h1}>Publish App</h1>
        <Box className={classes.btnBox}>
          <Button className={classes.cancelBtn}>Cancel </Button>
          <Button
            disabled={isSubmit}
            className={classes.submitBtn}
            onClick={handleSubmit(onSubmit)}
          >
            <Add />
            {isSubmit ? (
              <Loader type="Oval" color="#FFFFFF" height={15} width={15} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </Box>

      <Box component="form">
        {/* < */}
        <Box>
          <label className={classes.label}>Site Logo</label>
          <div
            style={{ position: "relative" }}
            id="logo"
            className={classes.siteLogo}
          >
            {/* <ImgIcon /> */}

            <div style={{ position: "absolute" }}>
              {isLogoUploaded && (
                <Loader type="Oval" color="#57C074" height={50} width={50} />
              )}
            </div>
          </div>

          <div className={classes.inputGuide}>
            Max. size of 5 MB in: JPG or PNG. 300x500 or larger recommended
          </div>
          <input
            type="file"
            onChange={(e) => UploadLogoFunction(e.target.files[0])}
          />
        </Box>
        {isAppLogoTrue && (
          <div className="required-field">This field is required</div>
        )}
        <Box
          display="flex"
          className={`${classes.formRow} ${classes.formRow1}`}
        >
          <Box
            className={`${classes.inputContainer} ${classes.max33}`}
            flex={1}
          >
            <label>AppName</label>
            <input
              className={classes.input}
              placeholder="Skylink"
              name="appname"
              ref={register}
            />
            {isAppNameTrue && (
              <div className="required-field">This field is required</div>
            )}
          </Box>
          <Box className={`${classes.inputContainer} ${classes.selectVersion}`}>
            <label>Version</label>
            <Box>
              <Select
                defaultValue={verson}
                onChange={(e) => setVersion(e.value)}
                options={optionsVersion}
                styles={reactSelectStyles}
              />
              {isAppVersionTrue && (
                <div className="required-field">This field is required</div>
              )}
            </Box>
          </Box>
          <Box className={classes.inputContainer} flex={1}>
            <label>Demo url</label>
            <input
              className={classes.input}
              name="demoUrl"
              ref={register}
              placeholder="https://www.demo.com/UJJ5Rgbu2TM"
            />
          </Box>
          <Box className={`${classes.inputContainer} ${classes.selectVersion}`}>
            <label>Age</label>
            <Box>
              <Controller
                as={Select}
                name="age"
                ref={register}
                control={control}
                defaultValue={selectedOption}
                onChange={([selected]) => {
                  // React Select return object instead of value for selection
                  return { value: selected };
                }}
                options={optionsAge}
                styles={reactSelectStyles}
              />
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          className={`${classes.formRow} ${classes.formRow2}`}
        >
          <Box className={classes.inputContainer} flex={1}>
            <label>App Website URL</label>
            <input
              name="appUrl"
              ref={register}
              className={classes.input}
              placeholder="https://www.skapp.com/UJJ5Rgbu2TM"
            />
            {isAppUrlTrue && (
              <div className="required-field">This field is required</div>
            )}
          </Box>
          <Box className={classes.inputContainer} flex={1}>
            <label>Source Code</label>
            <input
              name="sourceCode"
              ref={register}
              className={classes.input}
              placeholder="https://www.demo.com/UJJ5Rgbu2TM"
            />
          </Box>
          <Box className={`${classes.inputContainer}`} flex={1}>
            <label>Choose Category</label>
            <Box>
              <Controller
                as={Select}
                control={control}
                ref={register}
                name="category"
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={appCatOptions}
                styles={reactSelectStyles}
              />
              {isAppCatTrue && (
                <div className="required-field">This field is required</div>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          className={`${classes.formRow} ${classes.formRow4}`}
        >
          <Box className={classes.inputContainer} flex={1}>
            <label>Manual tag</label>
            <TagsInput
              value={tags}
              className={classes.input}
              onChange={(tags) => setTags(tags)}
            />
            {/* <input
              className={classes.input}
              name="tags"
              ref={register}
              value="Skylink"
            /> */}
          </Box>

          <Box className={`${classes.inputContainer}`} flex={1}>
            <label>App Status</label>
            <Box>
              <Controller
                isMulti
                as={Select}
                ref={register}
                control={control}
                name="appStatus"
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={appStatus}
                styles={reactSelectStyles}
              />
            </Box>
          </Box>
        </Box>
        <div className={classes.OneRowInput}>
          <div>
            <label className={classes.previewImgLabel}>
              Preview Images
              <span>
                {" "}
                Max. size of 5 MB in: JPG or PNG. 1750x900 or larger recommended
              </span>
            </label>
          </div>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={6}>
              <Box style={{ position: "relative" }}>
                <div id="vid" className={classes.previewImg}>
                  {/* <ImgIcon /> */}
                  <div style={{ position: "absolute" }}>
                    {isVideoUploaded && (
                      <Loader
                        type="Oval"
                        color="#57C074"
                        height={50}
                        width={50}
                      />
                    )}
                  </div>
                </div>

                <input
                  accept=".mov,.mp4"
                  type="file"
                  // name="previewVideo"
                  // ref={register}
                  onChange={(e) => onChangeHandlerForVideos(e.target.files[0])}
                />
              </Box>
            </Grid>

            <Grid item md={3} sm={6} xs={6}>
              <Box style={{ position: "relative" }}>
                <div id="img1" className={classes.previewImg}>
                  {/* <ImgIcon /> */}
                  <div style={{ position: "absolute" }}>
                    {isImageUploadFirst && (
                      <Loader
                        type="Oval"
                        color="#57C074"
                        height={50}
                        width={50}
                      />
                    )}
                  </div>
                </div>

                <input
                  accept=".png,.jpg"
                  type="file"
                  onChange={(e) => {
                    onChangeHandlerForImages(e.target.files[0], "img1");
                  }}
                />
              </Box>
            </Grid>

            <Grid item md={3} sm={6} xs={6}>
              <Box
                style={{ position: "relative" }}
                id="img2"
                className={classes.placeholderImg}
              >
                <div style={{ position: "absolute" }}>
                  {isImageUploadSecond && (
                    <Loader
                      type="Oval"
                      color="#57C074"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
              </Box>
              <input
                accept=".png,.jpg"
                type="file"
                onChange={(e) => {
                  onChangeHandlerForImages(e.target.files[0], "img2");
                }}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={6}>
              <Box
                style={{ position: "relative" }}
                id="img3"
                className={classes.placeholderImg}
              >
                <div style={{ position: "absolute" }}>
                  {isImageUploadThird && (
                    <Loader
                      type="Oval"
                      color="#57C074"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
              </Box>
              <input
                accept=".png,.jpg"
                type="file"
                onChange={(e) => {
                  onChangeHandlerForImages(e.target.files[0], "img3");
                }}
              />
            </Grid>
            {/* <Grid item md={3} sm={6} xs={6}>
              <Box className={classes.placeholderImg}></Box>
            </Grid> */}
          </Grid>
        </div>
        <div className={classes.OneRowInput}>
          <div>
            <label className={classes.textareaLabel}>
              Release Notes
              <span>This will go on App Card.</span>
            </label>
          </div>
          <Box position="relative">
            <TextareaAutosize
              className={classes.textarea}
              aria-label="minimum height"
              rowsMin={4}
              ref={register}
              name="releaseNotes"
              // value="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et."
              placeholder="Write your Comment"
            />
            <span className={classes.maxChar}>Max 70 Characters</span>
          </Box>
        </div>
        <div className={classes.OneRowInput}>
          <div>
            <label className={classes.textareaLabel}>
              Detailed Description
              <span>Detailed summary of your app</span>
            </label>
          </div>
          <Box position="relative">
            <TextareaAutosize
              name="appDescription"
              ref={register}
              className={classes.textarea}
              aria-label="minimum height"
              rowsMin={6}
              // value="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et."
              placeholder="Write your Comment"
            />
            <span className={classes.maxChar}>0/500</span>
          </Box>
          {isAppDetailDesTrue && (
            <div className="required-field">This field is required</div>
          )}
        </div>
        <div className={classes.OneRowInput}>
          <div>
            <label className={classes.textareaLabel}>Social Media</label>
          </div>
          <Box position="relative">
            <Grid container spacing={2}>
              <Grid item md={6} lg={4} sm={12} xs={12}>
                <Box display="flex" className={classes.socialOptionContainer}>
                  <Select
                    classNamePrefix="socialMedia"
                    className={classes.socilaMediaSelect}
                    defaultValue={firstSocialLinkTitle}
                    onChange={(e) => setfirstSocialLinkTitle(e.value)}
                    options={socialOption}
                    styles={reactSelectStyles}
                  />
                  <input
                    placeholder="https://www.demo.com/UJJ5Rgbu2TM"
                    onChange={(e) => setfirstSocialLink(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item md={6} lg={4} sm={12} xs={12}>
                <Box display="flex" className={classes.socialOptionContainer}>
                  <Select
                    classNamePrefix="socialMedia"
                    className={classes.socilaMediaSelect}
                    defaultValue={secondSocialLinkTitle}
                    onChange={(e) => setSecondSocialLinkTitle(e.value)}
                    options={socialOption}
                    styles={reactSelectStyles}
                  />
                  <input
                    placeholder="https://www.demo.com/UJJ5Rgbu2TM"
                    onChange={(e) => setSecondSocialLink(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item md={6} lg={4} sm={12} xs={12}>
                <Box display="flex" className={classes.socialOptionContainer}>
                  <Select
                    classNamePrefix="socialMedia"
                    className={classes.socilaMediaSelect}
                    defaultValue={thirdSocialLinkTitle}
                    onChange={(e) => setThirdSocialLinkTitle(e.value)}
                    options={socialOption}
                    styles={reactSelectStyles}
                  />
                  <input
                    placeholder="https://www.demo.com/UJJ5Rgbu2TM"
                    onChange={(e) => setThirdSocialLink(e.target.value)}
                  />
                </Box>
              </Grid>

              <Grid item md={6} lg={4} style={{ alignSelf: "center" }}>
                <Button
                  className={classes.button}
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmit}
                >
                  {isSubmit ? (
                    <Loader
                      type="Oval"
                      color="#FFFFFF"
                      height={15}
                      width={15}
                    />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default SubmitApp;
