import axios from "axios";
let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api/escrowMilestones"

export function getByEscrowId(escrowId) {
    const url = baseUrl + "/" + escrowId;
  
    const config = {
      method: "GET",
      data: escrowId,
      withCredentials: true
    };
  
    return axios(url, config)
      .then(responseSuccessHandler)
      .catch(responseErrorHandler);
  }
  
  export function updateMilestoneStatus(data) {
    const url = baseUrl + "/" + data._id;
  
    const config = {
      method: "PUT",
      data: data,
      withCredentials: true
    };
  
    return axios(url, config)
      .then(responseSuccessHandler)
      .catch(responseErrorHandler);
  }
  
  export function createMilestoneStatus(data) {
    const url = baseUrl;
  
    const config = {
      method: "POST",
      data: data,
      withCredentials: true
    };
  
    return axios(url, config)
      .then(responseSuccessHandler)
      .catch(responseErrorHandler);
  }
  
  export function delMilestoneStatus(id) {
    const url = baseUrl + "/" + id;
  
    const config = {
      method: "DELETE",
      withCredentials: true
    };
  
    return axios(url, config)
      .then(responseSuccessHandler)
      .catch(responseErrorHandler);
  }

 

  const responseSuccessHandler = response => {
    // console.log(response.data);
    return response.data;
  };
  
  const responseErrorHandler = error => {
    // console.log(error);
    return Promise.reject(error);
  };