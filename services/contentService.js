const { default: Axios } = require("axios");

class ContentService {
  constructor() {
    let service = Axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // let error, response;
    // service.interceptors.response.use((error) => {
    //   if (error.response.status >= 400 && error.response.status <= 500) {
    //     this.error = {
    //       message: error.response.data.message,
    //       status: error.response.status,
    //     };
    //   } else {
    //     return Promise.reject(error);
    //   }
    // });
    this.service = service;
    // this.error = error;
    // this.response = response;
  }

  // ACTIVITIES ENDPOINTS

  activity = (
    type,
    slug,
    title,
    subtitle,
    categories,
    seasons,
    region,
    cover,
    images,
    description,
    phone,
    website,
    activity_full_address,
    activity_locality,
    activity_province,
    activity_state,
    activity_country,
    activity_lat,
    activity_lng,
    activity_rating,
    activity_place_id,
    activity_opening_hours,
    duration,
    price,
    organization_id
  ) => {
    return this.service
      .post("/activity", {
        type,
        slug,
        title,
        subtitle,
        categories,
        seasons,
        region,
        cover,
        images,
        description,
        phone,
        website,
        activity_full_address,
        activity_locality,
        activity_province,
        activity_state,
        activity_country,
        activity_lat,
        activity_lng,
        activity_rating,
        activity_place_id,
        activity_opening_hours,
        duration,
        price,
        organization_id,
      })
      .then((res) => res.data);
  };

  activities = () => this.service.get("/activities").then((res) => res.data);

  userActivities = (id) =>
    this.service.get(`/users/${id}/activities`).then((res) => res.data);

  activityDetails = (id) =>
    this.service.get(`/activities/${id}`).then((res) => res.data);

  removeActivity = (id) =>
    this.service
      .put(`/activities/${id}`, { isRemoved: true })
      .then((res) => res.data);

  editActivity = (
    _id,
    slug,
    title,
    subtitle,
    categories,
    seasons,
    region,
    cover,
    images,
    description,
    phone,
    website,
    activity_full_address,
    activity_locality,
    activity_province,
    activity_state,
    activity_country,
    activity_lat,
    activity_lng,
    activity_rating,
    activity_place_id,
    activity_opening_hours,
    duration,
    price,
    organization
  ) =>
    this.service.put(`/activities/${_id}`, {
      slug,
      title,
      subtitle,
      categories,
      seasons,
      region,
      cover,
      images,
      description,
      phone,
      website,
      activity_full_address,
      activity_locality,
      activity_province,
      activity_state,
      activity_country,
      activity_lat,
      activity_lng,
      activity_rating,
      activity_place_id,
      activity_opening_hours,
      duration,
      price,
      organization,
    });

  // FILES ENDPOINTS

  uploadFile = (file) => {
    return this.service.post("/upload", file).then((res) => {
      return res.data;
      // if (this.error === undefined) {
      //   return this.response;
      // } else {
      //   return this.error;
      // }
    });
  };

  // USERS ENDPOINTS

  getUserProfile = (id) =>
    this.service.get(`/users/${id}`).then((res) => res.data);

  getUserData = (token) => {
    if (token.ct) {
      const confirmToken = token.ct;
      return this.service
        .get(`/userDetails/${confirmToken}`)
        .then((res) => res.data);
    } else {
      return this.service.get(`/userDetails/${token}`).then((res) => res.data);
    }
  };

  editProfile = (_id, avatar, fullName, username, bio, location) =>
    this.service.put(`/users/${_id}`, {
      avatar,
      fullName,
      username,
      bio,
      location,
    });

  editAccountSettings = (_id, fullName, gender, birthDate, phoneNumber) =>
    this.service.put(`/users/${_id}/settings`, {
      fullName,
      gender,
      birthDate,
      phoneNumber,
    });

