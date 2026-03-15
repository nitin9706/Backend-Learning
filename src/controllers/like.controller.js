import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  //TODO: toggle like on video
  const userId = req.user._id;

  if (!videoId) {
    throw new ApiError(404, "video id not found");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "video does not exist");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, false, "video like removed"));
  } else {
    await Like.create({
      video: videoId,
      likedBy: userId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, true, "video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  //TODO: toggle like on video
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(404, "comment id not found");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(404, "comment does not exist");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    res.status(200).json(new ApiResponse(200, false, "comment like removed"));
  } else {
    await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    res
      .status(200)
      .json(new ApiResponse(200, true, "comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;
  //TODO: toggle like on video
  const userId = req.user._id;

  if (!tweetId) {
    throw new ApiError(404, "tweet id not found");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(404, "tweet does not exist");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    res.status(200).json(new ApiResponse(200, false, "tweet like removed"));
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
    res
      .status(200)
      .json(new ApiResponse(200, true, "tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "video id required");
  }

  const LikedVideo = await Like.find({ likedBy: userId });
  console.log(LikedVideo);
  res
    .status(200)
    .json(new ApiResponse(200, LikedVideo, "liked video feteched"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
