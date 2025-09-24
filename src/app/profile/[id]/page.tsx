import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

function Page({ params }: PageProps) {
  return (
    <div className="text-center text-5xl mt-40">
      The id is{" "}
      <span className="font-bold bg-orange-500 rounded-sm px-3 py-2">
        {params.id}
      </span>
    </div>
  );
}

export default Page;
