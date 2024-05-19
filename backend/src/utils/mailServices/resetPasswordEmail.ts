import { sendEmail, EmailOptions } from './nodeMailer'
import { EmailTemplateParams, createEmailTemplate } from './emailTemplate'
import { UserToken } from '../../entities/UserToken'

export const resetPasswordEmail = async (
  userEmail: string,
  userNickName: string,
  UserToken: UserToken
) => {
  const verificationLink = `${process.env.FRONTEND_URL}/reset-password?token=${UserToken.token}`

  const emailParams: EmailTemplateParams = {
    content: `<div class="header">
          Bonjour ${userNickName}
        </div>
        <div class="content">
          <p>Cliquez sur le bouton ci-dessous pour récupérer votre compte et créer un nouveau mot de passe.</p>
          <a href="${verificationLink}" class="button">Récupérer votre compte</a>
        </div>
        <div class="footer">
          Si vous n'avez pas demandé cette réinitialisation de mot de passe, veuillez ignorer cet email.
        </div>`,
    title: 'Réinitialisez votre mot de passe The Good Cookie !',
  }
  const emailHtml = createEmailTemplate(emailParams)

  const emailOptions: EmailOptions = {
    from: process.env.MAIL_USER || 'contact@tgc.megakrash.com',
    to: userEmail || '',
    subject: 'Réinitialisez votre mot de passe The Good Cookie !',
    html: emailHtml,
  }

  try {
    const info = await sendEmail(emailOptions)
    return info
  } catch (error) {
    throw new Error(`Error sending verification email: ${error}`)
  }
}
