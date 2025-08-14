import Image1 from "@/assets/images/image1.svg";
import Image2 from "@/assets/images/image2.svg";
import Image3 from "@/assets/images/image3.svg";
import Image4 from "@/assets/images/image4.svg";

export default [
  {
    id: "5765",
    tripName: "رحلة إلى سواحل سوريا",
    description: "رحلة ممتعة لمدة 5 أيام إلى اللاذقية وطرطوس,رحلة ممتعة,",
    images: [Image1, Image2, Image3, Image4],
    company: "تيك أوف",
    date: "22/12/2025",
    price: 50,
    capacity: 1000,
    discount: 50, // percent
    refNumber: "234087920",
    rating: 4.8,
    status:"تم الإلغاء",
    tags: ["طبيعة", "ترفيه", "طرطوس", "اللاذقية", "بالليل"],
    location: {
      address: "اللاذقية، سوريا",
      mapEmbed: "https://maps.google.com/embed?pb=!1m18!...",
    },
    comments: [
      { text: "رحلة رائعة!", author: "أحمد محسن", date: "22/12/2025", rating: 4.5 },
      { text: "المناظر الطبيعية جميلة.", author: "رنا", date: "22/12/2025", rating: 4.5 },
      { text: "المناظر الطبيعية جميلة.", author: "رنا", date: "22/12/2025", rating: 4.5 },
      { text: "المناظر الطبيعية جميلة.", author: "رنا", date: "22/12/2025", rating: 4.5 },
      { text: "المناظر الطبيعية جميلة.", author: "رنا", date: "22/12/2025", rating: 4.5 },
      { text: "المناظر الطبيعية جميلة.", author: "رنا", date: "22/12/2025", rating: 4.5 },
    ],
    days: [
      {
        day: 1,
        activities: [
          { time: "9:00 AM", title: "الوصول إلى اللاذقية",description:"ويبسبوبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنبويسكممنيسكممنبةنيسبةيسنمبةم" },
          { time: "10:30 AM", title: "زيارة الكورنيش" ,description:"ويبسبويسكممنبةنيسبةيسنمبةم"},
          { time: "3:00 PM", title: "الغداء في مطعم محلي" ,description:"ويبسبويسكممنبةنيسبةيسنمبةم"},
          { time: "9:00 AM", title: "الوصول إلى اللاذقية" },
          { time: "10:30 AM", title: "زيارة الكورنيش" },
          { time: "3:00 PM", title: "الغداء في مطعم محلي" },
        ],
      },
      {
        day: 2,
        activities: [
          { time: "9:00 AM", title: "رحلة إلى طرطوس" },
          { time: "1:00 PM", title: "زيارة الميناء" },
        ],
      },
      {
        day: 3,
        activities: [
          { time: "يوم كامل", title: "نشاطات بحرية" },
        ],
      },
      {
        day: 4,
        activities: [
          { time: "يوم حر", title: "استرخاء على الشاطئ" },
        ],
      },
      {
        day: 5,
        activities: [
          { time: "8:00 AM", title: "العودة" },
        ],
      },
    ],
  },
];
