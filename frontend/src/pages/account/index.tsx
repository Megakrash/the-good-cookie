import React from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import { Avatar, Box, Tab, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useUserContext } from "@/context/UserContext";
import { useQuery } from "@apollo/client";
import { AdTypes } from "@/types/AdTypes";
import { queryAdByUser } from "@/graphql/ads/queryAdByUser";
import { UserTypes } from "@/types/UserTypes";
import { queryMe } from "@/graphql/users/queryMe";
import LoadingApp from "@/styles/LoadingApp";
import UserAdsAccount from "@/components/users/userAccount/UserAdsAccount";
import UserInfosAccount from "@/components/users/userAccount/UserInfosAccount";

function AccountPage(): React.ReactNode {
  const { user } = useUserContext();
  const [value, setValue] = React.useState<string>("1");
  // Ads
  const { data: adsData } = useQuery<{ items: AdTypes[] }>(queryAdByUser, {
    variables: { adsByUserId: user?.id },
  });
  const userAds = adsData ? adsData.items : null;
  // User infos
  const { data: meData, loading: meLoading } = useQuery<{ item: UserTypes }>(
    queryMe,
  );
  if (meLoading) return <LoadingApp />;
  const userInfos = meData ? meData.item : null;

  // Tabs
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };
  // User image
  const userImageUrl = userInfos.picture
    ? `${process.env.NEXT_PUBLIC_PATH_IMAGE}${userInfos.picture}`
    : "/images/default/avatar.webp";
  return (
    <LayoutFull title="TGC : Mon compte">
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "auto",
          marginTop: 3,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            alt={userInfos.nickName}
            sx={{ width: "55px", height: "55px" }}
            src={userImageUrl}
          />
          <Typography variant="h5">{`Bonjour ${userInfos.nickName} !`}</Typography>
        </Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Mes informations" value="1" />
              <Tab label="Mes annonces" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <UserInfosAccount user={userInfos} />
          </TabPanel>
          <TabPanel value="2">
            <UserAdsAccount ads={userAds} />
          </TabPanel>
        </TabContext>
      </Box>
    </LayoutFull>
  );
}

export default AccountPage;
