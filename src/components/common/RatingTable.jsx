import React from "react";
import { useNavigate } from "react-router-dom";
import { FiStar } from "react-icons/fi";

const RatingTable = ({
  columns = [
    { header: "الترتيب", accessor: "rank" },
    { header: "الاسم", accessor: "name" },
    { header: "التقييم", accessor: "rating" },
  ],
  data = [],
  rowHeight = 61,
}) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        <FiStar className="text-yellow-400 fill-yellow-400" />
        <span className="text-body-bold-14">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleRowClick = (id) => {
    if (id) navigate(`/place/${id}`);
  };

  return (
    <div className="overflow-visible relative z-10 w-full">
      {/* Table Content */}
      <div className="flex flex-col space-y-2 w-full rounded-xl overflow-hidden">
        {/* Table Headers - Same color as rows */}
        <div
          className="grid grid-cols-3 text-center bg-white px-4 py-4 font-bold text-gray-600 text-sm rounded-xl"
          style={{ height: rowHeight }}
        >
          {columns.map((col, idx) => (
            <div key={idx}>{col.header}</div>
          ))}
        </div>

        {/* Table Rows */}
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-3 bg-white px-4 rounded-2xl shadow-sm text-sm text-gray-700 h-[61px] cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleRowClick(row.id)}
          >
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className="flex items-center justify-center gap-2 truncate"
              >
                {col.accessor === "rank" ? (
                  <span className="text-body-bold-16">{rowIndex + 1}</span>
                ) : col.accessor === "rating" ? (
                  renderStars(row[col.accessor])
                ) : col.render ? (
                  col.render(row[col.accessor], row)
                ) : (
                  row[col.accessor]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingTable;
