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

export default function DayDetails({ days, className = "" }) {
    const [openDay, setOpenDay] = useState(null);

    // Transform the API data structure to match component expectations
    const transformedDays = days?.map(day => ({
        day: day.day_number,
        activities: day.sections?.map(section => ({
            time: section.time,
            title: section.title,
            description: Array.isArray(section.description)
                ? section.description
                : [section.description]
        })) || []
    })) || [];

    return (
        <div className={`cared bg-white rounded-2xl shadow-sm p-4 space-y-6 ${className}`}>
            {transformedDays.map((day, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                >
                    {/* Day Header */}
                    <button
                        onClick={() => setOpenDay(openDay === index ? null : index)}
                        className="w-full flex items-center justify-between cursor-pointer px-4 py-3 bg-emerald-100/40 hover:bg-emerald-100 text-green font-semibold transition-colors duration-200"
                        style={{ fontFamily: "'BC Arabic', sans-serif" }}
                    >
                        <span>اليوم {day.day}</span>
                        <span
                            className={`transform transition-transform duration-300 ${
                                openDay === index ? 'rotate-180' : ''
                            }`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>

                    {/* Timeline Activities */}
                    {openDay === index && (
                        <div className="overflow-y-auto px-4 py-4" style={{ maxHeight: '371px' }}>
                            <Timeline
                                position="left"
                                sx={{
                                    padding: "8px 0",
                                    margin: 0,
                                    "& .MuiTimelineItem-root": { minHeight: "70px", mb: 1 },
                                    "& .MuiTimelineSeparator-root": {
                                        flex: "0 0 auto",
                                        alignSelf: "stretch",
                                    },
                                    "& .MuiTimelineOppositeContent-root": {
                                        flex: "0 0 75px",
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
                                            mb: i !== day.activities.length - 1 ? 1 : 0,
                                        }}
                                    >
                                        {/* Activity text */}
                                        <TimelineContent
                                            sx={{
                                                py: 1.5,
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
                                            {activity.description && activity.description.length > 0 && (
                                                <div className="mt-2 pr-4 space-y-2">
                                                    {activity.description.map((desc, idx) => (
                                                        desc && (
                                                            <p
                                                                key={idx}
                                                                className="text-xs text-gray-500 leading-relaxed"
                                                                style={{ fontFamily: "'BC Arabic', sans-serif" }}
                                                            >
                                                                {desc}
                                                            </p>
                                                        )
                                                    ))}
                                                </div>
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
                                            {i !== day.activities.length - 1 ? (
                                                <TimelineConnector sx={{ backgroundColor: "#000" }} />
                                            ) : (
                                                // Adjusting the height and adding padding to the last connector
                                                <div style={{ height: '80%', backgroundColor: '#000', width: '2px' }} />
                                            )}
                                        </TimelineSeparator>

                                        {/* Time */}
                                        <TimelineOppositeContent
                                            sx={{
                                                m: "auto 1",
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