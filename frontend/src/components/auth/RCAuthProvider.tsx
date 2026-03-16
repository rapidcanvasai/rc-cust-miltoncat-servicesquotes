import React, { PropsWithChildren } from 'react';

import useTokenValidation from '../../hooks/useTokenValidation';
import withToken from './withToken';
import Spinner from '../widgets/Spinner';

const RCAuthProvider: React.FC<PropsWithChildren> = (props) => {
	const { data, isLoading, isError, isSuccess } = useTokenValidation();

	if (isLoading) {
		return <Spinner />;
	}

	if (isError) {
		return <>Not Authenticated, Redirecting to Login...</>;
	}

	if (isSuccess) {
		return <>{React.cloneElement(props.children as React.JSX.Element, { roleName: data })}</>;
	}

	return null;
};

export default withToken(RCAuthProvider);
