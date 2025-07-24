
export default function StatCard({ title, value, subtitle, color = "bg-(--bg-card)", textColor = "text-black" }) {
    return (
        <div className={`card ${color}`}>
            <h4 className={`card-header ${textColor}`}>{title}</h4>
            <h2 className={`card-value ${textColor}`}>{value}</h2>
            <p className={`card-subtitle ${textColor}`}>{subtitle}</p>
        </div>
    );
}
