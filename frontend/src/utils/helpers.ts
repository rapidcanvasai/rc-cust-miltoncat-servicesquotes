import _ from "lodash";
import parentBridge from "./parentBridge";

const TOKEN = "token";

const redirectToLogin = (): void => {
  const baseUrl = window.location.hostname === "localhost"
    ? "https://test2.rapidcanvas.ai"
    : window.location.origin;
  const url = `${baseUrl}/auth/sign-in?dataappurl=${window.location.href}`;
  window.location.href = url;
};

const getSlug = async () => {
  const url = window.location.href;

  const slug = url.includes("/dataapps/")
    ? _.chain(url).split("/dataapps/").last().split("/").head().value()
    : null;

  if (slug) {
    return slug;
  }

  return await parentBridge.getSlugFromParent();
};

export const getDataAppToken = (dataAppSlug: string): string | null => {
  const storageKey = "dataapp_tokens";

  let storedObj: Record<string, Record<string, string>> = {};

  try {
    const existing = localStorage.getItem(storageKey);
    storedObj = existing ? JSON.parse(existing) : {};
  } catch (err) {
    console.warn("Invalid JSON in localStorage. Resetting.", err);
    return null;
  }

  // Search for the token inside all tenants
  for (const tenantId of Object.keys(storedObj)) {
    const tenantData = storedObj[tenantId];
    if (tenantData && tenantData[dataAppSlug]) {
      return tenantData[dataAppSlug];
    }
  }

  // Not found
  return null;
};

const getToken = async (): Promise<string | undefined> => {
  console.log("🔍 getToken: Starting...");
  console.log("🔍 getToken: hostname =", window.location.hostname);

  // Em localhost, usar token do .env se disponível
  if (window.location.hostname === "localhost" && import.meta.env.VITE_DEV_TOKEN) {
    console.log("✅ getToken: Using VITE_DEV_TOKEN from .env");
    const token = import.meta.env.VITE_DEV_TOKEN;
    console.log("🔍 getToken: Token length =", token?.length);
    return token;
  }

  const decodedUrl = decodeURIComponent(window.location.href);
  const searchParams = new URL(decodedUrl).searchParams;
  const tokenFromQueryParams = searchParams.get(TOKEN);
  console.log("🔍 getToken: tokenFromQueryParams =", tokenFromQueryParams ? "Found" : "Not found");

  const slug = await getSlug();
  console.log("🔍 getToken: slug =", slug);

  const dataAppToken = getDataAppToken(slug ?? "");
  console.log("🔍 getToken: dataAppToken =", dataAppToken ? "Found" : "Not found");

  if (dataAppToken) {
    return dataAppToken;
  }

  if (tokenFromQueryParams) {
    return tokenFromQueryParams;
  }

  console.log("🔍 getToken: Requesting token from parentBridge...");
  let token = await parentBridge.get("token");
  console.log("🔍 getToken: parentBridge token =", token ? "Found" : "Not found");

  if (token) {
    return token;
  }
};

const safeParseJSON = (json: string | undefined, defaultValue = {}) => {
  if (!json) {
    return defaultValue;
  }
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return defaultValue;
  }
};

export { redirectToLogin, getToken, getSlug, safeParseJSON };
