import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ID,
  Ctx,
  Authorized,
} from "type-graphql";
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

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async usersGetAll(): Promise<User[]> {
    const users = await User.find({
      relations: { ads: true },
    });
    return users;
  }
  @Query(() => User)
  async userById(@Arg("id") id: number): Promise<User> {
    const user = await User.findOne({
      where: { id },
      relations: { ads: true },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
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
        data: user.id,
      },
      process.env.JWT_SECRET_KEY || ""
    );

    const tokenData = JSON.stringify({ token: token, user: user.id });
    context.res.cookie("TGCToken", tokenData, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return user;
  }

  // @Authorized()
  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UserUpdateInput
  ): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
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
          where: { id: id },
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

  @Mutation(() => User, { nullable: true })
  async userDelete(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
      relations: { ads: true },
    });
    if (user) {
      await user.remove();
      user.id = id;
    } else {
      throw new Error(`Error delete user`);
    }
    return user;
  }
}
