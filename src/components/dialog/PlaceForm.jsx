import React, { useState, useRef, useEffect } from "react";
import {
  X as XIcon,
  Trash2,
  Paperclip,
  Check,
  ChevronDown,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import MapSearchPicker from "@/components/common/MapSearchPicker";
import "leaflet/dist/leaflet.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/components/dialog/PlaceForm.css";
import { toast } from "react-toastify";

const initialForm = {
  type: "restaurant",
  name: "",
  city_name: "",
  phone: "",
  country_code: "+963",
  number_of_branches: 1,
  description: "",
  place: "",
  lat: 33.5138,
  lon: 36.2765,
  images: [],
  classification: null,
};

const placeTypeLabels = {
  restaurant: "مطعم",
  hotel: "فندق",
  tourist: "مكان سياحي",
};

const cities = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطус",
  "ادلب",
  "الرقة",
  "دير الزور",
  "الحسكة",
  "درعا",
  "السويداء",
];

// Must match backend allowed values exactly
const touristTags = [
  "ثقافية",
  "تاريخية",
  "دينية",
  "ترفيهية",
  "طبيعية",
  "اثرية", // spelling must match backend validator
];

const toAbsoluteUrl = (u) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `${window.location.origin}${u.startsWith("/") ? u : `/${u}`}`;
};

