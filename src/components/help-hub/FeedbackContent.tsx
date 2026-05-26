"use client";

import { useState } from "react";

export default function FeedbackContent() {
  const [topic, setTopic] = useState("General");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topics = ["General", "Bug Report", "Feature Request", "Listing Issue", "Other"];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setMessage("");
    setTopic("General");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Share Your Feedback</h2>
        <p className="mt-1 text-sm text-body-muted">
          Your feedback helps us make the platform better. It only takes 30 seconds.
        </p>
        {submitted ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            Thank you! Your feedback has reached us — our team will review it.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#f75d34] focus:outline-none"
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your message..."
                className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#f75d34] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#f75d34] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e54a23]"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </section>
      <aside className="space-y-4">
        <div className="rounded-2xl bg-orange-50 p-6">
          <h3 className="text-base font-bold text-gray-900">Direct Channels</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>Email: <span className="font-semibold">feedback@oldcarbazar.in</span></li>
            <li>Helpline: <span className="font-semibold">+91 98765 43210</span></li>
            <li>Hours: <span className="font-semibold">Mon-Sat, 10AM-7PM</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="text-base font-bold text-gray-900">Common Questions</h3>
          <p className="mt-2 text-sm text-body-muted">
            Need a quick answer? Check our <a href="/help/faq" className="font-semibold text-[#f75d34]">FAQs</a>
            {" "}or head to <a href="/contact" className="font-semibold text-[#f75d34]">Contact Us</a>.
          </p>
        </div>
      </aside>
    </div>
  );
}
