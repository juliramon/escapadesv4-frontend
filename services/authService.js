import Axios from "axios";

class AuthService {
  constructor() {
    let service = Axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
    });
    let error, response;
    service.interceptors.response.use(
      (response) => (this.response = response.data),
      (error) => {
        if (error.response.status >= 400 && error.response.status <= 500) {
          this.error = {
            message: error.response.data.message,
            status: error.response.status,
          };
        } else {
          return Promise.reject(error);
        }
      }
    );
    this.service = service;
    this.error = error;
    this.response = response;
  }

  signup = (fullName, email, password, slug) => {
    return this.service
      .post("/auth/signup", { fullName, email, password, slug })
      .then(() => {
        if (this.error === undefined) {
          return this.response;
        } else {
          return this.error;
        }
      });
  };

  completeAccount = (
    accountCompleted,
    typesToFollow,
    categoriesToFollow,
    regionsToFollow,
    seasonsToFollow
  ) => {
    return this.service.put("/auth/complete-account", {
      accountCompleted,
      typesToFollow,
      categoriesToFollow,
      regionsToFollow,
      seasonsToFollow,
    });
  };

  login = (username, password) => {
    return this.service.post("/auth/login", { username, password }).then(() => {
      if (this.error === undefined) {
        return this.response;
      } else {
        return this.error;
      }
    });
  };

  logout = () => this.service.post("/auth/logout", {}).then((res) => res.data);

  resetPassword = (email) =>
    this.service.post("/auth/reset-password", { email }).then(() => {
      console.log("email =>", email);
      if (this.error === undefined) {
        return this.response;
      } else {
        return this.error;
      }
    });

  googleAuth = (fullName, email, imageUrl) => {
    return this.service
      .post("/auth/googlesignup", { fullName, email, imageUrl })
      .then(() => {
        if (this.error === undefined) {
          return this.response;
        } else {
          return this.error;
        }
      });
  };

  createOrganization = (
    orgName,
    slug,
    orgLogo,
    VATNumber,
    followers,
    infoProvided,
    organization_full_address,
    organization_streetNumber,
    organization_street,
    organization_locality,
    organization_zipcode,
    organization_province,
    organization_state,
    organization_country,
    organization_lat,
    organization_lng,
    additionalInfo
  ) => {
    return this.service
      .post("/auth/create-organization", {
        orgName,
        slug,
        orgLogo,
        VATNumber,
        followers,
        infoProvided,
        organization_full_address,
        organization_streetNumber,
        organization_street,
        organization_locality,
        organization_zipcode,
        organization_province,
        organization_state,
        organization_country,
        organization_lat,
        organization_lng,
        additionalInfo,
      })
      .then((res) => {
        if (this.error === undefined) {
          return this.response;
        } else {
          return this.error;
        }
      });
  };
}

export default AuthService;
