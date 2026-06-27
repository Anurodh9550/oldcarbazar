import { cn } from "@/lib/cn";

export const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/15";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-gray-600">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          fieldClass,
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <span className="mt-1 block text-xs text-gray-500">{hint}</span>
      )}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function TextArea({ label, error, className, id, ...props }: TextAreaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-gray-600">
          {label}
        </span>
      )}
      <textarea
        id={inputId}
        className={cn(
          fieldClass,
          "min-h-[100px] resize-y",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className, id, children, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-gray-600">
          {label}
        </span>
      )}
      <select id={inputId} className={cn(fieldClass, className)} {...props}>
        {children}
      </select>
    </label>
  );
}
