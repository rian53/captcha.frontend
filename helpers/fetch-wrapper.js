import getConfig from "next/config";

import { userService } from "services";

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
  get,
  post,
  postForm,
  patch,
  put,
  delete: _delete,
};

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function postForm(url, formData) {
  return fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      ...authHeader(url),
    },
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Erro no postForm:", error);
      throw error;
    });
}

function patch(url, body) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, body) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
    body: body,
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const user = userService.userValue;
  const isLoggedIn = user && user.token;
  const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
  
  const headers = {};
  
  if (isLoggedIn && isApiUrl) {
    headers.Authorization = `Bearer ${user.token}`;
  }
  
  // Adiciona header de timezone automaticamente para requests da API
  if (isApiUrl) {
    headers.Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  return headers;
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401 && userService.userValue) {
        // auto logout apenas se 401 Unauthorized (token inválido/expirado)
        userService.logout();
      }

      // Cria um objeto de erro personalizado para melhor tratamento
      const errorMessage = (data && data.message) || response.statusText;
      const errorObject = {
        message: errorMessage,
        statusCode: data?.statusCode || response.status,
        errorType: data?.error,
        fullResponse: data,
        name: 'APIError'
      };
      
      return Promise.reject(errorObject);
    }

    return data;
  });
}
