import { useEffect, useRef, useState } from "react";

export default function ExamTimer({
  durationMinutes,
  onTimeUp,
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, Math.floor(Number(durationMinutes) * 60)),
  );

  const endTimeRef = useRef(
    Date.now() + Math.max(0, Number(durationMinutes) * 60 * 1000),
  );

  const timeUpCalledRef = useRef(false);

  useEffect(() => {
    const duration = Math.max(
      0,
      Math.floor(Number(durationMinutes) * 60),
    );

    endTimeRef.current = Date.now() + duration * 1000;
    timeUpCalledRef.current = false;
    setRemainingSeconds(duration);

    const updateTimer = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil(
          (endTimeRef.current - Date.now()) / 1000,
        ),
      );

      setRemainingSeconds(secondsLeft);

      if (secondsLeft === 0 && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        onTimeUp?.();
      }
    };

    updateTimer();

    const intervalId = window.setInterval(
      updateTimer,
      1000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [durationMinutes, onTimeUp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isCritical = remainingSeconds <= 60;
  const isWarning =
    remainingSeconds > 60 && remainingSeconds <= 300;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-3
        rounded-xl
        border
        px-4
        py-3
        text-sm
        font-black
        backdrop-blur-md
        transition-colors
        duration-300
        ${
          isCritical
            ? "border-red-400/30 bg-red-500/10 text-red-300"
            : isWarning
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-white/10 bg-white/[0.04] text-white"
        }
      `}
      aria-label={`الوقت المتبقي ${formattedTime}`}
    >
      <span className="text-xs font-bold text-white/40">
        الوقت المتبقي
      </span>

      <span className="tabular-nums tracking-wider">
        {formattedTime}
      </span>
    </div>
  );
}