  editUserPlan = (
    _id,
    hasSelectedPlan,
    hasPublishedAnOrganization,
    hasSelectedContentType,
    hasPostedContent
  ) =>
    this.service.put(`/users/${_id}/editPlan`, {
      hasSelectedPlan: hasSelectedPlan,
      hasPublishedAnOrganization: hasPublishedAnOrganization,
      hasSelectedContentType: hasSelectedContentType,
      hasPostedContent: hasPostedContent,
    });

  editUserName = (_id, userName) =>
    this.service.put(`/users/${_id}/username`, { userName });

  editEmailAddress = (_id, email) =>
    this.service.put(`/users/${_id}/email`, { email });

  editPassword = (_id, password, newPassword) =>
    this.service.put(`/users/${_id}/password`, { password, newPassword });

  editUserCover = (_id, cover) => this.service.put(`/users/${_id}`, { cover });

  editUserSlug = (_id, slug) => this.service.put(`/users/${_id}`, { slug });

  getAllUsers = () => this.service.get("/users").then((res) => res.data);

  // PLACES ENDPOINTS

  place = (
    type,
    slug,
    title,
    subtitle,
    categories,
    seasons,
    region,
    placeType,
    cover,
    images,
    description,
    phone,
    website,
    place_full_address,
    place_locality,
    place_province,
    place_state,
    place_country,
    place_lat,
    place_lng,
    place_rating,
    place_id,
    place_opening_hours,
    price,
    organization_id
  ) => {
    return this.service
      .post("/place", {
        type,
        slug,
        title,
        subtitle,
        categories,
        seasons,
        region,
        placeType,
        cover,
        images,
        description,
        phone,
        website,
        place_full_address,
        place_locality,
        place_province,
        place_state,
        place_country,
        place_lat,
        place_lng,
        place_rating,
        place_id,
        place_opening_hours,
        price,
        organization_id,
      })
      .then((res) => {});
  };

  getAllPlaces = () => this.service.get("/places").then((res) => res.data);

  getPlaceDetails = (id) =>
    this.service.get(`/places/${id}`).then((res) => res.data);

  removePlace = (id) =>
    this.service
      .put(`/places/${id}`, { isRemoved: true })
      .then((res) => res.data);

  editPlace = (
    _id,
    slug,
    title,
    subtitle,
    categories,
    seasons,
    region,
    placeType,
    cover,
    images,
    description,
    phone,
    website,
    place_full_address,
    place_locality,
    place_province,
    place_state,
    place_country,
    place_lat,
    place_lng,
    place_rating,
    place_place_id,
    place_opening_hours,
    price,
    organization
  ) =>
    this.service.put(`/places/${_id}`, {
      slug,
      title,
      subtitle,
      categories,
      seasons,
      region,
      placeType,
      cover,
      images,
      description,
      phone,
      website,
      place_full_address,
      place_locality,
      place_province,
      place_state,
      place_country,
      place_lat,
      place_lng,
      place_rating,
      place_place_id,
      place_opening_hours,
      price,
      organization,
    });

  getUserPlaces = (id) =>
    this.service.get(`/users/${id}/places`).then((res) => res.data);

  // STORIES ENDPOINTS

  story = (type, slug, title, subtitle, cover, image, description) => {
    return this.service
      .post("/story", {
        type,
        slug,
        title,
        subtitle,
        cover,
        image,
        description,
      })
      .then((res) => res.data);
  };

  getAllStories = () => this.service.get("/stories").then((res) => res.data);

  getStoryDetails = (id) =>
    this.service.get(`/stories/${id}`).then((res) => res.data);

  getUserStories = (id) =>
    this.service.get(`/users/${id}/stories`).then((res) => res.data);

  editStory = (_id, slug, title, subtitle, cover, images, description) =>
    this.service.put(`/stories/${_id}`, {
      slug,
      title,
      subtitle,
      cover,
      images,
      description,
    });

  removeStory = (id) =>
    this.service
      .put(`/stories/${id}`, { isRemoved: true })
      .then((res) => res.data);

