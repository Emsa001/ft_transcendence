import axios from "axios";

interface APIServiceOptions {
    baseUrl?: string;
    path?: string;
}

export class APIService {
    protected api;

    constructor({ baseUrl, path }: APIServiceOptions) {
        this.api = axios.create({
            baseURL:
                (baseUrl ||
                    process.env.FT_REACT_PUBLIC_API_HOST ||
                    "https://localhost:443") + (path || ""),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            withCredentials: true,
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                // console.error(
                //     "API Error:",
                //     error.response?.data || error.message
                // );
                return Promise.reject(error);
            }
        );
    }

    getInstance() {
        return this.api;
    }
}
