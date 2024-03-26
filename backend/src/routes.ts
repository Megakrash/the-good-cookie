import { Express, Request, Response } from 'express'
import axios from 'axios'
import { createImage } from './utils/pictureServices/pictureServices'
import { uploadPicture } from './utils/pictureServices/multer'
import { verifyRecaptchaToken } from './utils/reCaptcha'
import { sendContactEmail } from './utils/mailServices/contactEmail'

export function expressMiddlewares(app: Express) {
  // Upload picture
  app.post('/picture', uploadPicture.single('file'), async (req, res) => {
    if (req.file) {
      try {
        const picture = await createImage(req.file.filename)
        res.json(picture)
      } catch (error) {
        res.status(500).send('Error saving picture')
      }
    } else {
      res.status(400).send('No file was uploaded.')
    }
  })

  // Api search adress.gouv
  app.get('/search-address', async (req: Request, res: Response) => {
    try {
      const query = req.query.q
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=city=${query}&limit=5`
      )
      res.json(response.data)
    } catch (error) {
      console.error("Erreur lors de la requête à l'API:", error)
      res.status(500).send('Erreur interne du serveur')
    }
  })

  // Contact email
  app.post('/sendcontactemail', verifyRecaptchaToken, sendContactEmail)
}
