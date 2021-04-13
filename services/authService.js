import Axios from "axios";

class AuthService {
  constructor() {
    let service = Axios.create({
      // baseURL: "https://api.escapadesenparella.cat/api",
      baseURL: "http://localhost:5000/api",
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
    console.log({
      accountCompleted: accountCompleted,
      typesToFollow: typesToFollow,
      categoriesToFollow: categoriesToFollow,
      regionsToFollow: regionsToFollow,
      seasonsToFollow: seasonsToFollow,
    });
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
}

export default AuthService;
