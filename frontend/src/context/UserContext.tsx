import { createContext } from "react";
import { UserTypes } from "@/types/types";

type UserContextType = {
  user: UserTypes | null;
  setUser: React.Dispatch<React.SetStateAction<UserTypes | null>>;
};
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
export default UserContext;
