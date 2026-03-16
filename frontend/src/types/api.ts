export interface DataappAskAIConfig {
	allowColumnHyperLink?: boolean;
	[key: string]: any;
}

export interface DataAppResponse {
	id: string;
	projectId: string;
	tenantId?: string;
	scenarioId: string;
	askAIConfig?: DataappAskAIConfig;
	newAskAIFlow?: boolean;
	metadata?: {
		columns_hyperlinks_mapping?: string;
		[key: string]: any;
	};
	[key: string]: any;
}

export interface ValidateTokenResponse {
	roleName: string;
	[key: string]: any;
}

