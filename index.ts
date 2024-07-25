import express, { Express, Request, Response } from "express";
import dotnev from "dotenv";
import * as database from "./config/database";
import Task from "./models/task.model";
dotnev.config();
database.connect();
const app: Express = express();
const port: string | number = process.env.PORT || 3000;
app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  res.json(tasks);
});
app.get(
  "/tasks/detail/:id",
  async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });

    res.json(task);
  }
);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
