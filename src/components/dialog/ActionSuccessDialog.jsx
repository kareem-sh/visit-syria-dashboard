import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function ActionSuccessDialog({
                                                open,
                                                onClose,
                                                message = "تمت العملية بنجاح ✅",
                                            }) {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, 2500); // auto-close after 2.5s
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                            }}
                            className="text-green-500 mb-4"
                        >
                            <CheckCircle size={64} />
                        </motion.div>
                        <div className="text-gray-800 text-lg font-medium text-center">
                            {message}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
