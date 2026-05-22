import { safetyTips } from "@/data/helpHubPages";

export default function SafetyTipsContent() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {safetyTips.map((tip) => (
        <li
          key={tip.title}
          className="rounded-2xl border-l-4 border-[#f75d34] bg-gray-50 p-6 shadow-sm"
        >
          <span className="text-2xl">{tip.icon}</span>
          <h3 className="mt-3 font-bold text-gray-900">{tip.title}</h3>
          <p className="mt-2 text-body-muted">{tip.desc}</p>
        </li>
      ))}
    </ul>
  );
}
