import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from '@/helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/auth`;
const apiBaseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    loginWithEmail,
    recover,
    recoverByToken,
    logout,
    validateSession,
    getById,
    getProfile,
    update,
    emailExists,
    checkInitialEmailStatus,
};

async function emailExists(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return false;
  }

  try {
    const response = await fetchWrapper.post(`${baseUrl}/email-exists`, { email });
    return Boolean(response.exists);
  } catch (error) {
    console.error('Erro ao verificar e-mail:', error);
    return false;
  }
}

async function checkInitialEmailStatus(sessionEmail) {
  if (!sessionEmail) {
    return { 
      emailExists: false, 
      isEditable: false, 
      showAlert: false 
    };
  }

  try {
    const exists = await emailExists(sessionEmail);
    return {
      emailExists: exists,
      isEditable: exists,
      showAlert: exists
    };
  } catch (error) {
    return { 
      emailExists: false, 
      isEditable: false, 
      showAlert: false 
    };
  }
}

async function login(email, password) {
  // Manter compatibilidade com código antigo que ainda usa password
  const response = await fetchWrapper.post(`${baseUrl}/login`, { email });

  if (response.error) {
    console.error('Error logging in:', response.error);
    throw new Error(response.error);
  }

  userSubject.next(response);
  localStorage.setItem('user', JSON.stringify(response));
  return response;
}

async function loginWithEmail(email) {
  const response = await fetchWrapper.post(`${baseUrl}/login`, { email });

  if (response.error) {
    console.error('Error logging in:', response.error);
    throw new Error(response.error);
  }

  userSubject.next(response);
  localStorage.setItem('user', JSON.stringify(response));
  return response;
}

function validateSession(sessionId) {
    return fetchWrapper.get(`${baseUrl}/validate-session/${sessionId}`);
}

async function recoverByToken(token, password) {
    const response = await fetchWrapper.post(`${baseUrl}/reset-password`, { token, password });
    console.log(response)
    return response
}

async function recover(email) {
    const response = await fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
    return response;
}


function logout() {
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push({
        pathname: '/account/login',
    },
        null,
        {
          shallow: true,
        }
      )
      .catch((e) => {
        if (!e.cancelled) {
          throw e
        }
      })
}


function getById() {
    return fetchWrapper.get(`${baseUrl}/profile`);
}

function getProfile() {
    return fetchWrapper.get(`${baseUrl}/profile`);
}

function update(id, params) {
    // Incluir o id no payload pois o backend espera isso no DTO
    const payload = { ...params, id: parseInt(id) };

    return fetchWrapper.put(`${baseUrl}/update`, payload)
        .then(x => {

            if (id === userSubject.value.id) {
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));
                userSubject.next(user);
            }
            return x;
        })
        .catch(error => {
            console.error('Update error:', error);
            throw error;
        });
}


