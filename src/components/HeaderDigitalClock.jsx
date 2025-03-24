import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const HeaderDigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (number) => {
    return number < 10 ? `0${number}` : number;
  };

  const hours = formatNumber(time.getHours());
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());

  return (
    <div className="bg-white rounded-full py-2 px-6 flex items-center justify-center shadow-md">
      <div className="font-mono text-2xl font-semibold text-btn-purple flex items-center">
        <span>{hours}</span>
        <span className="mx-1 animate-pulse">:</span>
        <span>{minutes}</span>
        <span className="mx-1 animate-pulse">:</span>
        <span>{seconds}</span>
      </div>
      <Clock className="ml-6 text-btn-purple" />
    </div>
  );
};

export default HeaderDigitalClock;
