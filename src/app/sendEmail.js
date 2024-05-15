import nodemailer from "nodemailer";
import { logger } from "./logger.js";

class sendEmail {
  constructor() {
    this.__transporter__ = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_SMTP_EMAIL,
        pass: process.env.APP_SMTP_PASSWORD,
      },
    });
  }
  async send(email, link) {
    const transporter = await this.__transporter__;
    try {
      await transporter.sendMail({
        from: `"Express Shop Support" <${process.env.APP_SMTP_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: `Your reset password link has been request`, // Subject line
        html: `
        
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&family=Sedan+SC&display=swap"
      rel="stylesheet"
    />
    <title>Email Letter OTP</title>
    <style>
      * {
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        width: 100%;
        padding: 50px 0px;
        background-color: rgb(255, 106, 0);
        margin: auto;
        border-radius:10px;
      }
      .card {
        background-color: white;
        padding: 35px;
        border-radius: 15px;
        min-width: 0px;
        width: 320px;
        max-width: 350px;
        box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.25);
        margin: auto;
        margin-top: 40px;
      }
      .wrapper-footer {
        width: 400px;
        max-width: 400px;
        color: rgba(255, 255, 255, 0.512);
        margin-top: 20px;
      }
      .wrapper-footer a {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.512);
        font-size: 13px;
      }
      .logo-wrapper {
        color: white;
        font-weight: lighter;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo-wrapper" style="text-align: center">
        <h2 style="font-family: 'Jaro', sans-serif">EXPRESS SHOP</h2>
      </div>
      <div class="card" style="text-align: center">
        <img
          style="width: 50px"
          src="https://cdn.kibrispdr.org/data/637/icon-pesan-png-40.png"
          alt="logo.png"
        />
        <p
          style="
            margin-top: 20px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.685);
          "
        >
          Here is your reset password link
        </p>
        <p
          style="
            font-weight: lighter;
            color: rgba(0, 0, 0, 0.645);
            font-size: 14px;
            margin-bottom: 20px;
          "
        >
          To update your password
        </p>
        <a href="${link}">http://localhost:5100/reset-password/new-password?token=${link}</a>
        <p
          style="
            font-size: 12px;
            margin-top: 20px;
            color: red;
            font-weight: lighter;
          "
        >
          Valid for 5 minute only
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <span class="wrapper-footer"
          ><a href="">FAQs</a> | <a href="">Terms & Conditions</a> |
          <a href="">Contact Us</a>
        </span>
      </div>
    </div>
  </body>
</html>

        
        `, // html body
      });
    } catch (error) {
      logger.error(error.message);
    }
  }

  async unusualActivity(email, user_agent) {
    const transporter = await this.__transporter__;
    try {
      await transporter.sendMail({
        from: `"Express Shop Support" <rusnandapurnama1@outlook.com>`, // sender address
        to: email, // list of receivers
        subject: `Unusual Activity - Your account has been locked`, // Subject line
        html: `
        
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&family=Sedan+SC&display=swap"
      rel="stylesheet"
    />
    <title>Email Letter OTP</title>
    <style>
      * {
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        width: 100%;
        padding: 50px 0px;
        background-color: rgb(255, 106, 0);
        margin: auto;
        border-radius:10px;
      }
      .card {
        background-color: white;
        padding: 35px;
        border-radius: 15px;
        min-width: 0px;
        width: 320px;
        max-width: 350px;
        box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.25);
        margin: auto;
        margin-top: 40px;
      }
      .wrapper-footer {
        width: 400px;
        max-width: 400px;
        color: rgba(255, 255, 255, 0.512);
        margin-top: 20px;
      }
      .wrapper-footer a {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.512);
        font-size: 13px;
      }
      .logo-wrapper {
        color: white;
        font-weight: lighter;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo-wrapper" style="text-align: center">
        <h2 style="font-family: 'Jaro', sans-serif">EXPRESS SHOP</h2>
      </div>
      <div class="card" style="text-align: center">
        <img
          style="width: 50px"
          src="https://cdn.kibrispdr.org/data/637/icon-pesan-png-40.png"
          alt="logo.png"
        />
        <p
          style="
            font-weight: lighter;
            color: rgba(0, 0, 0, 0.645);
            font-size: 14px;
            margin-bottom: 20px;
          "
        >
          We have detecetd unusual activity on your account.
        </p>
        <p
        style="
          font-weight: lighter;
          color: rgba(0, 0, 0, 0.645);
          font-size: 14px;
          margin-bottom: 20px;
        "
      >
        <b>DEVICE</b> ${user_agent}
      </p>
    
      </div>
      <div style="text-align: center; margin-top: 20px">
        <span class="wrapper-footer"
          ><a href="">FAQs</a> | <a href="">Terms & Conditions</a> |
          <a href="">Contact Us</a>
        </span>
      </div>
    </div>
  </body>
</html>
        `, // html body
      });
    } catch (error) {
      logger.error(error.message);
    }
  }
}

export default sendEmail;
