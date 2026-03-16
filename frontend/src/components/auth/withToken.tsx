import React, { PropsWithChildren, useEffect, useState } from "react";

import api from "../../client";
import { redirectToLogin } from "../../utils/helpers";

const withToken = (
  Component: React.JSXElementConstructor<PropsWithChildren>
): React.FC<PropsWithChildren> => {
  const Providers: React.FC<PropsWithChildren> = (props) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const initializeApi = async () => {
        try {
          console.log("🔄 Starting API initialization...");
          await api.init();
          console.log("✅ API initialized successfully");
          setIsInitialized(true);
        } catch (error: any) {
          console.error("❌ Failed to initialize API:", error);
          console.error("❌ Error details:", {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
          });
          setHasError(true);
        }
      };

      initializeApi();
    }, []);

    if (hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Failed to initialize API. Check console for details.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
          <button onClick={() => redirectToLogin()}>Redirect to Login</button>
        </div>
      );
    }

    if (!isInitialized) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div>Loading...</div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            Initializing API client...
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return Providers;
};

export default withToken;
