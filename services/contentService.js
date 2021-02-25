const { default: Axios } = require("axios");

class ContentService {
  constructor() {
    let service = Axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_APP_API_URL}`,
      withCredentials: true,
    });
    this.service = service;
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
    price
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
    price
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
    });

  // FILES ENDPOINTS

  uploadFile = (file) =>
    this.service.post("/upload", file).then((res) => res.data);

  // USERS ENDPOINTS

  getUserProfile = (id) =>
    this.service.get(`/users/${id}`).then((res) => res.data);

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
    price
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
      })
      .then((res) => {
        console.log(res.data);
      });
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
    price
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

  createCategory = (slug, name, title, subtitle, image, icon, seoText) =>
    this.service
      .post("/category", {
        slug,
        name,
        title,
        subtitle,
        image,
        icon,
        seoText,
      })
      .then((res) => res.data);

  getCategories = () => this.service.get("/categories").then((res) => res.data);

  removeCategory = (id) =>
    this.service
      .put(`/categories/${id}`, { isRemoved: true })
      .then((res) => res.data);

  editCategory = (id, slug, name, title, subtitle, image, icon, seoText) => {
    console.log("id =>", id);
    return this.service.put(`/categories/${id}`, {
      slug,
      name,
      title,
      subtitle,
      image,
      icon,
      seoText,
    });
  };

  getCategoryDetails = (slug) => {
    console.log("slug =>", slug);
    return this.service.get(`/categories/${slug}`).then((res) => res.data);
  };

  getCategoryResults = (category) => {
    console.log("category =>", category);
    return this.service
      .get(`/searchCategoryResults/${category}`)
      .then((res) => res.data);
  };
}

export default ContentService;
