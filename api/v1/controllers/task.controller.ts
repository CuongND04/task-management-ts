import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
  }

  const find: Find = {
    deleted: false,
  };
  if (req.query.status) {
    find["status"] = `${req.query.status}`;
  }
  // Tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // Phân trang
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };
  const countTasks = await Task.countDocuments(find);
  let objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );

  // Sắp xếp
  const sort: any = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[`${req.query.sortKey}`] = `${req.query.sortValue}`;
  }
  // Hết Sắp xếp

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });

  res.json(task);
};

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    // console.log(error);
    res.json({
      code: 400,
      message: "Không tồn tại bản ghi!",
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids;
    const key: string = req.body.key;
    const value: string = req.body.value;
    const listStatus: string[] = [
      "initial",
      "doing",
      "finish",
      "pending",
      "notFinish",
    ];
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Đổi trạng thái thành công!",
        });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.json({
          code: 200,
          message: "Xóa công việc thành công!",
        });
        break;
      default:
        res.json({
          code: 400,
          message: `Trạng thái không hợp lệ!`,
        });
        break;
    }
  } catch (error) {}
};

// [POST] /api/v1/tasks/create
export const create = async (req, res) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tạo công việc thành công!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: `Không hợp lệ!`,
    });
  }
};
