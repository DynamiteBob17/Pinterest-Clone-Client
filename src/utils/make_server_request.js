import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

async function makeServerRequest(method, path, data, user_id) {
    const token = cookies.get('gh_jwt');

    const config = {
        method,
        url: `${import.meta.env.VITE_SERVER_ORIGIN}${path}`,
        headers: {
            Authorization: `${user_id} ${token}`,
            'Content-Type': 'application/json'
        },
        data
    }

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default makeServerRequest;
