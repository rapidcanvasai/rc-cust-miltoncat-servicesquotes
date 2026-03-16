import React from 'react';

import ReactExceptionIcon from './ReactExceptionIcon';
import Result from './Result';

interface IProps {
	heading: string;
	subtitle1?: string;
	extra?: JSX.Element;
}

const SomethingWentWrong: React.FC<IProps> = (props) => {
	return <Result icon={<ReactExceptionIcon />} {...props} />;
};

export default SomethingWentWrong;
