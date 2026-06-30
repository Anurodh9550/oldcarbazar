"use client";

import ShowroomImageUpload from "@/components/dealers/showroom/ShowroomImageUpload";
import { fieldClass } from "@/components/ui/Input";
import type { ShowroomGalleryItem } from "@/types/dealerShowroom";

type ShowroomGalleryEditorProps = {
  gallery: ShowroomGalleryItem[];
  onChange: (gallery: ShowroomGalleryItem[]) => void;
  onPersist: () => void | Promise<void>;
};

const emptyItem = (): ShowroomGalleryItem => ({
  id: `sg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: "",
  photoUrl: "",
  priceLabel: "",
  note: "",
});

export default function ShowroomGalleryEditor({
  gallery,
  onChange,
  onPersist,
}: ShowroomGalleryEditorProps) {
  const updateItem = (id: string, patch: Partial<ShowroomGalleryItem>) => {
    onChange(gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  const removeItem = (id: string) => {
    onChange(gallery.filter((g) => g.id !== id));
  };

  const addItem = () => {
    onChange([...gallery, emptyItem()]);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-gray-900">More cars & products</h3>
        <p className="mt-1 text-sm text-gray-500">
          Cars you have not listed on Old Car Bazar yet — upload photos and show
          them below your live listings on the Showroom.
        </p>
      </div>

      {gallery.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 py-10 text-center">
          <span className="text-4xl">🚗</span>
          <p className="mt-2 text-sm font-semibold text-gray-800">
            No extra showroom cards yet
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
            Add cars from your yard that are not posted as listings — buyers will
            see them under &quot;More in our showroom&quot;.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {gallery.map((item, index) => (
            <li
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f75d34]">
                  Card {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <ShowroomImageUpload
                  label="Car photo"
                  variant="logo"
                  value={item.photoUrl}
                  onChange={(photoUrl) => updateItem(item.id, { photoUrl })}
                  hint="Upload from computer or paste image URL."
                />
                <div className="space-y-3">
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">
                      Car / product name *
                    </span>
                    <input
                      className={fieldClass}
                      value={item.title}
                      onChange={(e) =>
                        updateItem(item.id, { title: e.target.value })
                      }
                      placeholder="e.g. 2021 Hyundai Creta SX"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">
                      Price (optional)
                    </span>
                    <input
                      className={fieldClass}
                      value={item.priceLabel ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, { priceLabel: e.target.value })
                      }
                      placeholder="₹8.5 L or Ask for price"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">
                      Note (optional)
                    </span>
                    <textarea
                      rows={2}
                      className={`${fieldClass} resize-y`}
                      value={item.note ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, { note: e.target.value })
                      }
                      placeholder="Coming soon / Not listed yet / Fresh import…"
                    />
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addItem}
          className="rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          + Add car card
        </button>
        <button
          type="button"
          onClick={() => void onPersist()}
          className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-[#f75d34]"
        >
          Save gallery
        </button>
      </div>
    </div>
  );
}
