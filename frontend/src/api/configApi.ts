export const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/api/";
export const WS_URL = process.env.WS_URL || "ws://localhost:5000/";
export const MIDDLEWARE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/"
    : "/api/";
export const PATH_IMAGE =
  process.env.PATH_IMAGE || "http://localhost:5005/pictures/";
export const RECAPTCHA_SITE_KEY: string =
  process.env.NODE_ENV === "development"
    ? "6LctKSQpAAAAAOdHh-YB8K9XDvf93Qeko1r5nfRl"
    : "6Lc2CdgpAAAAAGy9G-CAQeVrOr65wXWRw6sP54JE";
