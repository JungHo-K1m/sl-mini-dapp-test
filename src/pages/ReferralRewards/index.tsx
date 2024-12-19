import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TopTitle } from "@/shared/components/ui";

const ReferralRewardHistory: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    

    // DatePicker용 Custom Input
    const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
        ({ value, onClick, placeholder }, ref) => (
        <div
            className="flex items-center w-full px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer focus:ring focus:ring-blue-500"
            onClick={onClick}
            >
            <input
            ref={ref}
            value={value}
            readOnly
            placeholder={placeholder}
            className="bg-transparent outline-none w-full text-white"
            />
            <FaCalendarAlt className="text-blue-500 ml-2" />
        </div>
        )
    );
    CustomDateInput.displayName = "CustomDateInput";

    return (
        <div>

        </div>
    );
};

export default ReferralRewardHistory;