import Master1 from "../assets/Master/master 1.webp";
import Master2 from "../assets/Master/master 2.webp";
import Master3 from "../assets/Master/master 3.webp";

const courses = [
  {
    id: "social-studies-preparatory",
    title: "الدراسات الاجتماعية للمرحلة الإعدادية",
    description:
      "شرح مبسط ومنظم يساعدك على فهم الدروس وربط الأحداث بطريقة سهلة وشيقة.",
    grade: "المرحلة الإعدادية",
    duration: "كورس شامل",
    image: Master1,
    lessonsCount: "غير محدد",
    subscriptionPlans: [
      {
        id: "monthly",
        name: "اشتراك شهري",
        price: 150,
        currency: "EGP",
      },
      {
        id: "term",
        name: "اشتراك الترم",
        price: 400,
        currency: "EGP",
      },
    ],
  },

  {
    id: "history-secondary",
    title: "التاريخ للمرحلة الثانوية",
    description:
      "شرح التاريخ بطريقة واضحة مع التركيز على أهم الأحداث والنقاط التي تحتاجها في دراستك.",
    grade: "المرحلة الثانوية",
    duration: "كورس شامل",
    image: Master2,
    lessonsCount: "غير محدد",
    subscriptionPlans: [
      {
        id: "monthly",
        name: "اشتراك شهري",
        price: null,
        currency: "EGP",
      },
      {
        id: "term",
        name: "اشتراك الترم",
        price: null,
        currency: "EGP",
      },
    ],
  },

  {
    id: "history-different-way",
    title: "التاريخ بطريقة مختلفة",
    description:
      "محتوى تعليمي منظم يساعدك على تثبيت المعلومات وفهم التاريخ بصورة أعمق.",
    grade: "محتوى تعليمي",
    duration: "دروس متكاملة",
    image: Master3,
    lessonsCount: "غير محدد",
    subscriptionPlans: [
      {
        id: "monthly",
        name: "اشتراك شهري",
        price: null,
        currency: "EGP",
      },
      {
        id: "term",
        name: "اشتراك الترم",
        price: null,
        currency: "EGP",
      },
    ],
  },
];

export default courses;
