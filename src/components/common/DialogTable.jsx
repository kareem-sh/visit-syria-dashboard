import React, { useState } from "react";
import CommonTable from "@/components/common/CommonTable";

const DialogTable = ({
                         columns,
                         data,
                         rowGap,
                         rowHeight,
                         dialogTitle = "تفاصيل",
                         renderDialogContent,
                         dialogSize = "max-w-4xl"
                     }) => {
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const handleCloseDialog = () => {
        setSelectedRow(null);
    };

    return (
        <>
            <CommonTable
                columns={columns}
                data={data}
                rowGap={rowGap}
                rowHeight={rowHeight}
                onRowClick={handleRowClick}
                entityType={"user"}
            />

            {selectedRow && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
                    <div
                        className={`rounded-xl w-full ${dialogSize}`}
                        style={{ backgroundColor: "var(--bg-dashboard, white)" }}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Scrollable wrapper contains the entire dialog content.
                The content itself (title / close / body) is provided by renderDialogContent
                so title+close live inside the scrollable area as you requested. */}
                        <div className="overflow-y-auto max-h-[90vh]">
                            {renderDialogContent ? (
                                // pass the selected row and the close handler so the content can render the header/close
                                renderDialogContent(selectedRow, handleCloseDialog)
                            ) : (
                                // default fallback content (also receives close)
                                <div className="p-1">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold">{dialogTitle}</h2>
                                        <button
                                            onClick={handleCloseDialog}
                                            className="text-black font-black hover:text-black text-2xl"
                                            aria-label="Close dialog"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {columns.map((column) => (
                                            <div key={column.accessor}>
                                                <p className="text-gray-600">{column.header}:</p>
                                                <p className="font-medium">
                                                    {column.render
                                                        ? column.render(selectedRow[column.accessor], selectedRow)
                                                        : selectedRow[column.accessor]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DialogTable;
