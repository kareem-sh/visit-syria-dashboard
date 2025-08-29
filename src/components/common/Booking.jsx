// src/components/bookings/Bookings.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DialogTable from "@/components/common/DialogTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { useAuth } from "@/contexts/AuthContext.jsx"


const filterOptions = [
    { label: "الكل", value: "all" },
    { label: "حسب التاريخ (الأقدم)", value: "oldest" },
    { label: "حسب التاريخ (الأحدث)", value: "latest" },
    { label: "حسب عدد الأشخاص (1-2)", value: "people1_2" },
    { label: "حسب عدد الأشخاص (3-4)", value: "people3_4" },
    { label: "حسب عدد الأشخاص (5+)", value: "people5plus" },
    { label: "حسب المبلغ (أقل من 200$)", value: "amountUnder200" },
    { label: "حسب المبلغ (200$ - 300$)", value: "amount200_300" },
    { label: "حسب المبلغ (أكثر من 300$)", value: "amountAbove300" },
];

const Bookings = ({ data = [] }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [currentFilter, setCurrentFilter] = useState("all");
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();

    /**
     * Map a single booking item (either nested raw API shape or already-flattened shape)
     * into the shape the table & dialog expect (keeps the same keys).
     */
    const mapBookingItem = (b, idx) => {
        // if API raw object with person exists -> pull from nested structure
        if (b && b.person) {
            const person = b.person || {};
            const profile = person.profile || {};
            const bill = b.bill || {};
            const passengers = Array.isArray(b.passengers) ? b.passengers : [];

            const id = person.user_id ?? person.id ?? `guest_${idx}`;
            const userName =
                (profile.first_name || profile.last_name)
                    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                    : person.email ?? "مجهول";

            const ticketsCount = Number(bill.number_of_tickets ?? 0);
            const totalPrice = Number(bill.total_price ?? 0);
            const ticketPrice = Number(bill.price ?? 0);

            return {
                // table fields (kept exactly as keys you use)
                id,
                userName,
                bookingDate: b.bookingDate ?? b.created_at ?? null,
                amount: Number(totalPrice), // المبلغ -> bill.total_price
                peopleCount: ticketsCount, // عدد الأشخاص -> bill.number_of_tickets

                // dialog / extras (kept for rest of UI)
                email: person.email ?? "-",
                phone: profile.phone ?? "-",
                birthDate: profile.date_of_birth ?? "-",
                nationality: profile.country ?? "-",
                companions: passengers.map((p) => ({
                    fullName: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || p.name || p.email || "-",
                    birthDate: p.birth_date || p.date_of_birth || p.dob || "-",
                    nationality: p.nationality || p.country || "-",
                })),
                invoice: {
                    ticketsCount,
                    ticketPrice,
                    totalPrice,
                },
                refNumber: b.refNumber ?? b.booking_ref ?? null,
                raw: b,
            };
        }

        // else if item already flattened - keep compatibility
        return {
            id: b.id ?? b.user_id ?? `guest_${idx}`,
            userName: b.userName ?? b.name ?? b.email ?? "مجهول",
            bookingDate: b.bookingDate ?? b.created_at ?? null,
            amount: Number(b.amount ?? b.total_price ?? (b.invoice?.totalPrice ?? 0)),
            peopleCount: Number(b.peopleCount ?? b.passengersCount ?? b.invoice?.ticketsCount ?? 0),

            email: b.email ?? "-",
            phone: b.phone ?? "-",
            birthDate: b.date_of_birth ?? "-",
            nationality: b.nationality ?? "-",
            companions: Array.isArray(b.companions)
                ? b.companions
                : (Array.isArray(b.passengers)
                    ? b.passengers.map((p) => ({
                        fullName: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || p.name || p.email || "-",
                        birthDate: p.birth_date || p.date_of_birth || p.dob || "-",
                        nationality: p.nationality || b.country || "-",
                    }))
                    : []),
            invoice: b.invoice ?? { ticketsCount: b.tickets ?? 0, ticketPrice: b.price ?? 0, totalPrice: b.total_price ?? b.amount ?? 0 },
            refNumber: b.refNumber ?? b.booking_ref ?? null,
            raw: b,
        };
    };

    const normalized = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data.map(mapBookingItem);
    }, [data]);

    useEffect(() => {
        setFilteredData(normalized);
    }, [normalized]);

    const handleFilterChange = useCallback(
        (filterValue) => {
            setCurrentFilter(filterValue);
            let newData = [...(normalized || [])];
            switch (filterValue) {
                case "latest":
                    newData.sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0));
                    break;
                case "oldest":
                    newData.sort((a, b) => new Date(a.bookingDate || 0) - new Date(b.bookingDate || 0));
                    break;
                case "people1_2":
                    newData = newData.filter((item) => (item.peopleCount ?? (item.companions?.length ?? 0)) >= 1 && (item.peopleCount ?? (item.companions?.length ?? 0)) <= 2);
                    break;
                case "people3_4":
                    newData = newData.filter((item) => (item.peopleCount ?? (item.companions?.length ?? 0)) >= 3 && (item.peopleCount ?? (item.companions?.length ?? 0)) <= 4);
                    break;
                case "people5plus":
                    newData = newData.filter((item) => (item.peopleCount ?? (item.companions?.length ?? 0)) >= 5);
                    break;
                case "amountUnder200":
                    newData = newData.filter((item) => parseFloat(item.amount) < 200);
                    break;
                case "amount200_300":
                    newData = newData.filter((item) => {
                        const amt = parseFloat(item.amount);
                        return amt >= 200 && amt <= 300;
                    });
                    break;
                case "amountAbove300":
                    newData = newData.filter((item) => parseFloat(item.amount) > 300);
                    break;
                default:
                    newData = [...(normalized || [])];
            }
            setFilteredData(newData);
        },
        [normalized]
    );

    const safe = (val, fallback = "") => (val !== undefined && val !== null ? val : fallback);

    const arabicOrdinals = [
        "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر",
        "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر", "السادس عشر", "السابع عشر",
        "الثامن عشر", "التاسع عشر", "العشرون",
    ];
    const getArabicOrdinal = (i) => arabicOrdinals[i] ?? `${i + 1}`;

    return (
        <div className="w-full p-0 m-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
                <h1 className="text-h1-bold-24 text-gray-800">الحجوزات</h1>
                <SortFilterButton
                    options={filterOptions.map((opt) => opt.label)}
                    selectedValue={currentFilter}
                    position="left"
                    onChange={(label) => {
                        const matched = filterOptions.find((f) => f.label === label);
                        if (matched) handleFilterChange(matched.value);
                    }}
                />
            </div>

            <DialogTable
                columns={[
                    { header: "الرقم التعريفي", accessor: "id" },
                    { header: "اسم المستخدم", accessor: "userName" },
                    { header: "تاريخ الحجز", accessor: "bookingDate" },
                    { header: "المبلغ", accessor: "amount" },
                    { header: "عدد الأشخاص", accessor: "peopleCount" },
                ]}
                data={filteredData}
                title=""
                dialogTitle="تفاصيل الحجز"
                renderDialogContent={(booking, onClose) => {
                    const id = safe(booking.id, "#12345");
                    const refNumber = safe(booking.refNumber, "49862389");
                    const ownerName = safe(booking.userName, "أحمد محسن");
                    const ownerEmail = safe(booking.email, "ahmedmohsen@gmail.com");
                    const ownerPhone = safe(booking.phone, "+963 933 333 333");
                    const ownerBirth = safe(booking.birthDate, "22/07/1970");
                    const ownerNationality = safe(booking.nationality, "سوريا");
                    const peopleCount = safe(booking.peopleCount, booking.companions?.length ?? 4);
                    const amount = safe(booking.amount, booking.invoice?.totalPrice ?? 200);

                    const companions =
                        Array.isArray(booking.companions) && booking.companions.length
                            ? booking.companions
                            : [
                                { fullName: "أحمد محسن", birthDate: "22/07/1970", nationality: "سوريا" },
                            ];

                    const invoice = booking.invoice || { ticketsCount: peopleCount, ticketPrice: 50, totalPrice: amount };

                    return (
                        <div dir="rtl" className="max-w-3xl mx-auto py-5 text-right">
                            <div className="flex items-start justify-between my-6">
                                <div className="text-right">
                                    <h2 className="text-h1-bold-32 text-green">معلومات الحجز</h2>
                                    <p className="text-sm pt-3 text-(--text-paragraph) mt-1">الرقم التعريفي: {id}</p>
                                    <h2 className="text-h1-bold-24 mt-6 text-(--text-title)">صاحب الحجز</h2>
                                </div>

                                <button onClick={() => onClose && onClose()} aria-label="إغلاق" className="text-gray-700 hover:text-black transition duration-150 ease-in-out">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-5">
                                <div>
                                    <p className="text-body-bold-16">الاسم الكامل</p>
                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{ownerName}</p>

                                    <p className="text-body-bold-16 mt-4">البريد الالكتروني</p>
                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{ownerEmail}</p>
                                </div>

                                <div>
                                    <p className="text-body-bold-16">تاريخ الولادة</p>
                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{ownerBirth}</p>

                                    <p className="text-body-bold-16 mt-4">رقم الهاتف</p>
                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{ownerPhone}</p>
                                </div>

                                <div>
                                    <p className="text-body-bold-16">الجنسية</p>
                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{ownerNationality}</p>
                                </div>
                            </div>

                            {/* Only show button if user is super admin */}
                            {isSuperAdmin && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => navigate(`/users/${refNumber}`)}
                                        className="w-full inline-block text-h2-bold-16 bg-green hover:shadow-md cursor-pointer text-(--text-title-inverse) py-3 px-6 rounded-lg"
                                    >
                                        الانتقال لصفحة المعلومات الشخصية
                                    </button>
                                </div>
                            )}

                            <div className="border-t border-gray-500/20 mt-8 mb-12" />

                            <div className="mb-6">
                                {companions.map((c, idx) => {
                                    const compName = safe(c.fullName, "أحمد محسن");
                                    const compBirth = safe(c.birthDate, "22/07/1970");
                                    const compNat = safe(c.nationality, "سوريا");
                                    return (
                                        <div key={idx} className="mb-6">
                                            <h3 className="text-h1-bold-22 my-8 text-(--text-title)">{`المرافق ${getArabicOrdinal(idx)}`}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                                <div>
                                                    <p className="text-body-bold-16">الاسم الكامل</p>
                                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{compName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-body-bold-16">تاريخ الولادة</p>
                                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{compBirth}</p>
                                                </div>
                                                <div>
                                                    <p className="text-body-bold-16">الجنسية</p>
                                                    <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{compNat}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-500/20 mt-8 mb-12" />

                            <div>
                                <h3 className="text-h1-bold-24 mb-10 text-(--text-title)">الفاتورة</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                    <div>
                                        <p className="text-body-bold-16">عدد التذاكر</p>
                                        <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{invoice.ticketsCount ?? peopleCount}</p>
                                    </div>

                                    <div>
                                        <p className="text-body-bold-16">سعر التذكرة</p>
                                        <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{invoice.ticketPrice ? `${invoice.ticketPrice}$` : `50$`}</p>
                                    </div>

                                    <div>
                                        <p className="text-body-bold-16">السعر الاجمالي</p>
                                        <p className="text-body-regular-14 text-(--text-paragraph) mt-2">{invoice.totalPrice ? `${invoice.totalPrice}$` : `${amount}$`}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4" />
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default Bookings;
