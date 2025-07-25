import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import AttendanceIndicator from "@/components/molecules/AttendanceIndicator";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isWeekend } from "date-fns";

const AttendanceCalendar = ({ attendanceData = [], selectedEmployee }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendanceData.find(record => 
      record.date === dateStr && 
      (!selectedEmployee || record.employeeId === selectedEmployee.Id)
    );
  };
  
  const getAttendanceStatus = (date) => {
    if (isWeekend(date)) return "weekend";
    
    const attendance = getAttendanceForDate(date);
    if (!attendance) return "absent";
    
    return attendance.status?.toLowerCase() || "absent";
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Calculate grid start position based on first day of month
  const firstDayOfMonth = getDay(monthStart);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900">
            Attendance Calendar
          </h3>
          {selectedEmployee && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedEmployee.firstName} {selectedEmployee.lastName}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => navigateMonth(-1)}
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <span className="font-medium text-gray-900 min-w-[120px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="small"
            onClick={() => navigateMonth(1)}
          >
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month start */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => {
          const status = getAttendanceStatus(day);
          const attendance = getAttendanceForDate(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`
                aspect-square flex flex-col items-center justify-center p-1 rounded-lg text-sm
                ${isToday(day) ? "ring-2 ring-primary-500 bg-primary-50" : "hover:bg-gray-50"}
                transition-all duration-200 cursor-pointer
              `}
            >
              <span className={`font-medium mb-1 ${isToday(day) ? "text-primary-600" : "text-gray-700"}`}>
                {format(day, "d")}
              </span>
              <AttendanceIndicator status={status} />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Leave</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <span className="text-sm text-gray-600">Weekend</span>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;