export default function ReturnRefundPolicyPage() {
  const documentText = `Version: March 2026

Evervale
ELEVAN plus s.r.o.
Na Cecelice 425/4, 150 00 Praha, Czechia
Email: privacy@evervale.org

1. General Return Policy
Due to the nature of our products, returns/refunds are generally not permitted.
Limited return options may be available under strict conditions.

2. No Guarantee of Results
Products are sold "as-is" with no warranty of outcomes, including viability or characteristics.

3. Return Eligibility Requirements
All of the following must be met:
- Request submitted within 14 days of delivery
- Original packaging unopened and sealed
- No signs of use, damage, or tampering
- Valid order confirmation/proof of purchase

4. Return Process
- Contact privacy@evervale.org with order number and reason
- Provide photos if requested
- Wait for approval (usually within 5 business days)
- Return using instructions provided

5. Return Shipping Costs
Return shipping is paid by the customer.

6. Refund Options
If approved, Evervale may provide (at its discretion):
- Replacement product
- Store credit
- Refund in exceptional circumstances

7. Non-Returnable Items
Opened, used, tampered, damaged, late, or improperly returned products are not eligible.

8. Damaged Products on Arrival
Report within 7 days to privacy@evervale.org with clear photos.

9. Lost or Missing Orders
We will assist with carrier tracing and resolution where possible.

10. Exceptions
Exceptional-case resolutions may be granted at Evervale's sole discretion.

11. Disputes
If you disagree with a return decision, contact privacy@evervale.org.

12. Policy Changes
We may update this policy from time to time.

13. Contact
privacy@evervale.org`;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Return & Refund Policy
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
