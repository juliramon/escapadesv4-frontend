const { default: Axios } = require("axios");

class PaymentService {
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

  stripeCheckout = (priceId, productId) => {
    return this.service
      .post("/payments/stripe-checkout", { priceId, productId })
      .then((res) => res.data);
  };
}

export default PaymentService;
