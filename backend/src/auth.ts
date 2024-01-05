import { AuthChecker } from "type-graphql";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { MyContext } from "./index";
import { User } from "./entities/User";

export const customAuthChecker: AuthChecker<MyContext> = async (
  { context },
  roles
): Promise<boolean> => {
  const cookie = new Cookies(context.req, context.res);
  const token = cookie.get("TGCookie");

  if (!token) {
    console.error("No Token");
    return false;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "");

    if (typeof payload === "object" && "userId" in payload) {
      const user = await User.findOneBy({ id: payload.userId });

      if (user) {
        context.user = {
          id: user.id,
          nickName: user.nickName,
          role: user.role,
        };

        if (roles.length === 0) {
          return true;
        }

        return roles.includes(user.role);
      } else {
        console.error("User not found");
        return false;
      }
    } else {
      console.error("Invalid token, missing userId");
      return false;
    }
  } catch (error) {
    console.error("Invalid token");
    return false;
  }
};
