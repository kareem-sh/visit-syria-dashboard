
import Image1 from "@/assets/images/image1.svg";
import Image2 from "@/assets/images/image2.svg";
import Image3 from "@/assets/images/image3.svg";
import Image4 from "@/assets/images/image4.svg";

export const demoData = [
    {
        id: "1",
        type: "restaurant",
        name: "بيت حلب",
        city_id: 1,
        description: "أشهر مطاعم حلب يقدم المأكولات الحلبية الأصيلة.",
        number_of_branches: 3,
        phone: "933111111",
        country_code: "+963",
        place: "سوق الجميلية",
        longitude: "37.1340000",
        latitude: "36.2020000",
        rating: 2.5,
        classification: null,
        images: [Image1, Image2, Image3, Image4],
        recent_comments: [
            {
                id: 1,
                user_id: 3,
                user_name: "maya maya",
                user_avatar:
                    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Aleppo_Citadel.jpg",
                body: "التنظيف يحتاج إلى تحسين بسيط.",
                created_at: "2025-08-17",
                rating_value: 4
            },
            {
                id: 2,
                user_id: 4,
                user_name: "maher maher",
                user_avatar:
                    "https://upload.wikimedia.org/wikipedia/commons/3/3b/Palmyra_ancient_ruins.jpg",
                body: "الطعام لذيذ والأسعار مناسبة.",
                created_at: "2025-08-17",
                rating_value: 1
            }
        ]
    },
    {
        id: "000007",
        city_id: 1,
        type: "hotel",
        name: "فندق حلب الدولي",
        description: "فندق فاخر قرب قلعة حلب الأثرية.",
        number_of_branches: 1,
        phone: "944222222",
        country_code: "+963",
        place: "ساحة سعد الله الجابري",
        longitude: "37.1580000",
        latitude: "36.2120000",
        rating: 2.5,
        classification: null,
        images: [],
        rank: null,
        is_saved: null,
        user_rating: null,
        user_comment: null,
        recent_comments: [
            {
                id: 13,
                user_id: 3,
                user_name: "maya maya",
                user_avatar: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Aleppo_Citadel.jpg",
                body: "بعض الأصناف كانت غير متوفرة عند الزيارة.",
                created_at: "2025-08-17",
                rating_value: 1
            },
            {
                id: 14,
                user_id: 4,
                user_name: "maher maher",
                user_avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Palmyra_ancient_ruins.jpg",
                body: "الجو هادئ والموظفون ودودون.",
                created_at: "2025-08-17",
                rating_value: 4
            }
        ],
        created_at: "2025-08-17T08:07:54.000000Z",
        updated_at: "2025-08-17T08:07:54.000000Z"
    },
    {
        id: "3",
        type: "tourist",
        name: "الجامع الأموي",
        description: "أحد أقدم وأجمل المساجد في العالم الإسلامي.",
        number_of_branches: 1,
        phone: null,
        country_code: null,
        place: "المركز القديم",
        longitude: "36.3060000",
        latitude: "33.5120000",
        rating: 2,
        classification: "أثرية",
        images: [],
        recent_comments: []
    }
];

// helper
export function getDataByType(type) {
    return demoData[type] || [];
}
