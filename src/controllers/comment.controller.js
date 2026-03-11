import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const videoId = req.params.id;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(404, "please give the video id");
  }

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(404, "video not exist");
  }
  const commentCount = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(200, commentCount, "all comment fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  const videoId = req.params.id;

  if (!videoId) {
    throw new ApiError(404, "please give the video id");
  }

  const { commentGiven } = req.body;

  if (!commentGiven) {
    throw new ApiError(404, "please enter a comment");
  }
  // const video = await Comment.aggregate([
  //   {
  //     $lookup: {
  //       from: "videos",
  //       localField: "video",
  //       foreignField: "_id",
  //       as: "videoMatched",
  //     },
  //   },
  //   {
  //     $unwind: "$videoMatched",
  //   },
  // ]);

  const owner = req.user._id;

  const comment = await Comment.create({
    content: commentGiven,
    video: videoId,
    owner: owner,
  });

  const commentMade = await Comment.findById(comment._id);

  if (!commentMade) {
    throw new ApiError(404, "comment is not made");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, commentMade, "the comment is made successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  const commentId = req.params.id;
  const { newComment } = req.body;
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newComment,
      },
    },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, comment, "comment is updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const commentId = req.params.id;

  const comment = await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "comment is deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
