"use client";

import TransitionLink from "@/components/motion/TransitionLink";
import { m } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { brands, classplusLoginUrl } from "@/lib/classplus/brands";
import type { SanitySiteCard } from "@/lib/sanity/client";
import { sanityFieldAttribute } from "@/lib/sanity/visual";
import { cleanSanityString } from "@/lib/sanity/client";
import { HeroFade, HeroHeading } from "@/components/motion/HeroText";
import { useEffect, useState } from "react";
import {
  ArrowRight, Search, Menu, X, Users, Play, Star, Globe2, BarChart3,
  BookOpen, MonitorPlay, ClipboardCheck, HeartHandshake, ShieldCheck,
  Target, Eye, GraduationCap, Award, UsersRound, Lightbulb, CheckCircle2, ExternalLink, Smartphone
} from "lucide-react";


function CountUpText({ value }: { value: string }) {
  const match = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[1].replace(/,/g, "")) : 0;
  const suffix = match?.[2] ?? "";
  const decimals = match?.[1].includes(".") ? 1 : 0;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let frame = 0;
    let start = 0;
    const tick = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / 1250, 1);
      setCurrent(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{current.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Learners", tone: "orange" },
  { icon: Play, value: "500+", label: "Video Lessons", tone: "pink" },
  { icon: Star, value: "4.8/5", label: "Average Rating", tone: "orange" },
  { icon: BarChart3, value: "95%", label: "Report Visible Improvement", tone: "pink" },
  { icon: Globe2, value: "500+", label: "Cities Across India", tone: "violet" },
];

const timeline = [
  ["2021", "Started online teaching with a small group of students"],
  ["2022", "Launched structured courses for learners across India"],
  ["2023", "Introduced Persona English and English with Khushi"],
  ["2024", "Built a community of 10,000+ learners"],
  ["2025", "Continuing our mission to make English learning practical, simple and accessible"],
];

const benefits = [
  { icon: BookOpen, title: "Practical Learning", desc: "Real-life examples and conversations", tone: "orange" },
  { icon: MonitorPlay, title: "Live + Recorded Classes", desc: "Learn anytime, anywhere", tone: "red" },
  { icon: ClipboardCheck, title: "Structured Courses", desc: "Step-by-step learning path", tone: "blue" },
  { icon: GraduationCap, title: "Tests & Practice", desc: "Improve with regular practice", tone: "violet" },
  { icon: HeartHandshake, title: "Supportive Community", desc: "Be part of a positive learning environment", tone: "cyan" },
  { icon: ShieldCheck, title: "Trusted by Learners", desc: "A growing community across India", tone: "orange" },
];

export default function AboutPageClient({ siteCards = [] }: { siteCards: SanitySiteCard[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const appCards = [
    {
      key: "about-persona-app",
      brand: brands.persona,
      title: "Persona English",
      subtitle: "Learn with Ajay Sir",
      description: "Build spoken English, grammar and vocabulary through structured live and recorded learning.",
      image: "/images/persona-logo.png",
      badge: "PERSONA INSTITUTE",
      points: ["Live & recorded classes", "Grammar and spoken English", "Practice with guidance"],
      href: classplusLoginUrl(brands.persona),
      tone: "persona",
    },
    {
      key: "about-khushi-app",
      brand: brands.khushi,
      title: "English with Khushi",
      subtitle: "Learn with Khushi Ma’am",
      description: "Practice everyday English, grow your confidence and make speaking a regular habit.",
      image: "/images/course-khushi.jpg",
      badge: "A FRIENDLY LEARNING SPACE",
      points: ["Daily speaking practice", "Confidence building", "Learner-friendly lessons"],
      href: classplusLoginUrl(brands.khushi),
      tone: "khushi",
    },
  ].map((base) => {
    const override = siteCards.find((card) => {
      const key = cleanSanityString(typeof card.key === "string" ? card.key : card.key?.current);
      return key === base.key;
    });
    return {
      ...base,
      title: override?.title || base.title,
      subtitle: override?.subtitle || base.subtitle,
      description: override?.description || base.description,
      image: cleanSanityString(override?.imageUrl) || base.image,
      imageFit: (cleanSanityString(override?.imageFit) === 'cover' ? 'cover' : 'contain') as 'cover' | 'contain',
      imagePosition: cleanSanityString(override?.imagePosition) || 'center',
      badge: override?.badge || base.badge,
      points: override?.features?.length ? override.features : base.points,
      href: cleanSanityString(override?.buttonUrl) || base.href,
      buttonLabel: override?.buttonLabel || `Open ${override?.title || base.title}`,
      sanityCardId: override?._id,
    };
  });
  return (
    <main className="min-h-screen overflow-x-clip bg-[#fffdfb] text-[#102d70]">

      {/* About hero: supplied panoramic image is the background, with a soft fade for readable content */}
      <section className="about-hero-section relative isolate overflow-hidden bg-[#fff5eb]">
        <div
          aria-hidden="true"
          className="about-hero-bg absolute inset-0 -z-20 bg-cover bg-[position:64%_center] md:bg-[position:62%_43%]"
          style={{ backgroundImage: "url('/images/about-hero-background.webp')" }}
        />
        {/* Keep the portrait crisp; fade only the lower edge into the next section. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-[#fffdfb] via-[#fffdfb]/45 to-transparent" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-5 px-5 pb-7 pt-4 sm:px-7 md:min-h-[340px] md:grid-cols-[minmax(0,1fr)_minmax(245px,290px)] md:gap-7 md:px-10 md:pb-8 lg:min-h-[360px] lg:gap-10">
          <div className="about-enter relative z-10 max-w-[650px] py-2 md:py-3">
            <div className="mb-3 flex items-center gap-2 text-xs text-[#51678f]">
              <TransitionLink href="/" className="hover:text-orange-600">Home</TransitionLink><span>›</span><span>About Us</span>
            </div>
            <span className="inline-flex rounded-full border border-[#ffd5c9] bg-white/85 px-3 py-1 text-[10px] font-extrabold tracking-[0.11em] text-[#f04422] shadow-sm">ABOUT PERSONA INSTITUTE</span>
            <HeroHeading ariaLabel="Building Confident English Speakers for a Brighter Tomorrow" className="mt-3 max-w-[650px] text-[clamp(2rem,3.5vw,3.65rem)] font-black leading-[1.01] tracking-[-0.045em] text-[#102d70]" lines={[["Building Confident"],[{text:"English Speakers",className:"text-[#f04422]"},"for"],["a Brighter Tomorrow"]]}/>
            <HeroFade delay={.35}><p className="mt-3 max-w-[500px] text-sm leading-relaxed text-[#284779] sm:text-base">
              Persona Institute is more than an online learning platform — it’s a mission to help every student speak, think and grow with confidence in English.
            </p></HeroFade>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <TransitionLink href="/courses" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,83,25,.22)] transition hover:-translate-y-0.5">Our Courses <ArrowRight size={16}/></TransitionLink>
              <a href="#founder" className="inline-flex items-center gap-2 rounded-full border border-[#ff6840] bg-white/90 px-4 py-3 text-sm font-bold text-[#102d70] transition hover:bg-orange-50"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#ff3928] text-white"><Play size={11} fill="currentColor"/></span> Watch Our Story</a>
            </div>
          </div>
          <aside className="about-enter about-enter-delay about-quote-card relative z-10 ml-auto w-full max-w-[290px] rounded-[20px] border border-white/90 bg-white/90 p-4 shadow-[0_14px_36px_rgba(74,46,25,.15)] md:mt-0 lg:p-5">
            <div className="flex gap-2"><span className="-mt-1 text-4xl font-black leading-none text-[#ff5a24]">“</span><div><p className="text-base font-semibold leading-[1.35] text-[#102d70]">Education is the most powerful weapon to change your future.</p><p className="mt-3 text-xs font-semibold text-[#173879]">— Ajay Sir</p><p className="text-[10px] text-[#52658d]">Founder, Persona Institute</p></div></div>
            <div className="my-3 h-px bg-gradient-to-r from-orange-100 via-slate-100 to-transparent" />
            <ul className="grid grid-cols-1 gap-2.5 text-xs font-medium text-[#173879]">
              {[{icon:BookOpen,label:"Learn with Practical Approach"},{icon:MonitorPlay,label:"Build Real Communication Skills"},{icon:UsersRound,label:"Get Personal Guidance"},{icon:Award,label:"Grow in English & in Life"}].map(({icon:Icon,label})=> <li key={label} className="flex items-center gap-2.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fff0e8] text-[#ff5425]"><Icon size={15}/></span><span>{label}</span></li>)}
            </ul>
          </aside>
        </div>
      </section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="about-stats relative z-30 mx-auto -mt-1 grid max-w-[1440px] grid-cols-2 gap-2 px-5 py-3 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
        {stats.map(({icon:Icon,value,label,tone})=><div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-4 shadow-[0_5px_20px_rgba(15,39,87,.05)] sm:px-4"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone==="pink"?"bg-rose-100 text-rose-500":tone==="violet"?"bg-violet-100 text-violet-600":"bg-orange-100 text-orange-500"}`}><Icon size={21} fill={label==="Average Rating"?"currentColor":"none"}/></span><span><strong className="block text-lg font-black leading-tight tabular-nums sm:text-xl"><CountUpText value={value}/></strong><span className="mt-1 block text-[10px] leading-tight text-[#52658d] sm:text-xs">{label}</span></span></div>)}
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="mx-auto grid max-w-[1440px] items-center gap-5 px-5 py-3 md:grid-cols-[290px_1fr_230px] lg:px-10">
        <div className="overflow-hidden rounded-2xl bg-orange-50"><img src="/images/ajay-sir-tablet.png" alt="Learning English with Persona Institute" className="h-[235px] w-full object-contain object-center sm:h-[260px]"/></div>
        <div className="py-2">
          <span className="rounded-full bg-[#fff0df] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#f04c20]">OUR STORY</span>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">How Persona Institute Began</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#52658d]">Persona Institute was founded with a simple belief — that everyone can learn English, regardless of their background, if they get the right guidance, practical learning and continuous support.</p>
          <p className="mt-3 text-sm leading-relaxed text-[#52658d]">What started as a small online initiative has grown into a learning community. Through structured courses, live practice and real-life examples, we help students overcome their fear and speak English with confidence.</p>
        </div>
        <div className="about-process-line relative space-y-3 border-l-2 border-orange-200 py-2 pl-5">
          {timeline.map(([year,desc])=><div key={year} className="relative"><span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-orange-500 shadow"/><strong className="block text-sm font-extrabold">{year}</strong><p className="mt-0.5 text-xs leading-relaxed text-[#52658d]">{desc}</p></div>)}
        </div>
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="relative mt-5 overflow-hidden rounded-[30px] bg-gradient-to-r from-[#fff0e7] via-[#fffaf6] to-[#ffeadb]">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-5 py-6 md:grid-cols-2 lg:px-10">
          <div className="flex gap-4 rounded-2xl bg-white/70 p-4 sm:p-5"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#ff4a20] shadow-sm"><Target size={31}/></span><div><h3 className="text-lg font-black">Our Mission</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-[#52658d]">To deliver high-quality, affordable and practical English learning programs that empower students to communicate confidently and build a better future.</p></div></div>
          <div className="flex gap-4 rounded-2xl bg-white/70 p-4 sm:p-5"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#ff4a20] shadow-sm"><Eye size={31}/></span><div><h3 className="text-lg font-black">Our Vision</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-[#52658d]">To become a trusted learning platform, helping learners speak English with confidence and create better opportunities in life.</p></div></div>
        </div>
      </m.section>

      {/* Two learning apps — highlighted as separate destinations. */}
      <m.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: .08, margin: "0px 0px -4% 0px" }}
        variants={fadeUp}
        className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10"
      >
        <div className="mb-5 max-w-2xl">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-extrabold tracking-wider text-rose-600">LEARN WITH PERSONA</span>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Two Learning Apps. One Goal: Better English.</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#52658d]">Choose the learning experience that suits you and continue on the dedicated app.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {appCards.map((app) => (
            <article
              key={app.brand.id}
              data-sanity-edit-target
              className={`group relative isolate overflow-hidden rounded-[26px] border p-5 shadow-[0_14px_38px_rgba(20,40,90,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(20,40,90,.14)] sm:p-6 ${
                app.tone === "persona"
                  ? "border-orange-100 bg-gradient-to-br from-white via-orange-50/70 to-rose-50"
                  : "border-violet-100 bg-gradient-to-br from-white via-violet-50/80 to-indigo-50"
              }`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-16 -z-10 h-48 w-48 rounded-full blur-3xl ${app.tone === "persona" ? "bg-orange-200/45" : "bg-violet-200/55"}`} />
              <div className="flex items-start gap-4">
                <span className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-md ${app.tone === "persona" ? "ring-2 ring-orange-100" : "ring-2 ring-violet-100"}`}>
                  <img src={app.image} alt={`${app.title} app`} data-sanity={app.sanityCardId ? sanityFieldAttribute(app.sanityCardId, "siteCard", "image") : undefined} className="h-full w-full rounded-xl" style={{ objectFit: app.imageFit, objectPosition: app.imagePosition }} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-[.12em] ${app.tone === "persona" ? "bg-orange-100 text-orange-700" : "bg-violet-100 text-violet-700"}`}>{app.badge}</span>
                  <h3 className="mt-2 text-xl font-black tracking-tight text-[#102d70] sm:text-2xl">{app.title}</h3>
                  <p className="text-xs font-bold text-[#52658d]">{app.subtitle}</p>
                </div>
                <Smartphone className={`hidden h-6 w-6 shrink-0 sm:block ${app.tone === "persona" ? "text-orange-500" : "text-violet-500"}`} />
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#52658d]">{app.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.points.map((point) => (
                  <span key={point} className="rounded-full border border-white/90 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#284779] shadow-sm">{point}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {app.href ? (
                  <a href={app.href} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 ${
                    app.tone === "persona" ? "bg-gradient-to-r from-[#ff5a1f] to-[#ef2441]" : "bg-gradient-to-r from-violet-600 to-indigo-600"
                  }`}>
                    {app.buttonLabel} <ExternalLink size={15} />
                  </a>
                ) : (
                  <a href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-700 px-5 py-2.5 text-sm font-extrabold text-white">
                    Choose app at login <ArrowRight size={15} />
                  </a>
                )}
                <a href="/courses" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2.5 text-sm font-bold text-[#102d70] shadow-sm transition hover:bg-white">
                  Explore courses <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="mx-auto max-w-[1440px] px-5 py-7 lg:px-10">
        <span className="rounded-full bg-[#fff0df] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#f04c20]">WHAT MAKES US DIFFERENT?</span>
        <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">More Than Just English Courses</h2>
        <p className="mt-1 text-sm text-[#52658d]">We focus on real learning, real practice and real results. Here’s what you get with Persona Institute.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {benefits.map(({icon:Icon,title,desc,tone})=><div key={title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_5px_18px_rgba(15,39,87,.045)] transition hover:-translate-y-1 hover:shadow-lg"><span className={`grid h-10 w-10 place-items-center rounded-full ${tone==="red"?"bg-rose-100 text-rose-600":tone==="blue"?"bg-blue-100 text-blue-600":tone==="violet"?"bg-violet-100 text-violet-600":tone==="cyan"?"bg-cyan-100 text-cyan-600":"bg-orange-100 text-orange-600"}`}><Icon size={21}/></span><h3 className="mt-3 text-sm font-extrabold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-[#52658d]">{desc}</p></div>)}
        </div>
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="comparison-section mx-auto max-w-[1440px] px-5 py-7 lg:px-10">
        <div className="mb-5 max-w-2xl"><span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold tracking-wider text-blue-700">THE PERSONA DIFFERENCE</span><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Traditional Learning vs Persona Learning</h2><p className="mt-2 text-sm leading-relaxed text-[#52658d]">A quick look at how structured practice and guidance support a more confident learning journey.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="comparison-card comparison-traditional rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="text-lg font-black text-slate-700">Traditional learning</h3><p className="mt-1 text-xs text-slate-500">Often focused on one-way instruction</p><ul className="mt-4 grid gap-3 text-sm text-slate-600">{['Limited speaking practice','Progress can be hard to measure','Less flexible revision routine','Doubts may wait until the next class'].map(item=><li key={item} className="flex items-start gap-2"><span className="comparison-minus mt-0.5">−</span>{item}</li>)}</ul></article>
          <article className="comparison-card comparison-persona rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/70 p-5 sm:p-6"><h3 className="text-lg font-black text-[#102d70]">Persona learning</h3><p className="mt-1 text-xs text-[#52658d]">Practice, feedback and steady progress</p><ul className="mt-4 grid gap-3 text-sm text-[#284779]">{['Live speaking and daily practice','Tests and visible progress tracking','Recorded lessons to revise anytime','Guidance and doubt-solving support'].map(item=><li key={item} className="flex items-start gap-2"><CheckCircle2 className="comparison-check mt-0.5 shrink-0" size={17}/>{item}</li>)}</ul></article>
        </div>
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} id="founder" className="mx-auto grid max-w-[1440px] items-center gap-5 px-5 pb-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#f8e9df]"><img src="/images/ajay-sir-persona-wide.webp" alt="Ajay Sir at Persona Institute" className="absolute inset-0 h-full w-full object-cover object-center"/><button aria-label="Play founder introduction" className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-white/90 text-[#f04422] shadow-xl"><Play fill="currentColor" size={23}/></button></div>
        <div><span className="rounded-full bg-[#ffe6e0] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#f04422]">MEET OUR FOUNDER</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Ajay Singh Rajput (Ajay Sir)</h2><p className="mt-2 text-sm leading-relaxed text-[#52658d]">With a learner-first approach, practical examples and structured lessons, our goal is to help students overcome hesitation and build real communication skills. Persona Institute is designed to make English learning approachable and useful in everyday life.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[{icon:Award,top:"Years of",bottom:"Teaching Experience"},{icon:UsersRound,top:"10,000+",bottom:"Students Guided"},{icon:GraduationCap,top:"Specialist in",bottom:"Spoken English"},{icon:Users,top:"Mentor &",bottom:"Career Guide"}].map(({icon:Icon,top,bottom})=><div key={bottom} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-500"><Icon size={16}/></span><span><strong className="block text-[11px]">{top}</strong><span className="text-[10px] text-[#52658d]">{bottom}</span></span></div>)}</div>
          <div className="mt-4 flex flex-wrap gap-2"><TransitionLink href="/courses" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1738] to-[#ff5017] px-5 py-3 text-xs font-bold text-white">Explore Courses <ArrowRight size={15}/></TransitionLink><TransitionLink href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#ff6840] bg-white px-5 py-3 text-xs font-bold">Talk to Our Team</TransitionLink></div>
        </div>
      </m.section>

      <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="relative overflow-hidden bg-gradient-to-r from-[#fff0e4] via-[#fffaf5] to-[#ffdfca]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-5 px-5 py-7 md:grid-cols-2 lg:px-10">
          <div><h2 className="max-w-md text-2xl font-black leading-tight tracking-tight sm:text-3xl">Be a Part of Our Growing Learning Community</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-[#52658d]">Join thousands of students who are building their confidence and creating better opportunities with Persona Institute.</p><TransitionLink href="/courses" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-5 py-3 text-xs font-bold text-white">Start Learning Today <ArrowRight size={15}/></TransitionLink></div>
          <div className="relative aspect-video overflow-hidden rounded-2xl"><img src="/images/ajay-sir-persona-wide.webp" alt="Ajay Sir at Persona Institute" className="absolute inset-0 h-full w-full rounded-2xl object-cover object-center"/><div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl border border-white bg-white/95 px-5 py-3 shadow-xl"><strong className="block text-xl font-black">10,000+</strong><span className="text-xs text-[#52658d]">Happy Learners</span></div></div>
        </div>
      </m.section>
      <footer className="bg-[#102d70] px-5 py-5 text-center text-xs text-white/75">© {new Date().getFullYear()} Persona Institute. Learn · Practice · Grow.</footer>
    </main>
  );
}
