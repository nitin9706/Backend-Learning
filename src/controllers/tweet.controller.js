import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudnary } from "../utils/Cloudnary.js";
import { Tweet } from "../models/tweet.model.js";

const getAllTweet = asyncHandler(async (req, res) => {
  const ownerId = req.params.id;

  if (!ownerId) {
    throw new ApiError(404, "userId needed");
  }

  const userTweets = await Tweet.find({ owner: ownerId });
  if (!userTweets) {
    throw new ApiError(404, "user tweet not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, userTweets, "User tweets retrieved successfully")
    );
});

const makeTweet = asyncHandler(async (req, res) => {
  // get data from user and upload it db or if i have an image then upload cloudinary first and then in db

  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  let imageUrl;
  const imagelocalPath = req.file?.path;
  if (imagelocalPath) {
    const image = await uploadOnCloudnary(imagelocalPath);
    if (!image) {
      throw new ApiError(500, "Image upload failed");
    }
    imageUrl = image.url;
  }
  const userId = req.user.id;
  const tweet = await Tweet.create({
    content: content,
    image: imageUrl || "",
    owner: userId,
  });
  const tweetCreated = await Tweet.findById(tweet._id);
  if (!tweetCreated) {
    throw new ApiError(500, "Tweet creation failed");
  }
  res
    .status(200)
    .json(new ApiResponse(200, tweetCreated, "Tweet created successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;

  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required");
  }
  await Tweet.findByIdAndDelete(tweetId);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

export { getAllTweet, makeTweet, deleteTweet, updateTweet };
