 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { baseURL } from '../../config';

const { getIdTokenClaims } = useAuth0();

async function PostAPIWithoutHeader (endpoint, body) {
    try {
        const url = `${baseURL}${endpoint}`;
        const data = await axios.post(url, body);
        return { error: false, data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}
const getAPI = async (endpoint, customHeaders = {}) => {
    try {
        const tokenClaims = await getIdTokenClaims();
        const accessToken = tokenClaims.__raw;
        const defaultHeaders = { Authorization: `Bearer ${accessToken}` };
        
        // Merge default headers with custom headers
        const headers = { ...defaultHeaders, ...customHeaders };

        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, { headers });
        return { error: false, data };
    } catch (error) {
        return { error: true, data: error.response };
    }
};
export const dataService = {
    PostAPIWithoutHeader,
    getAPI
};
