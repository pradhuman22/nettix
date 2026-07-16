import { useEffect, useState } from "react";

export function useResendOtp(seconds: number) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  function start() {
    setRemaining(seconds);
  }

  return {
    remaining,
    start,
    canResend: remaining <= 0,
  };
}
