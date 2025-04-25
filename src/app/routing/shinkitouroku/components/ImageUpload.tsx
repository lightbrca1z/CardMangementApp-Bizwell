interface ImageUploadProps {
  selectedFile: File | null;
  previewUrl: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({
  selectedFile,
  previewUrl,
  handleFileChange,
}: ImageUploadProps) {
  return (
    <div className="bg-purple-200 p-6 rounded-2xl w-full lg:w-1/3 shadow-lg relative">
      <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-2xl mb-4">画像登録</h2>
      <p className="text-center mb-4">名刺の画像から登録</p>
      <div className="border-2 border-purple-400 bg-white text-center py-10 rounded relative cursor-pointer mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <span className="text-black pointer-events-none">ファイルを選択してください</span>
      </div>
      {previewUrl && (
        <div className="text-center text-sm text-purple-900 break-words space-y-2">
          <p>選択中の画像:</p>
          <img src={previewUrl} alt="プレビュー" className="mx-auto max-h-40 rounded shadow" />
        </div>
      )}
    </div>
  );
} 