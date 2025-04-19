import Image from "next/image";

const HostingOverview = () => {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-[50%] h-full flex items-center justify-center px-30">
        <h1 className="text-6xl">
          간단하게 에어비앤비 호스팅을 시작할 수 있습니다.
        </h1>
      </div>
      <div className="w-[50%] py-24 h-full">
        <div className="w-full h-[30%] flex flex-row">
          <div className="h-full w-[50px] flex justify-center">
            <h2 className="text-2xl">1</h2>
          </div>
          <div className="w-full h-full">
            <h2 className="text-2xl">숙소 정보를 알려주세요</h2>
            <p className="text-xl mt-1 text-black/50">
              숙소 위치와 숙박 가능 인원 등 기본 정보를 알려주세요.
            </p>
          </div>
          <div className="w-[50%] h-full flex items-center justify-center">
            <Image
              src="/hosting/bed.avif"
              alt="bed"
              width={50}
              height={50}
              className="w-[8rem] h-[8rem]"
            />
          </div>
        </div>
        <div className="w-full h-[30%] flex flex-row">
          <div className="h-full w-[50px] flex justify-center">
            <h2 className="text-2xl">2</h2>
          </div>
          <div className="w-full h-full">
            <h2 className="text-2xl">숙소를 돋보이게 하세요</h2>
            <p className="text-xl mt-1 text-black/50">
              사진을 5장 이상 제출하고 제목과 설명을 추가해 주시면 숙소가 돋보일
              수 있도록 도와드릴게요.
            </p>
          </div>
          <div className="w-[50%] h-full flex items-center justify-center">
            <Image
              src="/hosting/chair.avif"
              alt="chair"
              width={50}
              height={50}
              className="w-[8rem] h-[8rem]"
            />
          </div>
        </div>
        <div className="w-full h-[30%] flex flex-row">
          <div className="h-full w-[50px] flex justify-center">
            <h2 className="text-2xl">3</h2>
          </div>
          <div className="w-full h-full">
            <h2 className="text-2xl">등록을 완료하세요</h2>
            <p className="text-xl mt-1 text-black/50">
              호스팅 초기에 적용할 요금을 설정하고, 세부정보를 인증한 다음 숙소
              등록을 완료하세요.
            </p>
          </div>
          <div className="w-[50%] h-full flex items-center justify-center">
            <Image
              src="/hosting/door.avif"
              alt="door"
              width={50}
              height={50}
              className="w-[8rem] h-[8rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostingOverview;
