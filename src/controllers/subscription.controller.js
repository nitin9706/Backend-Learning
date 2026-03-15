import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  // TODO: toggle subscription

  if (!channelId) {
    throw new ApiError(404, "channel Id required");
  }

  const userId = req.user._id;

  const existingSubscriber = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (existingSubscriber) {
    await Subscription.findByIdAndDelete(existingSubscriber._id);
    return res.status(200).json(new ApiResponse(200, false, "Unsubscribed"));
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });
    return res.status(200).json(new ApiResponse(200, true, "Subscribed"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(404, "channel Id required");
  }

  const channelSubscribers = await Subscription.find({ channel: channelId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelSubscribers, "channel subscriber fetched")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(404, "subscriber Id required");
  }

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribedChannels, " subscribed channel fetched")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
