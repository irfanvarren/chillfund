"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6"; // Twitter/X icon
import Link from "next/link";

const steps = [
  {
    image: "/images/wallet-setup.png",
    title: "STEP 1: SET UP A CRYPTO WALLET",
    description:
      "You’ll need a digital wallet to store your NFTs and cryptocurrency. Common wallets include: Metamask, Phantom, Trust Wallet. Download the wallet as a browser extension or mobile app and create an account.",
  },
  {
    image: "/images/buy-crypto.png",
    title: "STEP 2: BUY CRYPTOCURRENCY",
    description:
      "Purchase cryptocurrency (e.g., USDT, ETH, SOL) from an exchange like Binance or Coinbase. Transfer your crypto to your wallet.",
  },
  {
    image: "/images/connect-wallet.png",
    title: "STEP 3: CONNECT YOUR WALLET",
    description:
      "Visit our marketplace and click 'Connect Wallet'. Choose your wallet provider and approve the connection.",
  },
  {
    image: "/images/mint-nft.png",
    title: "STEP 4: BUY OR MINT NFT",
    description:
      "Select the NFT you want to buy and complete the transaction using your wallet.",
  },
];

export default function Home() {




  return (
    <div>
      {/* Home Section */}
      <section
        id="home"
        className="relative flex items-center h-screen md:max-h-[600px] lg:max-h-[750px] bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        {/* Floating Astronaut Image */}
        <motion.div
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="absolute bottom-0 right-0 opacity-80"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/astronaut-home.png"
              alt="Floating Astronaut"
              width={305}
              height={398}
            />
          </motion.div>
        </motion.div>

        {/* Join Our Community */}
        <div
          className="fixed bottom-5 right-5 bg-[#e9f4f7] text-black rounded-2xl px-4 py-3 flex items-center gap-3 shadow-md z-50 cursor-pointer hover:bg-[#d8ecf1] transition"
          onClick={() => window.open("https://twitter.com/chillfund", "_blank")}
        >
          <span className="text-lg font-semibold">Join Our Community</span>
          <FaXTwitter className="text-2xl text-black hover:text-blue-500 transition" />
        </div>

        <div className="py-8 px-14 relative z-10">
          {/* Text Content */}
          <main className="text-left">
            <div className="text-7xl font-extrabold mb-3 text-white drop-shadow-lg">
              <div>
                <strong className="text-[#f13a97] tracking-tighter">
                  Collect Our NFT &
                </strong>
              </div>
              <div className="mt-4 mb-3 tracking-tighter">
                Unlocking Superior Returns
              </div>
              <div className="mb-3 tracking-tighter">Through Innovative</div>
              <div className="mb-3 tracking-tighter">Investment Strategies</div>
            </div>
          </main>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="flex h-screen md:max-h-[600px] lg:max-h-[750px] bg-[#ecf0f1]">
        {/* Left Side (30%) */}
        <div className="w-1/3 bg-[#266ab8] flex flex-col items-center justify-end relative">
          {/* About Us Text */}
          <div className="flex items-center text-left w-full px-8 mb-4">
            <div className="w-2 h-14 bg-[#68a6ff] mr-5"></div>
            <h2 className="text-6xl font-bold text-[#68a6ff] ">
              About Us
            </h2>
          </div>

          {/* Scaled Rocket Image (80%) */}
          <div className="scale-80">
            <Image
              src="/images/about-rocket-raw.png"
              alt="Rocket"
              width={400}
              height={542}
            />
          </div>
        </div>

        {/* Right Side (70%) */}
        {/* Right Side (70%) */}
        <div className="w-2/3 p-10 pt-28 flex flex-col justify-center font-roboto">
          <div className="max-w-[750px]">
            <p className="text-lg text-gray-800 leading-relaxed">
              ChillFund is your go-to platform for stress-free investing, offering simple and easy ways to grow your funds while you relax. At ChillFund, we believe in making financial freedom accessible to everyone—without the complexity.
            </p>
            <p className="text-lg text-gray-800 leading-relaxed mt-4">
              With smart investment options and a user-friendly environment, you can confidently manage your investments, letting your money work for you while you focus on enjoying life. Our mission is to create a laid-back experience where you can invest at your own pace, kick back, and watch your funds grow, hassle-free.
            </p>

            <p className="text-2xl font-semibold text-[#266ab8] mt-6">
              How Does It Work?
            </p>
            <p className="text-lg text-gray-800 leading-relaxed mt-2">
              Just buy our NFT—we’ll handle the rest. Once you own it, we’ll know your wallet address and start generating passive income for you. Our team of experienced investors actively navigates the crypto space, identifying and seizing the best opportunities to grow your investment. Sit back, relax, and let your investment work while you enjoy the rewards. It’s that simple.
            </p>
          </div>

          {/* Boxes with Icons and Text */}
          <div className="mt-8 flex gap-2 w-4/5 mx-auto">
            {/* Stable Return Box */}
            <div className="flex flex-col items-center rounded-xl w-1/3">
              <div className="h-[120px] flex items-center justify-center">
                <Image src="/images/stable-return.png" alt="Stable Return" width={120} height={120} className="object-contain" />
              </div>
              <p className="mt-2 text-lg font-semibold text-[#266ab8]">Stable Return</p>
            </div>

            {/* Low Risk Box */}
            <div className="flex flex-col items-center rounded-xl w-1/3">
              <div className="h-[120px] flex items-center justify-center">
                <Image src="/images/low-risk.png" alt="Low Risk" width={120} height={120} className="object-contain" />
              </div>
              <p className="mt-2 text-lg font-semibold text-[#266ab8]">Low Risk</p>
            </div>

            {/* Long-Term Investment Box */}
            <div className="flex flex-col items-center rounded-xl w-1/3">
              <div className="h-[120px] flex items-center justify-center">
                <Image src="/images/long-term.png" alt="Long-Term Investment" width={120} height={120} className="object-contain" />
              </div>
              <p className="mt-2 text-lg font-semibold text-[#266ab8]">Long Term  <br /> Investment</p>
            </div>
          </div>
        </div>

      </section>

      {/* How to Buy Section */}
      <section id="how-to-buy" className="h-screen md:max-h-[600px] lg:max-h-[750px] py-6 flex items-center justify-items-center bg-[#ecf0f1]">
        <div className="text-center mx-auto">
          <h2 className="text-4xl font-bold text-[#266ab8] my-6">HOW TO BUY</h2>
          <div className="relative w-full max-w-[1200px] mx-auto">

          </div>
        </div>
      </section>

      {/* Collections Section */}
      {/* Collections Section */}
      <section id="marketplace" className="h-screen md:max-h-[600px] lg:max-h-[750px] flex justify-center items-center p-10 bg-[#c1daf9] relative">
        <div className="w-full relative z-10 pl-[30px] pr-[240px]">
          <div className="flex flex-col md:flex-row items-center min-h-[600px] bg-[#edf4fd] shadow-lg rounded-4xl overflow-hidden">
            {/* Image on the Left */}
            <div className="w-full md:w-1/2">
              <Image
                src="/images/marketplace.png"
                alt="Marketplace Item 1"
                width={460}
                height={460}
                className="mx-auto"
              />
            </div>

            {/* Text & Button on the Right */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center text-center">
              <h3 className="text-5xl font-extrabold text-[#5397f7] mb-5">
                Marketplace
              </h3>

              <Link href="/marketplace" className="px-8 cursor-pointer">
                <button className="mt-4 bg-[#ffde58] cursor-pointer text-lg text-black px-6 py-3 w-full rounded-4xl font-bold transition shadow-[6px_6px_0px_#ffbd58] hover:shadow-[4px_4px_0px_#ffbd58] active:shadow-[2px_2px_0px_#ffbd58]">
                  See Our Collection Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Astronaut Image on Bottom Right */}
        <div className="absolute bottom-[100px] right-[30px] z-20">
          <Image
            src="/images/astronaut-marketplace.png"
            alt="Floating Astronaut"
            width={316}
            height={386}
            className="object-contain"
          />
        </div>
      </section>

    </div>
  );
}
