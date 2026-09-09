export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-500">
      <span>⚠️</span>
      <p>{message || "Something went wrong. Please try again."}</p>
    </div>
  );
}
