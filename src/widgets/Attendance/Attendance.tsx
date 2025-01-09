import React, { useState } from "react";
import AttendanceDay from "@/features/AttendanceDay/components/AttendanceDay";
import { useUserStore } from "@/entities/User/model/userModel";
import { useTranslation } from "react-i18next";

type DayKeys = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

const getTodayDay = (): DayKeys => {
  const days: DayKeys[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();
  return days[today.getDay()];
};

const Attendance: React.FC = () => {
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

  // 요일 목록
  const days: DayKeys[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div>
      <h1 className="mt-6 flex items-center justify-center text-white font-jalnan text-3xl">
        {t("dice_event.attendance")}
      </h1>

      <div
        id="attendance"
        className="grid grid-cols-7 gap-2 bg-box mt-4 w-[332px] px-8 md:w-[595.95px] min-h-24 md:h-32 text-white text-xs"
      >
        {days.map((day) => {
          // day: "SUN" | "MON" etc. (식별자)
          // displayDay: i18n에서 불러온 번역 문자열
          const displayDay = t(`dice_event.day.${day}`);
          // 예: day === "SUN" -> displayDay === "일" (혹은 "SUN" 등)

          return (
            <AttendanceDay
              key={day}
              day={day}               // 식별자
              displayDay={displayDay} // 화면 표시용 번역문
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
