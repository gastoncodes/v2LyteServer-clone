import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import connect from "./db/index";
const dotenv = require("dotenv");

const PORT = 8000;
const app: Express = express();
//midleware
dotenv.config();
app.use(cors());
app.use(express.json());
//ping
app.get("/v2", (req: Request, res: Response) => {
  res.send("Do you need to see this really?");
});
//endpoints
app.use("/v2", require("./api/user/index"));
app.use("/v2", require("./api/manager/index"));
app.use("/v2", require("./api/admin/index"));
app.use("/v2", require("./api/hostel/index"));

//db connection
connect();
//404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  res.send("404");
});

//server start
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}....`);
});
