import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { User, UserInput } from "../entities/User";
import { validate } from "class-validator";

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
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    const date: Date = new Date();
    const registrationDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

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
}
