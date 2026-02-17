import mongoose from "mongoose";
import { DB_NAME } from "../constant.js     ";

export const connectdb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DB_NAME}`
    );
    console.log(
      "DB is connected sucessfuly",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log(`DataBase connection failed ${error}`);
  }
};
export default connectdb;
