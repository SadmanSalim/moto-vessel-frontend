"use client";

import { Bell, CarFront, Heart, History, LogOut, MapPin, MessageCircle, Shield, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout, useMe } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useReveal } from "@/hooks/useReveal";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Security", href: "/account/security", icon: Shield },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "My Garage", href: "/account/vehicles", icon: CarFront },
  { label: "Orders", href: "/account/orders", icon: History },
  { label: "My Reviews", href: "/account/reviews", icon: Star },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user: storedUser } = useAuthStore();
  const { data: profile } = useMe();
  const logoutMutation = useLogout();
  const user = profile ?? storedUser;
  const canRender = useRequireAuth();

  useReveal();

  // Formerly enforced server-side by middleware.ts before the page ever
  // rendered; now this hook redirects client-side and we simply render
  // nothing for the moment it takes to kick in, so protected content never
  // flashes for a logged-out visitor.
  if (!canRender) return null;

  return (
    <div className="bg-[#f7f9fd] py-6 md:py-10">
      <div className="mv-container grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="reveal-left flex flex-col rounded-[18px] bg-white p-4 shadow-[0_10px_30px_rgba(13,71,161,0.06)] lg:h-fit">
          <div className="mb-4 flex items-center gap-3">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-[12px] font-bold text-white">
                {user?.name?.slice(0, 2).toUpperCase() ?? "MV"}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-[#1a2744]">{user?.name ?? "Guest"}</p>
              <p className="truncate text-[11px] text-[#5c7099]">{user?.email ?? "Sign in to sync"}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2.5 text-left text-[12px] font-medium transition",
                    isActive ? "bg-[#edf5ff] text-[#1565c0]" : "text-[#5c7099] hover:bg-[#f7fbff] hover:text-[#1a2744]",
                  )}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2.5 text-left text-[12px] font-medium text-[#5c7099] transition hover:bg-[#f7fbff] hover:text-red-600"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut size={14} />
              Log Out
            </button>
          </nav>

          <div className="mt-6 border-t border-[#eef2f8] pt-4">
            <div className="rounded-[14px] bg-[#0e1630] p-4 text-white">
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle size={15} className="text-white/70" />
                <p className="text-[12px] font-bold">Need Help?</p>
              </div>
              <p className="text-[10px] leading-relaxed text-white/65">Orders, fitment, or account questions — we're here.</p>
              <Link
                href="/contact"
                className="mt-3 flex w-full items-center justify-center rounded-[8px] border border-white/25 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/10"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </aside>

        <section className="space-y-5">{children}</section>
      </div>
    </div>
  );
}
