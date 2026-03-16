import React, { Suspense } from "react";

import App from "../../App";
import SomethingWentWrong from "../Errorboundary/SomethingWentWrong";
import Spinner from "../widgets/Spinner";
import useDataAppBySlug from "../../hooks/useDataAppBySlug";

interface IProps {
  roleName?: string; // passing using React.cloneElement
}

const SecuredApp: React.FC<IProps> = (props) => {
  const { roleName } = props;

  const { data, isLoading, isError, refetch } = useDataAppBySlug();

  if (isError) {
    return (
      <SomethingWentWrong
        heading="Something went wrong"
        subtitle1="Please make sure you have updated the data app slug in the URL or in vite config file."
        extra={
          <button
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            onClick={() => refetch()}
          >
            Retry
          </button>
        }
      />
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-screen w-screen pt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <App {...data} roleName={roleName} />
    </Suspense>
  );
};

export default SecuredApp;
