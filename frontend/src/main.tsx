import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/Errorboundary/ErrorBoundary';
import Providers from './components/auth/Providers';
import SecuredApp from './components/auth/SecuredApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<ErrorBoundary>
		<Providers>
			<SecuredApp />
		</Providers>
	</ErrorBoundary>,
);
