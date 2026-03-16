// parentBridge.ts

type ParentMessageType =
  | "LOCAL_STORAGE_REQUEST"
  | "LOCAL_STORAGE_RESPONSE"
  | "LOCAL_STORAGE_SET"
  | "LOCAL_STORAGE_REMOVE"
  | "LOCAL_STORAGE_CLEAR"
  | "PARENT_HOSTNAME_REQUEST"
  | "PARENT_HOSTNAME_RESPONSE"
  | "PARENT_SLUG_REQUEST"
  | "PARENT_SLUG_RESPONSE";

interface ParentMessage {
  type: ParentMessageType;
  key?: string;
  value?: string;
  requestId?: string;
}

function generateRequestId(): string {
  return Math.random().toString(36).slice(2);
}

function isLocalStorageAccessible(): boolean {
  try {
    const isTokenAvailable = localStorage.getItem("token");
    return !!isTokenAvailable;
  } catch {
    return false;
  }
}

export function isHostNameAvailable(): boolean {
  try {
    if (window.self.location.origin && window.top?.location?.origin) {
      return window.self.location.origin === window.top.location.origin;
    }
    return false;
  } catch (err) {
    return false;
  }
}

async function requestLocalStorage(key: string): Promise<string | null> {
  return new Promise((resolve) => {
    const requestId = generateRequestId();

    function handleResponse(event: MessageEvent) {
      const data = event.data as ParentMessage;
      if (
        data?.type === "LOCAL_STORAGE_RESPONSE" &&
        data.requestId === requestId
      ) {
        window.removeEventListener("message", handleResponse);
        resolve(data.value ?? null);
      }
    }

    window.addEventListener("message", handleResponse);

    const msg: ParentMessage = {
      type: "LOCAL_STORAGE_REQUEST",
      key,
      requestId,
    };

    window.parent.postMessage(msg, "*");
  });
}

async function requestHostName(): Promise<string | null> {
  return new Promise((resolve) => {
    const requestId = generateRequestId();

    function handleResponse(event: MessageEvent) {
      const data = event.data as ParentMessage;
      if (
        data?.type === "PARENT_HOSTNAME_RESPONSE" &&
        data.requestId === requestId
      ) {
        window.removeEventListener("message", handleResponse);
        resolve(data.value ?? null);
      }
    }

    window.addEventListener("message", handleResponse);

    const msg: ParentMessage = {
      type: "PARENT_HOSTNAME_REQUEST",
      requestId,
    };

    window.parent.postMessage(msg, "*");
  });
}

async function requestSlug(): Promise<string | null> {
  return new Promise((resolve) => {
    const requestId = generateRequestId();

    function handleResponse(event: MessageEvent) {
      const data = event.data as ParentMessage;
      if (
        data?.type === "PARENT_SLUG_RESPONSE" &&
        data.requestId === requestId
      ) {
        window.removeEventListener("message", handleResponse);
        resolve(data.value ?? null);
      }
    }

    window.addEventListener("message", handleResponse);

    const msg: ParentMessage = {
      type: "PARENT_SLUG_REQUEST",
      requestId,
    };

    window.parent.postMessage(msg, "*");
  });
}
function postToParent(
  type: ParentMessageType,
  payload: Record<string, unknown> = {}
): void {
  const msg = { type, ...payload };
  window.parent.postMessage(msg, "*");
}

const parentBridge = {
  async get(key: string): Promise<string | null> {
    if (isLocalStorageAccessible()) {
      return localStorage.getItem(key);
    }
    return await requestLocalStorage(key);
  },

  set(key: string, value: string): void {
    if (isLocalStorageAccessible()) {
      localStorage.setItem(key, value);
      return;
    }
    postToParent("LOCAL_STORAGE_SET", { key, value });
  },

  remove(key: string): void {
    if (isLocalStorageAccessible()) {
      localStorage.removeItem(key);
      return;
    }
    postToParent("LOCAL_STORAGE_REMOVE", { key });
  },

  clear(): void {
    if (isLocalStorageAccessible()) {
      localStorage.clear();
      return;
    }
    postToParent("LOCAL_STORAGE_CLEAR");
  },

  async getHostName(): Promise<string | null> {
    if (isHostNameAvailable()) {
      return window?.top?.location?.origin || "";
    }
    return await requestHostName();
  },

  async getSlugFromParent(): Promise<string | null> {
    return await requestSlug();
  },
};

export default parentBridge;
