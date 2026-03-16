import { UseQueryResult, useQuery } from "@tanstack/react-query";

import api from "../client";
import { DataappAskAIConfig } from "../types/api";
import { getSlug, safeParseJSON } from "../utils/helpers";

const QUERY_KEY_DATAAPP_BY_SLUG = "query-key-dataapp-by-slug";

export interface IDataAppDetails {
  projectId: string;
  tenantId?: string;
  scenarioId: string;
  dataAppId: string;
  askAIConfig: DataappAskAIConfig;
  newAskAIFlow: boolean;
  linksMap: { string: string };
}

const useDataAppBySlug = (): UseQueryResult<IDataAppDetails, unknown> => {
  return useQuery({
    staleTime: Infinity,
    queryKey: [QUERY_KEY_DATAAPP_BY_SLUG],
    queryFn: async () => {
      const slug = await getSlug();

      if (!slug) {
        throw "slug is absent";
      }

      const { data } = await api.getDataAppsBySlug(slug);

      return {
        projectId: data.projectId!,
        tenantId: data.tenantId!,
        scenarioId: data.scenarioId!,
        dataAppId: data.id!,
        askAIConfig: data.askAIConfig!,
        newAskAIFlow: data?.newAskAIFlow!,
        linksMap: data.askAIConfig?.allowColumnHyperLink
          ? safeParseJSON(data.metadata?.columns_hyperlinks_mapping, {})
          : {},
      };
    },
  });
};

export { QUERY_KEY_DATAAPP_BY_SLUG };
export default useDataAppBySlug;