export default function PlaceForm({
                                    onClose,
                                    onSuccess,
                                    submitFn,
                                    initialData = null,
                                    isEdit = false,
                                    isLoading = false,
                                  }) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      const matchCity = cities.find(
          (c) =>
              (initialData.city_name &&
                  (c === initialData.city_name ||
                      c.toLowerCase() === initialData.city_name.toLowerCase())) ||
              (initialData.city &&
                  (c === initialData.city ||
                      c.toLowerCase() === initialData.city.toLowerCase()))
      );

      const images = (initialData.images || []).map((img) => {
        if (typeof img === "string") {
          return { id: null, url: toAbsoluteUrl(img), file: null };
        }
        const url = toAbsoluteUrl(img.url || img.path || img.thumbnail || "");
        return { id: img.id ?? null, url, file: null };
      });

      return {
        type: initialData.type ?? initialForm.type,
        name: initialData.name ?? "",
        city_name: matchCity ?? initialData.city_name ?? initialData.city ?? "",
        phone: initialData.phone ?? "",
        country_code: initialData.country_code ?? "+963",
        number_of_branches: initialData.number_of_branches ?? 1,
        description: initialData.description ?? "",
        place: initialData.place ?? "",
        lat: initialData.latitude ?? initialData.lat ?? initialForm.lat,
        lon: initialData.longitude ?? initialData.lon ?? initialForm.lon,
        images,
        classification: initialData.classification ?? null,
      };
    }
    return { ...initialForm };
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const convertedExistingRef = useRef(false); // prevent repeat conversion

  useEffect(() => {
    // revoke blob URLs on unmount / when images change
    return () => {
      formData.images.forEach((img) => {
        if (img.file && img.url && img.url.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(img.url);
          } catch {}
        }
      });
    };
  }, [formData.images]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (formData.type !== "tourist" && formData.classification) {
      setFormData((p) => ({ ...p, classification: null }));
    }
    if (formData.type === "tourist") {
      setErrors((prev) => {
        const { number_of_branches, phone, ...rest } = prev;
        return rest;
      });
    }
  }, [formData.type]);

  /**
   * NEW: In edit mode, convert existing image URLs to File objects (when possible)
   * so submitFn always receives File objects for images.
   *
   * Behavior:
   * - Runs once per component mount (convertedExistingRef stops repeats).
   * - For each initial image that has a url and no file, attempt to fetch the URL,
   *   create a File, and set it into formData.images[index].file.
   * - If fetch fails (CORS / network), we keep the original url and leave file=null.
   */
  useEffect(() => {
    if (!isEdit || !initialData || convertedExistingRef.current) return;
    const initialImgs = initialData.images || [];
    if (!initialImgs.length) {
      convertedExistingRef.current = true;
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const conversions = await Promise.all(
            initialImgs.map(async (img, idx) => {
              const url = typeof img === "string" ? toAbsoluteUrl(img) : toAbsoluteUrl(img.url || img.path || img.thumbnail || "");
              if (!url) return { index: idx, file: null };

              try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("fetch failed");
                const blob = await res.blob();

                // derive filename from url if possible
                let filename = `existing-${idx}`;
                try {
                  const parsed = new URL(url);
                  const parts = parsed.pathname.split("/");
                  if (parts.length) {
                    const last = parts.pop();
                    if (last) filename = last.split("?")[0] || filename;
                  }
                } catch (e) {
                  // ignore
                }

                const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
                return { index: idx, file, url };
              } catch (err) {
                console.error("PlaceForm: failed to fetch image for conversion", url, err);
                return { index: idx, file: null, url };
              }
            })
        );

        if (cancelled) return;

        setFormData((prev) => {
          // Use prev.images as base in case something else changed it
          const images = (prev.images || []).slice();
          // Ensure images length matches at least initialImgs length
          for (let i = 0; i < conversions.length; i++) {
            const c = conversions[i];
            if (!images[i]) {
              // create placeholder if missing
              images[i] = { id: null, url: c.url || "", file: c.file ?? null };
            } else {
              if (c.file) {
                images[i] = { ...images[i], file: c.file };
              } else {
                // leave existing url, file remains as-is (likely null)
                images[i] = { ...images[i], url: images[i].url || c.url || images[i].url, file: images[i].file ?? null };
              }
            }
          }
          return { ...prev, images };
        });

      } finally {
        convertedExistingRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
    // Run only once for initialData + isEdit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const MAX_IMAGES = 4;
    const existingServerImages = formData.images.filter((img) => img.id);
    const localFilesCount = formData.images.filter((img) => img.file).length;
    const canAdd = Math.max(
        0,
        MAX_IMAGES - existingServerImages.length - localFilesCount
    );

    if (canAdd === 0) {
      toast.error("يمكنك رفع أربع صور كحد أقصى");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const newImages = files.slice(0, canAdd).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: null,
    }));

    setFormData((prev) => ({
      ...prev,
      // Keep server images first, then local files, then newly added files
      images: [
        ...prev.images.filter((img) => img.id),
        ...prev.images.filter((img) => !img.id),
        ...newImages,
      ],
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const imageToRemove = prev.images[index];
      if (
          imageToRemove?.file &&
          imageToRemove.url &&
          imageToRemove.url.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(imageToRemove.url);
        } catch {}
      }
      return { ...prev, images: prev.images.filter((_, i) => i !== index) };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (value, data) => {
    const dialCode = data.dialCode;
    const phoneNumber = value.replace(dialCode, "");

    setFormData((prev) => ({
      ...prev,
      phone: phoneNumber,
      country_code: `+${dialCode}`,
    }));
  };

  const handleLocationSelect = ({ display_name, lat, lon }) => {
    setFormData((prev) => ({ ...prev, place: display_name, lat, lon }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {};

      // Append non-image fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") return;
        if (key === "lat" || key === "lon") return;
        if (key === "classification") return;

        let toAppend = value === null || value === undefined ? "" : value;

        // For phone, combine country code and phone number
        if (key === "phone") {
          payload[key] = `${formData.country_code}${value}`;
          return;
        }

        payload[key] = String(toAppend);
      });

      // classification
      payload.classification =
          formData.type === "tourist" ? formData.classification ?? "" : "";

      // lat/lon
      payload.latitude = String(formData.lat ?? "");
      payload.longitude = String(formData.lon ?? "");

      // Collect ALL images as File objects (existing + new)
      const allFiles = (formData.images || [])
          .filter((i) => i.file instanceof File) // only take those with a File
          .map((i) => i.file);

      payload.images = allFiles;

      await submitFn(payload);
      // Removed the toast.success call here to prevent double toast
      if (typeof onSuccess === "function") onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      const errMsg = error?.response?.data;
      if (errMsg && typeof errMsg === "object") {
        const first = errMsg.errors ? Object.values(errMsg.errors)[0] : null;
        if (first) {
          toast.error(Array.isArray(first) ? first[0] : String(first));
          setErrors((p) => ({
            ...p,
            api: Array.isArray(first) ? first[0] : String(first),
          }));
        } else if (errMsg.message) {
          toast.error(errMsg.message);
          setErrors((p) => ({ ...p, api: errMsg.message }));
        } else {
          toast.error("فشل إرسال البيانات");
          setErrors((p) => ({ ...p, api: "فشل إرسال البيانات" }));
        }
      } else {
        toast.error("فشل إرسال البيانات");
        setErrors((p) => ({ ...p, api: "فشل إرسال البيانات" }));
      }
    }
  };
  // ---------------------------------------------------------------------

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = `${placeTypeLabels[formData.type] || "الاسم"} مطلوب`;
    if (!formData.city_name) newErrors.city_name = "المدينة مطلوبة";
    if (formData.type !== "tourist" && !formData.phone?.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.place?.trim()) newErrors.place = "الموقع مطلوب";
    if (formData.images.length === 0) newErrors.images = "يجب رفع صورة واحدة على الأقل";
    if (formData.type !== "tourist") {
      const n = Number(formData.number_of_branches);
      if (!n || n < 1) newErrors.number_of_branches = "عدد الفروع يجب أن يكون على الأقل 1";
    }
    if (formData.type === "tourist") {
      if (!formData.classification) newErrors.classification = "اختر فئة واحدة";
      else if (!touristTags.includes(formData.classification)) newErrors.classification = "فئة غير صالحة";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const baseInput =
      "p-3 bg-white border rounded-xl focus:outline-none w-full transition text-right";
  const validInput =
      "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
  const errorInput =
      "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500";
  const fieldClass = (error) =>
      `${baseInput} ${error ? errorInput : validInput}`;

  const imageCount = formData.images.length;

  const CustomListbox = ({
                           value,
                           onChange,
                           options,
                           placeholder,
                           getLabel,
                         }) => (
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
              className={`${fieldClass(false)} flex justify-between items-center`}
          >
          <span
              className={`${value ? "text-gray-900" : "text-gray-400"} truncate`}
          >
            {getLabel ? getLabel(value) || placeholder : value || placeholder}
          </span>
            <ChevronDown size={18} />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-50 max-h-56 overflow-auto">
            {options.map((opt) => {
              const val = opt?.value ?? opt;
              const label = getLabel ? getLabel(val, opt) : opt?.label ?? opt;
              return (
                  <Listbox.Option
                      key={val}
                      value={val}
                      className={({ active }) =>
                          `cursor-pointer px-4 py-3 ${
                              active ? "bg-green text-white" : "text-gray-700"
                          }`
                      }
                  >
                    {({ selected }) => (
                        <div className="flex justify-between items-center">
                          <span>{label}</span>
                          {selected && <Check size={16} />}
                        </div>
                    )}
                  </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </div>
      </Listbox>
  );

  const getFormTitle = () => {
    if (!isEdit) return "إضافة مكان";
    const typeLabel = placeTypeLabels[formData.type] || "مكان";
    return `تعديل معلومات ${typeLabel}`;
  };

  return (
      <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-9999"
          onClick={onClose}
      >
        <div
            className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
        >
          <button
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={onClose}
              type="button"
          >
            <XIcon />
          </button>
          <h2 className="text-2xl font-bold text-green mb-6 text-right">
            {getFormTitle()}
          </h2>

          <form
              className="grid grid-cols-2 gap-4 items-start"
              onSubmit={handleSubmit}
          >
            {!isEdit && (
                <div className="col-span-2">
                  <label className="block text-body-bold-14 mb-1">نوع المكان</label>
                  <CustomListbox
                      value={formData.type}
                      onChange={(val) => setFormData((p) => ({ ...p, type: val }))}
                      options={Object.keys(placeTypeLabels)}
                      placeholder="اختر النوع"
                      getLabel={(v) => placeTypeLabels[v]}
                  />
                </div>
            )}

            <div>
              <label className="block text-body-bold-14 mb-1">
                {placeTypeLabels[formData.type]}
              </label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={placeTypeLabels[formData.type]}
                  className={fieldClass(errors.name)}
              />
              {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-body-bold-14 mb-1">المدينة</label>
              <CustomListbox
                  value={formData.city_name}
                  onChange={(val) => setFormData((p) => ({ ...p, city_name: val }))}
                  options={cities}
                  placeholder="اختر المدينة"
              />
              {errors.city_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.city_name}</p>
              )}
            </div>

            <div>
              <label className="block text-body-bold-14 mb-1">الوصف</label>
              <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="اكتب وصف المكان"
                  className={`${fieldClass(errors.description)} h-28 resize-none`}
              />
              {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-body-bold-14 mb-1">الصور</label>
              <div className="relative">
                <label
                    role="filepicker"
                    className={`${fieldClass(
                        errors.images
                    )} flex items-center justify-between cursor-pointer`}
                >
                <span className="text-sm text-gray-700">
                  {imageCount > 0 ? `${imageCount} ملفات` : "اختر صور"}
                </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">رفع</span>
                    <Paperclip size={18} />
                  </div>
                  <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      accept="image/*"
                  />
                </label>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                يمكنك رفع أربع صور كحد أقصى
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.images.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-[90px] h-[90px] border rounded-xl overflow-hidden group"
                    >
                      <img
                          src={img.url}
                          alt={`Place image ${index}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentNode.style.display = "none";
                          }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white"
                            aria-label="حذف الصورة"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                ))}
              </div>

              {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
            </div>

            {formData.type !== "tourist" && (
                <div>
                  <label className="block text-body-bold-14 mb-1">رقم الهاتف</label>
                  <div className="placeform-phone-wrapper">
                    <PhoneInput
                        country={"sy"}
                        value={`${formData.country_code}${formData.phone}`}
                        onChange={handlePhoneChange}
                        enableSearch
                        containerClass={`react-tel-input ${
                            errors.phone ? "phone-error" : ""
                        } show-dialcode`}
                        inputClass="form-control"
                        buttonClass="flag-dropdown"
                        dropdownStyle={{ backgroundColor: "#ffffff" }}
                        inputProps={{ name: "phone", placeholder: "00 0000000" }}
                    />
                  </div>
                  {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
            )}

            {formData.type !== "tourist" && (
                <div>
                  <label className="block text-body-bold-14 mb-1">عدد الفروع</label>
                  <input
                      type="number"
                      name="number_of_branches"
                      value={formData.number_of_branches}
                      onChange={handleChange}
                      placeholder="0"
                      className={fieldClass(errors.number_of_branches)}
                      min="1"
                  />
                  {errors.number_of_branches && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.number_of_branches}
                      </p>
                  )}
                </div>
            )}

            <div className="col-span-2">
              <label className="block text-body-bold-14 mb-1">الموقع</label>
              <MapSearchPicker
                  initialPosition={[formData.lat, formData.lon]}
                  initialPlace={formData.place}
                  onSelect={handleLocationSelect}
              />
              {errors.place && (
                  <p className="text-red-500 text-sm mt-1">{errors.place}</p>
              )}
            </div>

            {formData.type === "tourist" && (
                <div className="col-span-2">
                  <label className="block text-body-bold-16 mb-2">الفئة</label>
                  <div className="flex flex-wrap justify-between">
                    {touristTags.map((tag, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() =>
                                setFormData((p) => ({
                                  ...p,
                                  classification: p.classification === tag ? null : tag,
                                }))
                            }
                            className={`px-6 py-3 rounded-full min-w-10 text-body-bold-14-auto cursor-pointer ${
                                formData.classification === tag
                                    ? "bg-green text-white"
                                    : "bg-gray-200 text-green"
                            }`}
                        >
                          {tag}
                        </button>
                    ))}
                  </div>
                  {errors.classification && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.classification}
                      </p>
                  )}
                </div>
            )}

            <div className="col-span-2 mt-4">
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green text-white py-3 rounded-xl hover:shadow-md cursor-pointer transition disabled:opacity-50"
              >
                {isLoading ? (isEdit ? "جار التعديل...." : "جار الإضافة....") : isEdit ? "حفظ التعديلات" : "+ إضافة"}
              </button>
            </div>

            {errors.api && (
                <div className="col-span-2">
                  <p className="text-red-500 text-sm mt-1">{errors.api}</p>
                </div>
            )}
          </form>
        </div>
      </div>
  );
}