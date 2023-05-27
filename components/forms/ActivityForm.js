import React, { useEffect, useState } from "react";
import ContentService from "../../services/contentService";

const initialState = {
  formData: {
    emptyForm: true,
    type: "activity",
    title: "",
    subtitle: "",
    categories: [],
    seasons: [],
    region: "",
    cover: "",
    blopCover: "",
    images: [],
    blopImages: [],
    cloudImages: [],
    coverCloudImage: "",
    cloudImagesUploaded: false,
    coverCloudImageUploaded: false,
    description: "",
    phone: "",
    website: "",
    activity_full_address: "",
    activity_locality: "",
    activity_province: "",
    activity_state: "",
    activity_country: "",
    activity_lat: "",
    activity_lng: "",
    activity_rating: 0,
    activity_place_id: "",
    activity_opening_hours: "",
    duration: "",
    price: "",
    isReadyToSubmit: false,
  },
};
const [state, setState] = useState(initialState);
const [queryId, setQueryId] = useState(null);
useEffect(() => {
  if (router && router.route) {
    setQueryId(router.route);
  }
}, [router]);
const service = new ContentService();

const saveFileToStatus = (e) => {
  const fileToUpload = e.target.files[0];
  if (e.target.name === "cover") {
    setState({
      ...state,
      formData: {
        ...state.formData,
        blopCover: URL.createObjectURL(fileToUpload),
        cover: fileToUpload,
      },
    });
  } else {
    setState({
      ...state,
      formData: {
        ...state.formData,
        blopImages: [
          ...state.formData.blopImages,
          URL.createObjectURL(fileToUpload),
        ],
        images: [...state.formData.images, fileToUpload],
      },
    });
  }
};

const imagesList = state.formData.blopImages.map((el, idx) => (
  <div className="image" key={idx}>
    <img src={el} />
  </div>
));

let coverImage;
if (state.formData.blopCover) {
  coverImage = (
    <div className="image">
      <img src={state.formData.blopCover} />
    </div>
  );
}

const handleFileUpload = async (e) => {
  const imagesList = state.formData.images;
  const cover = state.formData.cover;
  let uploadedImages = [];
  const uploadData = new FormData();
  uploadData.append("imageUrl", cover);
  const uploadedCover = await service.uploadFile(uploadData);
  imagesList.forEach((el) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", el);
    service.uploadFile(uploadData).then((res) => {
      uploadedImages.push(res.path);
      if (uploadedImages.length === state.formData.images.length) {
        setState({
          ...state,
          formData: {
            ...state.formData,
            cloudImages: uploadedImages,
            coverCloudImage: uploadedCover.path,
            cloudImagesUploaded: true,
            coverCloudImageUploaded: true,
          },
        });
      }
    });
  });
};

const handleCheckCategory = (e) => {
  let categories = state.formData.categories;
  if (e.target.checked === true) {
    categories.push(e.target.id);
  } else {
    let index = categories.indexOf(e.target.id);
    categories.splice(index, 1);
  }
  setState({
    ...state,
    formData: { ...state.formData, categories: categories },
  });
};

const handleCheckSeason = (e) => {
  let seasons = state.formData.seasons;
  if (e.target.checked === true) {
    seasons.push(e.target.id);
  } else {
    let index = seasons.indexOf(e.target.id);
    seasons.splice(index, 1);
  }
  setState({
    ...state,
    formData: { ...state.formData, seasons: seasons },
  });
};

const handleCheckRegion = (e) => {
  setState({
    ...state,
    formData: { ...state.formData, region: e.target.id },
  });
};

const handleChange = (e) => {
  setState({
    ...state,
    formData: {
      ...state.formData,
      [e.target.name]: e.target.value,
      emptyForm: false,
    },
  });
};

const submitActivity = async () => {
  const slug = await slugify(state.formData.title, {
    remove: /[*+~.,()'"!:@]/g,
    lower: true,
  });
  const {
    type,
    title,
    subtitle,
    categories,
    seasons,
    region,
    coverCloudImage,
    cloudImages,
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
  } = state.formData;
  service
    .activity(
      type,
      slug,
      title,
      subtitle,
      categories,
      seasons,
      region,
      coverCloudImage,
      cloudImages,
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
    )
    .then(() => Router.push("/dashboard"))
    .catch((err) => console.error(err));
};

const handleSubmit = (e) => {
  e.preventDefault();
  handleFileUpload();
};

useEffect(() => {
  if (
    state.formData.cloudImagesUploaded === true &&
    state.formData.coverCloudImageUploaded === true
  ) {
    submitActivity();
  }
}, [state.formData]);

useEffect(() => {
  const {
    title,
    subtitle,
    categories,
    seasons,
    region,
    activity_full_address,
    phone,
    website,
    coverImage,
    images,
    price,
    duration,
    description,
  } = state.formData;

  if (
    title &&
    subtitle &&
    categories &&
    seasons &&
    region &&
    activity_full_address &&
    phone &&
    website &&
    images.length > 0 &&
    coverImage !== "" &&
    description &&
    duration &&
    price
  ) {
    setState((state) => ({ ...state, isReadyToSubmit: true }));
  }
}, [state.formData]);
