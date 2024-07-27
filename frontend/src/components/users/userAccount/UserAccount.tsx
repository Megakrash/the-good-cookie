import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import { queryMe } from "@/graphql/users/queryMe";
import { useQuery } from "@apollo/client";
import { UserTypes } from "@/types/UserTypes";
import LoadingApp from "@/styles/LoadingApp";
import { AdTypes } from "@/types/AdTypes";
import AdCard from "@/components/ads/AdCard";
import { queryAdByUser } from "@/graphql/ads/queryAdByUser";
import { useUserContext } from "@/context/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteAd from "@/components/ads/AdDelete";
import { useRouter } from "next/router";

function UserAccount(): React.ReactNode {
  const router = useRouter();
  const { user } = useUserContext();
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

  const userImageUrl = userInfos.picture
    ? `${process.env.NEXT_PUBLIC_PATH_IMAGE}${userInfos.picture}`
    : "/images/default/avatar.webp";
  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "auto",
        marginTop: 3,
        padding: 2,
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
      {userAds && (
        <Typography variant="h6">{`Toutes vos annonces :`}</Typography>
      )}
      {userAds && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 2,
          }}
        >
          {userAds.map((ad) => (
            <Box
              key={ad.id}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <AdCard ad={ad} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  startIcon={<EditIcon />}
                  type="button"
                  onClick={() => {
                    router.push(`/ads/edit/${ad.id}`);
                  }}
                  size="small"
                >
                  Modifier
                </Button>
                <DeleteAd id={ad.id} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default UserAccount;
