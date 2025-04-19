"use server";

import { SearchParamsProps } from "@/types/type";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const result = (await searchParams) as unknown as SearchParamsProps;
  console.log(result);

  return (
    <div className="min-h-dvh bg-blue-300">
      <div className="bg-red-500 w-full h-dvh">
        <h1>{result.checkIn?.toString()}</h1>
        <h1>{result.checkOut?.toString()}</h1>
      </div>
      <div className="bg-blue-500 w-full h-dvh"></div>
      <div className="bg-green-500 w-full h-dvh"></div>
    </div>
  );
};

export default Home;
