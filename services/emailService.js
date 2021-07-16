const { default: Axios } = require("axios");

class EmailService {
  constructor() {
    let service = Axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.service = service;
  }

  sendConfirmEmail = (userName, email) => {
    return this.service
      .post("/email/confirmEmail", { userName, email })
      .then((res) => res.data);
  };

  sendWelcomeEmail = (userName, email) => {
    return this.service
      .post("/email/welcomeEmail", { userName, email })
      .then((res) => res.data);
  };

  sendResetPasswordEmail = (email) => {
    return this.service
      .post("/email/resetPassword", {
        email,
      })
      .then((res) => res.data);
  };
}

export default EmailService;
