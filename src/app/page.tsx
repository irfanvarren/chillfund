"use client";
import { IoStorefront } from "react-icons/io5";
import { TiInfoLarge } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-auto overflow-hidden">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-start md:min-h-[34rem] pb-20 gap-16 font-geist">
        <main className="flex flex-row row-start-2 items-center sm:items-start justify-self-center lg:justify-self-start ">
          <div className="relative mx-8 mt-48 md:mt-60 xl:mt-20 lg:mt-auto bg-white xl:shadow-none shadow-md xl:border-none border sm:border-gray-100 rounded-xl p-5 sm:p-8 z-50 max-w-[540px] xl:max-w-[600px] ">
            <h1 className="text-xl sm:text-3xl font-semibold whitespace-nowrap mb-3">
              Logo
            </h1>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 ">
                Welcome to the NFT Marketplace
              </h1>
              <p>
                Discover, create, and trade unique digital assets on the
                Ethereum blockchain.
              </p>
            </div>
            <footer className="flex gap-6 items-center justify-start sm:justify-center mt-4 relative">
              <button
                className="flex w-full smd:w-auto items-center gap-2 hover:underline hover:underline-offset-4 sm:-ml-4"
                onClick={() => router.push("/marketplace", { scroll: false })}
                rel="noopener noreferrer"
              >
                <IoStorefront />
                Marketplace
              </button>
              <button
                className="flex w-full smd:w-auto items-center gap-2 hover:underline hover:underline-offset-4"
                onClick={() => router.push("/about", { scroll: false })}
                rel="noopener noreferrer"
              >
                <TiInfoLarge />
                About
              </button>
            </footer>
          </div>
        </main>
        {/* Overlapping Images (Fan Cards Effect) */}
        <div className="absolute w-full lg:w-1/2 h-[400px] right-[-10px] top-0 lg:top-auto xl:right-[50px] overflow-x-clip mt-28 sm:mt-32  mx-auto transform rotate-[-2deg] ">
          <div></div>
          <div className="absolute w-full max-w-[120px] md:max-w-[150px] xl:max-w-[200px] z-40 top-[15px] md:top-[7px] lg:top-[20px] left-[calc(50%-150px)] md:left-[calc(50%-195px)] -translate-x-1/2 lg:translate-x-0 lg:left-auto  sm:translate-auto sm:right-[50px] group transform rotate-[-17deg] lg:rotate-[17deg]">
            <Image
              src="/images/nfts/1.avif" // Replace with your image path
              alt="Image 1"
              width={200}
              height={300}
              className="h-[160px]  md:h-52 xl:h-72 xl:max-w-[200px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="absolute w-full max-w-[120px] xl:max-w-[200px] md:max-w-[150px] z-30 top-[-10px] md:top-[-22px] lg:top-[-10px] left-[calc(50%-50px)] md:left-[calc(50%-70px)] -translate-x-1/2 lg:translate-x-0 lg:left-auto sm:translate-auto sm:right-[175px] group transform rotate-[-9deg] lg:rotate-[9deg]">
            <Image
              src="/images/nfts/6.avif" // Replace with your image path
              alt="Image 2"
              width={200}
              height={300}
              className="h-[160px] md:h-52 xl:h-72 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="absolute w-full max-w-[120px] md:max-w-[150px] xl:max-w-[200px] z-20 top-[-5px] md:top-[-15px] lg:top-[-10px] left-[calc(50%+40px)] md:left-[calc(50%+45px)] -translate-x-1/2 lg:translate-x-0 lg:left-auto sm:translate-auto sm:right-[290px] group transform rotate-[9deg] lg:rotate-[-9deg]">
            <Image
              src="/images/nfts/5.avif" // Replace with your image path
              alt="Image 3"
              width={200}
              height={300}
              className="h-[160px]  md:h-52  xl:h-72 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="absolute w-full max-w-[120px] md:max-w-[150px] xl:max-w-[200px] z-10 top-[15px] md:top-[9px] lg:top-[20px] left-[calc(50%+140px)] md:left-[calc(50%+175px)] -translate-x-1/2 lg:translate-x-0 lg:left-auto sm:translate-auto sm:right-[415px] group transform rotate-[17deg] lg:rotate-[-17deg]">
            <Image
              src="/images/nfts/4.avif" // Replace with your image path
              alt="Image 4"
              width={200}
              height={300}
              className="h-[160px] md:h-52  xl:h-72  object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
