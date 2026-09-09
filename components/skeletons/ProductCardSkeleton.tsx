export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-gray-100 p-4">
      <div className="mb-3 h-48 rounded-lg bg-gray-200" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
    </div>
  );
}
