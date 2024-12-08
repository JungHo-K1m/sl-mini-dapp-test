import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineGift } from "react-icons/ai";
import { TbTargetArrow } from "react-icons/tb";
import { BiWallet } from "react-icons/bi";
import { useNavigationStore } from "@/shared/store/navigationStore";
import { IoGameControllerOutline } from "react-icons/io5";
import Images from "@/shared/assets/images";

interface BottomNavigationProps {
  hidden?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({hidden}) => {
  const { selected, setSelected } = useNavigationStore();

  const handleNavigation = (path: string) => {
    setSelected(path);
  };

  return (
    <div
      id="bottomNav"
      className={`fixed bottom-8 self-center rounded-full flex flex-row items-center justify-evenly bottomNav-bg h-16 w-80 font-medium text-[10px] bg-white shadow-lg z-10 ${hidden ? 'hidden' : ''}`}
  
   >
      <Link to="/AI-menu" onClick={() => handleNavigation("/AI-menu")}>
        <motion.div
          className={`flex flex-col items-center justify-center rounded-lg w-12 h-12 ${
            selected === "/AI-menu"
              ? "text-[#0147e5] bg-[#e0f2fe]"
              : "text-[#A3A3A3]"
          }`}
          animate={{
            backgroundColor: selected === "/AI-menu" ? "#e0f2fe" : "#ffffff",
            color: selected === "/AI-menu" ? "#0147e5" : "#A3A3A3",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: selected === "/AI-menu" ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {  selected === "/AI-menu" ? <img src={Images.SeletedBottomBarAI} className="w-6 h-6" /> :  <img src={Images.BottomBarAI} className="w-6 h-6" /> }
         
          </motion.div>
          {selected === "/AI-menu" && (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              AI
            </motion.p>
          )}
        </motion.div>
      </Link>
   
      <Link to="/reward" onClick={() => handleNavigation("/reward")}>
        <motion.div
          className={`flex flex-col items-center justify-center rounded-lg w-12 h-12 ${
            selected === "/reward"
              ? "text-[#0147e5] bg-[#e0f2fe]"
              : "text-[#A3A3A3]"
          }`}
          animate={{
            backgroundColor: selected === "/reward" ? "#e0f2fe" : "#ffffff",
            color: selected === "/reward" ? "#0147e5" : "#A3A3A3",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: selected === "/reward" ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <AiOutlineGift className="w-6 h-6" />
          </motion.div>
          {selected === "/reward" && (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Reward
            </motion.p>
          )}
        </motion.div>
      </Link>
      <Link to="/dice-event" onClick={() => handleNavigation("/dice-event")}>
        <motion.div
          className={`flex flex-col items-center justify-center rounded-lg w-12 h-12 ${
            selected === "/dice-event"
              ? "text-[#0147e5] bg-[#e0f2fe]"
              : "text-[#A3A3A3]"
          }`}
          animate={{
            backgroundColor: selected === "/dice-event" ? "#e0f2fe" : "#ffffff",
            color: selected === "/dice-event" ? "#0147e5" : "#A3A3A3",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: selected === "/dice-event" ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <IoGameControllerOutline className="w-6 h-6" />
          </motion.div>
          {selected === "/dice-event" && (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Game
            </motion.p>
          )}
        </motion.div>
      </Link>
      <Link to="/mission" onClick={() => handleNavigation("/mission")}>
        <motion.div
          className={`flex flex-col items-center justify-center rounded-lg w-12 h-12 ${
            selected === "/mission"
              ? "text-[#0147e5] bg-[#e0f2fe]"
              : "text-[#A3A3A3]"
          }`}
          animate={{
            backgroundColor: selected === "/mission" ? "#e0f2fe" : "#ffffff",
            color: selected === "/mission" ? "#0147e5" : "#A3A3A3",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: selected === "/mission" ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <TbTargetArrow className="w-6 h-6" />
          </motion.div>
          {selected === "/mission" && (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Mission
            </motion.p>
          )}
        </motion.div>
      </Link>
      <Link to="/my-assets" onClick={() => handleNavigation("/my-assets")}>
        <motion.div
          className={`flex flex-col items-center justify-center rounded-lg w-12 h-12 ${
            selected === "/my-assets"
              ? "text-[#0147e5] bg-[#e0f2fe]"
              : "text-[#A3A3A3]"
          }`}
          animate={{
            backgroundColor: selected === "/my-assets" ? "#e0f2fe" : "#ffffff",
            color: selected === "/my-assets" ? "#0147e5" : "#A3A3A3",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: selected === "/my-assets" ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <BiWallet className="w-6 h-6" />
          </motion.div>
          {selected === "/my-assets" && (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Asset
            </motion.p>
          )}
        </motion.div>
      </Link>
    </div>
  );
};

export default BottomNavigation;
