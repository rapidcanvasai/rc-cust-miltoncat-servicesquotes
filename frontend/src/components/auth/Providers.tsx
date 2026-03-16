import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RCAuthProvider from './RCAuthProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
	},
});

const Providers: React.FC<PropsWithChildren> = (props) => {
	return (
		<QueryClientProvider client={queryClient}>
			<RCAuthProvider>{props.children}</RCAuthProvider>
		</QueryClientProvider>
	);
};

export default Providers;
