import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, plan } = req.body;

    const user = await userService.createUser(email, plan);

    res.status(201).json({
      message: "User created",
      apiKey: user.api_key,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};