import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // kiểm tra xem người ta có gửi lên header kèm token hay không
    if (!req.headers.authorization) {
      res.json({
        code: 400,
        message: "Vui lòng gửi kèm token",
      });
      return;
    }
    // lấy token từ chuỗi authorization
    const token: string = req.headers.authorization.split(" ")[1];
    // tìm xem có tài khoản nào có token đấy không
    const user = await User.findOne({
      token: `${token}`,
      deleted: false,
    }).select("-password");
    if (!user) {
      res.json({
        code: 400,
        message: "Token không hợp lệ",
      });
      return;
    }
    // đặt user làm biến toàn cục
    req["user"] = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
