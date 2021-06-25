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

  stripeCheckout = (priceId, productId, customerId, customerEmail) => {
    return this.service
      .post("/payments/stripe-checkout", {
        priceId,
        productId,
        customerId,
        customerEmail,
      })
      .then((res) => res.data);
  };

  createFreeBasicSubscription = () =>
    this.service.post("/payments/createFreeBasicSubscription");

  checkUserSubscription = () =>
    this.service.get("/payments/checkUserSubscription").then((res) => res.data);

  editUserSubscription = (value) =>
    this.service.put("/payments/editUserSubscription", { value });
}

export default PaymentService;
