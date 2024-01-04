import { AuthCheckerFn } from "type-graphql";
import { MyContext } from "./index";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { User } from "./entities/User";

export const customAuthChecker: AuthCheckerFn<MyContext> = async (
  { root, args, context, info },
  roles
): Promise<boolean> => {
  const cookie = new Cookies(context.req, context.res);
  const token = cookie.get("TGCookie");

  if (!token) {
    console.error("No Token");
    return false;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "supersecret"
    );
    if (typeof payload === "object" && "userId" in payload) {
      const user = await User.findOneBy({ id: payload.userId });

      if (user !== null) {
        context.user = Object.assign(user, { hashedPassword: undefined });
        return true;
      } else {
        console.error("user not found");
        return false;
      }
    } else {
      console.error("invalid token, msising userid");
      return false;
    }
  } catch {
    console.error("invalid token");
    return false;
  }
};
