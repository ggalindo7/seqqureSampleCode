import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "/api/milestones";

// GET TEMPLATE BY ID //////////////////////////////////////////////

export function getTemplateById(info) {
  const url =
    baseUrl + "/api/escrowTemplates/" + info.templateId + "/" + info.escrowId;

  const config = {
    cache: false,
    data: info,
    method: "GET",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function getAll() {
  const url = baseUrl + "/api/milestones";

  const config = {
    cache: false,
    method: "GET",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function getById(id) {
  const url = baseUrl + "/api/milestones/" + id;

  const config = {
    cache: false,
    method: "GET",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function update(milestone) {
  let url = baseUrl + "/api/milestones/" + milestone._id;
  const config = {
    method: "PUT",
    data: milestone,
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function create(data) {
  const url = baseUrl + "/api/milestones";

  const config = {
    method: "POST",
    data: data,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function del(id) {
  const url = baseUrl + "/api/milestones/" + id;

  const config = {
    method: "DELETE",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

// GET SPECIFIC MILESTONE STATUS /////////////////////////////////////

export function getMilestoneStatusById(escrowId) {
  const url = baseUrl + "/api/escrowMilestones/" + escrowId;

  const config = {
    method: "GET",
    data: escrowId,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

// EDIT MILESTONE STATUS //////////////////////////////////////////////////////////

export function updateMilestoneStatus(milestone) {
  let url = baseUrl + "/api/escrowMilestones/" + milestone._id;

  const config = {
    method: "PUT",
    data: milestone,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

// POST NEW MILESTONE STATUS////////////////////////////////////////////

export function createMilestoneStatus(data) {
  const url = baseUrl + "/api/escrowMilestones";

  const config = {
    method: "POST",
    data: data,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

// DELETE MILESTONE ////////////////////////////////////////////////

export function delMilestoneStatus(id) {
  const url = baseUrl + "/api/escrowMilestones/" + id;

  const config = {
    method: "DELETE",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

//////////////////////////////
// PROVISION
//////////////////////////////

export const provision = (data, tenantId) => {
  const url = baseUrl + "/api/milestones/provision/" + tenantId;

  const config = {
    method: "PUT",
    data,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

//RESPONSES/////////////////////////////////////////////////////////////////

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  return Promise.reject(error);
};
