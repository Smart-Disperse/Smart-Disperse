"use client";
import Image from "next/image";
import Navbar from "../NewHomePage/navbar/navbar";
import home from "../NewHomePage/css/home.module.css";
import "../NewHomePage/css/chain.css";
import user from "../NewHomePage/assests/2.svg";
import { Fade } from "react-reveal";
import { useInView } from "react-intersection-observer";
import React, { useLayoutEffect, useRef } from "react";
import {
  faLink,
  faMagnifyingGlassChart,
  faRectangleList,
  faShuffle,
  faShare,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import fast from "../NewHomePage/assests/fast.png";
import secure from "../NewHomePage/assests/secure.png";
import box1 from "../NewHomePage/assests/box1.webp";
import box2 from "../NewHomePage/assests/box2.webp";
import box3 from "../NewHomePage/assests/box3.webp";
// import outer from "../Components/NewHomePage/assests/outer.webp";
// import middle from "../Components/NewHomePage/assests/middle.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import inner from "../Components/NewHomePage/assests/inner.webp";
// import iconLogo from "../Components/NewHomePage/assests/disperse.webp";
// import base from "../Components/NewHomePage/assests/base.webp";
// import scrolll from "../Components/NewHomePage/assests/scroll.webp";
// import eth from "../Components/NewHomePage/assests/ethereum.webp";
// import mode from "../Components/NewHomePage/assests/mode.webp";
// import optimism from "../Components/NewHomePage/assests/optimism.webp";
// import arbitrum from "../Components/NewHomePage/assests/arbitrum.webp";
import Footer from "../NewHomePage/footer/footer";
// import Carousel from "../Components/NewHomePage/milsestone/carousel";
import Link from "next/link";
import spinner from "../../Assets/spinner.gif";

const OPTIONS = { loop: true, duration: 30 };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const steps = [
  {
    icon: faWallet,
    position: { left: "56%", top: "-2%" },
    text: "Connect Wallet",
    className: "bottom",
  },
  {
    icon: faLink,
    position: { right: " -9.5%", top: "17%" },
    text: "Select Chain",
    className: "left",
  },
  {
    icon: faShuffle,
    position: { left: "68%", top: "44%" },
    text: "Select Transactions Type (same-chain/cross-chain)",
    className: "bottom",
  },
  {
    icon: faRectangleList,
    position: { left: "32%", top: "44.5%" },
    text: "List your transactions",
    className: "top",
  },
  {
    icon: faUser,
    position: { left: "-10.5%", top: "68%" },
    text: "Verify the Recipient address & amount",
    className: "right",
  },
  {
    icon: faShare,
    position: { left: "21%", top: "93%" },
    text: "Send Transactions",
    className: "bottom",
  },
  {
    icon: faMagnifyingGlassChart,
    position: { left: "53%", top: "93%" },
    text: "View History of Transactions",
    className: "top",
  },
];

export default function Home({ children }) {
  const [containerRef, containerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1, // Adjust based on when you want to trigger the animation
  });

  const stepRefs = steps.map(() =>
    useInView({ triggerOnce: true, threshold: 0.1 })
  );

  return (
    <main className={home.homeParent} id="smooth-wrapper">
      <div className={home.HomeSubDiv} id="smoooth-content">
        <section className={home.homeMain1}>
          <Navbar />
          <div className={home.sec1}>
            <Fade bottom duration={1000} distance="20px">
              <div className={home.colLeft}>
                <div className={home.titleSame1}>Cross-Chain </div>
                <div className={home.titleSame1}>Made Simple</div>
                <div className={home.peraSame}>
                  Smart-Disperse Powerd by CCIP revolutionizes token transfers
                  with advanced features for seamless cross-chain
                  interoperability. Our solution reduces gas fees, saves time,
                  and simplifies operations, making cross-chain token transfers
                  as effortless as same-chain transfers.
                </div>
              </div>
            </Fade>

            <div className={home.chainCircle}>
              <div className={home.outerWrapper}>
                <Image
                  src={spinner}
                  style={{ width: "100%", height: "100%" }}
                  alt="none"
                  className={home.outercircle}
                />
              </div>
            </div>
          </div>
          <div className={home.chainTitle}>Supported Chains</div>
          <div className={home.wrapper}>
            <div className="marquee">
              <div className="marqueAnimation">
                <div className="marqueegroup">
                  <Link
                    className="marqueFlex"
                    href="https://www.base.org/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/646ceb33c9240a54fa0c0161_Base.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Base</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://www.mode.network/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/65e09ab37ff439cc89a664e5_Mode%20Network.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Mode</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://scroll.io/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/646ceb35bd74dc737a9116e7_Scroll.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Scroll</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://www.optimism.io/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/64606d96c0388563ae674a42_Optimism.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Optimism</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://ethereum.org/en/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/64606d95c004d57477b749e5_Ethereum.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Ethereum</span>
                  </Link>
                </div>

                <div aria-hidden="true" className="marqueegroup">
                  <Link
                    className="marqueFlex"
                    href="https://www.base.org/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/646ceb33c9240a54fa0c0161_Base.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Base</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://www.mode.network/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/65e09ab37ff439cc89a664e5_Mode%20Network.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Mode</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://scroll.io/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/646ceb35bd74dc737a9116e7_Scroll.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Scroll</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://www.optimism.io/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/64606d96c0388563ae674a42_Optimism.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Optimism</span>
                  </Link>
                  <Link
                    className="marqueFlex"
                    href="https://ethereum.org/en/"
                    target="/blank"
                  >
                    <Image
                      src="https://assets-global.website-files.com/63996d8b3c061af402fa0609/64606d95c004d57477b749e5_Ethereum.svg"
                      width={80}
                      height={100}
                      className="ChainImg"
                    ></Image>
                    <span className="chainText">Ethereum</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Fade bottom duration={1000} distance="20px">
          <section className={home.sec2Main}>
            <div className={home.sec2Div}>
              <div className={home.sec2Title}>About SmartDisperse</div>
              <div className={home.sec2Pera}>
                SmartDisperse leverages CCIP to enhance cross-chain
                interoperability
              </div>
            </div>

            <div className={home.gridContentMain}>
              <div className={home.gridContent}>
                <div className={home.gridBox1}>
                  <div className={home.gridImg}>
                    <Image
                      src={fast}
                      alt="none"
                      className={home.aboutBoxFast}
                    />
                  </div>
                  <h6>Fast</h6>
                  <div className={home.box1Pera1}>
                    Store preferred chains and tokens on the blockchain,
                    reducing effort and ensuring beneficial, frequent token
                    transfers.
                  </div>
                </div>
                <div className={home.gridBox1}>
                  <div className={home.gridImg}>
                    <Image src={secure} alt="none" className={home.aboutBox} />
                  </div>
                  <h6>Secure</h6>
                  <div className={home.box1Pera2}>
                    Built on CCIP, SmartDisperse inherits robust security
                    features, ensuring comprehensive support and assistance in
                    case of any issues
                  </div>
                </div>
                <div className={home.gridBox1}>
                  <div className={home.gridImg}>
                    <Image src={user} alt="none" className={home.aboutBox} />
                  </div>
                  <h6>User Friendly</h6>
                  <div className={home.box1Pera3}>
                    SmartDisperse prioritizes speed and efficiency by analyzing
                    and selecting the best possible routes for your token
                    transfers across chains.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Fade>
        <section className={home.sec3Main}>
          <div className={home.sec2Div}>
            <div className={home.sec2Title}>Usecase</div>
          </div>
          <div className={home.outerdivofusecases}>
            <div className={home.cardcontainer}>
              <div className={home.cards}>
                <Fade duration={1000} delay={500}>
                  <div className={home.card}>
                    <div className={home.cardimage}>
                      <Image
                        src={box1}
                        alt="none"
                        width={90}
                        className={home.cardImg1}
                      />
                    </div>
                    <div className={home.cardcontent}>
                      <div className={home.cardcontent1}>Dispersing prize </div>
                      <div className={home.cardcontent2}>
                        SmartDisperse sends prizes to multiple addresses in
                        preferred tokens, swapping if necessary, saving time and
                        fees.
                      </div>
                    </div>
                  </div>
                </Fade>
                <Fade duration={1000} delay={600}>
                  <div className={home.card}>
                    <div className={home.cardimage}>
                      <Image
                        src={box2}
                        alt="none"
                        width={90}
                        className={home.cardImg1}
                      />
                    </div>
                    <div className={home.cardcontent}>
                      <div className={home.cardcontent1}>Sending Gas</div>
                      <div className={home.cardcontent2}>
                        If an address lacks gas for ERC-20 tokens, SmartDisperse
                        helps acquire it from another chain, ensuring smooth
                        transactions
                      </div>
                    </div>
                  </div>
                </Fade>
                <Fade duration={1000} delay={700}>
                  <div className={home.card}>
                    <div className={home.cardimage}>
                      <Image
                        src={box3}
                        alt="none"
                        width={90}
                        className={home.cardImg1}
                      />
                    </div>{" "}
                    <div className={home.cardcontent}>
                      <div className={home.cardcontent1}>
                        Multi-Wallet Transfers
                      </div>
                      <div className={home.cardcontent2}>
                        Easily send funds to multiple wallets at once,
                        effectively streamlining transactions and catering to a
                        diverse range of use cases seamlessly.
                      </div>
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </section>
        <section className={home.sec4Main} ref={containerRef}>
          {containerInView && (
            <Fade duration={1500} delay={100}>
              <div className={home.snakeSection}>
                <div className={home.sec2Div}>
                  <div className={home.sec2Title}>
                    SmartDisperse Walkthrough
                  </div>
                </div>

                <div className={home.container}>
                  <div className={`${home.stepWrapper} ${home.moveLine}`}>
                    {steps.map((step, index) => {
                      const [ref, inView] = stepRefs[index];
                      return (
                        <article
                          key={index}
                          className={`${home.lineStep} ${
                            home[`lineStep${index + 1}`]
                          }`}
                          style={step.position}
                          ref={ref}
                        >
                          {inView && (
                            <Fade duration={1500} delay={100}>
                              <span className={home.num}>
                                <FontAwesomeIcon icon={step.icon} />
                              </span>
                              <p className={home[step.className]}>
                                {step.text}
                              </p>
                            </Fade>
                          )}
                        </article>
                      );
                    })}

                    <svg
                      width="100%"
                      viewBox="0 0 1156 608"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className={home.path}
                        d="m560.30957,10.588011c0,0 438.0947,1.90476 439.04708,1.90476c0.95238,0 144.57857,-1.02912 143.80934,137.14269c-0.76923,138.17181 -116.81095,142.30859 -131.61967,143.8923c-14.80873,1.58372 -840.41472,-0.71429 -860.5941,0.71429c-20.17938,1.42858 -148.4991,6.80903 -146.83244,147.05973c1.66666,140.2507 129.52365,152.14266 129.33243,151.27321c0.19122,0.86945 815.268425,2.687632 951.42748,0"
                        opacity="0.5"
                        strokeWidth="2"
                        stroke="#2567d1"
                        strokeDasharray="10 10"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Fade>
          )}
        </section>
        <section className={home.sec3Main}>
          <div className={home.sec2Div}>
            <div className={home.sec2Title}>get Started Now</div>
          </div>
          <div className={home.outerdivofusecases}>
            <div className={home.cardcontainer}>
              <div className={home.cardGet}>
                {/* <Fade bottom duration={1000} distance="20px"> */}
                <div className={home.cardofgetstart}>
                  <div className={home.cardcontent}>
                    <div className={home.cardcontent1}>Cross-chain</div>
                    <div className={home.cardcontent2}>
                      Unlocking Cross-Chain Transactions: Seamlessly Connect
                      Blockchain
                    </div>
                    <div className={home.buttongetstart}>
                      <Link
                        href="http://smartdisperse.xyz/cross-chain"
                        target="_blank"
                      >
                        <button className={home.getstartbtn}>
                          Start now ➔
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* </Fade> */}
                {/* <Fade bottom duration={1000} distance="20px"> */}
                <div className={home.cardofgetstart}>
                  <div className={home.cardcontent}>
                    <div className={home.cardcontent1}>Same-chain</div>
                    <div className={home.cardcontent2}>
                      Streamlining Same-Chain Transactions: Enhancing Efficiency
                      and Accessibility
                    </div>
                    <div className={home.buttongetstart}>
                      <Link
                        href="http://smartdisperse.xyz/same-chain"
                        target="_blank"
                      >
                        <button className={home.getstartbtn}>
                          Start now ➔
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* </Fade> */}
                {/* <Fade bottom duration={1000} distance="20px"> */}
                <div className={home.cardofgetstart}>
                  <div className={home.cardcontent}>
                    <div className={home.cardcontent1}>Documentation</div>
                    <div className={home.cardcontent2}>
                      Unraveling SmartDisperse: A Comprehensive Guide to
                      Seamless Cross-Chain Communication
                    </div>
                    <div className={home.buttongetstart}>
                      <div>
                        <Link
                          href="https://smart-disperse.gitbook.io/smart-disperse/"
                          target="_blank"
                        >
                          <button className={home.getstartbtn}>
                            Start now ➔
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </Fade> */}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
// export const metadata = {
//   metadataBase: new URL("https://smartdisperse.xyz/"),
//   title: "Home Page",
//   description:
//     "All Chains, One Solution Smart-Disperse Your Crypto Transactions",
//   openGraph: {
//     title: "Home Page",
//     description:
//       "All Chains, One Solution Smart-Disperse Your Crypto Transactions",
//     url: "https://smartdisperse.xyz/",
//     siteName: "SmartDisperse",
//     images: [
//       {
//         url: "https://gateway.lighthouse.storage/ipfs/QmeUAbno6D5VeiJCvaamzuiWugoe5xxfQD7hEm3mTGNxti", // Must be an absolute URL
//         width: 800,
//         height: 600,
//       },
//       {
//         url: "https://gateway.lighthouse.storage/ipfs/QmeUAbno6D5VeiJCvaamzuiWugoe5xxfQD7hEm3mTGNxti", // Must be an absolute URL
//         width: 1800,
//         height: 1600,
//         alt: "My custom alt",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };
