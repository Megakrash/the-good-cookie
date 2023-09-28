import { Controller } from "./Interface";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { User } from "../entities/User";

export class UsersController extends Controller {
  // Get all users
  getAll = async (req: Request, res: Response) => {
    const users = await User.find();
    res.status(200).json(users);
  };

  // Get user by Id
  getOne = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    const users = await User.findOne({
      where: { id: id },
    });
    res.status(200).json(users);
  };

  // Post new user with class-validator
  createOne = async (req: Request, res: Response) => {
    const date: Date = new Date();
    const registrationDate: string = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    const userEmail: string = req.body.email;
    const existingEmailUser = await User.findOne({
      where: { email: userEmail },
    });

    if (existingEmailUser) {
      res.status(409).send("This email is already use");
    } else {
      const user = new User();
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.nickName = req.body.nickName;
      user.email = req.body.email;
      user.password = req.body.password;
      user.registrationDate = registrationDate;
      user.adress = req.body.adress;
      user.zipCode = req.body.zipCode;
      user.city = req.body.city;
      user.phoneNumber = req.body.phoneNumber;
      user.isAdmin = req.body.isAdmin;

      try {
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).json({ errors: errors });
        } else {
          await user.save();
          res.status(200).send("New user successfully created");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  };

  // Delete user
  deleteOne = async (req: Request, res: Response) => {
    const user = await User.findOne({
      where: { id: Number(req.params.id) },
    });
    if (user) {
      await user.remove();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  };

  // Update user by Id
  patchOne = async (req: Request, res: Response) => {
    const user = await User.findOne({
      where: { id: Number(req.params.id) },
    });
    if (user) {
      Object.assign(user, req.body, { id: user.id });
      await user.save();
    } else {
      res.status(404).send("Not found");
    }
    res.status(200).send("User were successfully updated");
  };
}
