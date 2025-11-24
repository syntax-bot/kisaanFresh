import { useEffect, useState } from "react";

export default function Countdown(endTime) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

  function getTimeLeft(end) {
    const endDate = new Date(end);
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return { expired: true, minutes: 0, seconds: 0 };

    return {
      expired: false,
      minutes: Math.floor(diff / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
}
