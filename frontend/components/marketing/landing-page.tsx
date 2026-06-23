import Link from 'next/link'
import { Fraunces } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
})

const railItems = [
  {
    title: 'Brand',
    body: 'Create a clean workspace for each client, product line, or campaign system.',
  },
  {
    title: 'Kit',
    body: 'Answer six lightweight questions to lock in tone, audience, colors, and guardrails.',
  },
  {
    title: 'Keys',
    body: 'Bring your own OpenAI or Gemini keys and manage active validation per brand.',
  },
  {
    title: 'History',
    body: 'Review generated assets, failure states, timestamps, and downloadable outputs.',
  },
] as const

const narrativeItems = [
  {
    step: 'Step 01',
    title: 'Set the creative perimeter',
    body: 'The brand kit gives the model a name, tone, audience, colors, and words to avoid before prompting begins.',
  },
  {
    step: 'Step 02',
    title: 'Connect the provider directly',
    body: 'Basar AI uses a BYOK model, so the customer controls provider credentials while the product focuses on orchestration.',
  },
  {
    step: 'Step 03',
    title: 'Generate for where the image will live',
    body: 'Platform presets turn a prompt into an asset sized for a real channel, from LinkedIn banners to Instagram posts.',
  },
  {
    step: 'Step 04',
    title: 'Keep a clean operational record',
    body: 'Generation history is part of the product, so teams can inspect what shipped, what failed, and what belongs to each brand.',
  },
] as const

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.96)),#faf8f1] text-[#181715]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white/55 shadow-[0_24px_80px_rgba(24,23,21,0.08)] backdrop-blur-xl">
          <header className="border-b border-black/10 bg-white/72">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#181715] text-sm font-semibold tracking-[0.18em] text-[#f7f3ec]">
                  BA
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-[0.04em]">Basar AI</div>
                  <div className="text-sm text-black/55">
                    Multi-brand social image generation with your own provider keys.
                  </div>
                </div>
              </div>
              <nav className="flex flex-wrap items-center gap-3 text-sm text-black/65">
                <a href="#how-it-works" className="transition hover:text-black">
                  Workflow
                </a>
                <a href="#product-narrative" className="transition hover:text-black">
                  Narrative
                </a>
                <Link
                  href="/login"
                  className="rounded-full border border-black/10 px-4 py-2 transition hover:bg-black/[0.03] hover:text-black"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-[#181715] px-5 py-2 text-[#f7f3ec] transition hover:bg-black"
                >
                  Start free
                </Link>
              </nav>
            </div>
          </header>

          <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-14 lg:py-16">
            <div>
              <div className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#705842]">
                Minimal Product Narrative
              </div>
              <h1
                className={`${fraunces.className} mt-5 max-w-[10ch] text-[3.3rem] leading-[0.94] tracking-[-0.06em] sm:text-[4.5rem] lg:text-[5.7rem]`}
              >
                The shortest path from brand context to social image.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-black/66 sm:text-lg sm:leading-9">
                Basar AI is a calm, structured workflow for image generation. No noisy creative
                suite. No extra billing layer. No mystery around why one asset looks on-brand and
                the next one does not. Just a clear chain from brand identity to platform-ready
                output.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center rounded-full bg-[#181715] px-6 py-3 text-sm font-medium text-[#f7f3ec] transition hover:bg-black"
                >
                  Start free with your own keys
                </Link>
                <a
                  href="#product-narrative"
                  className="inline-flex items-center rounded-full border border-black/12 px-6 py-3 text-sm font-medium transition hover:bg-black/[0.03]"
                >
                  Read the product flow
                </a>
              </div>
            </div>

            <aside className="rounded-[28px] border border-black/10 bg-white/60 p-6 shadow-[0_12px_40px_rgba(24,23,21,0.06)] backdrop-blur-lg sm:p-7">
              <div className="text-[0.82rem] uppercase tracking-[0.16em] text-black/50">
                At a glance
              </div>
              <p className="mt-4 text-sm leading-8 text-black/68 sm:text-[0.98rem]">
                Multi-brand workspace. Supabase auth and storage. FastAPI backend. Next.js
                frontend. OpenAI and Gemini providers. Brand kit, generation history, and hard
                deletes included.
              </p>
              <p className="mt-4 text-sm leading-8 text-black/68 sm:text-[0.98rem]">
                Designed for founders, operators, and small teams who want branded social image
                generation without the weight of a bigger creative platform.
              </p>

              <div className="mt-7 space-y-4">
                <div className="rounded-3xl border border-black/8 bg-[#f8f4ee] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-black/45">
                    Example Run
                  </div>
                  <div className="mt-3 text-sm leading-7 text-black/72">
                    Brand kit complete. Gemini active. Preset set to LinkedIn Post. Logo mode set
                    to watermark. Result stored in generation history with download metadata.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-3xl border border-black/8 bg-white/72 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-black/45">
                      Presets
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">13</div>
                  </div>
                  <div className="rounded-3xl border border-black/8 bg-white/72 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-black/45">
                      Providers
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">2</div>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section id="how-it-works" className="border-y border-black/10 px-6 py-8 md:px-8">
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {railItems.map((item) => (
                <article key={item.title} className="rounded-[24px] bg-white/42 p-5">
                  <div className="text-[0.78rem] uppercase tracking-[0.16em] text-black/46">
                    {item.title}
                  </div>
                  <p className="mt-3 text-base leading-8 text-black/72">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="product-narrative"
            className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 lg:py-14"
          >
            <div>
              <div className="text-sm uppercase tracking-[0.16em] text-black/42">
                Product Narrative
              </div>
              <p className="mt-4 text-sm leading-7 text-black/56">
                A simple system, intentionally narrow in scope, built to keep multi-brand image
                generation understandable.
              </p>
            </div>

            <div className="space-y-2">
              {narrativeItems.map((item) => (
                <article
                  key={item.step}
                  className="grid gap-3 border-t border-black/10 py-6 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-6"
                >
                  <div className="text-[0.8rem] uppercase tracking-[0.16em] text-black/42">
                    {item.step}
                  </div>
                  <div>
                    <h2 className="text-2xl tracking-[-0.04em] sm:text-[1.8rem]">{item.title}</h2>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-black/68">
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-black/10 bg-[#f6f1e9] px-6 py-10 md:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[0.78rem] uppercase tracking-[0.16em] text-black/44">
                  Ready to ship the first brand?
                </div>
                <h2
                  className={`${fraunces.className} mt-3 max-w-[12ch] text-[2.4rem] leading-tight tracking-[-0.05em] sm:text-[3.2rem]`}
                >
                  Bring your own keys. Keep your own brand logic.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center rounded-full bg-[#181715] px-6 py-3 text-sm font-medium text-[#f7f3ec] transition hover:bg-black"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border border-black/12 px-6 py-3 text-sm font-medium transition hover:bg-black/[0.03]"
                >
                  Log in
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
