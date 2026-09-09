export default function StoreCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[16px] border border-mv-border bg-white p-5">
      <div className="mb-3 h-5 w-24 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
    </div>
  );
}
