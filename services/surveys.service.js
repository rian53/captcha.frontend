import getConfig from 'next/config';
import { fetchWrapper } from '@/helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/surveys`;

export const surveysService = {
  getAvailable,
  getById,
  complete,
  getCompleted,
  isCompleted,
  getCount,
};

function getAvailable() {
  return fetchWrapper.get(baseUrl);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function complete(surveyId) {
  return fetchWrapper.post(`${baseUrl}/complete`, { surveyId });
}

function getCompleted() {
  return fetchWrapper.get(`${baseUrl}/completed`);
}

function isCompleted(id) {
  return fetchWrapper.get(`${baseUrl}/completed/${id}`);
}

function getCount() {
  return fetchWrapper.get(`${baseUrl}/count`);
}

