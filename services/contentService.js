const {default: Axios} = require("axios");

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
		title,
		subtitle,
		categories,
		seasons,
		region,
		image,
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
				title,
				subtitle,
				categories,
				seasons,
				region,
				image,
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
			.put(`/activities/${id}`, {isRemoved: true})
			.then((res) => res.data);

	editActivity = (
		_id,
		title,
		subtitle,
		categories,
		seasons,
		region,
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
			title,
			subtitle,
			categories,
			seasons,
			region,
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
	
	editAccountSettings = (_id, fullName, username, gender, email, birthDate, phoneNumber, password, isProfileIndexed, arePostsIndexed, isProfileVisible, isProfileProtected) => this.service.put(`/users/${_id}/settings`, {
		fullName, username, gender, email, birthDate, phoneNumber, password, isProfileIndexed, arePostsIndexed, isProfileVisible, isProfileProtected
	});

	editUserCover = (_id, cover) => this.service.put(`/users/${_id}`, {cover});

	getAllUsers = () => this.service.get("/users").then((res) => res.data);

	// PLACES ENDPOINTS

	place = (
		type,
		title,
		subtitle,
		categories,
		seasons,
		region,
		placeType,
		image,
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
				title,
				subtitle,
				categories,
				seasons,
				region,
				placeType,
				image,
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
			.then((res) => res.data);
	};

	getAllPlaces = () => this.service.get("/places").then((res) => res.data);

	getPlaceDetails = (id) =>
		this.service.get(`/places/${id}`).then((res) => res.data);

	removePlace = (id) =>
		this.service
			.put(`/places/${id}`, {isRemoved: true})
			.then((res) => res.data);

	editPlace = (
		_id,
		title,
		subtitle,
		categories,
		seasons,
		region,
		placeType,
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
			title,
			subtitle,
			categories,
			seasons,
			region,
			placeType,
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

	story = (type, title, subtitle, image, description) => {
		return this.service
			.post("/story", {
				type,
				title,
				subtitle,
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

	editStory = (_id, title, subtitle, description, location, status) =>
		this.service.put(`/stories/${_id}`, {
			title,
			subtitle,
			description,
			location,
			status,
		});

	removeStory = (id) =>
		this.service.delete(`/stories/${id}`).then((res) => res.data);

	// PLACES ENDPOINTS

	bookmark = (listingId, listingType) =>
		this.service
			.post("/bookmark", {listingId, listingType})
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
}

export default ContentService;
