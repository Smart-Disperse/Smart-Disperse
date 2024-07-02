"use client";
import React from "react";
import milestone from "./milestone.module.css";
import milestoneImg from "../../Assets/version.svg";
import Image from "next/image";
import Footer from "@/Components/Footer/Footer";
import Navbar from "../../Components/NewHomePage/navbar/navbar";
function page() {
  return (
    <div>
      <Navbar />
      <div className={milestone.container}>
        <div className={milestone.TitleDiv}>
          <h1 className={milestone.header}>Milestone</h1>
        </div>
        <div>
          <ul className={milestone.ulMain}>
            <li className={milestone.LiMain}>
              <aside className={milestone.aside}>
                <div className={milestone.asideLeft}>
                  <div className={milestone.asideHeader}>🏆 Our Goal</div>
                  <div className={milestone.asideDot}></div>
                </div>
                <div className={milestone.asideBorder}></div>
              </aside>
              <div className={milestone.ContainerRight}>
                <div className={milestone.RightMain}>
                  <Image src={milestoneImg} className={milestone.Img}></Image>
                </div>
                <h2 className={milestone.subHeader}>Smart Disperse</h2>
                <div className={milestone.subPera}>
                  Alice can send Native and ERC20 token to multiple users on the
                  same chain within one transaction
                </div>
              </div>
              <div></div>
            </li>
            <li className={milestone.LiMain}>
              <aside className={milestone.aside}>
                <div className={milestone.asideLeft}>
                  <div className={milestone.asideHeader}>🎯 Milestone 0</div>
                  <div className={milestone.asideDot}></div>
                </div>
                <div className={milestone.asideBorder}></div>
              </aside>
              <div className={milestone.ContainerRight}>
                <div className={milestone.RightMain}>
                  <Image src={milestoneImg} className={milestone.Img}></Image>
                </div>
                <h2 className={milestone.subHeader}>Milestone 0 Title</h2>
                <div className={milestone.subPera}>
                  Alice can send Native and ERC20 token to multiple users on the
                  same chain within one transaction
                </div>
              </div>
              <div></div>
            </li>
            <li className={milestone.LiMain}>
              <aside className={milestone.aside}>
                <div className={milestone.asideLeft}>
                  <div className={milestone.asideHeader}>🎯 Milestone 1</div>
                  <div className={milestone.asideDot}></div>
                </div>
                <div className={milestone.asideBorder}></div>
              </aside>
              <div className={milestone.ContainerRight}>
                <div className={milestone.RightMain}>
                  <Image src={milestoneImg} className={milestone.Img}></Image>
                </div>
                <h2 className={milestone.subHeader}>Milestone 2 Title</h2>
                <div className={milestone.subPera}>
                  Alice can transfer both native and ERC20 tokens. for native
                  token, Alice will provide ETH to the contract and that eth
                  will be converted into WETh and bridged to the destination
                  chain. after receiving on destination chain it will be
                  converted to ETH again and disperse. this all will be done in
                  one transaction.
                </div>
                <div className={milestone.subPera}>
                  Alice knows the desired chain of alice and bob and can send
                  funds to bob and charlie on the destination chain as well as
                  the source chain in one transaction.
                </div>
              </div>
              <div></div>
            </li>
            {/* <li className={milestone.LiMain}>
         <aside className={milestone.aside}>
           <div className={milestone.asideLeft}>
             <div className={milestone.asideHeader}>Milestone 1</div>
             <div className={milestone.asideDot}></div>
           </div>
           <div className={milestone.asideBorder}></div>
         </aside>
         <div className={milestone.ContainerRight}>
           <div className={milestone.RightMain}>
             <Image src={milestoneImg} className={milestone.Img}></Image>
           </div>
           <h2 className={milestone.subHeader}>Smart Disperse</h2>
           <p>
             ✨ We just made our 𝙛𝙞𝙣𝙖𝙡 𝙢𝙖𝙟𝙤𝙧 𝙐𝙄 𝙪𝙥𝙙𝙖𝙩𝙚 before launching on
             Arbitrum Mainnet ✨
           </p>
         </div>
         <div></div>
       </li>
       <li className={milestone.LiMain}>
         <aside className={milestone.aside}>
           <div className={milestone.asideLeft}>
             <div className={milestone.asideHeader}>Milestone 1</div>
             <div className={milestone.asideDot}></div>
           </div>
           <div className={milestone.asideBorder}></div>
         </aside>
         <div className={milestone.ContainerRight}>
           <div className={milestone.RightMain}>
             <Image src={milestoneImg} className={milestone.Img}></Image>
           </div>
           <h2 className={milestone.subHeader}>Smart Disperse</h2>
           <p>
             ✨ We just made our 𝙛𝙞𝙣𝙖𝙡 𝙢𝙖𝙟𝙤𝙧 𝙐𝙄 𝙪𝙥𝙙𝙖𝙩𝙚 before launching on
             Arbitrum Mainnet ✨
           </p>
         </div>
         <div></div>
       </li>
       <li className={milestone.LiMain}>
         <aside className={milestone.aside}>
           <div className={milestone.asideLeft}>
             <div className={milestone.asideHeader}>Milestone 1</div>
             <div className={milestone.asideDot}></div>
           </div>
           <div className={milestone.asideBorder}></div>
         </aside>
         <div className={milestone.ContainerRight}>
           <div className={milestone.RightMain}>
             <Image src={milestoneImg} className={milestone.Img}></Image>
           </div>
           <h2 className={milestone.subHeader}>Smart Disperse</h2>
           <div className={milestone.subPera}>
             ✨ We just made our 𝙛𝙞𝙣𝙖𝙡 𝙢𝙖𝙟𝙤𝙧 𝙐𝙄 𝙪𝙥𝙙𝙖𝙩𝙚 before launching on
             Arbitrum Mainnet ✨
           </div>
         </div>
         <div></div>
       </li> */}
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default page;
