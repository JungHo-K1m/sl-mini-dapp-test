import React from 'react';
import { HiCheck, HiX } from 'react-icons/hi';

interface AttendanceDayProps {
  day: string;
  status: 'checked' | 'missed' | 'default' | 'today';
}

const AttendanceDay: React.FC<AttendanceDayProps> = ({ day, status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'checked':
        return 'attendance-check-box-checked text-white border-none';
      case 'missed':
        return 'attendance-check-box-missed text-white border-none';
      case 'default':
        return 'border-slate-200';
      case 'today':
        return 'border-yellow-400 animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="font-semibold">{day}</p>
      <div
        className={`w-7 h-7 rounded-full flex justify-center items-center border-2 ${getStatusClass()}`}
      >
        {status === 'checked' ? (
          <HiCheck className="w-5 h-5" />
        ) : status === 'missed' ? (
          <HiX className="w-5 h-5" />
        ) : null}
      </div>
    </div>
  );
};

export default AttendanceDay;
