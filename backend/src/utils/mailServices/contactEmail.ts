import { Request, Response } from "express";
import { sendEmail, EmailOptions } from "./nodeMailer";

export const sendContactEmail = (req: Request, res: Response) => {
  const { formDetails } = req.body;

  const mailOptions1: EmailOptions = {
    from: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    to: formDetails.email,
    subject: "Votre message à The Good Corner",
    html: `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Réservation confirmée</title>
      </head>
      <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom 1px solid #eee">
            <p>Cher client,</p>
            <p>Votre message nous a bien été transmis. Nous y répondrons dans les meilleurs délais.</p>
            <p>Cordialement,</p>
            <p>Votre message : ${formDetails.message}.</p>
            <div style="float:left;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>The Good Corner</p>
              <p>1 avenue de la bonne affaire</p>
              <p>98562 GoodDealCity</p>
              <p>XX XX XX XX XX</p>
              <p>contact@tgc.megakrash.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
  };

  const mailOptions2: EmailOptions = {
    from: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    to: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    replyTo: formDetails.email,
    subject: "Vous avez un nouveau message d'un client",
    html: `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Nouveau message reçu :</title>
      </head>
      <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom 1px solid #eee">
            <p>Nom : ${formDetails.lastName}</p>
            <p>Prénom : ${formDetails.firstName}</p>
            <p>Email : ${formDetails.email}</p>
            <p>Téléphone : ${formDetails.phoneNumber}</p>
            <p>Message : ${formDetails.message}</p>
          </div>
        </div>
      </body>
      </html>
      `,
  };

  Promise.all([sendEmail(mailOptions1), sendEmail(mailOptions2)])
    .then(() => {
      res.status(200).send("Emails envoyés avec succès");
    })
    .catch(() => {
      res.status(500).send("Une erreur s'est produite");
    });
};
