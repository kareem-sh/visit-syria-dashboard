import React, { useState } from "react";
import ReusableFormDialog from "@/components/dialog/ReusableFormDialog";

const DialogTest = () => {
    const [open, setOpen] = useState(true); // start open

    const fields = [
        { key: "eventName", label: "اسم الحدث", type: "text", required: true },
        { key: "description", label: "الوصف", type: "textarea", required: true, maxLength: 1000 },
        { key: "location", label: "الموقع", type: "text" }, // just text for now
    ];

    const handleSubmit = (data) => {
        console.log("Form submitted:", data);
        setOpen(false);
    };

    return (
        <div>
            {open && (
                <ReusableFormDialog
                    title="اختبار النموذج"
                    fields={fields}
                    onClose={() => setOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}
            {!open && <button onClick={() => setOpen(true)}>فتح النموذج مرة أخرى</button>}
        </div>
    );
};

export default DialogTest;
