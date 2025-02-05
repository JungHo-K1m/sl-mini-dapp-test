import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Images from "@/shared/assets/images";


const ItemStore: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { playSfx } = useSound();

    const handleBackClick = () => {
        playSfx(Audios.button_click);
        navigate(-1);
    };

    return (
        <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
            <div 
                className={"h-14 flex items-center  w-full font-bold text-xl mb-8 justify-between"}
                onClick={handleBackClick}>
                <IoChevronBackOutline className={"w-6 h-6"} />
                <p>{t("asset_page.item_store")}</p>
                <img
                    src={Images.Receipt}
                    className="w-6 h-6"
                    onClick={() => {navigate("/payment-history")}}/>
            </div>
        </div>
    );
};

export default ItemStore;