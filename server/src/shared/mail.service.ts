import nodemailer from "nodemailer";
import { logger } from "./logger";


export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"App Support" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      logger.info({ to, subject }, "Email sent successfully");
    } catch (err: any) {
      logger.error({ to, subject, err }, "Failed to send email");
      throw new Error("Failed to send email");
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;
    const html = `
      <h2>Подтверждение регистрации</h2>
      <p>Для завершения регистрации перейдите по ссылке:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
    `;
    await this.sendMail(to, "Подтверждение регистрации", html);
  }
}
