import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Ctx,
  Authorized,
  ID,
} from "type-graphql";
import {
  User,
  UserContext,
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
import path from "path";
import { promises as fsPromises } from "fs";

@Resolver(User)
export class UsersResolver {
  @Authorized("ADMIN")
  @Query(() => [User])
  async usersGetAll(@Ctx() context: MyContext): Promise<User[]> {
    if (context.user?.role === "ADMIN") {
      const users = await User.find({
        relations: { ads: true, picture: true },
      });
      return users;
    } else {
      throw new Error("Not authorized");
    }
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
        exp: Math.floor(Date.now() + 2 * 60 * 60 * 1000),
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

  @Authorized("ADMIN", "USER")
  @Query(() => UserContext)
  async meContext(@Ctx() context: MyContext): Promise<UserContext> {
    if (!context.user) {
      throw new Error("User not found");
    }
    const user = context.user as UserContext;
    return user;
  }

  @Authorized("ADMIN", "USER")
  @Query(() => User)
  async me(@Ctx() context: MyContext): Promise<User> {
    if (!context.user) {
      throw new Error("User not found");
    }
    const user = await User.findOne({
      where: { id: context.user.id },
      relations: { picture: true },
    });

    return user as User;
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => Boolean)
  async userSignOut(@Ctx() context: MyContext): Promise<Boolean> {
    const cookie = new Cookies(context.req, context.res);
    cookie.set("TGCookie", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Ctx() context: MyContext,
    @Arg("data") data: UserUpdateInput
  ): Promise<User | null> {
    const userId = context.user?.id;

    const user = await User.findOne({
      where: { id: userId },
      relations: { ads: true, picture: true },
    });

    if (
      user &&
      (user.id === context.user?.id || context.user?.role === "ADMIN")
    ) {
      let oldPictureId: number | null = null;
      let oldPictureName: string | null = null;
      if (data.ads) {
        data.ads = data.ads.map((entry) => {
          const existingRelation = user.ads.find(
            (ad) => ad.id === Number(entry.id)
          );
          return existingRelation || entry;
        });
      }
      if (data.pictureId && user.picture?.id) {
        oldPictureId = user.picture.id;
        oldPictureName = user.picture.filename;
        const newPicture = await Picture.findOne({
          where: { id: data.pictureId },
        });
        if (!newPicture) {
          throw new Error("New picture not found");
        }
        user.picture = newPicture;
      }

      Object.assign(user, data);

      const errors = await validate(user);
      if (errors.length === 0) {
        await User.save(user);
        if (oldPictureId && oldPictureName) {
          const oldPicture = await Picture.findOneBy({ id: oldPictureId });
          if (oldPicture) {
            try {
              await Picture.remove(oldPicture);
              const filePath = path.join(
                __dirname,
                `../../public/assets/images/ads/${oldPictureName}`
              );
              await fsPromises.unlink(filePath);
            } catch (error) {
              console.error("Error removing picture", error);
            }
          }
        }

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

  @Authorized("ADMIN", "USER")
  @Mutation(() => User, { nullable: true })
  async userDelete(
    @Ctx() context: MyContext,
    @Arg("id", () => ID) id: number
  ): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
      relations: { ads: true, picture: true },
    });
    if (
      user &&
      (user.id === context.user?.id || context.user?.role === "ADMIN")
    ) {
      const pictureId = user.picture?.id;
      await user.remove();
      if (pictureId) {
        const picture = await Picture.findOne({ where: { id: pictureId } });
        if (picture) {
          try {
            await Picture.remove(picture);
            const filePath = path.join(
              __dirname,
              `../../public/assets/images/ads/${picture.filename}`
            );
            await fsPromises.unlink(filePath);
          } catch (error) {
            console.error("Error removing picture", error);
          }
        }
      }
      user;
    } else {
      throw new Error(`Error delete user`);
    }
    return user;
  }
}
