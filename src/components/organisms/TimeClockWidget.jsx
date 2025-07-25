import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import attendanceService from "@/services/api/attendanceService";
import employeeService from "@/services/api/employeeService";

const TimeClockWidget = ({ onAttendanceUpdate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load current employee and attendance status
  useEffect(() => {
    loadCurrentStatus();
  }, []);

  const loadCurrentStatus = async () => {
    try {
      // For demo purposes, using first employee - in real app, would get from auth context
      const employees = await employeeService.getAll();
      const employee = employees[0];
      setCurrentEmployee(employee);

      // Check today's attendance
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = await attendanceService.getByDate(today);
      const employeeAttendance = todayAttendance.find(att => att.employeeId === employee?.Id);
      
      if (employeeAttendance && employeeAttendance.checkInTime && !employeeAttendance.checkOutTime) {
        setIsCheckedIn(true);
        setLastCheckIn(employeeAttendance.checkInTime);
      }
    } catch (error) {
      console.error("Error loading status:", error);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(coords);
          setLocationLoading(false);
          resolve(coords);
        },
        (error) => {
          setLocationLoading(false);
          let message = "Unable to retrieve location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information unavailable";
              break;
            case error.TIMEOUT:
              message = "Location request timed out";
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const handleCheckIn = async () => {
    if (!currentEmployee) {
      toast.error("Employee information not available");
      return;
    }

    setIsLoading(true);
    try {
      const locationData = await getCurrentLocation();
      const result = await attendanceService.checkIn(currentEmployee.Id, locationData);
      
      setIsCheckedIn(true);
      setLastCheckIn(format(new Date(), "HH:mm:ss"));
      toast.success("Successfully checked in!");
      
      if (onAttendanceUpdate) {
        onAttendanceUpdate();
      }
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error(error.message || "Failed to check in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentEmployee) {
      toast.error("Employee information not available");
      return;
    }

    setIsLoading(true);
    try {
      const locationData = await getCurrentLocation();
      const result = await attendanceService.checkOut(currentEmployee.Id, locationData);
      
      setIsCheckedIn(false);
      setLastCheckIn(null);
      toast.success("Successfully checked out!");
      
      if (onAttendanceUpdate) {
        onAttendanceUpdate();
      }
    } catch (error) {
      console.error("Check-out error:", error);
      toast.error(error.message || "Failed to check out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="text-center space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Time Clock
          </h2>
          {currentEmployee && (
            <p className="text-gray-600">
              Welcome, {currentEmployee.firstName} {currentEmployee.lastName}
            </p>
          )}
        </div>

        {/* Digital Clock Display */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-4xl md:text-5xl font-mono font-bold text-gray-900 mb-2">
            {format(currentTime, "HH:mm:ss")}
          </div>
          <div className="text-lg text-gray-600">
            {format(currentTime, "EEEE, MMMM d, yyyy")}
          </div>
        </div>

        {/* Status Display */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            isCheckedIn ? "bg-success-100 text-success-700" : "bg-gray-100 text-gray-600"
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isCheckedIn ? "bg-success-500" : "bg-gray-400"
            }`}></div>
            <span className="font-medium">
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </span>
          </div>
          {lastCheckIn && (
            <div className="text-sm text-gray-600">
              Since {lastCheckIn}
            </div>
          )}
        </div>

        {/* Location Status */}
        {locationLoading && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="MapPin" size={16} className="animate-pulse" />
            <span>Getting location...</span>
          </div>
        )}
        
        {location && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="MapPin" size={16} />
            <span>Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isCheckedIn ? (
            <Button
              size="large"
              onClick={handleCheckIn}
              disabled={isLoading}
              className="bg-success-500 hover:bg-success-600 text-white px-8 py-4 text-lg font-semibold min-w-[200px]"
            >
              {isLoading ? (
                <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Clock" size={20} className="mr-2" />
              )}
              Check In
            </Button>
          ) : (
            <Button
              size="large"
              onClick={handleCheckOut}
              disabled={isLoading}
              variant="outline"
              className="border-error-500 text-error-600 hover:bg-error-50 px-8 py-4 text-lg font-semibold min-w-[200px]"
            >
              {isLoading ? (
                <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Clock" size={20} className="mr-2" />
              )}
              Check Out
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-500 bg-white/50 rounded-lg p-3">
          <ApperIcon name="Info" size={16} className="inline mr-1" />
          Location tracking is used for attendance verification. Please ensure location services are enabled.
        </div>
      </div>
    </Card>
  );
};

export default TimeClockWidget;