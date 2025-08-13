import axios from "axios";

export class APIService {
    protected api;

    constructor(baseUrl: string) {
        this.api = axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            withCredentials: true,
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error(
                    "API Error:",
                    error.response?.data || error.message
                );
                return Promise.reject(error);
            }
        );
    }

    getInstance() {
        return this.api;
    }
}
