/* eslint-disable security/detect-object-injection */
import axios from 'axios';
import { baseURL } from '../config';
import authHeader from './authHeader';

async function PostAPIWithoutHeader (endpoint, body) {
    try {
        const url = `${baseURL}${endpoint}`;
        const data = await axios.post(url, body);
        return { error: false, data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}

/**
 * The function `GetAPI` makes an asynchronous GET request to a specified API endpoint with
 * authentication headers and returns the response data or an error object.
 * @param endpoint - The `endpoint` parameter in the `GetAPI` function represents the specific endpoint
 * of the API that you want to make a GET request to. It is a string that typically comes after the
 * base URL of the API. For example, if the base URL is `https://api.example.com` and
 * @returns The `GetAPI` function is returning an object with two properties:
 * 1. If the API call is successful, it returns an object with `error` set to `false` and `data`
 * containing the response data from the API.
 * 2. If there is an error during the API call, it returns an object with `error` set to `true` and
 * `data` containing the error
 */
async function GetAPI (endpoint) {
    const headers = await authHeader();
    try {
        const data = await axios.get(`${baseURL}${endpoint}`, {
            headers
        });
        return { error: false, data: data.data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}

/**
 * The function `PostAPI` makes a POST request to a specified endpoint with a payload and returns the
 * response data or an error object.
 * @param endpoint - The `endpoint` parameter in the `PostAPI` function refers to the specific API
 * endpoint or route where you want to send the POST request. It is typically a URL path that specifies
 * the location of the resource on the server that you want to interact with. For example, it could be
 * something like
 * @param payload - The `payload` parameter in the `PostAPI` function refers to the data that you want
 * to send in the POST request to the specified `endpoint`. This data could be in the form of an
 * object, string, or any other format that the API endpoint expects to receive. It typically includes
 * the
 * @returns The `PostAPI` function returns an object with two properties:
 * 1. If the API call is successful, it returns an object with `error` set to `false` and `data`
 * containing the response data from the API.
 * 2. If there is an error during the API call, it returns an object with `error` set to `true` and
 * `data` containing the error response
 */
async function PostAPI (endpoint, payload) {
    try {
        const headers = await authHeader();
        const data = await axios.post(`${baseURL}${endpoint}`, payload, {
            headers
        });
        return { error: false, data: data.data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}

/**
 * The function `PatchAPI` sends a PATCH request to a specified endpoint with a payload and returns the
 * response data or an error object.
 * @param endpoint - The `endpoint` parameter in the `PatchAPI` function represents the specific URL
 * endpoint or route that you want to send a PATCH request to. It is typically a string that specifies
 * the location of the resource on the server that you want to update or modify.
 * @param payload - The `payload` parameter in the `PatchAPI` function refers to the data that you want
 * to send in the body of the PATCH request to the specified `endpoint`. This data could be in the form
 * of an object, string, or any other format that is required by the API you are interacting
 * @returns The `PatchAPI` function returns an object with two properties:
 * 1. If the operation is successful, it returns an object with `error: false` and the `data` received
 * from the API call.
 * 2. If there is an error during the API call, it returns an object with `error: true` and the error
 * response received.
 */
async function PatchAPI (endpoint, payload) {
    try {
        const headers = await authHeader();
        const data = await axios.patch(`${baseURL}${endpoint}`, payload, {
            headers
        });
        return { error: false, data: data.data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}

/**
 * The function `DeleteAPI` makes an asynchronous DELETE request to a specified endpoint using axios
 * with error handling.
 * @param endpoint - The `endpoint` parameter in the `DeleteAPI` function represents the specific URL
 * endpoint or route that you want to send a DELETE request to. This endpoint is appended to the
 * `baseURL` to form the complete URL for the DELETE request.
 * @returns The `DeleteAPI` function is returning an object with two properties:
 * 1. If the deletion operation was successful, it returns an object with `error` set to `false` and
 * the `data` received from the API call.
 * 2. If an error occurs during the deletion operation, it returns an object with `error` set to `true`
 * and the error response data.
 */
async function DeleteAPI (endpoint) {
    try {
        const headers = await authHeader();
        const data = await axios.delete(`${baseURL}${endpoint}`, {
            headers
        });
        return { error: false, data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}

export const dataService = {
    PatchAPI,
    GetAPI,
    PostAPI,
    DeleteAPI,
    PostAPIWithoutHeader
};
