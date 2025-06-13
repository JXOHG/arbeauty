import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { API_URL } from "../config";

const VacationNotificationBanner = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [vacationInfo, setVacationInfo] = useState(null);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get vacation period string
  const getVacationPeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric'
    });
    
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} through ${endFormatted}`;
  };

  useEffect(() => {
    const fetchVacationStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vacation-status`);
        const data = await response.json();
        
        setVacationInfo(data);
        setShowNotification(data.showNotification && !isDismissed);
      } catch (error) {
        console.error('Error fetching vacation status:', error);
      }
    };

    // Check immediately
    fetchVacationStatus();

    // Check every hour to ensure accuracy
    const interval = setInterval(fetchVacationStatus, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowNotification(false);
  };

  if (!showNotification || !vacationInfo) return null;

  // Different styling and messaging based on whether we're currently on vacation
  const isCurrentlyOnVacation = vacationInfo.isCurrentlyOnVacation;
  const bgColor = isCurrentlyOnVacation 
    ? "bg-gradient-to-r from-red-500 to-orange-500"
    : "bg-gradient-to-r from-blue-500 to-purple-500";
    
  const Icon = isCurrentlyOnVacation ? Calendar : Clock;
  const vacationPeriod = getVacationPeriod(vacationInfo.vacationStart, vacationInfo.vacationEnd);

  return (
    <div className={`${bgColor} text-white px-4 py-3 shadow-lg`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            {isCurrentlyOnVacation ? (
              <>
                <p className="text-sm font-medium">
                  <strong>{vacationInfo.message}</strong> - {vacationPeriod}
                </p>
                <p className="text-xs opacity-90">
                  We'll be back on {vacationInfo.returnDate}! Thank you for your patience.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  <strong>Upcoming Vacation Notice</strong> - {vacationInfo.message} {vacationPeriod}
                </p>
                <p className="text-xs opacity-90">
                  Plan ahead! We'll be back on {vacationInfo.returnDate}. Book your appointments before or after our vacation.
                </p>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 transition-colors ml-4"
          aria-label="Dismiss vacation notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VacationNotificationBanner;