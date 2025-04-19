import Image from "next/image";

const AboutYourPlace = () => {
  return (
    <div className="w-full h-dvh flex lg:flex-row max-lg:flex-col-reverse items-center justify-center">
      <div className="h-[25rem] lg:h-full w-full lg:w-1/2 px-20 max-lg:pb-32 flex flex-col items-start justify-center">
        <p>1단계</p>
        <h1 className="text-5xl">숙소 정보를 알려주세요</h1>
        <p>
          먼저 숙소 유형을 선택하고, 게스트가 예약할 수 있는 숙소가 공간
          전체인지 개인실 또는 다인실인지 알려주세요. 그런 다음 숙소 위치와 수용
          가능 인원을 알려주세요.
        </p>
      </div>
      <div className="w-full h-[100rem] lg:h-full lg:w-1/2 lg:px-40 max-lg:pt-80 flex items-center justify-center">
        <Image
          src="/hosting/livingroom.avif"
          alt="livingroom"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};

export default AboutYourPlace;
