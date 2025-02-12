import axios from "axios";

const axiosClient = axios.create({ baseURL: "http://26.181.43.237:3000/" });

export default axiosClient;
