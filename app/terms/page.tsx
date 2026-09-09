import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MotoVessel",
};

export default function TermsPage() {
  return (
    <div className="bg-[#f7f9fd] py-12 md:py-16">
      <div className="mv-container max-w-[820px]">
        <h1 className="text-[32px] font-extrabold text-[#1a2744]">Terms of Service</h1>
        <p className="mt-2 text-[13px] text-[#5c7099]">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 rounded-[18px] bg-white p-6 text-[14px] leading-relaxed text-[#374151] shadow-[0_10px_30px_rgba(13,71,161,0.06)] md:p-8">
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Orders &amp; Payment</h2>
            <p className="mt-2">
              Orders placed through MotoVessel are confirmed once you receive an order number. We currently accept
              Cash on Delivery, bKash, and bank transfer. Prices are listed in Bangladeshi Taka (৳) and are subject to
              change without prior notice.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Product Fitment</h2>
            <p className="mt-2">
              We do our best to ensure listed compatibility (make, model, year, engine) is accurate, but you are
              responsible for confirming fitment before installation. Contact our team if you&apos;re unsure whether a
              part matches your vehicle.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Shipping &amp; Delivery</h2>
            <p className="mt-2">
              Delivery timelines vary by shipping method selected at checkout and by location within Bangladesh. Risk
              of loss passes to you upon delivery to the shipping address provided.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Returns</h2>
            <p className="mt-2">
              Defective or incorrect items can be returned within a reasonable period of delivery — contact support
              with your order number to start a return.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Account Use</h2>
            <p className="mt-2">
              You&apos;re responsible for keeping your account credentials secure. Notify us immediately if you
              suspect unauthorized access to your account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
