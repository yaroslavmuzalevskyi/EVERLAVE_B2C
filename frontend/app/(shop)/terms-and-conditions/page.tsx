export default function TermsAndConditionsPage() {
  const documentText = `Version: March 2026

Evervale
ELEVAN plus s.r.o.
Na Cecelice 425/4, 150 00 Praha, Czechia
Company ID: 02928205 | VAT ID: CZ02928205
Email: privacy@evervale.org

1. Introduction and Acceptance
These Terms and Conditions ("Terms") govern your use of https://evervale.org and purchases made on the website. By using the website or placing an order, you agree to these Terms.

2. Eligibility and Age Restriction
You must be at least 21 years old to use the website and purchase products.

3. Product Description and Use
Products are offered as souvenir and collectible cannabis seeds for collection purposes only.
No results (including germination/viability) are guaranteed.

4. Legal Compliance
You are responsible for ensuring purchase/possession is legal in your jurisdiction.
Evervale is not responsible for legal consequences related to local law compliance.

5. Shipping and Delivery
Orders ship from the Czech Republic via postal services.
Risk of loss transfers upon delivery.
Delivery delays caused by postal/customs carriers are outside our control.

6. Returns and Refunds
Returns are generally not accepted, with limited exceptions for unopened/unused items and requests made within 14 days.

7. Payment
Payments are processed through Stripe. We do not store card details.

8. User Accounts
If you create an account, you are responsible for account accuracy and credential security.

9. Limitation of Liability
To the maximum extent allowed by law, Evervale and ELEVAN plus s.r.o. are not liable for indirect/incidental/consequential damages.

10. Indemnification
You agree to indemnify and hold Evervale and ELEVAN plus s.r.o. harmless for claims arising from your use of the website, purchases, or violation of these Terms.

11. Governing Law and Jurisdiction
These Terms are governed by the laws of the Czech Republic, with disputes resolved in Czech courts.

12. Modifications to Terms
We may update these Terms at any time. Updates are effective upon posting.

13. Entire Agreement
These Terms and related policies form the entire agreement between you and Evervale.

14. Contact
privacy@evervale.org`;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-pr_w/70">
            Last updated: March 2026
          </p>
          <article className="mt-8 rounded-3xl border border-pr_w/20 bg-pr_w/5 px-6 py-8 text-left whitespace-pre-line text-sm leading-7 text-pr_w/85 shadow-xl backdrop-blur-sm sm:px-8 sm:py-10">
            {documentText}
          </article>
        </div>
      </section>
    </div>
  );
}
