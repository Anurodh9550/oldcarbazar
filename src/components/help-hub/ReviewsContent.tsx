import { sampleReviews } from "@/data/helpHubPages";

export default function ReviewsContent() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {sampleReviews.map((review) => (
        <li key={review.car} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900">{review.car}</h3>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
              ★ {review.rating}
            </span>
          </div>
          <p className="mt-3 text-body-muted">&ldquo;{review.excerpt}&rdquo;</p>
          <p className="mt-4 text-xs font-semibold text-gray-400">— {review.author}</p>
        </li>
      ))}
    </ul>
  );
}
