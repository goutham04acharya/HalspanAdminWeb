/**
 * The `useApi` function is a custom hook in a React application that handles API requests with
 * authentication using Auth0 and Axios.
 * @returns The `useApi` function returns an object containing four functions: `getAPI`, `PostAPI`,
 * `PatchAPI`, and `DeleteAPI`. These functions are used to make API requests with proper authorization
 * headers using the Auth0 access token.
 */

import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { baseURL } from '../../config';

const useApi = () => {
    /* The line `const { getIdTokenClaims } = useAuth0();` is using object destructuring to extract the
    `getIdTokenClaims` function from the object returned by the `useAuth0` hook. This function is
    typically provided by the Auth0 React SDK and is used to retrieve the access token claims,
    including the raw access token needed for authentication when making API requests. By extracting
    this function, the `useApi` hook can easily access and call `getIdTokenClaims` to obtain the
    necessary access token for API requests. */
    const { getIdTokenClaims } = useAuth0();

    /**
     * The function `getAPI` is an asynchronous function that fetches data from an API using an access
     * token retrieved from `getIdTokenClaims` and returns the data or an error response.
     * @returns The `getAPI` function is returning an object with two properties: `error` and `data`.
     * If the API call is successful, it will return `{ error: false, data: responseData }`, where
     * `responseData` is the data received from the API. If there is an error during the API call, it
     * will return `{ error: true, data: errorResponse }`, where `error
     */
    const getAPI = async (endpoint) => {
        try {
            const tokenClaims = await getIdTokenClaims();
            const accessToken = tokenClaims.__raw;
            const headers = { Authorization: `Bearer ${accessToken}` }; // Fix the template literal here
            const { data } = await axios.get(`${baseURL}${endpoint}`, { headers }); // Fix the template literal here
            return { error: false, data };
        } catch (error) {
            return { error: true, data: error.response };
        }
    };

    /**
     * The function `PostAPI` sends a POST request with authorization headers using an access token
     * retrieved from `getIdTokenClaims` and returns the response data or an error.
     * @returns The function `PostAPI` is returning an object with two properties:
     * 1. `error`: A boolean value indicating whether an error occurred during the API call. If no
     * error occurred, this will be `false`.
     * 2. `data`: The response data from the API call. If an error occurred, this will contain the
     * error response.
     */
    const PostAPI = async (endpoint, payload) => {
        try {
            const tokenClaims = await getIdTokenClaims();
            const accessToken = tokenClaims.__raw
            const headers = { Authorization: `Bearer ${accessToken}` };  
            const { data } = await axios.post(`${baseURL}${endpoint}`, payload, { headers });
            return { error: false, data };
        } catch (error) {
            console.log(error)
            return { error: true, data: error.response };
        }
    }

    /**
     * The function `PatchAPI` sends a PATCH request to a specified endpoint with authorization using
     * an access token and returns the response data or an error.
     * @returns The `PatchAPI` function returns an object with two properties:
     * 1. `error`: A boolean value indicating whether an error occurred during the API call. If no
     * error occurred, it will be `false`.
     * 2. `data`: The data returned from the API call. If an error occurred, this will contain the
     * error response. Otherwise, it will contain the data returned by the API.
     */
    const PatchAPI = async (endpoint, payload) => {
        try {
            const tokenClaims = await getIdTokenClaims();
            const accessToken = tokenClaims.__raw
            const headers = { Authorization: `Bearer ${accessToken}` };  
            const data = await axios.patch(`${baseURL}${endpoint}`, payload, {
                headers
            });
            return { error: false, data: data.data };
        } catch (error) {
            return { error: true, data: error.response };
        }
    }

    /**
     * The function `DeleteAPI` sends a DELETE request to a specified endpoint with authorization
     * headers and returns the response data or an error.
     * @returns The DeleteAPI function returns an object with two properties:
     * 1. "error": A boolean value indicating whether an error occurred during the API call. If no
     * error occurred, it will be false.
     * 2. "data": The response data from the API call if successful, or the error response if an error
     * occurred.
     */
    const DeleteAPI =  async (endpoint) => {
        try {
            const tokenClaims = await getIdTokenClaims();
            const accessToken = tokenClaims.__raw
            const headers = { Authorization: `Bearer ${accessToken}` };  
            const data = await axios.delete(`${baseURL}${endpoint}`, {
                headers
            });
            return { error: false, data };
        } catch (error) {
            return { error: true, data: error.response };
        }
    } 

    return { getAPI, PostAPI, PatchAPI, DeleteAPI };
};

export default useApi;
