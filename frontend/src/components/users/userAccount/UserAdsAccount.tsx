import { Box, Button, Typography } from "@mui/material";
import { AdTypes } from "@/types/AdTypes";
import AdCard from "@/components/ads/AdCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteAd from "@/components/ads/AdDelete";
import { useRouter } from "next/router";

type UserAdsAccountProps = {
  ads: AdTypes[];
};

const UserAdsAccount: React.FC<UserAdsAccountProps> = ({ ads }) => {
  const router = useRouter();
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {!ads && (
        <Typography variant="h6">{`Vous n'avez pas encore mis d'annonces en ligne`}</Typography>
      )}
      {ads && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 2,
          }}
        >
          {ads.map((ad) => (
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
};

export default UserAdsAccount;
