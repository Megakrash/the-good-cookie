import { AdTypes } from '@/types/AdTypes'
import { PATH_IMAGE } from '@/api/configApi'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { Box, CardActionArea } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'

type AdCardProps = {
  ad?: AdTypes
}

function AdCard(props: AdCardProps): React.ReactNode {
  // Path images
  const adImageUrl =
    props.ad.picture.filename && props.ad.picture.filename !== ''
      ? `${PATH_IMAGE}/pictures/${props.ad.picture.filename}`
      : `${PATH_IMAGE}/default/default.png`
  const userImageUrl =
    props.ad.user.picture.filename && props.ad.user.picture.filename !== ''
      ? `${PATH_IMAGE}/pictures/${props.ad.user.picture.filename}`
      : `${PATH_IMAGE}/default/avatar.webp`

  function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return (
    <>
      {props.ad && (
        <CardActionArea
          sx={{
            width: 332,
          }}
          href={`/annonces/${props.ad.id}`}
        >
          <Card
            sx={{
              width: 330,
              height: 380,
              '&:hover': {
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: '100%',
                height: 200,
                margin: 'auto',
                objectFit: 'contain',
              }}
              image={adImageUrl}
              title={props.ad.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="body1"
                color="text.secondary"
                component="div"
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <PlaceIcon sx={{ marginRight: '4px' }} />{' '}
                  {capitalizeFirstLetter(props.ad.city)}
                </Box>
              </Typography>
              <Typography
                sx={{
                  height: '75px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
                variant="h5"
              >
                {props.ad.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body1" color="primary">
                  {props.ad.price}€
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar alt={props.ad.user.nickName} src={userImageUrl} />
                  <Typography variant="body2" color="text.secondary">
                    {props.ad.user.nickName}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </CardActionArea>
      )}
    </>
  )
}

export default AdCard
