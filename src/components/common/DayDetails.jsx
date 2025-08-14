import { useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";

// put AM/PM after the time
function formatTime(timeStr) {
    const parts = timeStr.trim().split(" ");
    if (parts.length === 2 && (parts[0] === "AM" || parts[0] === "PM")) {
        return `${parts[1]} ${parts[0]}`;
    }
    return timeStr;
}

export default function DayDetails({ days }) {
    const [openDay, setOpenDay] = useState(null);

    return (
        <div className="cared bg-white rounded-2xl shadow-sm p-4 space-y-6">
            {days.map((day, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                >
                    {/* Day Header */}
                    <button
                        onClick={() => setOpenDay(openDay === index ? null : index)}
                        className="w-full text-right px-4 py-3 bg-(--color-emerald-100)/50 text-green font-semibold"
                        style={{ fontFamily: "'BC Arabic', sans-serif" }}
                    >
                        اليوم {day.day}
                    </button>

                    {/* Timeline Activities */}
                    {openDay === index && (
                        <div className="max-h-60 overflow-y-auto px-4 py-4"> {/* increased px from 2 → 4 */}
                            <Timeline
                                position="left"
                                sx={{
                                    padding: "8px 0", // add vertical padding
                                    margin: 0,
                                    "& .MuiTimelineItem-root": { minHeight: "70px", mb: 1 }, // slightly taller + margin bottom
                                    "& .MuiTimelineSeparator-root": {
                                        flex: "0 0 auto",
                                        alignSelf: "stretch",
                                    },
                                    "& .MuiTimelineOppositeContent-root": {
                                        flex: "0 0 75px", // more space for time
                                        textAlign: "left",
                                        fontFamily: "'BC Arabic', sans-serif",
                                        whiteSpace: "nowrap",
                                    },
                                    "& .MuiTypography-root": {
                                        fontFamily: "'BC Arabic', sans-serif",
                                    },
                                }}
                            >
                                {day.activities.map((activity, i) => (
                                    <TimelineItem
                                        key={i}
                                        sx={{
                                            "&::before": { display: "none" },
                                            alignItems: "flex-start",
                                            mb: i !== day.activities.length - 1 ? 1 : 0, // spacing between items
                                        }}
                                    >
                                        {/* Activity text */}
                                        <TimelineContent
                                            sx={{
                                                py: 1.5, // slightly more padding
                                                px: 2,
                                                textAlign: "right",
                                                flex: 1,
                                                fontFamily: "'BC Arabic', sans-serif",
                                                overflowWrap: "break-word",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                fontWeight="bold"
                                                sx={{
                                                    fontSize: "0.95rem",
                                                    color: "#111827",
                                                    fontFamily: "inherit",
                                                    display: "block",
                                                }}
                                            >
                                                {activity.title}
                                            </Typography>
                                            {activity.description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        color: "#6b7280",
                                                        fontFamily: "inherit",
                                                        lineHeight: 1.5, // slightly increased line height
                                                        display: "block",
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {activity.description}
                                                </Typography>
                                            )}
                                        </TimelineContent>

                                        {/* Bullet + Connector */}
                                        <TimelineSeparator>
                                            <TimelineDot
                                                sx={{
                                                    backgroundColor: "#000",
                                                    width: 10,
                                                    height: 10,
                                                    minWidth: 10,
                                                }}
                                            />
                                            {i !== day.activities.length - 1 && (
                                                <TimelineConnector sx={{ backgroundColor: "#d1d5db" }} />
                                            )}
                                        </TimelineSeparator>

                                        {/* Time */}
                                        <TimelineOppositeContent
                                            sx={{
                                                m: "auto 0",
                                                px: 1,
                                                fontSize: "0.875rem",
                                                color: "#6b7280",
                                                fontFamily: "'BC Arabic', sans-serif",
                                            }}
                                        >
                                            {formatTime(activity.time)}
                                        </TimelineOppositeContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
