"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const sampleChats = [
  {
    id: 1,
    name: "Rahul M.",
    car: "2019 Maruti Swift",
    msg: "Is the car still available?",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    name: "Priya S.",
    car: "2020 Hyundai Creta",
    msg: "Can I see it this weekend?",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    name: "Amit K.",
    car: "2018 Honda City",
    msg: "Final price negotiable?",
    time: "Yesterday",
    unread: false,
  },
];

export default function MessagesContent() {
  const { isLoggedIn, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [active, setActive] = useState(sampleChats[0]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!isLoggedIn) setAuthOpen(true);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <div className="py-16 text-center">
          <WhatsAppIcon size={56} className="mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Login to Chat</h2>
          <p className="mx-auto mt-2 max-w-md text-body-muted">
            Buyer messages sirf logged-in sellers ko dikhte hain.
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="mt-6 rounded-full bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white"
          >
            Login / Register
          </button>
        </div>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <div className="flex h-[480px] flex-col md:flex-row">
        <aside className="w-full border-b border-gray-200 bg-gray-50 md:w-80 md:border-b-0 md:border-r">
          <div className="border-b border-gray-200 bg-white p-4">
            <p className="font-bold text-gray-900">Messages</p>
            <p className="text-caption">Hi, {user?.name}</p>
          </div>
          <ul className="max-h-[400px] overflow-y-auto">
            {sampleChats.map((chat) => (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => setActive(chat)}
                  className={`flex w-full gap-3 border-b border-gray-100 p-4 text-left hover:bg-white ${
                    active.id === chat.id ? "bg-white" : ""
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f75d34]/20 text-sm font-bold text-[#f75d34]">
                    {chat.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {chat.name}
                      </p>
                      <span className="text-[10px] text-gray-400">{chat.time}</span>
                    </div>
                    <p className="truncate text-caption">{chat.car}</p>
                    <p className="truncate text-xs text-gray-600">{chat.msg}</p>
                  </div>
                  {chat.unread && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#f75d34]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex flex-1 flex-col">
          <div className="border-b border-gray-200 bg-white p-4">
            <p className="font-semibold text-gray-900">{active.name}</p>
            <p className="text-caption">{active.car}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm shadow-sm">
              {active.msg}
            </div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#f75d34] px-4 py-2 text-sm text-white">
              Hi! Yes, the car is available. When would you like to visit?
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setReply("");
            }}
            className="flex gap-2 border-t border-gray-200 bg-white p-4"
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#f75d34]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#f75d34] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <p className="mt-4 text-center text-caption">
        Demo chat UI — connect{" "}
        <Link href="/my-listings" className="text-[#f75d34] hover:underline">
          My Listings
        </Link>{" "}
        for real inquiries
      </p>
    </div>
  );
}
