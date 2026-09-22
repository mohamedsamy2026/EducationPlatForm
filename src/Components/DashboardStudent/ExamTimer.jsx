import { useEffect, useRef, useState } from "react";

export default function ExamTimer({ durationMinutes, onTimeUp }) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, Math.floor(Number(durationMinutes) * 60)),
  );

  const endTimeRef = useRef(
    Date.now() + Math.max(0, Number(durationMinutes) * 60 * 1000),
  );

  const timeUpCalledRef = useRef(false);

  useEffect(() => {
    const duration = Math.max(0, Math.floor(Number(durationMinutes) * 60));

    endTimeRef.current = Date.now() + duration * 1000;

    timeUpCalledRef.current = false;

    setRemainingSeconds(duration);

    const updateTimer = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000),
      );

      setRemainingSeconds(secondsLeft);

      if (secondsLeft === 0 && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        onTimeUp?.();
      }
    };

    updateTimer();

    const intervalId = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [durationMinutes, onTimeUp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isCritical = remainingSeconds <= 120;
  const isWarning = remainingSeconds > 60 && remainingSeconds <= 300;

  return (
    <div
      className={`
    flex
    flex-col
    items-center
    justify-center
    w-36
    h-36
    rounded-full
    border-2
    backdrop-blur-md
    transition-all
    duration-300
    shadow-lg
    ${
      isCritical
        ? "border-red-500/50 bg-red-500/10 text-red-400 shadow-red-500/20"
        : isWarning
          ? "border-gold/50 bg-gold/10 text-gold shadow-gold/20"
          : "border-white/20 bg-white/[0.04] text-white"
    }
  `}
      aria-label={`الوقت المتبقي ${formattedTime}`}
    >
      <span className="text-xs font-bold text-white/60">الوقت المتبقي</span>

      <span className="text-2xl font-black tabular-nums tracking-wider">
        {formattedTime}
      </span>
    </div>
  );
}
