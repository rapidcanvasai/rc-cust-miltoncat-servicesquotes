import { UseQueryResult, useQuery } from "@tanstack/react-query";

import api from "../client";
import { getToken, redirectToLogin } from "../utils/helpers";

const QUERY_KEY_TOKEN_VALIDATION = "query-key-token-validation";

const useTokenValidation = (): UseQueryResult<string, unknown> => {
  return useQuery({
    queryKey: [QUERY_KEY_TOKEN_VALIDATION],
    staleTime: Infinity,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        redirectToLogin();
        throw "No token found";
      }

      try {
        const { data } = await api.validateToken({
          token,
        });
        return data.roleName!;
      } catch {
        redirectToLogin();
        throw "Failed to validate";
      }
    },
  });
};

export { QUERY_KEY_TOKEN_VALIDATION };
export default useTokenValidation;
