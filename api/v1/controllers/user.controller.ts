import { Request, Response } from "express";
import User from "../models/user.model";
import { generateRandomString } from "../../../helpers/generate";

import md5 from "md5";
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
