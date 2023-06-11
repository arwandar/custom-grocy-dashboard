import axios from "axios";

import config from "./config.json";

const instance = axios.create(config);

export default instance;
