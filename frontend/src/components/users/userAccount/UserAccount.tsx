import { Card, Typography } from "@mui/material";
import { queryMe } from "@/components/graphql/Users";
import { useQuery } from "@apollo/client";
import { UserTypes } from "../../../types/types";
import UserContext from "@/context/UserContext";
import { useContext, useEffect } from "react";

const UserAccount = (): React.ReactNode => {
  const { user, setUser } = useContext(UserContext);
  const { data } = useQuery<{ item: UserTypes }>(queryMe);
  const userInfos = data ? data.item : null;

  useEffect(() => {
    if (userInfos) {
      setUser(userInfos);
    }
  }, [userInfos]);
  return (
    <Card>
      {user && (
        <Typography variant="h4" gutterBottom>
          {`Hey ${user.nickName} !`}
        </Typography>
      )}
    </Card>
  );
};

export default UserAccount;
