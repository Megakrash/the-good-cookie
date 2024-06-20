import { Express, Request, Response } from 'express'
import axios from 'axios'
import { verifyRecaptchaToken } from './utils/reCaptcha'
import { sendContactEmail } from './utils/mailServices/contactEmail'

export function expressMiddlewares(app: Express) {
  // Api search adress.gouv
  app.get('/search-address', async (req: Request, res: Response) => {
    try {
      const query = req.query.q
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=city=${query}&limit=5`
      )
      res.json(response.data)
    } catch (error) {
      console.error('Error API request:', error)
      res.status(500).send('Server error.')
    }
  })

  // Contact email
  app.post('/sendcontactemail', verifyRecaptchaToken, sendContactEmail)
}
