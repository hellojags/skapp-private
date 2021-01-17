import imageCompression from "browser-image-compression";

export const getCompatibleTags = (resCategory) => {
    let category = []
    if (resCategory != null) {
      if (Array.isArray(resCategory)) {
        category = resCategory.map((cat) => cat.toLowerCase())
      } else {
        category = [resCategory.toLowerCase()]
      }
    }
    return JSON.parse(JSON.stringify(category))
  }
  
  export const getSkyspaceListForCarousalMenu = (snSkyspaceList) => {
    if (snSkyspaceList != null) {
      const carousalMenuObj = {}
      snSkyspaceList.forEach((skyspace) => {
        carousalMenuObj[skyspace] = {
          label: skyspace,
        }
      })
      return carousalMenuObj
    }
  }
/** Start : Skynet Methods * */
const getPortal = () => {
  // let skynetPortal = store.getState().snUserSetting?.setting?.portal
  // skynetPortal =
  //   skynetPortal && skynetPortal.trim() !== "" ? skynetPortal : DEFAULT_PORTAL
  // return skynetPortal
}

// It will generate base32 url for any Skapp
const getbase32URlForSkapp = (skylink) => {
  let base32URL = null;
  return base32URL;
}


/**
 * Compresses Image file to Skyspace params
 * 
 * @param {File} originalFile Original File.
 */
export const getCompressedImageFile = async(originalFile) => await imageCompression(originalFile, {
  maxSizeMB: 1,
  maxWidthOrHeight: 256,
  useWebWorker: true,
});

/**
 * Generates thumbnail image file out of the first frame of the video file.
 * 
 * @param {Object} Object
 * @param {string?} Object.url - The video source Url.
 * @param {string?} Object.file - Optional video file object reference. If the Url s not provided, 
 * then this property must have a value. If the url does have a valu then this property will be ignored.
 */

export const generateThumbnailFromVideo = async ({file, url}) => {
  let videoResolve = null;
  const videoPromise = new Promise((resolve) => {
    videoResolve = resolve;
  });
  let video = document.createElement('video');
  video.crossOrigin = "anonymous";
  video.src = url ? url :  URL.createObjectURL(file);
  video.load();
  await videoPromise;
  const videoThumbnail = await videoToImg(video);
  return videoThumbnail;
};

/**
 * Takes a video element and that has image already loaded and returns an image file which is a thumbnail
 * generated out of the first frame of the video 
 * 
 * @param {Element} video Video Element.
 */

export const videoToImg = async (video) => {
  let canvas = document.createElement("canvas");
  let w = video.videoWidth;
  let h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);
  let file = await imageCompression.canvasToFile(canvas, "image/jpeg");
  return file;
};