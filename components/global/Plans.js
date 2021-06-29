import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import { loadStripe } from "@stripe/stripe-js";
import PaymentService from "../../services/paymentService";
import Link from "next/link";
import { useRouter } from "next/router";
import ContentService from "../../services/contentService";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_API_KEY}`);

const Plans = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const service = new ContentService();
  const paymentService = new PaymentService();
  const initialState = {
    paymentFrequency: "annual",
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setState({ ...state, isFetching: true });
        const userSubscription = await paymentService.checkUserSubscription();
        setState({
          ...state,
          userSubscription: userSubscription,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCheckoutClick = async (e) => {
    let priceId, productId;
    if (state.paymentFrequency === "monthly") {
      if (e.target.name === "premium") {
        productId = "prod_JR2xs4lTwUW1uL";
        priceId = "price_1IoArDFsBll07FkGUXKS7esW";
      }
      if (e.target.name === "superior") {
        productId = "prod_JR2vm336uGtHsV";
        priceId = "price_1IoC5EFsBll07FkGpEIg4JBC";
      }
    } else {
      if (e.target.name === "premium") {
        productId = "prod_JR2xs4lTwUW1uL";
        priceId = "price_1IoArDFsBll07FkGLfWeHrgz";
      }
      if (e.target.name === "superior") {
        productId = "prod_JR2vm336uGtHsV";
        priceId = "price_1IoApdFsBll07FkGglzUbHOC";
      }
    }

    const stripe = await stripePromise;
    let customerId = user.customerId ? user.customerId : null;
    const response = await paymentService.stripeCheckout(
      priceId,
      productId,
      customerId,
      user.email
    );
    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: response.id,
    });
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  const createFreeSubscription = async () => {
    const { _id } = user;
    await paymentService.createFreeBasicSubscription();
    await service.editUserPlan(_id, true, false, false);
  };

  let basicButton, premiumButton, superiorButton;
  if (user === undefined || !user) {
    basicButton = (
      <Link href={"/empreses/registre?step=informacio-empresa"}>
        <a className="btn-soft-red">
          Continuar{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-narrow-right"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ac402a"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
            <line x1="15" y1="8" x2="19" y2="12" />
          </svg>
        </a>
      </Link>
    );
    premiumButton = (
      <Link href={"/empreses/registre?step=informacio-empresa"}>
        <a className="btn-soft-orange">
          Continuar{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-narrow-right"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#b8761a"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
            <line x1="15" y1="8" x2="19" y2="12" />
          </svg>
        </a>
      </Link>
    );
    superiorButton = (
      <Link href={"/empreses/registre?step=informacio-empresa"}>
        <a className="btn-soft-blue">
          Continuar{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-narrow-right"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#3a4887"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
            <line x1="15" y1="8" x2="19" y2="12" />
          </svg>
        </a>
      </Link>
    );
  } else {
    if (state.userSubscription) {
      if (state.userSubscription.plan === "basic") {
        basicButton = (
          <button className="btn-soft-red" type="button" name="basic" disabled>
            Pla actual{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-check"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ac402a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12l2 2l4 -4" />
            </svg>
          </button>
        );
      } else {
        basicButton = (
          <Link href={"/empreses/registre?step=informacio-empresa"}>
            <a className="btn-soft-red" onClick={createFreeSubscription}>
              Continuar{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-arrow-narrow-right"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ac402a"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="15" y1="16" x2="19" y2="12" />
                <line x1="15" y1="8" x2="19" y2="12" />
              </svg>
            </a>
          </Link>
        );
      }
      if (state.userSubscription.plan === "premium") {
        basicButton = (
          <button
            className="btn-soft-red"
            type="button"
            name="basic"
            disabled
            style={{ opacity: "0.35" }}
          >
            No disponible{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-x"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ac402a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button>
        );
        premiumButton = (
          <button
            className="btn-soft-orange"
            type="button"
            name="premium"
            disabled
          >
            Pla actual{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-check"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#b8761a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12l2 2l4 -4" />
            </svg>
          </button>
        );
      } else {
        premiumButton = (
          <button
            className="btn-soft-orange"
            type="button"
            name="premium"
            onClick={handleCheckoutClick}
          >
            Continuar{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-narrow-right"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#b8761a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="15" y1="16" x2="19" y2="12" />
              <line x1="15" y1="8" x2="19" y2="12" />
            </svg>
          </button>
        );
      }
      if (state.userSubscription.plan === "superior") {
        basicButton = (
          <button
            className="btn-soft-red"
            type="button"
            name="basic"
            disabled
            style={{ opacity: "0.35" }}
          >
            No disponible{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-x"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ac402a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button>
        );
        premiumButton = (
          <button
            className="btn-soft-red"
            type="button"
            name="premium"
            disabled
            style={{ opacity: "0.35" }}
          >
            No disponible{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-x"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#b8761a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button>
        );
        superiorButton = (
          <button className="btn-soft-blue" type="button" name="superior">
            Pla actual{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-check"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#3a4887"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12l2 2l4 -4" />
            </svg>
          </button>
        );
      } else {
        superiorButton = (
          <button
            className="btn-soft-blue"
            type="button"
            name="superior"
            onClick={handleCheckoutClick}
          >
            Continuar{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-narrow-right"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#3a4887"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="15" y1="16" x2="19" y2="12" />
              <line x1="15" y1="8" x2="19" y2="12" />
            </svg>
          </button>
        );
      }
    } else {
      basicButton = (
        <Link href={"/empreses/registre?step=informacio-empresa"}>
          <a className="btn-soft-red" onClick={createFreeSubscription}>
            Continuar{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-narrow-right"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ac402a"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="15" y1="16" x2="19" y2="12" />
              <line x1="15" y1="8" x2="19" y2="12" />
            </svg>
          </a>
        </Link>
      );
      premiumButton = (
        <button
          className="btn-soft-orange"
          type="button"
          name="premium"
          onClick={handleCheckoutClick}
        >
          Continuar{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-narrow-right"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#b8761a"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
            <line x1="15" y1="8" x2="19" y2="12" />
          </svg>
        </button>
      );
      superiorButton = (
        <button
          className="btn-soft-blue"
          type="button"
          name="superior"
          onClick={handleCheckoutClick}
        >
          Continuar{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-narrow-right"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#3a4887"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
            <line x1="15" y1="8" x2="19" y2="12" />
          </svg>
        </button>
      );
    }
  }

  return (
    <section className="page-header step1 plans">
      <Row>
        <Col lg={12}>
          <div className="page-header-wrapper">
            <h1 className="page-header-title">
              Potencia la visibilitat del teu negoci
            </h1>
            <p className="page-header-subtitle">
              Selecciona un dels nostres plans per arribar a parelles d'arreu de
              Catalunya
            </p>
          </div>
          <div className="plans-table">
            <div className="frequency-selector">
              <div className="frequency-selector-wrapper">
                <button
                  className={
                    state.paymentFrequency === "monthly" ? "btn active" : "btn"
                  }
                  onClick={() =>
                    setState({
                      ...state,
                      paymentFrequency: "monthly",
                    })
                  }
                >
                  Pagament mensual
                </button>
                <button
                  className={
                    state.paymentFrequency === "annual" ? "btn active" : "btn"
                  }
                  onClick={() =>
                    setState({
                      ...state,
                      paymentFrequency: "annual",
                    })
                  }
                >
                  Pagament anual
                </button>
              </div>
            </div>
            <div className="plans-table-wrapper">
              <div className="plan-box">
                <div className="top">
                  <span>Pla Bàsic</span>
                  <h3 className="price-tag">Gratuït</h3>
                </div>
                <div className="bottom">{basicButton}</div>
              </div>
              <div className="plan-box">
                <div className="top">
                  <span>Pla Premium</span>
                  <h3 className="price-tag">
                    {state.paymentFrequency === "monthly" ? "9" : "84"}{" "}
                    <div className="price-span">
                      <span className="price-off">
                        {state.paymentFrequency === "monthly" ? null : "108"}
                      </span>
                      <br />
                      {state.paymentFrequency === "monthly"
                        ? "€ / mes"
                        : "€ / any"}
                    </div>
                  </h3>
                </div>
                <div className="bottom">{premiumButton}</div>
              </div>
              <div className="plan-box">
                <div className="top">
                  <span>Pla Superior</span>
                  <h3 className="price-tag">
                    {state.paymentFrequency === "monthly" ? "22" : "204"}{" "}
                    <div className="price-span">
                      <span className="price-off">
                        {state.paymentFrequency === "monthly" ? null : "264"}
                      </span>
                      <br />
                      {state.paymentFrequency === "monthly"
                        ? "€ / mes"
                        : "€ / any"}
                    </div>
                  </h3>
                </div>
                <div className="bottom">{superiorButton}</div>
              </div>
            </div>
            <div className="plans-comparison-grid">
              <h2>Selecciona el pla que millor t'encaixi</h2>
              <div className="plans-comparison-grid-wrapper">
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-grid-title"></div>
                  <div className="plans-comparison-grid-title">
                    <span style={{ color: "#ac402a" }}>Pla Bàsic</span>
                  </div>
                  <div className="plans-comparison-grid-title">
                    <span style={{ color: "#b8761a" }}>Pla Premium</span>
                  </div>
                  <div className="plans-comparison-grid-title">
                    <span style={{ color: "#3a4887" }}>Pla Superior</span>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>
                      Número de publicacions
                      <br /> (Activitats i/o allotjaments)
                    </span>
                  </div>
                  <div
                    className="plans-comparison-feature-mark"
                    style={{ color: "#ac402a" }}
                  >
                    1
                  </div>
                  <div
                    className="plans-comparison-feature-mark"
                    style={{ color: "#b8761a" }}
                  >
                    3
                  </div>
                  <div
                    className="plans-comparison-feature-mark"
                    style={{ color: "#3a4887" }}
                  >
                    Il·limitades
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Millor posicionament en buscadors</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ac402a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>
                      Publicacions amb direcció i mapa
                      <br /> de localització
                    </span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ac402a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Perfil públic d'empresa</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Publicacions amb telèfon de contacte</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>
                      Publicacions amb enllaç al teu motor de reserva o pàgina
                      web
                    </span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>
                      Publicacions amb enllaços als teus perfils socials
                    </span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>
                      Publicacions destacades a les nostres pàgines de resultats
                    </span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#b8761a"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Compte multi-empresa</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Assessorament personalitzat</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Fitxa de publicació millorada</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>Segell de d'empresa verificada</span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3a4887"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
                <div className="plans-comparison-grid-row">
                  <div className="plans-comparison-feature-tag">
                    <span>
                      Perfil d'empresa destacat a les pàgines de categories
                    </span>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#afcfd8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="plans-comparison-feature-mark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-check"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default Plans;
