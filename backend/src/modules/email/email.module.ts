import nodemailer from "nodemailer";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  oauth2client,
} from "../../config/google.config.js";

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type MailProps = Omit<MailOptions, "from">;

const sendMail = async ({ to, subject, text, html }: MailProps) => {
  try {
    const accessToken = await oauth2client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "habibur353637@gmail.com", // from
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token ?? undefined,
      },
    });

    const mailOptions: MailOptions = {
      from: "FixFlow <habibur353637@gmail.com>",
      to: to,
      subject: subject,
      text: text,
    };
    if (html) mailOptions.html = html;

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error("Mail Error: " + err);
    throw err;
  }
};

export { sendMail };
