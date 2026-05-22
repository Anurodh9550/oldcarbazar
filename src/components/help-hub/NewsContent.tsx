import { newsArticles } from "@/data/helpHubPages";

export default function NewsContent() {
  return (
    <ul className="divide-y divide-gray-100">
      {newsArticles.map((article) => (
        <li key={article.title} className="flex flex-col gap-2 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {article.tag}
            </span>
            <h3 className="mt-2 font-bold text-gray-900 hover:text-[#f75d34]">{article.title}</h3>
          </div>
          <time className="shrink-0 text-sm text-gray-400">{article.date}</time>
        </li>
      ))}
    </ul>
  );
}
