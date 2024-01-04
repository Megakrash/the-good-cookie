import { Arg, Query, Resolver, Mutation, Ctx, Authorized } from "type-graphql";
import {
  User,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
} from "../entities/User";
import { validate } from "class-validator";
import { currentDate } from "../utils/date";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { MyContext } from "../index";
import Cookies from "cookies";
import { Picture } from "../entities/Picture";

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async usersGetAll(): Promise<User[]> {
    const users = await User.find({
      relations: { ads: true, picture: true },
    });
    return users;
  }

  // @Authorized()
  // @Query(() => User)
  // async userById(@Ctx() context: MyContext): Promise<User> {
  //   const userId = context.user?.id;
  //   const user = await User.findOne({
  //     where: { id: userId },
  //     relations: { ads: true },
  //   });
  //   if (!user) {
  //     throw new Error("User not found");
  //   }
  //   return user;
  // }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() context: MyContext): Promise<User> {
    return context.user as User;
  }

  @Mutation(() => User)
  async userCreate(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const registrationDate = currentDate();
    const newUser = new User();
    Object.assign(newUser, data, { registrationDate });

    if (data.pictureId) {
      const picture = await Picture.findOne({ where: { id: data.pictureId } });
      if (!picture) {
        throw new Error("Picture not found");
      }
      newUser.picture = picture;
    }

    try {
      newUser.hashedPassword = await argon2.hash(data.password);
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`);
    }

    const errors = await validate(newUser);
    if (errors.length === 0) {
      await newUser.save();
      return newUser;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Mutation(() => User)
  async userLogin(
    @Ctx() context: MyContext,
    @Arg("data", () => UserLoginInput) data: UserLoginInput
  ) {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error("Wrong email or password");
    }

    const valid = await argon2.verify(user.hashedPassword, data.password);
    if (!valid) {
      throw new Error("Wrong email or password");
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        userId: user.id,
      },
      process.env.JWT_SECRET_KEY || ""
    );

    const cookie = new Cookies(context.req, context.res);
    cookie.set("TGCookie", token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
    return user;
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Ctx() context: MyContext,
    @Arg("data") data: UserUpdateInput
  ): Promise<User | null> {
    const userId = context.user?.id;

    const user = await User.findOne({
      where: { id: userId },
      relations: { ads: true },
    });

    if (user) {
      if (data.ads) {
        data.ads = data.ads.map((entry) => {
          const existingRelation = user.ads.find(
            (ad) => ad.id === Number(entry.id)
          );
          return existingRelation || entry;
        });
      }
      Object.assign(user, data);

      const errors = await validate(user);
      if (errors.length === 0) {
        await User.save(user);
        return await User.findOne({
          where: { id: userId },
          relations: {
            ads: true,
          },
        });
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return user;
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async userDelete(@Ctx() context: MyContext): Promise<User | null> {
    const id = context.user?.id;

    const user = await User.findOne({
      where: { id: id },
      relations: { ads: true },
    });
    if (user) {
      await user.remove();
      user;
    } else {
      throw new Error(`Error delete user`);
    }
    return user;
  }
}
