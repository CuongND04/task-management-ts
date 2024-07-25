import express, { Express } from "express";
import dotnev from "dotenv";
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/index.route";

dotnev.config();

database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
