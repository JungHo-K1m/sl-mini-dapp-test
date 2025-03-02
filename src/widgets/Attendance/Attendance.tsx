// Attendance.tsx
import React, { useState } from "react";
import AttendanceDay from "@/features/AttendanceDay/components/AttendanceDay";
import { useUserStore } from "@/entities/User/model/userModel";
import { useTranslation } from "react-i18next";

type DayKeys = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

interface AttendanceProps {
  /** Tailwind width 클래스를 지정해 너비를 커스터마이징 */
  customWidth?: string;
}

const getTodayDay = (): DayKeys => {
  const days: DayKeys[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();
  return days[today.getDay()];
};

const Attendance: React.FC<AttendanceProps> = ({ customWidth }) => {
  const { weekAttendance } = useUserStore();
  const [today] = useState<DayKeys>(getTodayDay());
  const { t } = useTranslation();

  // 출석 상태 결정 로직
  const getStatus = (day: DayKeys) => {
    const attendanceData: { [key in DayKeys]: boolean | null } = {
      SUN: weekAttendance.sun,
      MON: weekAttendance.mon,
      TUE: weekAttendance.tue,
      WED: weekAttendance.wed,
      THU: weekAttendance.thu,
      FRI: weekAttendance.fri,
      SAT: weekAttendance.sat
    };

    if (attendanceData[day]) return "checked";
    if (day === today) return "today";

    const daysOfWeek: DayKeys[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const todayIndex = daysOfWeek.indexOf(today);
    const dayIndex = daysOfWeek.indexOf(day);

    return dayIndex < todayIndex ? "missed" : "default";
  };

  const days: DayKeys[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div>
      <div
        id="attendance"
        className={`grid grid-cols-7 gap-2 bg-box mt-4 px-8 min-h-24 md:h-32 text-white text-xs ${
          // customWidth가 있으면 그 클래스를, 없으면 기본 너비를 사용
          customWidth ? customWidth : "w-full md:w-[595.95px]"
        }`}
      >
        {days.map((day) => {
          const displayDay = t(`dice_event.day.${day}`);
          return (
            <AttendanceDay
              key={day}
              day={day}
              displayDay={displayDay}
              status={getStatus(day)}
            />
          );
        })}
      </div>

      <p className="flex items-start justify-start w-full font-medium text-xs md:text-sm mt-2 px-2 text-white">
        * {t("dice_event.star_rewards")}
      </p>
    </div>
  );
};

export default Attendance;
