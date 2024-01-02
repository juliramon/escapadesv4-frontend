const { default: Axios } = require("axios");

class NewsletterService {
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

  subscribeToNewsletter = (name, email) => {
    return this.service
      .post("/newsletter/subscribe", { name, email })
      .then((res) => res.data);
  };
}

export default NewsletterService;
