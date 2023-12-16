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
		isVerified,
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
		discountCode,
		discountInfo,
		review,
		relatedStory,
		organization_id,
		metaTitle,
		metaDescription
	) => {
		return this.service
			.post("/activity", {
				type,
				isVerified,
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
				discountCode,
				discountInfo,
				review,
				relatedStory,
				organization_id,
				metaTitle,
				metaDescription,
			})
			.then((res) => res.data);
	};

	activities = () => this.service.get("/activities").then((res) => res.data);

	paginateActivities = (page) =>
		this.service.get(`/activities?page=${page}`).then((res) => res.data);

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
		isVerified,
		title,
		subtitle,
		categories,
		seasons,
		region,
		cover,
		images,
		review,
		relatedStory,
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
		discountCode,
		discountInfo,
		metaTitle,
		metaDescription
	) =>
		this.service.put(`/activities/${_id}`, {
			slug,
			isVerified,
			title,
			subtitle,
			categories,
			seasons,
			region,
			cover,
			images,
			review,
			relatedStory,
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
			discountCode,
			discountInfo,
			metaTitle,
			metaDescription,
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
			return this.service
				.get(`/userDetails/${token}`)
				.then((res) => res.data);
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

	editUserCover = (_id, cover) =>
		this.service.put(`/users/${_id}`, { cover });

	editUserSlug = (_id, slug) => this.service.put(`/users/${_id}`, { slug });

	getAllUsers = () => this.service.get("/users").then((res) => res.data);

	// PLACES ENDPOINTS

	place = (
		type,
		isVerified,
		slug,
		title,
		subtitle,
		categories,
		seasons,
		characteristics,
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
		discountCode,
		discountInfo,
		review,
		relatedStory,
		organization_id,
		metaTitle,
		metaDescription
	) => {
		return this.service
			.post("/place", {
				type,
				isVerified,
				slug,
				title,
				subtitle,
				categories,
				seasons,
				characteristics,
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
				discountCode,
				discountInfo,
				review,
				relatedStory,
				organization_id,
				metaTitle,
				metaDescription,
			})
			.then((res) => { });
	};

	getAllPlaces = () => this.service.get("/places").then((res) => res.data);

	paginatePlaces = (page) =>
		this.service.get(`/places?page=${page}`).then((res) => res.data);

	getPlaceDetails = (id) =>
		this.service.get(`/places/${id}`).then((res) => res.data);

	removePlace = (id) =>
		this.service
			.put(`/places/${id}`, { isRemoved: true })
			.then((res) => res.data);

	editPlace = (
		_id,
		slug,
		isVerified,
		title,
		subtitle,
		categories,
		seasons,
		characteristics,
		region,
		placeType,
		placeCover,
		placeImages,
		review,
		relatedStory,
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
		discountCode,
		discountInfo,
		metaTitle,
		metaDescription
	) =>
		this.service.put(`/places/${_id}`, {
			slug,
			isVerified,
			title,
			subtitle,
			categories,
			seasons,
			characteristics,
			region,
			placeType,
			placeCover,
			placeImages,
			review,
			relatedStory,
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
			discountCode,
			discountInfo,
			metaTitle,
			metaDescription,
		});

	getUserPlaces = (id) =>
		this.service.get(`/users/${id}/places`).then((res) => res.data);

	// STORIES ENDPOINTS

	story = (
		type,
		slug,
		title,
		subtitle,
		cover,
		image,
		description,
		metaTitle,
		metaDescription
	) => {
		return this.service
			.post("/story", {
				type,
				slug,
				title,
				subtitle,
				cover,
				image,
				description,
				metaTitle,
				metaDescription,
			})
			.then((res) => res.data);
	};

	getStories = () => this.service.get("/stories").then((res) => res.data);

	getAllStories = () =>
		this.service.get("/all-stories").then((res) => res.data);

	paginateStories = (page) =>
		this.service.get(`/stories?page=${page}`).then((res) => res.data);

	getStoryDetails = (id) =>
		this.service.get(`/stories/${id}`).then((res) => res.data);

	getUserStories = (id) =>
		this.service.get(`/users/${id}/stories`).then((res) => res.data);

	editStory = (
		_id,
		slug,
		title,
		subtitle,
		cover,
		images,
		description,
		metaTitle,
		metaDescription
	) =>
		this.service.put(`/stories/${_id}`, {
			slug,
			title,
			subtitle,
			cover,
			images,
			description,
			metaTitle,
			metaDescription,
		});

	removeStory = (id) =>
		this.service
			.put(`/stories/${id}`, { isRemoved: true })
			.then((res) => res.data);

	// TRIP ENTRIES ENDPOINTS

	tripEntry = (
		trip,
		type,
		slug,
		title,
		subtitle,
		cover,
		images,
		description,
		metaTitle,
		metaDescription
	) => {
		return this.service
			.post("/trip-entry", {
				trip,
				type,
				slug,
				title,
				subtitle,
				cover,
				images,
				description,
				metaTitle,
				metaDescription,
			})
			.then((res) => res.data);
	};

	getAllTripEntries = () =>
		this.service.get("/all-trip-entries").then((res) => res.data);

	getTripEntries = () =>
		this.service.get("/trip-entries").then((res) => res.data);

	paginateTripEntries = (page) =>
		this.service.get(`/trip-entries?page=${page}`).then((res) => res.data);

	getTripEntryDetails = (id) =>
		this.service.get(`/trip-entry/${id}`).then((res) => res.data);

	getUserTripEntries = (id) =>
		this.service.get(`/users/${id}/trip-entries`).then((res) => res.data);

	editTripEntryDetails = (
		_id,
		slug,
		title,
		subtitle,
		cover,
		images,
		description,
		metaTitle,
		metaDescription,
		trip
	) =>
		this.service.put(`/trip-entries/${_id}`, {
			slug,
			title,
			subtitle,
			cover,
			images,
			description,
			metaTitle,
			metaDescription,
			trip,
		});

	removeTripEntry = (id) =>
		this.service
			.put(`/trip-entries/${id}`, { isRemoved: true })
			.then((res) => res.data);

	// TRIP CATEGORIES
	createTripCategory = (
		slug,
		title,
		image,
		country,
		mapLocation,
		seoTextHeader,
		seoText,
		isSponsored,
		isFeatured,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service
			.post("/trip-category", {
				slug,
				title,
				image,
				country,
				mapLocation,
				seoTextHeader,
				seoText,
				isSponsored,
				isFeatured,
				sponsorURL,
				sponsorLogo,
				sponsorClaim,
			})
			.then((res) => res.data);
	};

	getTripCategories = () =>
		this.service.get("/trip-categories").then((res) => res.data);

	getFeaturedTripCategories = () =>
		this.service.get("/feaured-trip-categories").then((res) => res.data);

	removeTripCategory = (id) =>
		this.service
			.put(`/trip-categories/${id}`, { isRemoved: true })
			.then((res) => res.data);

	editTripCategoryDetails = (
		id,
		slug,
		title,
		image,
		country,
		mapLocation,
		seoTextHeader,
		seoText,
		isSponsored,
		isFeatured,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service.put(`/trip-categories/${id}`, {
			slug,
			title,
			image,
			country,
			mapLocation,
			seoTextHeader,
			seoText,
			isSponsored,
			isFeatured,
			sponsorURL,
			sponsorLogo,
			sponsorClaim,
		});
	};

	getTripCategoryDetails = (slug) => {
		return this.service
			.get(`/trip-categories/${slug}`)
			.then((res) => res.data);
	};

	paginateTripCategory = (category, page) =>
		this.service
			.get(`/search-trip-category-results/${category}?page=${page}`)
			.then((res) => res.data);

	getTripCategoryResults = (categoryId) => {
		return this.service
			.get(`/search-trip-category-results/${categoryId}`)
			.then((res) => res.data);
	};

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
			.get(
				`/searchActivities?${queryRegion}&${queryCategory}&${querySeason}`
			)
			.then((res) => res.data);

	searchBarQuery = (searchQuery) =>
		this.service.get(`/searchQuery${searchQuery}`).then((res) => res.data);

	getUserCustomActivities = () =>
		this.service.get("/searchUserCustomActivities").then((res) => res.data);

	getUserCustomPlaces = () =>
		this.service.get("/searchUserCustomPlaces").then((res) => res.data);

	// Regions
	createRegion = (
		isFeatured,
		isSponsored,
		slug,
		name,
		pluralName,
		title,
		subtitle,
		image,
		seoText,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service
			.post("/region", {
				isFeatured,
				isSponsored,
				slug,
				name,
				pluralName,
				title,
				subtitle,
				image,
				seoText,
				sponsorURL,
				sponsorLogo,
				sponsorClaim,
			})
			.then((res) => res.data);
	};

	getRegions = () => this.service.get("/regions").then((res) => res.data);

	getFeaturedRegions = () =>
		this.service.get("/featured-regions").then((res) => res.data);

	removeRegion = (id) =>
		this.service
			.put(`/regions/${id}`, { isRemoved: true })
			.then((res) => res.data);

	editRegion = (
		id,
		slug,
		name,
		pluralName,
		title,
		subtitle,
		image,
		seoText,
		isSponsored,
		isFeatured,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service.put(`/categories/${id}`, {
			slug,
			name,
			pluralName,
			title,
			subtitle,
			image,
			seoText,
			isSponsored,
			isFeatured,
			sponsorURL,
			sponsorLogo,
			sponsorClaim,
		});
	};

	getRegionDetails = (slug) =>
		this.service.get(`/regions/${slug}`).then((res) => res.data);

	paginateRegion = (region, page) =>
		this.service
			.get(`/searchRegionResults/${region}?page=${page}`)
			.then((res) => res.data);

	getRegionResults = (region) =>
		this.service
			.get(`/searchRegionResults/${region}`)
			.then((res) => res.data);

	// Categories
	createCategory = (
		isFeatured,
		isSponsored,
		slug,
		name,
		pluralName,
		isPlace,
		title,
		subtitle,
		illustration,
		image,
		imageCaption,
		icon,
		seoTextHeader,
		seoText,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service
			.post("/category", {
				isFeatured,
				isSponsored,
				slug,
				name,
				pluralName,
				isPlace,
				title,
				subtitle,
				illustration,
				image,
				imageCaption,
				icon,
				seoTextHeader,
				seoText,
				sponsorURL,
				sponsorLogo,
				sponsorClaim,
			})
			.then((res) => res.data);
	};

	getCategories = () =>
		this.service.get("/categories").then((res) => res.data);

	getFeaturedCategories = () =>
		this.service.get("/featuredCategories").then((res) => res.data);

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
		illustration,
		image,
		imageCaption,
		icon,
		seoTextHeader,
		seoText,
		isSponsored,
		isFeatured,
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
			illustration,
			image,
			imageCaption,
			icon,
			seoTextHeader,
			seoText,
			isSponsored,
			isFeatured,
			sponsorURL,
			sponsorLogo,
			sponsorClaim,
		});
	};

	getCategoryDetails = (slug) => {
		return this.service.get(`/categories/${slug}`).then((res) => res.data);
	};

	paginateCategory = (category, page) =>
		this.service
			.get(`/searchCategoryResults/${category}?page=${page}`)
			.then((res) => res.data);

	getCategoryResults = (category) => {
		return this.service
			.get(`/searchCategoryResults/${category}`)
			.then((res) => res.data);
	};

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

	list = (
		type,
		title,
		subtitle,
		coverCloudImage,
		metaTitle,
		metaDescription,
		slug,
		editorData
	) => {
		return this.service
			.post("/list", {
				type,
				title,
				subtitle,
				coverCloudImage,
				metaTitle,
				metaDescription,
				slug,
				editorData,
			})
			.then((res) => res.data);
	};

	editList = (
		id,
		type,
		title,
		subtitle,
		isFeatured,
		coverCloudImage,
		metaTitle,
		metaDescription,
		slug,
		description
	) =>
		this.service.put(`/lists/${id}`, {
			type,
			title,
			subtitle,
			isFeatured,
			coverCloudImage,
			metaTitle,
			metaDescription,
			slug,
			description,
		});

	getAllLists = () => this.service.get("/all-lists").then((res) => res.data);

	getLists = () => this.service.get("/lists").then((res) => res.data);

	paginateLists = (page) =>
		this.service.get(`/lists?page=${page}`).then((res) => res.data);

	getListDetails = (id) =>
		this.service.get(`/lists/${id}`).then((res) => res.data);

	getUserLists = (id) =>
		this.service.get(`/users/${id}/lists`).then((res) => res.data);

	removeList = (id) =>
		this.service
			.put(`/lists/${id}`, { isRemoved: true })
			.then((res) => res.data);

	// Pagination + filter functions

	getFeaturedActivities = () =>
		this.service.get("/featured-activities").then((res) => res.data);

	getMostRatedPlaces = () =>
		this.service.get("/most-rated-places").then((res) => res.data);

	getMostRecentPlaces = () =>
		this.service.get("/most-recent-places").then((res) => {
			return res.data;
		});

	getMostRecentStories = () =>
		this.service.get("/most-recent-stories").then((res) => res.data);

	getFeaturedGetawaysByCategory = (category) =>
		this.service
			.get(`/featured-getaways-category?category=${category}`)
			.then((res) => res.data);

	getFeaturedList = () =>
		this.service.get("/featured-list").then((res) => res.data);

	getSiteStats = () =>
		this.service.get("/get-site-stats").then((res) => res.data);

	// Characteristics
	createCharacteristic = (
		isFeatured,
		isSponsored,
		slug,
		name,
		pluralName,
		isPlace,
		title,
		subtitle,
		illustration,
		image,
		imageCaption,
		icon,
		seoTextHeader,
		seoText,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service
			.post("/characteristic", {
				isFeatured,
				isSponsored,
				slug,
				name,
				pluralName,
				isPlace,
				title,
				subtitle,
				illustration,
				image,
				imageCaption,
				icon,
				seoTextHeader,
				seoText,
				sponsorURL,
				sponsorLogo,
				sponsorClaim,
			})
			.then((res) => res.data);
	};

	getCharacteristics = () =>
		this.service.get("/characteristics").then((res) => res.data);

	removeCharacteristic = (id) =>
		this.service
			.put(`/characteristics/${id}`, { isRemoved: true })
			.then((res) => res.data);

	editCharacteristic = (
		id,
		slug,
		name,
		pluralName,
		isPlace,
		title,
		subtitle,
		illustration,
		image,
		imageCaption,
		icon,
		seoTextHeader,
		seoText,
		isSponsored,
		isFeatured,
		sponsorURL,
		sponsorLogo,
		sponsorClaim
	) => {
		return this.service.put(`/characteristics/${id}`, {
			slug,
			name,
			pluralName,
			isPlace,
			title,
			subtitle,
			illustration,
			image,
			imageCaption,
			icon,
			seoTextHeader,
			seoText,
			isSponsored,
			isFeatured,
			sponsorURL,
			sponsorLogo,
			sponsorClaim,
		});
	};
}

export default ContentService;
