export default function PrivacyPolicyPage() {
  const documentText = `Version: March 2026

Evervale
ELEVAN plus s.r.o.
Na Cecelice 425/4, 150 00 Praha, Czechia
Privacy Contact: privacy@evervale.org

1. Introduction
This Privacy Policy ("Policy") describes how Evervale (operated by ELEVAN plus s.r.o.) collects, uses, protects, and processes your personal data when you visit our website at https://evervale.org or place an order.

2. Data Controller
ELEVAN plus s.r.o. is the data controller responsible for processing your personal data.
Contact: privacy@evervale.org

3. Personal Data We Collect
We collect only personal data that you voluntarily provide when placing an order or creating an account, including:
- Full name
- Email address
- Phone number
- Delivery address (country, city, postal code, street)
- Payment information (processed by Stripe; we do not store card details)

We do not collect sensitive personal data such as health information or other special categories of data.

4. Purpose of Data Collection and Use
We use your personal data only to:
- Process and fulfill your order
- Deliver products to your address
- Communicate about your order (confirmation, shipping updates)
- Maintain internal records and business operations
- Provide customer support

We do not use your data for marketing and do not send unsolicited newsletters.

5. Data Sharing and Third Parties
We do not sell or rent your personal data. We may share data with service providers needed to operate the website:
- Stripe (payment processing)
- Google Analytics (traffic analytics)
- Postal/shipping services (delivery)

6. Data Storage and Retention
Your personal data is stored in our internal CRM system and retained only as long as needed for the purposes above and legal requirements. We apply technical and organizational safeguards.

7. Cookies and Analytics
We use analytical cookies via Google Analytics for traffic/performance insights.
You can control cookies in your browser settings.

8. Your Data Rights
Depending on your jurisdiction, you may have rights to:
- Access your data
- Correct inaccurate data
- Request deletion
- Request portability
- Object to certain processing

To exercise rights, contact: privacy@evervale.org

9. International Data Transfers
Your data may be transferred to and stored in countries outside your country of residence, including the Czech Republic, in compliance with applicable law.

10. Children's Privacy
This website is not intended for individuals under 21. If we discover data from someone under 21, we will delete it.

11. Changes to This Policy
We may update this Privacy Policy from time to time. Updates are effective upon posting.

12. Contact Us
For questions about this Policy, contact: privacy@evervale.org`;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
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
