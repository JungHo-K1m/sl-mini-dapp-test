import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate  } from "react-router-dom";

interface TopTitleProps {
  title: string;
  className?: string;
  back?: boolean;
}

const TopTitle: React.FC<TopTitleProps> = ({ title, className, back }) => {

  const navigate = useNavigate();


  return (
    <div
      className={`h-14 flex items-center  w-full font-bold text-xl mb-8 px-6 ${className} ${back ? "justify-between" :"justify-center"}`}
      onClick={() => back && navigate(-1)}
    >
      <IoChevronBackOutline className={`w-6 h-6 ${back ? "" : "hidden"}`} />
      <p>{title}</p>
      <div className={`w-6 h-6 ${back ? "" : "hidden"}`} ></div>
    </div>
  );
};

export { TopTitle };
