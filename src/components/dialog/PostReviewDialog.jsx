import React from 'react';
import { X, User, Check, XIcon } from 'lucide-react';

// This file is a self-contained React application.
// To run it:
// 1. Create a new React project (e.g., using Vite: `npm create vite@latest my-app -- --template react`).
// 2. Navigate into the project folder (`cd my-app`).
// 3. Install Tailwind CSS and lucide-react: `npm install -D tailwindcss postcss autoprefixer && npm install lucide-react`.
// 4. Initialize Tailwind: `npx tailwindcss init -p`.
// 5. Configure `tailwind.config.js` to include your source files.
// 6. Add Tailwind directives to your main CSS file (`src/index.css`).
// 7. Replace the contents of `src/App.jsx` with this code.
// 8. Run the development server: `npm run dev`.

// Reusable Tag component for clarity
const Tag = ({ children }) => (
    <span className="bg-slate-100 text-slate-600 text-sm font-medium px-4 py-1.5 rounded-full">
    {children}
  </span>
);

// The main Dialog component provided by you
const PostReviewDialog = () => {
    return (
        // Overlay: Fills the entire screen with a semi-transparent background
        <div className="bg-slate-800/60 fixed inset-0 flex items-center justify-center p-4 font-sans">
            {/* Dialog Box: The main container for the dialog content */}
            <div
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl relative flex flex-col gap-5"
                dir="rtl" // Sets the text direction to right-to-left for Arabic
            >
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-slate-800">المنشور</h2>
                        <p className="text-sm text-slate-500 mt-1">تاريخ تقديم الطلب: 26/5/2025</p>
                    </div>
                    {/* Close Button */}
                    <button className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* User Information Section */}
                <div className="flex items-center justify-end gap-3">
                    <span className="font-semibold text-slate-700">أحمد محسن</span>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                        <User size={20} className="text-slate-500" />
                    </div>
                </div>

                {/* Main Image */}
                <img
                    src="https://i.imgur.com/G4PCD8y.jpeg"
                    alt="Water wheel in a lush garden"
                    className="rounded-xl w-full object-cover aspect-[16/9]"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x338/e2e8f0/475569?text=Image+Not+Found'; }}
                />

                {/* Description Text */}
                <p className="text-slate-600 text-right leading-relaxed">
                    بينتجت حستحبدسدسبربيهج حتجسبدحهمحتدحتحسدتحسدبريمحت دحتكسبدحبرتحسدبتحه ححتكسبدحبرتسهديث حهدحنسبدبتحيمهت ههدحنسبهب بينتجت حستحبدسدسبربيهج حتجسبدحهمحتدحتحسدتحسدبريمحت دحتكسبدحبرتحسدبتحه.
                </p>

                {/* Tags Section */}
                <div className="flex flex-wrap justify-end gap-2">
                    <Tag>أثرية</Tag>
                    <Tag>طبيعية</Tag>
                    <Tag>ترفيهية</Tag>
                    <Tag>دينية</Tag>
                    <Tag>تاريخية</Tag>
                    <Tag>ثقافية</Tag>
                </div>

                {/* Action Buttons Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {/* Accept Button */}
                    <button className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-white font-bold text-base transition-opacity hover:opacity-90 bg-teal-500">
                        <div className="bg-black/20 w-6 h-6 rounded-full flex items-center justify-center">
                            <Check size={16} />
                        </div>
                        <span>قبول</span>
                    </button>
                    {/* Reject Button */}
                    <button className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-white font-bold text-base transition-opacity hover:opacity-90 bg-red-600">
                        <div className="bg-black/20 w-6 h-6 rounded-full flex items-center justify-center">
                            <XIcon size={16} />
                        </div>
                        <span>رفض</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
