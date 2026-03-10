export default function DisclaimerPage() {
  const documentText = `Version: March 2026

Evervale
ELEVAN plus s.r.o.
Na Cecelice 425/4, 150 00 Praha, Czechia

1. General Disclaimer
By using the website or purchasing products, you acknowledge and accept this Disclaimer.

2. Website Disclaimer
Website content is provided "as-is" without warranties of accuracy, completeness, availability, or fitness for a particular purpose.

3. Product Disclaimer
Products are collectible/souvenir cannabis seeds. No warranties are made for viability, characteristics, or outcomes.

4. Informational Content Disclaimer
All strain/genetic content is informational and not medical, legal, or professional advice.

5. Legal Compliance Disclaimer
You are solely responsible for compliance with local laws regarding purchase and possession.

6. No Medical or Health Claims
No medical or therapeutic claims are made.

7. Limitation of Liability
To the fullest extent permitted by law, Evervale and ELEVAN plus s.r.o. are not liable for losses or damages related to website use or purchases.

8. Indemnification
You agree to indemnify and hold harmless Evervale and ELEVAN plus s.r.o. for claims arising from your actions.

9. Third-Party Links
We are not responsible for third-party websites or services linked from this website.

10. No Warranty
All warranties, express or implied, are disclaimed to the extent allowed by law.

11. Severability
If one provision is unenforceable, remaining provisions stay in effect.

12. Changes
We may update this Disclaimer at any time by posting an updated version.

13. Contact
privacy@evervale.org`;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Disclaimer</h1>
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
