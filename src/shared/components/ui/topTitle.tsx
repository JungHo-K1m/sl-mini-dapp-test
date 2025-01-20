import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate  } from "react-router-dom";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


interface TopTitleProps {
  title: string;
  className?: string;
  back?: boolean;
}

const TopTitle: React.FC<TopTitleProps> = ({ title, className, back }) => {
  const navigate = useNavigate();
  const { playSfx } = useSound();

  const handleBackClick = () => {
    if (back) {
      playSfx(Audios.button_click);
      navigate(-1);
    }
  };



  return (
    <div
      className={`h-14 flex items-center  w-full font-bold text-xl mb-8 ${className} ${back ? "justify-between" :"justify-center"}`}
      onClick={handleBackClick}
    >
      <IoChevronBackOutline className={`w-6 h-6 ${back ? "" : "hidden"}`} />
      <p>{title}</p>
      <div className={`w-6 h-6 ${back ? "" : "hidden"}`} ></div>
    </div>
  );
};

export { TopTitle };
