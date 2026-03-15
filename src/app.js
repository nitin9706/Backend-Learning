import express, { application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
// routes import

import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";
import playlistRouter from "./routes/playlist.route.js";
import tweetRouter from "./routes/tweet.route.js";
import likeRouter from "./routes/like.route.js";
//  declare route

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/like", likeRouter);
// http://localhost:8000/api/v1/users

export { app };
