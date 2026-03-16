import React from 'react';

interface IProps {
	icon: JSX.Element;
	heading: string | JSX.Element;
	subtitle1?: string;
	subtitle2?: string;
	extra?: JSX.Element;
}

const Result: React.FC<IProps> = (props) => {
	const { icon, heading, subtitle1, subtitle2, extra } = props;

	return (
		<div className="flex flex-col items-center justify-center gap-4 my-24">
			{icon}
			<h5 className="text-xl font-semibold">{heading}</h5>
			{subtitle1 && <p className="text-gray-600">{subtitle1}</p>}
			{subtitle2 && <p className="text-gray-600">{subtitle2}</p>}
			{extra}
		</div>
	);
};

export default Result;
