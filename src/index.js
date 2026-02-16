import dotenv from "dotenv";
import connectdb from "./DB/database.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectdb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION FAILED", err);
  });
