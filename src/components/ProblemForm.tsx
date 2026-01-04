// components/ProblemForm.tsx
export default function ProblemForm({ onSuccess, supabase }: any) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("problems").insert([{
      title_en: fd.get("title_en"),
      link: fd.get("link"),
      is_en_done: false, is_fr_done: false, is_ar_done: false
    }]);

    if (error) alert(error.message);
    else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title_en" placeholder="Problem Title" className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 outline-none" required />
      <input name="link" placeholder="Problem URL" className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 outline-none" required />
      <button className="w-full bg-blue-600 py-4 rounded-2xl font-black">SAVE PROBLEM</button>
    </form>
  );
}