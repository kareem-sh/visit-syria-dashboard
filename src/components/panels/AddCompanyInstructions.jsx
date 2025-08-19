// components/panels/AddCompanyInstructions.jsx
import React from "react";
import { Plus } from 'lucide-react';

export default function AddCompanyInstructions({ onAddClick }) {
    const instructionItems = [
        { title: "الترخيص الرسمي:", text: "يجب أن تكون الشركة مرخصة رسميًا من الجهات المختصة بمزاولة النشاط السياحي داخل الجمهورية العربية السورية." },
        { title: "المستندات المطلوبة:", items: ["نسخة من السجل التجاري.", "نسخة من الترخيص السياحي.", "صورة من هوية المالك أو المفوض بالتوقيع.", "عنوان الشركة ومعلومات الاتصال الرسمية (هاتف, بريد إلكتروني)."] },
        { title: "الالتزام بالأنظمة:", items: ["يجب على الشركة الالتزام بجميع اللوائح والأنظمة الصادرة عن وزارة السياحة." , "أي مخالفة مستقبلية قد تؤدي إلى تعليق نشاط الشركة أو إلغاء تسجيلها." ]},
        { title: "صحة المعلومات:", text: "يجب التأكد من أن جميع المعلومات المقدمة صحيحة ومحدثة. تقديم بيانات مضللة سيؤدي إلى رفض الطلب." },
        { title: "المدة المتوقعة لدراسة الطلب:", text: "يتم مراجعة الطلب خلال 10 إلى 15 يوم عمل من تاريخ تقديمه." },
        { title: "التواصل:", text: "سيتم التواصل مع الشركة عبر البريد الإلكتروني أو الهاتف في حال الحاجة إلى مستندات إضافية أو توضيحات." },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col max-h-[90vh]">
            <p className=" text-(--text-paragraph)  text-right text-body-bold-16  pb-4">تعليمات يجب إعلام الشركة بها قبل تسجيل الطلب :</p>
            <div className="overflow-y-auto flex-grow pr-2">
                <ol className="space-y-5">
                    {instructionItems.map((item, index) => (
                        <li key={index} className="flex">
                            <span className="bg-green  text-white rounded-full h-6 w-6 text-sm flex items-center justify-center font-bold mr-4 ml-2 shrink-0 mt-1">{index + 1}</span>
                            <div>
                                <h3 className="font-semibold mt-1 text-gray-700">{item.title}</h3>
                                {item.text && <p className="text-gray-600 text-sm mt-1">{item.text}</p>}
                                {item.items && (
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 text-sm">
                                        {item.items.map((subItem, subIndex) => <li key={subIndex}>{subItem}</li>)}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
            <div>
                <button
                    onClick={onAddClick}
                    className="w-full bg-green text-white py-3 rounded-lg hover:bg-green-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer"
                >
                    <Plus size={20} />
                    إضافة طلب شركة
                </button>
            </div>
        </div>
    );
}