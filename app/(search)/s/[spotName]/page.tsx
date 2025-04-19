"use server";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const spotName = await params;
  const result = await searchParams;
  console.log(spotName);
  console.log(result);

  return (
    <div className="min-h-dvh bg-blue-300">
      <div className="bg-red-500 w-full h-dvh"></div>
      <div className="bg-blue-500 w-full h-dvh"></div>
      <div className="bg-green-500 w-full h-dvh"></div>
    </div>
  );
};

export default Page;
