import { Request, Response } from "express";
import User from "../models/user.model";
import { generateRandomString } from "../../../helpers/generate";

import md5 from "md5";
import { request } from "http";
// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response): Promise<void> => {
  // Kiểm tra tài khoản tồn tại chưa
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!",
    });
    return;
  }
  // END Kiểm tra tài khoản tồn tại chưa
  // Tạo user mới lưu vào db

  req.body.password = md5(req.body.password);
  req.body.token = generateRandomString(30);
  const user = new User(req.body);
  await user.save();
  const token = user.token;
  res.json({
    code: 200,
    message: "Đăng ký tài khoản thành công!",
    token: token,
  });
};

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const existUser = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!existUser) {
    res.json({
      code: 400,
      message: "Email không tồn tại!",
    });
    return;
  }

  if (md5(password) != existUser.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!",
    });
    return;
  }

  const token: string = existUser.token || "";

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token,
  });
};

// [GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({
    _id: req.params.id,
    deleted: false,
  }).select("-password -token");
  res.json({
    code: 200,
    message: "Thành công!",
    user: user,
  });
};
