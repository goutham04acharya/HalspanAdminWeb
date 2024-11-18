 
import axios from 'axios';
import { baseURL } from '../config';

async function PostAPIWithoutHeader (endpoint, body) {
    try {
        const url = `${baseURL}${endpoint}`;
        const data = await axios.post(url, body);
        return { error: false, data };
    } catch (error) {
        return { error: true, data: error.response };
    }
}
export const dataService = {
    PostAPIWithoutHeader,
};
