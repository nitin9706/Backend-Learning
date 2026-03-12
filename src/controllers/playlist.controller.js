import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

// getting the playlist

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params.id;

  if (!playlistId) {
    throw new ApiError(404, "playlist id need to uploaded");
  }

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(404, "this playlist does not exist");
  }
  const playlist = await Playlist.findById(playlistId);

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

// getting all playlist

const getAllPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    throw new ApiError(404, "userId not found ");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(404, "user does not exist");
  }

  const playlist = await Playlist.find({ owner: userId });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

// making playlist
const makePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!(name || description)) {
    throw new ApiError(404, "both name and description field are required");
  }

  const video = [];

  const owner = req.user._id;

  const playlist = await Playlist.create({
    name: name,
    description: description,
    video: video,
    owner: owner,
  });

  const playlistCreated = await Playlist.findById(playlist._id);

  if (!playlistCreated) {
    throw new ApiError(404, "playlist not created");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, playlistCreated, "playlist is created successfully")
    );
});

// adding videos to the playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // get video id from params
  // then push it into the video array in db

  const playlistId = req.params.id;

  const { videoId } = req.body;

  const playlist = await Playlist.findByIdAndUpdate(playlistId, {
    $push: {
      video: videoId,
    },
  });
  await playlist.save({ validateBeforeSave: false });
  const playlistUpdated = await Playlist.findById(playlistId);
  res
    .status(200)
    .json(new ApiResponse(200, playlistUpdated, "video added to the playlist"));
});

// removing /deleting video from the playlist
const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  const { videoId } = req.body;

  if (!playlistId) {
    throw new ApiError(404, "no playlist id found");
  }
  if (!videoId) {
    throw new ApiError(404, "no video id found");
  }
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(404, "playlist does not exist");
  }

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(404, "video does not exist");
  }

  const playlist = await Playlist.findById(playlistId);

  playlist.video.splice(playlist.video.indexOf(videoId), 1);
  await playlist.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "video removed from the playlist"));
});

// deleting the playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  // taking playlist unique id of db and gonna remove it from db
  const playlistId = req.params.id;
  if (!playlistId) {
    throw new ApiError(404, "no playlist id found");
  }
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(404, "playlist does not exist");
  }
  await Playlist.findByIdAndDelete(playlistId);
  res
    .status(200)
    .json(new ApiResponse(200, {}, "playlist is deleted successfully"));
});

export {
  getPlaylistById,
  getAllPlaylist,
  makePlaylist,
  addVideoToPlaylist,
  deleteVideoFromPlaylist,
  deletePlaylist,
};
