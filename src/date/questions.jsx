const questions = [
  {
    id: "question-1",
    examId: "exam-1",
    type: "multiple-choice",
    question: "أين تقع مصر بالنسبة لقارات العالم القديم؟",
    options: [
      "في قارة آسيا فقط",
      "في قارة أفريقيا وتمتد إلى آسيا",
      "في قارة أوروبا",
      "في قارة أمريكا الشمالية",
    ],
    correctAnswer: 1,
    score: 1,
    order: 1,
  },

  {
    id: "question-2",
    examId: "exam-1",
    type: "multiple-choice",
    question: "ما أهمية موقع مصر الجغرافي؟",
    options: [
      "لأنها بعيدة عن طرق التجارة",
      "لأنها تربط بين قارات ومناطق مهمة",
      "لأنها لا تطل على بحار",
      "لأنها تقع بالكامل في أوروبا",
    ],
    correctAnswer: 1,
    score: 1,
    order: 2,
  },

  {
    id: "question-3",
    examId: "exam-1",
    type: "multiple-choice",
    question: "ما البحر الذي يحد مصر من الشمال؟",
    options: [
      "البحر الأحمر",
      "البحر المتوسط",
      "بحر العرب",
      "البحر الأسود",
    ],
    correctAnswer: 1,
    score: 1,
    order: 3,
  },

  {
    id: "question-4",
    examId: "exam-1",
    type: "multiple-choice",
    question: "ما النهر الذي ارتبط بقيام الحضارة المصرية القديمة؟",
    options: [
      "نهر دجلة",
      "نهر الفرات",
      "نهر النيل",
      "نهر الأردن",
    ],
    correctAnswer: 2,
    score: 1,
    order: 4,
  },

  {
    id: "question-5",
    examId: "exam-1",
    type: "multiple-choice",
    question: "أي من الآتي يعد من مظاهر الحضارة المصرية القديمة؟",
    options: [
      "الأهرامات",
      "ناطحات السحاب الحديثة",
      "القطارات الكهربائية",
      "الأقمار الصناعية",
    ],
    correctAnswer: 0,
    score: 1,
    order: 5,
  },

  {
    id: "question-6",
    examId: "exam-1",
    type: "multiple-choice",
    question: "ما العامل الذي ساعد على استقرار السكان في وادي النيل؟",
    options: [
      "توافر المياه",
      "قلة الأراضي الزراعية",
      "عدم وجود نهر",
      "الابتعاد عن مصادر المياه",
    ],
    correctAnswer: 0,
    score: 1,
    order: 6,
  },

  {
    id: "question-7",
    examId: "exam-1",
    type: "multiple-choice",
    question: "ما الذي ساعد المصريين القدماء على ممارسة الزراعة؟",
    options: [
      "مياه النيل",
      "قلة المياه",
      "الثلوج",
      "الأمطار الغزيرة طوال العام",
    ],
    correctAnswer: 0,
    score: 1,
    order: 7,
  },

  {
    id: "question-8",
    examId: "exam-1",
    type: "multiple-choice",
    question: "ما المقصود بالموقع الجغرافي؟",
    options: [
      "موقع المكان بالنسبة للأماكن المحيطة به",
      "عدد سكان المكان فقط",
      "مساحة المكان فقط",
      "مناخ المكان فقط",
    ],
    correctAnswer: 0,
    score: 1,
    order: 8,
  },

  {
    id: "question-9",
    examId: "exam-1",
    type: "multiple-choice",
    question: "أي من الآتي ساعد مصر على التواصل مع مناطق مختلفة؟",
    options: [
      "موقعها الجغرافي",
      "انعزالها التام",
      "بعدها عن طرق التجارة",
      "عدم وجود سواحل",
    ],
    correctAnswer: 0,
    score: 1,
    order: 9,
  },

  {
    id: "question-10",
    examId: "exam-1",
    type: "multiple-choice",
    question: "أين يوجد وادي النيل في مصر بصورة أساسية؟",
    options: [
      "حول نهر النيل",
      "في الصحراء الغربية فقط",
      "في سيناء فقط",
      "على ساحل البحر المتوسط فقط",
    ],
    correctAnswer: 0,
    score: 1,
    order: 10,
  },

  {
    id: "question-11",
    examId: "exam-1",
    type: "true-false",
    question: "مصر تطل على البحر المتوسط والبحر الأحمر.",
    correctAnswer: true,
    score: 1,
    order: 11,
  },

  {
    id: "question-12",
    examId: "exam-1",
    type: "true-false",
    question: "نهر النيل ليس له علاقة بقيام الحضارة المصرية القديمة.",
    correctAnswer: false,
    score: 1,
    order: 12,
  },

  {
    id: "question-13",
    examId: "exam-1",
    type: "true-false",
    question: "يساعد الموقع الجغرافي لمصر على التواصل بين مناطق مختلفة.",
    correctAnswer: true,
    score: 1,
    order: 13,
  },

  {
    id: "question-14",
    examId: "exam-1",
    type: "essay",
    question: "وضح أهمية نهر النيل في قيام الحضارة المصرية القديمة.",
    score: 2,
    order: 14,
  },

  {
    id: "question-15",
    examId: "exam-1",
    type: "essay",
    question: "اشرح أهمية الموقع الجغرافي لمصر.",
    score: 2,
    order: 15,
  },

  {
    id: "question-16",
    examId: "exam-1",
    type: "essay",
    question: "اذكر أهم مظاهر الحضارة المصرية القديمة واشرح أحدها.",
    score: 2,
    order: 16,
  },

  {
    id: "question-17",
    examId: "exam-1",
    type: "essay",
    question: "وضح أثر البيئة الجغرافية في حياة المصريين القدماء.",
    score: 2,
    order: 17,
  },

  {
    id: "question-18",
    examId: "exam-1",
    type: "essay",
    question: "كيف ساعدت الزراعة على استقرار المجتمع المصري القديم؟",
    score: 2,
    order: 18,
  },

  // =========================
  // Exam 2
  // =========================

  {
    id: "question-19",
    examId: "exam-2",
    type: "multiple-choice",
    question: "ما المقصود بالحضارة؟",
    options: [
      "كل ما يقدمه الإنسان من إنجازات مادية ومعنوية",
      "عدد السكان فقط",
      "مساحة الدولة فقط",
      "المناخ فقط",
    ],
    correctAnswer: 0,
    score: 1,
    order: 1,
  },

  {
    id: "question-20",
    examId: "exam-2",
    type: "multiple-choice",
    question: "من أشهر آثار الحضارة المصرية القديمة:",
    options: [
      "الأهرامات",
      "برج إيفل",
      "سور الصين",
      "الكولوسيوم",
    ],
    correctAnswer: 0,
    score: 1,
    order: 2,
  },

  {
    id: "question-21",
    examId: "exam-2",
    type: "multiple-choice",
    question: "ما الذي ساعد المصريين القدماء على معرفة مواعيد الزراعة؟",
    options: [
      "مراقبة فيضان النيل",
      "الابتعاد عن النيل",
      "قلة الزراعة",
      "عدم الاهتمام بالبيئة",
    ],
    correctAnswer: 0,
    score: 1,
    order: 3,
  },

  {
    id: "question-22",
    examId: "exam-2",
    type: "multiple-choice",
    question: "من أهم مظاهر الحياة الاقتصادية عند المصريين القدماء:",
    options: [
      "الزراعة",
      "صناعة الطائرات",
      "البرمجة",
      "الطباعة الرقمية",
    ],
    correctAnswer: 0,
    score: 1,
    order: 4,
  },

  {
    id: "question-23",
    examId: "exam-2",
    type: "true-false",
    question: "اعتمد المصريون القدماء على نهر النيل في حياتهم اليومية.",
    correctAnswer: true,
    score: 1,
    order: 5,
  },

  {
    id: "question-24",
    examId: "exam-2",
    type: "true-false",
    question: "كانت الحضارة المصرية القديمة قائمة على الزراعة فقط دون أي أنشطة أخرى.",
    correctAnswer: false,
    score: 1,
    order: 6,
  },

  {
    id: "question-25",
    examId: "exam-2",
    type: "essay",
    question: "وضح أهم العوامل التي ساعدت على قيام الحضارة المصرية القديمة.",
    score: 2,
    order: 7,
  },

  {
    id: "question-26",
    examId: "exam-2",
    type: "essay",
    question: "اشرح أهمية الزراعة في حياة المصريين القدماء.",
    score: 2,
    order: 8,
  },
];

export default questions;