export default function ExamQuestionNavigator({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
}) {
  const isAnswered = (question) => {
    const answer = answers[question.id];

    if (answer === undefined || answer === null) {
      return false;
    }

    if (typeof answer === "string") {
      return answer.trim().length > 0;
    }

    return true;
  };

  return (
    <aside className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.15)] lg:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold text-gold">
          أسئلة الاختبار
        </p>

        <h2 className="mt-1 text-lg font-black text-white">
          اختر سؤالًا
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex;
          const answered = isAnswered(question);

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelectQuestion(index)}
              aria-label={`الانتقال إلى السؤال ${index + 1}`}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                text-xs
                font-black
                transition-all
                duration-300
                ${
                  isCurrent
                    ? "border-gold bg-gold text-midnight shadow-[0_8px_20px_rgba(212,175,55,0.16)]"
                    : answered
                      ? "border-gold/30 bg-gold/10 text-gold hover:border-gold/50"
                      : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="grid grid-cols-1 gap-3 text-xs text-white/45 sm:grid-cols-3 lg:grid-cols-1">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gold" />
            السؤال الحالي
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-gold/30 bg-gold/10" />
            تمت الإجابة
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white/10 bg-white/[0.03]" />
            لم تتم الإجابة
          </div>
        </div>
      </div>
    </aside>
  );
}