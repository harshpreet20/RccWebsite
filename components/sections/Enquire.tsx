import SectionEyebrow from '@/components/ui/SectionEyebrow';
import QueryForm from '@/components/ui/QueryForm';

export default function Enquire() {
  return (
    <section id="enquire" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <SectionEyebrow>Get In Touch</SectionEyebrow>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
          Have A Question?
        </h2>
        <p className="mt-4 font-body text-sm text-muted sm:text-base">
          Whether it&apos;s about membership, a corporate event, or just curiosity &mdash;
          drop us a line and we&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-10">
        <QueryForm />
      </div>
    </section>
  );
}
