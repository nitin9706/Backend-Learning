import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { DeleteCloudnaryFile, uploadOnCloudnary } from "../utils/Cloudnary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
// getting all videos
const getAllVideos = asyncHandler(async (req, res) => {
  // Implementation for getting all videos
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  if (page < 1 || limit < 1) {
    throw new ApiError(404, "page and limit should be positive");
  }

  const pipeline = [];
  // only give the videos that are published
  const defaultVideo = { isPublished: true };
  // videos gotten from the query data
  if (!query) {
    throw new ApiError(404, "query is required");
  } else {
    defaultVideo.$or = [
      { title: { $regex: query, $options: "i" } },
      {
        description: { $regex: query, $options: "i" },
      },
    ];
  }

  if (userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid User 1");
    }
    defaultVideo.owner = new mongoose.Types.ObjectId(userId);
    defaultVideo.isPublished = false;
  }

  // pushing the element to the pipeline array
  pipeline.push({
    $match: defaultVideo,
  });

  // if sorting is used then
  const sortField = {};
  if (sortBy) {
    sortField[sortBy] = sortType === "asc" ? 1 : -1;
  } else {
    sortField["createdAt"] = sortType === "asc" ? 1 : -1;
  }
  pipeline.push({
    $sort: sortField,
  });

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    { $addFields: { owner: { $first: "$owner" } } }
  );

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const paginatedVideos = await Video.aggregatePaginate(
    Video.aggregate(pipeline, options)
  );

  if (!paginatedVideos) {
    throw new ApiResponse(500, "Couldn't fetch videos, Please try again.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, paginatedVideos, "video got successfully"));
});

// video uploader controller
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

const getVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) {
    throw new ApiError(404, "give the video id");
  }

  const video = await Video.findById(videoId);
  video.number = number++;
  await video.save({ validateBeforeSave: false });
  res.status(200).json(new ApiResponse(200, video, "Video got successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) {
    throw new ApiError(404, "give the video id to upadte the video");
  }

  const { title, description } = req.body;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "no video exist");
  }
  // changing the title of the video

  if (title) {
    video.title = title;
  }
  // changing the description of the video
  if (description) {
    video.description = description;
  }

  const thumbnailLocalPath = req.file?.path;
  // if there is a new thumbnail then it chnages
  if (thumbnailLocalPath) {
    const oldThumbnailLink = video.thumbnail;

    const newThumbnail = await uploadOnCloudnary(thumbnailLocalPath);

    if (!newThumbnail) {
      throw new ApiError(400, "coverImage is not uploaded ");
    }

    // if there is new thumnail them it changes it in dbs

    video.thumbnail = newThumbnail.url;

    await DeleteCloudnaryFile(oldThumbnailLink);
  }
  await video.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, video, "all changes have done successfully"));
});
const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) {
    throw new ApiError(404, "give the video id to upadte the video");
  }

  //TODO: delete video

  const video = await Video.findByIdAndDelete(videoId);
  res.status(200).json(200, {}, "video has been deleted");
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) {
    throw new ApiError(404, "give the video id to upadte the video");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }

  const lastPublishedStatus = video.isPublished;

  const newPublishedStatus = !lastPublishedStatus;

  video.isPublished = newPublishedStatus;
  await video.save({ validateBeforeSave: true });
  res.status(200).json(new ApiResponse(200, video, "published status changed"));
});

export {
  videoUploader,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
