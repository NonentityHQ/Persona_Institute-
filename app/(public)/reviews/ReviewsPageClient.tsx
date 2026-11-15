"use client";

import TransitionLink from "@/components/motion/TransitionLink";
import { HeroFade, HeroHeading } from "@/components/motion/HeroText";
import { useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Card3D from "@/components/motion/Card3D";
import { DUR, EASE_IN_OUT, EASE_OUT, cardItem, fadeUp, staggerParent } from "@/lib/motion";
import type { SanitySiteCard } from "@/lib/sanity/client";
import { sanityFieldAttribute } from "@/lib/sanity/visual";
import { cleanSanityString } from "@/lib/sanity/client";
import {
  ArrowRight, Search, GraduationCap, Users, BookOpen, ChevronLeft,
  ChevronRight, SlidersHorizontal, MapPin, Trophy, Sparkles
} from "lucide-react";

const categories = ["All Stories", "Persona English", "English with Khushi", "School Students", "College Students", "Working Professionals", "Competitive Exams"];

type Story = {
  id: string;
  name: string;
  role: string;
  city: string;
  course: string;
  quote: string;
  image: string;
  person: string;
  imageAlt: string;
  imageFit: "cover" | "contain";
  imagePosition: string;
  title: string;
  sanityCardId: string;
};

export default function ReviewsPageClient({ siteCards = [] }: { siteCards: SanitySiteCard[] }) {
  const [category, setCategory] = useState("All Stories");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Only publish learner stories that have actually been entered in Sanity.
  // The old hardcoded names, quotes, ratings and play buttons looked like verified
  // testimonials even though no linked videos or source records existed.
  const editableStories: Story[] = useMemo(() => siteCards
    .filter((card) => cleanSanityString(card.title) && cleanSanityString(card.description))
    .map((card) => {
      const course = cleanSanityString(card.badge) || "Persona English";
      const defaultBrandImage = course.toLowerCase().includes("khushi")
        ? "/images/success-story-khushi-brand.webp"
        : "/images/success-story-persona-brand.webp";
      return {
        id: card._id,
        name: cleanSanityString(card.title),
        role: cleanSanityString(card.subtitle),
        city: cleanSanityString(card.location),
        course,
        quote: cleanSanityString(card.description),
        image: cleanSanityString(card.imageUrl) || defaultBrandImage,
        person: cleanSanityString(card.secondaryImageUrl),
        imageAlt: cleanSanityString(card.imageAlt) || cleanSanityString(card.title),
        imageFit: cleanSanityString(card.imageFit) === "contain" ? "contain" : "cover",
        imagePosition: cleanSanityString(card.imagePosition) || "center",
        title: cleanSanityString(card.eyebrow) || "Learner Story",
        sanityCardId: card._id,
      };
    }), [siteCards]);

  const filteredStories = useMemo(() => editableStories.filter((story) => {
    const roleCategory: Record<string, string> = {
      "School Students": "School Student",
      "College Students": "College Student",
      "Working Professionals": "Working Professional",
      "Competitive Exams": "Competitive Exam Aspirant",
    };
    const categoryMatch =
      category === "All Stories" ||
      story.course === category ||
      story.role === roleCategory[category];
    const q = query.trim().toLowerCase();
    const queryMatch = !q || [
      story.name, story.role, story.city, story.course, story.quote, story.title,
    ].some((value) => value.toLowerCase().includes(q));
    return categoryMatch && queryMatch;
  }), [category, query, editableStories]);

  const featured = editableStories.length
    ? editableStories[featuredIndex % editableStories.length]
    : null;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fffdfb] text-[#102d70]">
      <section className="success-hero-section relative isolate overflow-hidden bg-[#fff2e7]">
        <div aria-hidden="true" className="success-hero-bg absolute inset-0 -z-20" style={{ backgroundImage: "url('/images/success-hero-background.webp')" }} />
        <div aria-hidden="true" className="success-hero-fade absolute inset-0 -z-10" />
        <div aria-hidden="true" className="success-hero-bottom-fade absolute inset-x-0 bottom-0 -z-10 h-12 md:h-16" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-5 px-5 pb-8 pt-7 sm:px-7 md:min-h-[340px] md:grid-cols-[minmax(0,1fr)_235px] md:gap-7 md:px-10 lg:min-h-[360px] lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-10">
          <div className="success-hero-copy relative z-10 max-w-[690px]">
            <span className="inline-flex rounded-full bg-white/75 px-3 py-1 text-[10px] font-extrabold tracking-[.12em] text-[#e94125] shadow-sm">LEARNER JOURNEYS</span>
            <HeroHeading ariaLabel="Success Stories That Inspire" className="mt-3 max-w-[660px] text-[clamp(2.3rem,4.5vw,4.1rem)] font-black leading-[.98] tracking-[-.05em] text-[#102d70]" lines={[["Success Stories"], ["That", { text: "Inspire", className: "text-[#f04422]" }]]} />
            <HeroFade delay={.35}>
              <p className="mt-3 max-w-[510px] text-sm leading-relaxed text-[#203f78] sm:text-base">
                Read learner experiences shared with Persona Institute and English with Khushi.
              </p>
            </HeroFade>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["Learner Stories", "Experiences shared by learners", Users],
                ["Learning Journeys", "Progress and milestones", Sparkles],
                ["English Growth", "Practice and confidence", BookOpen],
              ].map(([title, desc, Icon]: any) => (
                <div key={title} className="flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 shadow-sm backdrop-blur-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#f05a2a]"><Icon size={16} /></span>
                  <span><b className="block text-[10px] leading-tight">{title}</b><small className="text-[9px] text-slate-600">{desc}</small></span>
                </div>
              ))}
            </div>
          </div>
          <aside className="success-hero-metrics relative z-10 rounded-[22px] border border-white/90 bg-white/90 p-4 shadow-[0_16px_42px_rgba(74,46,25,.16)]">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-orange-50 text-[#f04b27]"><GraduationCap size={22} /></span>
            <b className="mt-3 block text-3xl font-black">{editableStories.length}</b>
            <span className="text-xs text-[#52658d]">Published learner stories</span>
            <p className="mt-3 text-xs leading-relaxed text-[#52658d]">Stories are published here after they are added to the Success Stories section in Sanity.</p>
          </aside>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-2 max-w-[1440px] px-4 sm:px-7 lg:px-10">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-sm">
          {categories.map((item, i) => (
            <button key={item} onClick={() => setCategory(item)} className={`story-filter flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-bold ${category === item ? "bg-gradient-to-r from-[#ff4a16] to-[#ff7014] text-white shadow-md" : "bg-white text-[#173879] hover:bg-orange-50"}`}>
              {i === 0 ? <SlidersHorizontal size={15} /> : i === 1 ? <BookOpen size={15} /> : i === 2 ? <Sparkles size={15} /> : i === 3 ? <GraduationCap size={15} /> : i === 4 ? <BookOpen size={15} /> : i === 5 ? <Users size={15} /> : <Trophy size={15} />} {item}
            </button>
          ))}
        </div>
      </section>

      {featured && (
        <m.section initial="hidden" whileInView="show" viewport={{ once: true, amount: .08, margin: "0px 0px -4% 0px" }} variants={fadeUp} id="featured-story" className="mx-auto max-w-[1440px] px-5 pb-5 pt-5 sm:px-7 lg:px-10">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div><h2 className="text-xl font-black tracking-tight sm:text-2xl">Featured Success Story</h2><p className="mt-1 text-xs text-[#52658d] sm:text-sm">A learner experience shared with Persona Institute.</p></div>
            {editableStories.length > 1 && (
              <div className="flex shrink-0 gap-2">
                <button aria-label="Previous story" onClick={() => setFeaturedIndex((featuredIndex + editableStories.length - 1) % editableStories.length)} className="grid h-9 w-9 place-items-center rounded-full border border-orange-200 text-orange-600 transition hover:bg-orange-50"><ChevronLeft size={18} /></button>
                <button aria-label="Next story" onClick={() => setFeaturedIndex((featuredIndex + 1) % editableStories.length)} className="grid h-9 w-9 place-items-center rounded-full border border-orange-200 text-orange-600 transition hover:bg-orange-50"><ChevronRight size={18} /></button>
              </div>
            )}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={featured.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .3, ease: EASE_OUT }}>
              <article data-sanity-edit-target className="grid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_28px_rgba(16,45,112,.06)] md:grid-cols-[.92fr_1fr]">
                <div className="relative min-h-[210px] overflow-hidden bg-orange-50 sm:min-h-[260px]">
                  <img loading="lazy" decoding="async" src={featured.image} alt={featured.imageAlt} className="h-full min-h-[210px] w-full sm:min-h-[260px]" style={{ objectFit: featured.imageFit, objectPosition: featured.imagePosition }} />
                  <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-3 py-1 text-[10px] font-bold text-white">{featured.course}</span>
                </div>
                <div className="grid gap-4 p-4 sm:p-5 lg:p-6">
                  <div>
                    <p className="text-4xl font-black leading-none text-[#ff5a2b]">“</p>
                    <blockquote className="-mt-2 text-base font-bold leading-snug text-[#102d70] sm:text-lg">{featured.quote}</blockquote>
                    <div className="mt-4 flex items-center gap-3">
                      {featured.person && <img loading="lazy" decoding="async" src={featured.person} alt="" data-sanity={sanityFieldAttribute(featured.sanityCardId, "siteCard", "secondaryImage")} className="h-10 w-10 rounded-full border border-orange-100 object-cover" />}
                      <div><b className="block text-xs">{featured.name}</b><small className="text-[10px] text-[#52658d]">{featured.role}</small></div>
                      {featured.city && <span className="ml-auto flex items-center gap-1 text-[10px] text-[#52658d]"><MapPin size={13} className="text-orange-500" />{featured.city}</span>}
                    </div>
                  </div>
                </div>
              </article>
            </m.div>
          </AnimatePresence>
        </m.section>
      )}

      <m.section initial="hidden" whileInView="show" viewport={{ once: true, amount: .08, margin: "0px 0px -4% 0px" }} variants={fadeUp} className="mx-auto max-w-[1440px] px-5 pb-7 sm:px-7 lg:px-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-xl font-black tracking-tight sm:text-2xl">More Success Stories from Our Learners</h2><p className="mt-1 text-xs text-[#52658d] sm:text-sm">Browse experiences shared by learners.</p></div>
          <div className="flex gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:w-[240px] sm:flex-none"><Search size={16} className="shrink-0 text-[#52658d]" /><input id="story-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, city, course..." className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-slate-400" /></label>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold ${showFilters ? "border-orange-300 bg-orange-50" : "border-slate-200 bg-white"}`}><SlidersHorizontal size={15} /> Filters</button>
          </div>
        </div>
        {showFilters && (
          <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-orange-100 bg-orange-50/50 p-3">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-3 py-2 text-xs font-semibold ${category === item ? "bg-[#ff4a16] text-white" : "bg-white text-[#173879]"}`}>{item}</button>)}
            <button onClick={() => { setCategory("All Stories"); setQuery(""); }} className="rounded-full px-3 py-2 text-xs font-semibold text-orange-700 underline">Clear filters</button>
          </div>
        )}
        {filteredStories.length ? (
          <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .08 }} variants={staggerParent(.05)} className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story) => (
                <m.div key={story.id} layout="position" variants={cardItem} exit="exit" transition={{ layout: { duration: DUR.routeEnter, ease: EASE_IN_OUT } }} className="min-w-0" data-sanity-edit-target>
                  <Card3D as="article" maxTilt={3} lift={4} className="story-card h-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_5px_18px_rgba(16,45,112,.05)]">
                    <div className="relative h-[190px] overflow-hidden bg-orange-50 sm:h-[145px] lg:h-[115px] xl:h-[145px]">
                      <img loading="lazy" decoding="async" src={story.image} alt={story.imageAlt} className="story-image h-full w-full" style={{ objectFit: story.imageFit, objectPosition: story.imagePosition }} />
                      <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-2 py-1 text-[9px] font-bold text-white">{story.course}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-3xl font-black leading-[.7] text-[#ff5a2b]">“</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#173879]">{story.quote}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {story.person && <img loading="lazy" decoding="async" src={story.person} alt="" data-sanity={sanityFieldAttribute(story.sanityCardId, "siteCard", "secondaryImage")} className="h-9 w-9 rounded-full border border-orange-100 object-cover" />}
                        <div className="min-w-0"><b className="block truncate text-[11px]">{story.name}</b><small className="block text-[10px] leading-tight text-[#52658d]">{story.role}</small></div>
                      </div>
                      {story.city && <p className="mt-2 flex items-center gap-1 text-[10px] text-[#52658d]"><MapPin size={12} className="text-orange-500" />{story.city}</p>}
                    </div>
                  </Card3D>
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-10 text-center">
            <p className="font-bold">{editableStories.length ? "No stories match your search." : "Success stories will appear here once published."}</p>
            <p className="mt-2 text-sm text-[#52658d]">Add learner stories in Sanity → Site Cards → Success Stories.</p>
            {editableStories.length > 0 && <button onClick={() => { setCategory("All Stories"); setQuery(""); }} className="mt-3 text-sm font-semibold text-orange-600 underline">Clear search and filters</button>}
          </div>
        )}
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{ once: true, amount: .08, margin: "0px 0px -4% 0px" }} variants={fadeUp} className="relative overflow-hidden bg-gradient-to-r from-[#fff0e5] via-[#fffaf5] to-[#ffe3cf]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-5 px-5 py-8 sm:px-7 md:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-10">
          <div className="success-hero-copy relative z-10">
            <span className="inline-flex rounded-full bg-[#ffe4df] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#ed4027]">YOUR JOURNEY STARTS HERE</span>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Start Your English Journey <em className="text-[#f04422]">Today</em></h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#52658d]">Explore the learning options available at Persona Institute and choose the next step for your goals.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <TransitionLink href="/courses" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-5 py-3 text-sm font-bold text-white shadow-md">Explore Courses <ArrowRight size={16} /></TransitionLink>
              <TransitionLink href="/contact" className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white px-5 py-3 text-sm font-bold">Talk to Our Team <ArrowRight size={15} /></TransitionLink>
            </div>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#17233d] shadow-[0_18px_45px_rgba(16,45,112,.14)]">
            <img loading="lazy" decoding="async" src="/images/ajay-sir-persona-wide.webp" alt="Ajay Sir at Persona Institute" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102d70]/25 via-transparent to-transparent" />
          </div>
        </div>
      </m.section>


    </main>
  );
}
