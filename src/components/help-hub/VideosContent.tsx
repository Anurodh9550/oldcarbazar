import { videoItems } from "@/data/helpHubPages";

export default function VideosContent() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {videoItems.map((video) => (
        <li
          key={video.title}
          className="group overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg"
        >
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl text-white backdrop-blur group-hover:bg-[#f75d34]">
              ▶
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 group-hover:text-[#f75d34]">{video.title}</h3>
            <p className="mt-1 text-caption">
              {video.duration} · {video.views} views
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
