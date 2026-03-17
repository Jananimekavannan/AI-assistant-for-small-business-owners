import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

const TASK_TYPES = [
  { value: "promotional_post", label: "📣 Promotional Post" },
  { value: "product_launch", label: "🚀 Product Launch" },
  { value: "customer_reply", label: "💬 Customer Reply" },
  { value: "discount_offer", label: "🏷️ Discount / Offer" },
  { value: "follow_up_message", label: "🔁 Follow-up Message" },
  { value: "thank_you_message", label: "🙏 Thank You Message" },
  { value: "appointment_reminder", label: "📅 Appointment Reminder" },
  { value: "feedback_request", label: "⭐ Feedback Request" },
  { value: "story_caption", label: "📸 Story Caption" },
  { value: "bio_description", label: "📝 Bio / Description" },
];

const TONES = [
  { value: "friendly", label: "😊 Friendly" },
  { value: "professional", label: "💼 Professional" },
  { value: "excited", label: "🎉 Excited" },
  { value: "casual", label: "😎 Casual" },
  { value: "urgent", label: "⚡ Urgent" },
  { value: "warm", label: "🤗 Warm & Personal" },
];

type User = {
  name?: string;
  email?: string;
} | null;

export default function BusinessAssistant({ user }: { user: User }) {
  const generateContent = useAction(api.assistant.generateContent);

  const [form, setForm] = useState({
    businessType: "",
    businessDescription: "",
    targetAudience: "",
    taskType: "",
    tone: "",
    extraContext: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessType || !form.businessDescription || !form.targetAudience || !form.taskType || !form.tone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const content = await generateContent({
        businessType: form.businessType,
        businessDescription: form.businessDescription,
        targetAudience: form.targetAudience,
        taskType: form.taskType,
        tone: form.tone,
        extraContext: form.extraContext || undefined,
      });
      setResult(content);
    } catch (err) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard! 📋");
  };

  const handleReset = () => {
    setResult("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-1">BizAssist AI</h1>
        <p className="text-gray-500 text-sm">
          Welcome, {user?.name ?? user?.email ?? "friend"}! Generate content for your business.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Business Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Business Type <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              placeholder="e.g. Bakery, Salon, Clothing Store, Gym..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
            />
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Business Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="businessDescription"
              value={form.businessDescription}
              onChange={handleChange}
              placeholder="e.g. We sell handmade cakes and pastries in Lagos. Known for custom birthday cakes."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm resize-none"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Target Audience <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="targetAudience"
              value={form.targetAudience}
              onChange={handleChange}
              placeholder="e.g. Young mothers, Students, Working professionals..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
            />
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Task Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TASK_TYPES.map((task) => (
                <button
                  key={task.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, taskType: task.value }))}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition text-left ${
                    form.taskType === task.value
                      ? "bg-emerald-600 text-white border-emerald-600 shadow"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  {task.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tone <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, tone: tone.value }))}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                    form.tone === tone.value
                      ? "bg-teal-600 text-white border-teal-600 shadow"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Context (optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Extra Details <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="extraContext"
              value={form.extraContext}
              onChange={handleChange}
              placeholder="e.g. 20% off this weekend only, mention free delivery..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>✨ Generate Content</>
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-1">
              ✅ Ready to Use
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                🔄 New
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition shadow"
              >
                📋 Copy
              </button>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-emerald-100">
            {result}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Paste directly into WhatsApp or Instagram 🚀
          </p>
        </div>
      )}
    </div>
  );
}
