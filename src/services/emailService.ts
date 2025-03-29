import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: process.env.MAIL_USER
    ? {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    : undefined,
});


export async function sendWelcomeEmail(email: string) {
  await transporter.sendMail({
    from:`"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: email,
    subject: 'Bienvenue a la maison !',
    text: 'Votre compte a été créé avec succès.',
  });
}
