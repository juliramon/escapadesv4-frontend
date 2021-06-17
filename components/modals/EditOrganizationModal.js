import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import ContentService from "../../services/contentService";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/router";

const EditOrganizationModal = ({
  organizationDetails,
  visibility,
  hideModal,
}) => {
  const router = useRouter();
  if (!organizationDetails) {
    return null;
  }
  let initialState;
  useState(() => {
    if (organizationDetails) {
      initialState = {
        formData: {
          orgLogo: organizationDetails.orgLogo,
          orgName: organizationDetails.orgName,
          cover: organizationDetails.profileCover,
          VATNumber: organizationDetails.VATNumber,
          slug: organizationDetails.slug,
          description: organizationDetails.description,
          organization_full_address:
            organizationDetails.organization_full_address,
          organization_streetNumber:
            organizationDetails.organization_streetNumber,
          organization_street: organizationDetails.organization_street,
          organization_locality: organizationDetails.organization_locality,
          organization_zipcode: organizationDetails.organization_zipcode,
          organization_province: organizationDetails.organization_province,
          organization_state: organizationDetails.organization_state,
          organization_country: organizationDetails.organization_country,
          organization_lat: organizationDetails.organization_lat,
          organization_lng: organizationDetails.organization_lng,
          additionalInfo: organizationDetails.additionalInfo,
        },
      };
    }
  }, [organizationDetails]);
  const [state, setState] = useState(initialState);
  const service = new ContentService();

  const handleChange = (e) => {
    if (e.target.name === "orgName") {
      setState({
        ...state,
        formData: {
          ...state.formData,
          [e.target.name]: e.target.value,
          slug: e.target.value,
        },
      });
    } else {
      setState({
        ...state,
        formData: { ...state.formData, [e.target.name]: e.target.value },
      });
    }
  };

  const handleFileUpload = (e) => {
    const fileToUpload = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("imageUrl", fileToUpload);
    service.uploadFile(uploadData).then((res) =>
      setState({
        ...state,
        formData: { ...state.formData, orgLogo: res.path },
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { _id } = organizationDetails;
    const { orgLogo, orgName, VATNumber, slug, description } = state.formData;
    let organization_full_address,
      organization_streetNumber,
      organization_street,
      organization_locality,
      organization_zipcode,
      organization_province,
      organization_state,
      organization_country,
      organization_lat,
      organization_lng,
      additionalInfo;
    if (state.organizationLocation) {
      organization_full_address =
        state.organizationLocation.organization_full_address;
      organization_streetNumber =
        state.organizationLocation.organization_streetNumber;
      organization_street = state.organizationLocation.organization_street;
      organization_locality = state.organizationLocation.organization_locality;
      organization_zipcode = state.organizationLocation.organization_zipcode;
      organization_province = state.organizationLocation.organization_province;
      organization_state = state.organizationLocation.organization_state;
      organization_country = state.organizationLocation.organization_country;
      organization_lat = state.organizationLocation.organization_lat;
      organization_lng = state.organizationLocation.organization_lng;
      additionalInfo = state.organizationLocation.additionalInfo;
    }
    service
      .editOrganizationData(
        _id,
        orgLogo,
        orgName,
        VATNumber,
        slug,
        description,
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
      )
      .then(() => {
        hideModal();
        router.push(`/empreses/${slug}`);
      });
  };

  const removeProfile = async () => {
    const { _id } = organizationDetails;
    service.removeOrganization(_id).then((res) => console.log(res.data));
    router.push("/feed");
  };

  return (
    <Modal
      show={visibility}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="editProfileModal organization"
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar informació</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="cover-picture box bordered"
          style={{
            backgroundImage: `url("${state.formData.cover}")`,
          }}
        ></div>
        <Form onSubmit={handleSubmit} className="user-editor">
          <Form.Group className="user-avatar">
            <label>
              <Form.Control
                type="file"
                onChange={handleFileUpload}
                className="input-avatar-user"
              ></Form.Control>
              <div className="avatar">
                <img
                  src={state.formData.orgLogo}
                  alt={state.formData.orgName}
                />
                <div className="avatar-overlay">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-camera-plus"
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#ffffff"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="12" cy="13" r="3" />
                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                    <line x1="15" y1="6" x2="21" y2="6" />
                    <line x1="18" y1="3" x2="18" y2="9" />
                  </svg>
                </div>
              </div>
            </label>
          </Form.Group>
          <Form.Group>
            <Form.Label>Nom de l'empresa</Form.Label>
            <Form.Control
              type="text"
              name="orgName"
              defaultValue={state.formData.orgName}
              onChange={handleChange}
              placeholder="Escriu el teu nom complet"
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>CIF/NIF</Form.Label>
            <Form.Control
              type="text"
              name="VATNumber"
              defaultValue={state.formData.VATNumber}
              onChange={handleChange}
              placeholder="Escriu el CIF o NIF de l'empresa"
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>URL del perfil</Form.Label>
            <Form.Control
              type="text"
              name="slug"
              value={state.formData.slug}
              onChange={handleChange}
              placeholder="Escriu l'URL del teu perfil"
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripció de l'empresa</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              defaultValue={state.formData.description}
              onChange={handleChange}
              placeholder="Descriu breument la teva empresa"
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Localització de l'empresa</Form.Label>
            <Autocomplete
              className="form-control"
              apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
              style={{ width: "100%" }}
              onPlaceSelected={(organization) => {
                let organization_full_address,
                  organization_streetNumber,
                  organization_street,
                  organization_locality,
                  organization_zipcode,
                  organization_province,
                  organization_state,
                  organization_country,
                  organization_lat,
                  organization_lng;
                organization_full_address = organization.formatted_address;
                organization.address_components.forEach((el) => {
                  if (el.types[0] === "street_number") {
                    organization_streetNumber = el.long_name;
                  }
                  if (el.types[0] === "route") {
                    organization_street = el.long_name;
                  }
                  if (el.types[0] === "locality") {
                    organization_locality = el.long_name;
                  }
                  if (el.types[0] === "postal_code") {
                    organization_zipcode = el.long_name;
                  }
                  if (el.types[0] === "administrative_area_level_2") {
                    organization_province = el.long_name;
                  }
                  if (el.types[0] === "administrative_area_level_1") {
                    organization_state = el.long_name;
                  }
                  if (el.types[0] === "country") {
                    organization_country = el.long_name;
                  }
                });

                if (organization.geometry.viewport) {
                  organization_lat = Object.values(
                    organization.geometry.viewport
                  )[0].i;
                  organization_lng = Object.values(
                    organization.geometry.viewport
                  )[1].i;
                }

                setState({
                  ...state,
                  organizationLocation: {
                    organization_full_address: organization_full_address,
                    organization_streetNumber: organization_streetNumber,
                    organization_street: organization_street,
                    organization_locality: organization_locality,
                    organization_zipcode: organization_zipcode,
                    organization_province: organization_province,
                    organization_state: organization_state,
                    organization_country: organization_country,
                    organization_lat: organization_lat,
                    organization_lng: organization_lng,
                  },
                });
              }}
              types={["address"]}
              placeholder={"Escriu la direcció de l'empresa"}
              fields={["address_components", "formatted_address", "geometry"]}
              defaultValue={state.formData.organization_full_address}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              name="additionalLocationInfo"
              type="text"
              onChange={(e) =>
                setState({
                  ...state,
                  organizationLocation: {
                    ...state.organizationLocation,
                    additionalInfo: e.target.value,
                  },
                })
              }
              placeholder="Informació addicional de l'adreça de l'empresa"
              defaultValue={state.formData.additionalInfo}
            />
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit">
              Guardar canvis
            </Button>
            <Button variant="warning" onClick={() => removeProfile()}>
              Eliminar organització
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditOrganizationModal;
