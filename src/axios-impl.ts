import {API_URL} from "./consts.ts";
import ax from 'axios';

const axios = ax.create({
	baseURL: API_URL,
	headers: {
		"Content-type": "application/json"
	},
});

export default axios;
