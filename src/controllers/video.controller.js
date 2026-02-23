import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudnary } from "../utils/Cloudnary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const videoUploader = asyncHandler(async (req, res) => {
  //  to upload a video
  // need to check that the user is loggedIn or not
  // data receive from the user
  //  video and thumbnail is send to cloudinary
  //  the link and the data is sent to the db
  //  conformation of videos uploaded as response to user
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "title and description is required");
  }
  //   need the video and thumbnail local path

  let videoLocalPath;
  if (req.files && req.files.video && req.files.video.length > 0) {
    videoLocalPath = req.files.video[0].path;
  }
  let thumbnailLocalPath;
  if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  const video = await uploadOnCloudnary(videoLocalPath);
  let thumbnailPath;
  if (thumbnailLocalPath) {
    const image_link = await uploadOnCloudnary(thumbnailLocalPath);
    thumbnailPath = image_link.url;
  } else {
    thumbnailPath =
      "https://tse3.mm.bing.net/th/id/OIP.5PxrXkYd_-27w1MBnZaOnAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3";
  }

  if (!video) {
    throw new ApiError(400, `video not found`);
  }

  if (!thumbnailPath) {
    throw new ApiError(400, "thumbnail not found");
  }

  const videoObject = await Video.create({
    title,
    description,
    thumbnail: thumbnailPath,
    videoFile: video.url,
    duration: video.duration,
    public_id: video.public_id,
  });

  const videoUploaded = await Video.findById(videoObject._id).select(
    "-public_id -duration"
  );
  if (!videoUploaded) {
    throw new ApiError(500, "error while uploading data in db");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, videoUploaded, "Video is uploaded success fully")
    );
});
export { videoUploader };
