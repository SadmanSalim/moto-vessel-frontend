"use client";

import { Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import { useDeleteMyReview, useMyReviews } from "@/hooks/useMyReviews";
import { getErrorMessage } from "@/lib/api";
import { mapApiProductToCard } from "@/lib/mapProduct";

export default function AccountReviewsPage() {
  const { data, isLoading, isError, error } = useMyReviews();
  const deleteReview = useDeleteMyReview();

  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
      <h2 className="text-[15px] font-bold text-[#1a2744]">My Reviews</h2>
      <p className="mt-1 text-[12px] text-[#5c7099]">Reviews you&apos;ve written for products.</p>

      {isError ? (
        <div className="mt-4">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 size={22} className="animate-spin text-[#1565c0]" />
        </div>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <div className="mt-8 text-center">
          <Star size={26} className="mx-auto mb-3 text-[#93a4c1]" />
          <p className="text-[12px] text-[#5c7099]">You haven&apos;t written any reviews yet.</p>
        </div>
      ) : null}

      {!isLoading && (data?.length ?? 0) > 0 ? (
        <div className="mt-4 space-y-3">
          {data!.map((review) => {
            const card = review.product ? mapApiProductToCard(review.product) : null;
            return (
              <div key={review.id} className="rounded-[14px] border border-[#eef2f8] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {card ? (
                      <Link href={`/products/${card.slug}`} className="relative block h-12 w-12 shrink-0 rounded-lg bg-[#f7f9fd] p-1.5">
                        <Image src={card.image} alt={card.name} width={40} height={40} className="h-full w-full object-contain" />
                      </Link>
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-[#f7f9fd]" />
                    )}
                    <div>
                      {card ? (
                        <Link href={`/products/${card.slug}`} className="text-[13px] font-bold text-[#1a2744] hover:text-[#1565c0]">
                          {card.name}
                        </Link>
                      ) : (
                        <p className="text-[13px] font-bold text-[#93a4c1]">Product no longer available</p>
                      )}
                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                        ))}
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            review.is_approved ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {review.is_approved ? "Published" : "Pending"}
                        </span>
                      </div>
                      {review.title ? <p className="mt-1.5 text-[12px] font-semibold text-[#1a2744]">{review.title}</p> : null}
                      {review.comment ? <p className="mt-0.5 text-[12px] text-[#5c7099]">{review.comment}</p> : null}
                      <p className="mt-1.5 text-[10px] text-[#93a4c1]">
                        {new Date(review.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteReview.mutate(review.id)}
                    disabled={deleteReview.isPending}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[#5c7099] transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete review"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
