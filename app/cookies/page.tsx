import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | MotoVessel",
};

export default function CookiesPage() {
  return (
    <div className="bg-[#f7f9fd] py-12 md:py-16">
      <div className="mv-container max-w-[820px]">
        <h1 className="text-[32px] font-extrabold text-[#1a2744]">Cookie Policy</h1>
        <p className="mt-2 text-[13px] text-[#5c7099]">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 rounded-[18px] bg-white p-6 text-[14px] leading-relaxed text-[#374151] shadow-[0_10px_30px_rgba(13,71,161,0.06)] md:p-8">
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">What We Use Cookies For</h2>
            <p className="mt-2">
              MotoVessel uses a small number of cookies and local storage entries to keep you signed in, remember
              items in your cart, and understand basic site usage. We don&apos;t use cookies for third-party
              advertising.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Essential Cookies</h2>
            <p className="mt-2">
              Your session token and shopping cart are stored locally in your browser so you stay signed in and your
              cart persists between visits. These are required for the site to function and can&apos;t be disabled
              without affecting checkout.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Managing Cookies</h2>
            <p className="mt-2">
              You can clear cookies and local storage at any time through your browser settings. Doing so will sign
              you out and clear your saved cart.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
