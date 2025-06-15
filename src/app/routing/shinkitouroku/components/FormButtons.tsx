import Link from 'next/link';

interface FormButtonsProps {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function FormButtons({ handleSubmit, isSubmitting }: FormButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "登録中..." : "登録する"}
      </button>
      <Link
        href="/routing/tanto"
        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors"
      >
        戻る
      </Link>
    </div>
  );
} 