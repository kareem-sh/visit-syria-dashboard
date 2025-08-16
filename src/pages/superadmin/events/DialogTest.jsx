import React, { useState } from "react";
import SuccessDialog from "@/components/dialog/SuccessDialog.jsx";

export default function DialogTest() {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                Show Success Dialog
            </button>

            <SuccessDialog open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
