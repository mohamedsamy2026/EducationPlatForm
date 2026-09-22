import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

export default function ExamQuestionCard({
  question,
  selectedAnswer,
  onAnswerChange,
}) {
  const renderMultipleChoice = () => {  
    return (
      <div className="mt-6 grid grid-cols-1 gap-3">
        {question.options?.map((option, index) => {
          const isSelected =
            String(selectedAnswer) === String(index);

          return (
            <button
              key={`${question.id}-option-${index}`}
              type="button"
              onClick={() => onAnswerChange(index)}
              className={`
                cursor-pointer
                group
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                border
                px-4
                py-4
                text-right
                transition-all
                duration-300
                ${
                  isSelected
                    ? "border-gold/40 bg-gold/10 text-white shadow-[0_8px_25px_rgba(212,175,55,0.08)]"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-gold/20 hover:bg-white/[0.05] hover:text-white"
                }
              `}
            >
              <span
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  text-sm
                  font-black
                  transition-all
                  duration-300
                  ${
                    isSelected
                      ? "border-gold/40 bg-gold text-midnight"
                      : "border-white/10 bg-white/[0.03] text-white/45 group-hover:border-gold/20 group-hover:text-gold"
                  }
                `}
              >
                {String.fromCharCode(1575 + index)}
              </span>

              <span className="flex-1 text-sm font-bold leading-7 sm:text-base">
                {option}
              </span>

              <span
                className={`
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  duration-300
                  ${
                    isSelected
                      ? "border-gold bg-gold text-midnight"
                      : "border-white/20 text-transparent"
                  }
                `}
              >
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-[11px]"
                />
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = () => {
    const choices = [
      {
        value: true,
        label: "صح",
      },
      {
        value: false,
        label: "خطأ",
      },
    ];

    return (
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {choices.map((choice) => {
          const isSelected =
            selectedAnswer === choice.value;

          return (
            <button
              key={choice.label}
              type="button"
              onClick={() => onAnswerChange(choice.value)}
              className={`
                flex
                min-h-14
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                px-5
                py-4
                text-sm
                font-extrabold
                transition-all
                duration-300
                ${
                  isSelected
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-white/10 bg-white/[0.03] text-white/65 hover:border-gold/20 hover:bg-white/[0.05] hover:text-white"
                }
              `}
            >
              <span
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-xs
                  ${
                    isSelected
                      ? "bg-gold text-midnight"
                      : "bg-white/[0.05] text-white/40"
                  }
                `}
              >
                {choice.value ? "✓" : "×"}
              </span>

              {choice.label}
            </button>
          );
        })}
      </div>
    );
  };

  const renderEssay = () => {
    return (
      <div className="relative mt-6">
        <div className="absolute right-4 top-4 text-gold/60">
          <FontAwesomeIcon icon={faPen} />
        </div>

        <textarea
          value={selectedAnswer ?? ""}
          onChange={(event) =>
            onAnswerChange(event.target.value)
          }
          placeholder="اكتب إجابتك هنا..."
          rows={7}
          className="
            w-full
            resize-y
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            px-12
            py-4
            text-md
            font-bold
            leading-8
            text-white
            outline-none
            transition-all
            duration-300
            placeholder:text-white/25
            focus:border-gold/30
            focus:bg-white/[0.04]
            focus:ring-0
          "
        />
      </div>
    );
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.15)] sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-sm font-black text-gold">
            {question.order}
          </div>

          <div>
            <p className="text-xs font-bold text-gold">
              السؤال رقم {question.order}
            </p>

            <h2 className="mt-2 text-lg font-black leading-8 text-white sm:text-xl">
              {question.question}
            </h2>
          </div>
        </div>

        <span className="shrink-0 self-start rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/45">
          {question.score}{" "}
          {Number(question.score) === 1 ? "درجة" : "درجات"}
        </span>
      </div>

      {question.type === "multiple-choice" &&
        renderMultipleChoice()}

      {question.type === "true-false" &&
        renderTrueFalse()}

      {question.type === "essay" && renderEssay()}
    </article>
  );
}