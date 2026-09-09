import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MotoVessel",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f7f9fd] py-12 md:py-16">
      <div className="mv-container max-w-[820px]">
        <h1 className="text-[32px] font-extrabold text-[#1a2744]">Privacy Policy</h1>
        <p className="mt-2 text-[13px] text-[#5c7099]">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 rounded-[18px] bg-white p-6 text-[14px] leading-relaxed text-[#374151] shadow-[0_10px_30px_rgba(13,71,161,0.06)] md:p-8">
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Information We Collect</h2>
            <p className="mt-2">
              When you create an account, place an order, or contact us, we collect information such as your name,
              email address, phone number, shipping address, and vehicle details you provide for part-fitment
              purposes. We do not collect or store payment card details — all checkout payment is handled via cash on
              delivery, bKash, or bank transfer arranged directly with our team.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">How We Use Your Information</h2>
            <p className="mt-2">
              We use your information to process and deliver orders, respond to consultancy and support requests,
              and — where you&apos;ve opted in — send you order updates and offers. We do not sell your personal
              information to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Data Retention &amp; Security</h2>
            <p className="mt-2">
              Account and order data is retained for as long as your account is active or as needed to comply with
              legal obligations. Passwords are stored using industry-standard one-way hashing and are never visible
              to our staff.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Your Rights</h2>
            <p className="mt-2">
              You can review and update your profile information at any time from your account settings, or contact
              us to request a copy or deletion of your data.
            </p>
          </section>
          <section>
            <h2 className="text-[16px] font-bold text-[#1a2744]">Contact</h2>
            <p className="mt-2">
              Questions about this policy? Reach out via our{" "}
              <a href="/contact" className="font-semibold text-[#1976d2] hover:underline">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
