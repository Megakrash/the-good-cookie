import { Arg, Query, Resolver, Mutation, ID } from "type-graphql";
import { User, UserCreateInput, UserUpdateInput } from "../entities/User";
import { validate } from "class-validator";
import { currentDate } from "../utils/date";

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
    const date: Date = new Date();
    const registrationDate = currentDate();

    const newUser = new User();
    Object.assign(newUser, data, { registrationDate });

    const errors = await validate(newUser);
    if (errors.length === 0) {
      await newUser.save();
      return newUser;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

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
