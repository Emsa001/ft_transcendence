import { CookieSerializeOptions } from "@fastify/cookie";

class CookieService {
    maxCookieAge = Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 24; // Default to 1 day

    getAuthSession(): CookieSerializeOptions {
        return {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: this.maxCookieAge,
        };
    }
}

const cookieService = new CookieService();
export default cookieService;
