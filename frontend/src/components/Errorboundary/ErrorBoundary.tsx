import React, { PropsWithChildren } from 'react';

import ReactException from './ReactException';

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<PropsWithChildren, ErrorBoundaryState> {
	constructor(props: PropsWithChildren) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error) {
		console.log(error);
	}

	render() {
		if (this.state.hasError) {
			return <ReactException onClick={() => this.setState({ hasError: false })} />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
