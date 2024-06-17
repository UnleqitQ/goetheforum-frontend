import {API_URL} from "./consts.ts";
import axios from "axios";

export default axios.create({
	baseURL: API_URL,
	headers: {
		"Content-type": "application/json"
	},
});
