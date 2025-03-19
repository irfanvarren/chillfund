"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomWalletButton from './CustomWalletButton';

export default function Navbar() {
    const router = useRouter();
    // const pathname = usePathname();

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(`/#${id}`, { scroll: false });
        }
    };

    return (
        <nav className="navbar fixed top-0 w-full z-50 bg-white py-2 px-2 mx-auto border-b border-b-gray-200 shadow-sm">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <button onClick={() => scrollToSection("home")} className="flex">
                    <span className="self-center text-lg font-semibold whitespace-nowrap flex items-center">
                        <Image width={50} height={50} src="/images/logo.png" className="inline" alt="chillfund" />
                        <span className="inline ml-2">CHILLFUND</span>
                    </span>
                </button>

                <div className="flex md:order-2 items-center">
                    <div className="mr-2 relative">
                        <CustomWalletButton />
                        <div
                            id="phantom-wallet-container"
                            className="hidden absolute right-0"
                            style={{ width: '360px', height: '520px' }}
                        />
                    </div>
                </div>

                <div className="hidden md:flex justify-between items-center w-full md:w-auto md:order-1">
                    <ul className="flex-col md:flex-row flex md:space-x-24 mt-4 md:mt-0 md:text-lg md:font-medium">
                        <li>
                            <button
                                onClick={() => scrollToSection("home")}
                                className={`md:bg-transparent font-roboto block pl-3 pr-4 py-2 md:p-0 rounded cursor-pointer`}
                            >
                                HOME
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection("about-us")}
                                className={`md:bg-transparent font-roboto block pl-3 pr-4 py-2 md:p-0 rounded cursor-pointer`}
                            >
                                ABOUT US
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection("how-to-buy")}
                                className={`md:bg-transparent font-roboto block pl-3 pr-4 py-2 md:p-0 rounded cursor-pointer`}
                            >
                                HOW TO BUY
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection("marketplace")}
                                className={`md:bg-transparent font-roboto block pl-3 pr-4 py-2 md:p-0 rounded cursor-pointer`}
                            >
                                MARKETPLACE
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
