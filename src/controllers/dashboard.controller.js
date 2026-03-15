import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const userId = req.user?._id;

  const likes = await Like.find({ likedBy: userId }).countDocuments();
  const subscribersCount = await Subscription.find({
    channel: userId,
  }).countDocuments();
  const videoUploaded = await Video.find({ owner: userId });

  const resultData = {
    likeCount: likes,
    subscribersCount: subscribersCount,
    videoUploaded: videoUploaded,
  };

  res
    .status(200)
    .json(new ApiResponse(200, resultData, "channel stat fetched"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const userId = req.user?._id;

  const videoUploaded = await Video.find({ owner: userId });

  res
    .status(200)
    .json(new ApiResponse(200, videoUploaded, "channel stat fetched"));
});

export { getChannelStats, getChannelVideos };
