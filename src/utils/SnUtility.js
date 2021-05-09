import imageCompression from "browser-image-compression";
import {DEFAULT_PORTAL} from "./SnConstants";
import base64 from "base64-js";
import base32Encode from "base32-encode";
import store from "../redux";

export function decodeBase64(input = "") {
  return base64.toByteArray(
    input.padEnd(input.length + 4 - (input.length % 4), "=")
  );
}

export function encodeBase32(input) {
  return base32Encode(input, "RFC4648-HEX", { padding: false }).toLowerCase();
}

export function getBase32Skylink(skylink) {
  return encodeBase32(decodeBase64(skylink));
}

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

// It will generate base32 url for any Skapp
const getbase32URlForSkapp = (skylink) => {
  let base32URL = null;
  return base32URL;
}
/**
 * Compresses Image file to Skyspace params. Returns an Object of type File
 * 
 * @param {File} originalFile Original File.
 */

export const getCompressedImageFile = async (originalFile) => {
  const compressedBlob = await imageCompression(originalFile, {
    maxSizeMB: 1,
    maxWidthOrHeight: 256,
    useWebWorker: true,
  });
  return new File([compressedBlob], compressedBlob.name);
};

/**
 * Generates thumbnail image file out of the first frame of the video file.
 * 
 * @param {Object} Object
 * @param {string?} Object.url - The video source Url.
 * @param {string?} Object.file - Optional video file object reference. If the Url s not provided, 
 * then this property must have a value. If the url does have a valu then this property will be ignored.
 */

export const generateThumbnailFromVideo = async ({ file, url }) => {
  let videoResolve = null;
  const videoPromise = new Promise((resolve) => {
    videoResolve = resolve;
  });
  let video = document.createElement('video');
  video.crossOrigin = "anonymous";
  video.src = url ? url : URL.createObjectURL(file);
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

export const hashFromSkylinkUploadResponse = (response) => response.skylink.replace("sia:", "");

export const flattenObject = (obj) => {
  const flattened = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key]
    }
  });
  return flattened;
};

/**
 * 
 * @param {String} searchStr Required. The string to search for in the object
 * @param {Object} obj Required. The object in which the searchStr will be searched. 
 * 
 * @description Searches for the searchStr in the value of every leaf node of the object. 
 * The method performs a case agnostic substring search. It returns true id searchStr in null.
 */
export const isStrInObj = (searchStr, obj) => {
  if (obj) {
    const flattenedObj = flattenObject(obj);
    return (searchStr == null) || Object.keys(flattenedObj).some(key => flattenedObj[key] != null && flattenedObj[key].toString().toLowerCase().includes(searchStr.toLowerCase()));
  } else {
    return true;
  }
};
export const genHostedAppSkappUrl = (hostedAppDetail) => hostedAppDetail?.content?.hns && hostedAppDetail?.content?.storageGateway &&
  `https://${hostedAppDetail.content.hns}.hns.${hostedAppDetail.content.storageGateway}`;
