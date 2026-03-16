import React from 'react';

import ReactExceptionIcon from './ReactExceptionIcon';
import Result from './Result';

interface IProps {
	onClick: () => void;
}

const ReactException: React.FC<IProps> = (props) => {
	return (
		<Result
			heading='Oops! Something went wrong...'
			icon={<ReactExceptionIcon />}
			subtitle1="We're sorry, but the page you are trying to access is currently experiencing issues."
			subtitle2='This could be due to a temporary problem or corruption in the page data.'
			extra={
				<button
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					onClick={props.onClick}
				>
					Reload
				</button>
			}
		/>
	);
};

export default ReactException;
