import Link from "next/link";

type ProfileEmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function ProfileEmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: ProfileEmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80 py-16 text-center">
      <span className="text-4xl" aria-hidden>
        {icon}
      </span>
      <h2 className="mt-4 text-xl font-bold text-gray-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-body-muted">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