  // PLACES ENDPOINTS

  bookmark = (listingId, listingType) =>
    this.service
      .post("/bookmark", { listingId, listingType })
      .then((res) => res.data);

  getUserActiveBookmarks = () =>
    this.service.get("/activebookmarks").then((res) => res.data);

  getUserAllBookmarks = () =>
    this.service.get("/bookmarks").then((res) => res.data);

  // SEARCH ENDPOINTS

  searchPlaces = (queryType, queryRegion, queryCategory, querySeason) =>
    this.service
      .get(
        `/searchPlaces?${queryType}&${queryRegion}&${queryCategory}&${querySeason}`
      )
      .then((res) => res.data);

  searchActivities = (queryRegion, queryCategory, querySeason) =>
    this.service
      .get(`/searchActivities?${queryRegion}&${queryCategory}&${querySeason}`)
      .then((res) => res.data);

  searchBarQuery = (searchQuery) =>
    this.service.get(`/searchQuery${searchQuery}`).then((res) => res.data);

  getUserCustomActivities = () =>
    this.service.get("/searchUserCustomActivities").then((res) => res.data);

  getUserCustomPlaces = () =>
    this.service.get("/searchUserCustomPlaces").then((res) => res.data);

  createCategory = (
    isSponsored,
    slug,
    name,
    pluralName,
    isPlace,
    title,
    subtitle,
    image,
    icon,
    seoText,
    sponsorURL,
    sponsorLogo,
    sponsorClaim
  ) => {
    return this.service
      .post("/category", {
        isSponsored,
        slug,
        name,
        pluralName,
        isPlace,
        title,
        subtitle,
        image,
        icon,
        seoText,
        sponsorURL,
        sponsorLogo,
        sponsorClaim,
      })
      .then((res) => res.data);
  };

  getCategories = () => this.service.get("/categories").then((res) => res.data);

  removeCategory = (id) =>
    this.service
      .put(`/categories/${id}`, { isRemoved: true })
      .then((res) => res.data);

  editCategory = (
    id,
    slug,
    name,
    pluralName,
    isPlace,
    title,
    subtitle,
    image,
    icon,
    seoText,
    isSponsored,
    sponsorURL,
    sponsorLogo,
    sponsorClaim
  ) => {
    return this.service.put(`/categories/${id}`, {
      slug,
      name,
      pluralName,
      isPlace,
      title,
      subtitle,
      image,
      icon,
      seoText,
      isSponsored,
      sponsorURL,
      sponsorLogo,
      sponsorClaim,
    });
  };

  getCategoryDetails = (slug) =>
    this.service.get(`/categories/${slug}`).then((res) => res.data);

  getCategoryResults = (category) =>
    this.service
      .get(`/searchCategoryResults/${category}`)
      .then((res) => res.data);

  getPlaceTypeResults = (placeType) =>
    this.service
      .get(`/searchPlaceResults/${placeType}`)
      .then((res) => res.data);

  getCategoriesTotals = () =>
    this.service.get(`/categoriesTotals`).then((res) => res.data);

  checkOrganizationsOwned = () =>
    this.service.get("/checkOrganizationsOwned").then((res) => res.data);

  organizationData = (slug) =>
    this.service.get(`/organizationData/${slug}`).then((res) => res.data);

  editOrganizationData = (
    _id,
    profileCover,
    orgLogo,
    orgName,
    VATNumber,
    slug,
    description,
    website,
    phone,
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
  ) =>
    this.service.put(`/editOrganizationData/${_id}`, {
      _id,
      profileCover,
      orgLogo,
      orgName,
      VATNumber,
      slug,
      description,
      website,
      phone,
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
    });

  removeOrganization = (_id) =>
    this.service
      .put("/removeOrganization", { _id, isRemoved: true })
      .then((res) => res.data);
}

export default ContentService;
