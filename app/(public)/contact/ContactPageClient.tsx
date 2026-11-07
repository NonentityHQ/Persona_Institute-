"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import type { SanitySiteCard } from "@/lib/sanity/client";
import { sanityFieldAttribute } from "@/lib/sanity/visual";
import { cleanSanityString } from "@/lib/sanity/client";
import TransitionLink from "@/components/motion/TransitionLink";
import { m } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { HeroFade, HeroHeading } from "@/components/motion/HeroText";
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Clock, Building2, UserRound, Users, Mic, BookOpen, GraduationCap, Star, ChevronDown, ChevronUp, Menu, X, MessageSquare, Award } from "lucide-react";

const faqs = [
  { key: "faq-enroll", q: "How can I enroll in a course?", a: "You can enroll through our website or contact us via WhatsApp. Our team will help you choose a course that fits your goals." },
  { key: "faq-demo", q: "Do you provide demo classes?", a: "Contact our team to ask about available demo classes and upcoming batches." },
  { key: "faq-course-choice", q: "Which course is best for me?", a: "Tell us about your current English level and goals. Our team will guide you towards a suitable course." },
  { key: "faq-refund", q: "Can I get a refund if I am not satisfied?", a: "Refund eligibility depends on the course and its applicable terms. Please contact our team before enrolling." },
  { key: "faq-offline", q: "Do you offer offline classes?", a: "Contact Persona Institute to confirm current offline class availability and location details." },
];
const DEFAULT_CONTACT_SETTINGS = {
  phonePrimary: "8719977802",
  phoneSecondary: "",
  whatsapp: "8719977802",
  email: "Personaenglishknw@gmail.com",
  address: "Navchandi Mandir Main Road, Rameshwar Nagar, Khandwa, Madhya Pradesh 450001, India",
};

function phoneDigits(value: string) { return value.replace(/\D/g, ""); }
function phoneHref(value: string) {
  const digits = phoneDigits(value);
  if (!digits) return "#";
  return `tel:+${digits.length === 10 ? `91${digits}` : digits}`;
}
function whatsappHref(value: string) {
  const digits = phoneDigits(value);
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}
function displayPhone(value: string) {
  const digits = phoneDigits(value);
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  return value;
}

type ContactSettings = typeof DEFAULT_CONTACT_SETTINGS;

export default function ContactPageClient({ contactSettings, siteCards = [] }: { contactSettings: ContactSettings; siteCards: SanitySiteCard[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [notice, setNotice] = useState("");
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", query: "", message: "" });
  const editableFaqs = faqs.map((faq) => {
    const override = siteCards.find((card) => card.externalId === faq.key);
    return { ...faq, q: override?.title || faq.q, a: override?.description || faq.a };
  });
  const contactCard = (externalId: string) => siteCards.find((card) => cleanSanityString(card.externalId) === externalId);

  function updateForm(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) { setForm({ ...form, [e.target.name]: e.target.value }); }
  const phoneOptions = [contactSettings.phonePrimary, contactSettings.phoneSecondary].map((value) => value.trim()).filter(Boolean);
  const whatsappNumber = contactSettings.whatsapp.trim() || DEFAULT_CONTACT_SETTINGS.whatsapp;
  const emailAddress = contactSettings.email.trim() || DEFAULT_CONTACT_SETTINGS.email;
  const whatsappUrl = whatsappHref(whatsappNumber);
  const emailUrl = `mailto:${emailAddress}`;
  const officeAddress = contactSettings.address || DEFAULT_CONTACT_SETTINGS.address;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`Persona Institute, ${officeAddress}`)}`;

  function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = ["Hello Persona Institute!", `Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, `Query: ${form.query}`, `Message: ${form.message}`].join("\n");
    window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setNotice("Your inquiry is ready in WhatsApp. Please send it there to complete your request.");
  }
  const nav = [["Home", "/"], ["Courses", "/courses"], ["Free Tests", "/free-tests"], ["Success Stories", "/reviews"], ["About Us", "/about"], ["Contact", "/contact"]];
  return <main className="min-h-screen overflow-x-clip bg-[#fffdfb] text-[#09276f]">

    <section className="contact-hero-section relative isolate overflow-hidden">
      <div aria-hidden="true" className="contact-hero-glow contact-hero-glow-one" />
      <div aria-hidden="true" className="contact-hero-glow contact-hero-glow-two" />
      <div aria-hidden="true" className="contact-hero-wave" />
      <div className="contact-hero-inner">
        <div className="contact-hero-copy">
          <div className="mb-5 flex items-center gap-2 text-xs font-medium text-[#51678f]">
            <TransitionLink href="/" className="hover:text-orange-600">Home</TransitionLink>
            <span>›</span>
            <span>Contact Us</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-[#fff0e5] px-4 py-2 text-[11px] font-extrabold tracking-[0.1em] text-[#f04422] shadow-sm">
            <MessageCircle size={15} /> CONTACT US
          </span>
          <HeroHeading
            ariaLabel="We’re Here to Help You"
            className="mt-5 max-w-[620px] text-[clamp(2.7rem,4.7vw,4.8rem)] font-black leading-[.98] tracking-[-.055em] text-[#102d70]"
            lines={[["We’re Here to"], [{ text: "Help You", className: "contact-title-accent" }]]}
          />
          <HeroFade delay={0.38}>
            <p className="mt-6 max-w-[540px] text-[15px] leading-[1.7] text-[#284779] sm:text-base">
              Have a question, need guidance, or want to know which course is right for you? Reach out to us — we&apos;re always happy to help.
            </p>
          </HeroFade>
          <HeroFade delay={0.58}>
          <div className="mt-7 flex max-w-[590px] flex-wrap gap-2.5">
            {[
              { label: "Course Guidance", icon: BookOpen },
              { label: "Doubt Support", icon: MessageCircle },
              { label: "Career Guidance", icon: Users },
              { label: "Quick Response", icon: Clock },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/95 px-3.5 py-2.5 text-xs font-bold text-[#173879] shadow-[0_5px_16px_rgba(15,39,87,.07)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fff0e7] text-[#ff4a1d]"><Icon size={15} /></span>
                {label}
              </span>
            ))}
          </div>
          </HeroFade>
        </div>

        <div className="contact-hero-visual" aria-label="Ajay Sir, Persona Institute">
          <div className="contact-hero-orbit" />
          <div className="contact-hero-floor-shadow" />
          <img
            src="/images/ajay-sir-contact-person.webp"
            alt="Ajay Sir welcoming students"
            className="contact-hero-person"
            fetchPriority="high"
          />
          <img
            src="/images/persona-logo-contact.webp"
            alt="Persona Institute logo"
            className="contact-hero-logo"
          />
          <div className="contact-hero-books" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>

        <aside className="contact-hero-card">
          <div className="flex gap-3">
            <span className="contact-quote-mark">“</span>
            <div>
              <p className="text-[17px] font-extrabold leading-[1.35] text-[#102d70] sm:text-lg">
                Same Guidance. Real Progress. We&apos;re Here to Help You.
              </p>
              <p className="mt-4 text-xs font-extrabold text-[#173879]">— Persona Institute Team</p>
              <p className="mt-1 text-[10px] text-[#52658d]">Course guidance · Doubt support · Career advice</p>
            </div>
          </div>
          <div className="my-4 h-px bg-gradient-to-r from-orange-200 via-slate-100 to-transparent" />
          <ul className="space-y-3.5 text-[13px] font-semibold text-[#173879]">
            {[
              { icon: GraduationCap, label: "Find the right course" },
              { icon: MessageCircle, label: "Get your doubts resolved" },
              { icon: Users, label: "Plan your learning journey" },
              { icon: Clock, label: "Quick response from our team" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff0e8] text-[#ff5425]"><Icon size={17} /></span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>

    <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
      {[
        { id: "contact-call", label: contactCard("contact-call")?.title || "Call Us", value: phoneOptions[0] ? displayPhone(phoneOptions[0]) : "Add a phone number", detail: contactCard("contact-call")?.description || (phoneOptions.length > 1 ? "Choose which number to call" : "Select to call · Add a second number in Sanity"), icon: Phone, color: "orange", action: "call" },
        { id: "contact-whatsapp", label: contactCard("contact-whatsapp")?.title || "WhatsApp Us", value: displayPhone(whatsappNumber), detail: contactCard("contact-whatsapp")?.description || "Quick Support", icon: MessageCircle, color: "green", href: whatsappUrl },
        { id: "contact-email", label: contactCard("contact-email")?.title || "Email Us", value: emailAddress, detail: contactCard("contact-email")?.description || "We reply within 24 hours", icon: Mail, color: "orange", href: emailUrl },
        { id: "contact-office", label: contactCard("contact-office")?.title || "Visit Our Office", value: contactCard("contact-office")?.subtitle || "Rameshwar Nagar, Khandwa", detail: contactCard("contact-office")?.description || "Navchandi Mandir Main Road", icon: MapPin, color: "orange", href: mapsUrl },
      ].map((item) => {
        const Icon = item.icon;
        const cardClass = "group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-[0_5px_20px_rgba(15,39,87,0.05)] transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg";
        const cardContent = <><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white ${item.color === "green" ? "bg-[#19c95a]" : "bg-gradient-to-br from-[#ff6a24] to-[#ff2818]"}`}><Icon size={23}/></span><span className="min-w-0"><strong className="block text-sm">{item.label}</strong><span className="mt-1 block break-words text-sm font-extrabold">{item.value}</span><span className="mt-1 block text-xs text-slate-500">{item.detail}</span></span></>;
        return item.action === "call"
          ? <button key={item.id} type="button" onClick={() => setCallModalOpen(true)} className={cardClass} data-sanity-edit-target>{cardContent}</button>
          : <a key={item.id} href={item.href || "#"} target={item.href?.startsWith("http") ? "_blank" : undefined} rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined} className={cardClass} data-sanity-edit-target>{cardContent}</a>;
      })}
    </m.section>

    <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-4 lg:grid-cols-[1.05fr_1fr] lg:px-10">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(15,39,87,0.055)] sm:p-7"><span className="rounded-full bg-[#ffe2e0] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#ff3341]">SEND US A MESSAGE</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Get in Touch</h2><p className="mt-1 text-sm leading-relaxed text-[#526b9f]">Fill out the form and our team will get back to you soon.</p>
        <form onSubmit={submitForm} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2">{[{label:"Your Name",name:"name",placeholder:"Enter your name",icon:UserRound,type:"text"},{label:"Email Address",name:"email",placeholder:"Enter your email",icon:Mail,type:"email"}].map(({label,name,placeholder,icon:Icon,type})=><label key={name} className="block text-xs font-semibold">{label} <span className="text-red-500">*</span><span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 px-3"><Icon size={18} className="shrink-0 text-[#34528c]"/><input required type={type} name={name} value={form[name as keyof typeof form]} onChange={updateForm} placeholder={placeholder} className="h-11 w-full min-w-0 bg-transparent text-sm font-normal outline-none placeholder:text-slate-400"/></span></label>)}</div>
          <label className="block text-xs font-semibold">Phone Number <span className="text-red-500">*</span><span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 px-3"><Phone size={18} className="shrink-0 text-[#34528c]"/><span className="border-r border-slate-200 pr-2 text-sm">🇮🇳 +91</span><input required type="tel" name="phone" value={form.phone} onChange={updateForm} pattern="[0-9]{10}" title="Enter a 10-digit mobile number" placeholder="Enter your phone number" className="h-11 w-full min-w-0 bg-transparent text-sm font-normal outline-none placeholder:text-slate-400"/></span></label>
          <label className="block text-xs font-semibold">Select Your Query <span className="text-red-500">*</span><span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 px-3"><MessageCircle size={18} className="shrink-0 text-[#34528c]"/><select required name="query" value={form.query} onChange={updateForm} className="h-11 w-full bg-transparent text-sm font-normal outline-none"><option value="">Choose an option</option>{["Course Guidance","Course Fees","Demo Class","Technical Support","Career Guidance","Other Query"].map(x=><option key={x}>{x}</option>)}</select></span></label>
          <label className="block text-xs font-semibold">Message <span className="text-red-500">*</span><span className="mt-2 flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3"><MessageSquare size={18} className="mt-1 shrink-0 text-[#34528c]"/><textarea required name="message" value={form.message} onChange={updateForm} rows={4} placeholder="Tell us how we can help you..." className="w-full resize-y bg-transparent text-sm font-normal outline-none placeholder:text-slate-400"/></span></label>
          <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff1738] to-[#ff4015] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5">Send Message <ArrowRight size={18}/></button>{notice&&<p role="status" className="rounded-lg bg-green-50 p-3 text-sm leading-relaxed text-green-800">{notice}</p>}</form>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(15,39,87,0.055)] sm:p-7"><div className="mb-4 flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-orange-50 text-[#ff481d]"><MapPin size={27} fill="currentColor"/></span><div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Our Office</h2><p className="mt-1 text-sm text-[#526b9f]">Visit us for in-person guidance, course details or any other information.</p></div></div>
        <div className="overflow-hidden rounded-xl bg-[#f8e6d5]"><img src={cleanSanityString(contactCard("contact-office")?.imageUrl) || "/images/contact-office-reference.webp"} alt={contactCard("contact-office")?.imageAlt || "Persona Institute office"} data-sanity={contactCard("contact-office")?._id ? sanityFieldAttribute(contactCard("contact-office")!._id, "siteCard", "image") : undefined} className="h-40 w-full sm:h-44" style={{ objectFit: cleanSanityString(contactCard("contact-office")?.imageFit) === 'cover' ? 'cover' : 'contain', objectPosition: cleanSanityString(contactCard("contact-office")?.imagePosition) || 'center' }}/></div>
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-orange-100 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><MapPin size={21} className="mt-1 shrink-0 text-[#ff4920]"/><div className="text-xs leading-relaxed"><strong className="block">Address</strong><strong className="block">Persona Institute</strong><span className="text-[#526b9f]">{officeAddress}</span></div></div><a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-xs font-bold text-[#ff3b1a] hover:bg-orange-50">Get Directions <ArrowRight size={15}/></a></div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">{[{icon:Clock,title:"Office Hours",desc:<>Mon - Sat<br/>10:00 AM - 6:00 PM</>},{icon:Building2,title:"Nearest Landmark",desc:<>Navchandi Mandir Main Road</>},{icon:MapPin,title:"Parking",desc:<>Please confirm availability</>}].map(({icon:Icon,title,desc})=><div key={title} className="rounded-xl bg-[#fffaf7] p-3"><Icon size={21} className="mb-2 text-[#ff4920]"/><strong className="block text-xs">{title}</strong><span className="mt-1 block text-[11px] leading-relaxed text-[#526b9f]">{desc}</span></div>)}</div>
        <div className="relative mt-4 h-36 overflow-hidden rounded-xl border border-slate-100 bg-[#edf2f6] sm:h-40"><iframe title="Map to Persona Institute in Rameshwar Nagar, Khandwa" src={`https://maps.google.com/maps?q=${encodeURIComponent(`Persona Institute, ${officeAddress}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><a href={mapsUrl} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 rounded-full bg-white px-3 py-2 text-[11px] font-bold text-blue-700 shadow">View on Google Maps ↗</a></div>
      </div>
    </m.section>

    <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="mx-auto max-w-[1440px] px-5 py-2 pb-4 lg:px-10">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(15,39,87,0.05)] sm:p-7">
        <span className="rounded-full bg-[#ffe2e0] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#ff3341]">QUICK ANSWERS</span>
        <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-[#526b9f]">Here are some common questions. Still have a question? Feel free to contact us.</p>
        <div className="mt-4 space-y-1">
          {editableFaqs.map((faq,i)=>(
            <div key={faq.key} className="overflow-hidden rounded-xl border border-slate-200" data-sanity-edit-target>
              <button onClick={()=>setActiveFaq(activeFaq===i?-1:i)} aria-expanded={activeFaq===i} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold hover:bg-orange-50/60">
                {faq.q}{activeFaq===i?<ChevronUp size={18} className="shrink-0 text-[#ff351c]"/>:<ChevronDown size={18} className="shrink-0"/>}
              </button>
              {activeFaq===i&&<p className="px-4 pb-4 text-sm leading-relaxed text-[#526b9f]">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </m.section>

    <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="relative isolate overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-[#f8fbff] to-[#eef5ff] py-8 md:py-12">
      <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-5 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:px-10">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.08em] text-[#f04422] shadow-sm">
            <MessageCircle size={14} /> NEED GUIDANCE?
          </span>
          <h2 className="mt-4 text-[clamp(1.85rem,3.6vw,2.85rem)] font-black leading-[1.05] tracking-tight text-[#102d70]">
            Talk to Ajay Sir
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#3b4f7a]">Get personalized guidance from Ajay Sir and our team. We&apos;ll help you choose the right course based on your current level and goals.</p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: BookOpen, title: "Course Guidance", desc: "Find the right course for your needs.", bg: "bg-blue-50 text-blue-600" },
              { icon: GraduationCap, title: "Doubt Support", desc: "Get your queries resolved quickly.", bg: "bg-violet-50 text-violet-600" },
              { icon: Users, title: "Career Guidance", desc: "Learn how English can help in your career.", bg: "bg-emerald-50 text-emerald-600" },
              { icon: Star, title: "Personal Mentorship", desc: "Direct guidance from Ajay Sir.", bg: "bg-amber-50 text-amber-600" },
            ].map(({ icon: Icon, title, desc, bg }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/90 bg-white/80 p-3.5 shadow-sm">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${bg}`}><Icon size={20} /></span>
                <span><strong className="block text-sm font-bold text-[#102d70]">{title}</strong><span className="mt-0.5 block text-xs text-[#526b9f]">{desc}</span></span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1e40af] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200/60 hover:bg-[#1e3a8a]">
              <MessageCircle size={18} /> Talk to Ajay Sir <ArrowRight size={16} />
            </a>
            <button type="button" onClick={() => setCallModalOpen(true)} className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e40af] bg-white px-5 py-3 text-sm font-bold text-[#1e40af] hover:bg-blue-50">
              <Clock size={16} /> Book a Guidance Call
            </button>
          </div>
        </div>
        <div className="relative flex min-h-[260px] items-end justify-center overflow-hidden rounded-[26px] bg-[radial-gradient(ellipse_at_50%_35%,#dceaff_0%,#eff5ff_48%,#f8fbff_100%)] md:min-h-[390px] md:justify-end">
          <div className="absolute right-5 top-5 z-20 rounded-2xl border border-white/90 bg-white/95 px-4 py-2 text-sm font-bold italic text-[#1e40af] shadow-lg">Let&apos;s Talk!</div>
          <img src="/images/ajay-sir-talk-cutout.webp" alt="Ajay Sir" className="relative z-10 block h-auto max-h-[340px] w-auto max-w-full object-contain object-bottom drop-shadow-2xl sm:max-h-[390px] md:max-h-[440px]" />
        </div>
      </div>
    </m.section>

    <m.section initial="hidden" whileInView="show" viewport={{once:true,amount:.08,margin:"0px 0px -4% 0px"}} variants={fadeUp} className="relative isolate overflow-hidden bg-gradient-to-r from-[#fff0e4] via-[#fffaf5] to-[#ffdfc9]"><div className="mx-auto grid max-w-[1440px] items-center gap-5 px-5 py-8 md:grid-cols-[1fr_.9fr] md:px-10"><div className="relative z-10"><span className="rounded-full bg-[#ffe0df] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#ff3341]">JOIN OUR COMMUNITY</span><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Start Your English Journey <span className="italic text-[#ff3b20]">Today</span></h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-[#526b9f]">Still confused? Talk to Ajay Sir and our team. We’re here to help you at every step.</p><div className="mt-5 flex flex-wrap gap-3"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1738] to-[#ff4015] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100"><MessageCircle size={19}/>Chat on WhatsApp <ArrowRight size={17}/></a><button type="button" onClick={() => setCallModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ff4931] bg-white px-6 py-3 text-sm font-bold text-[#ff321b] hover:bg-orange-50"><Phone size={18}/>Call Now</button></div></div><div className="flex items-center justify-center"><img src="/images/ajay-sir-persona-wide.webp" alt="Ajay Sir at Persona Institute" className="aspect-video w-full rounded-xl object-cover object-center shadow-lg"/></div></div></m.section>
    {callModalOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071b45]/55 p-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="call-modal-title" className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#ff4a1d]"><Phone size={22}/></span><h2 id="call-modal-title" className="mt-3 text-xl font-black text-[#102d70]">Choose a number to call</h2><p className="mt-1 text-sm text-slate-500">Select your preferred Persona Institute contact.</p></div><button type="button" onClick={() => setCallModalOpen(false)} aria-label="Close call options" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div>
        <div className="mt-5 space-y-3">{phoneOptions.map((phone, index) => <a key={`${phone}-${index}`} href={phoneHref(phone)} onClick={() => setCallModalOpen(false)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-orange-300 hover:bg-orange-50/60"><span><strong className="block text-sm text-[#102d70]">{index === 0 ? "Primary number" : "Alternate number"}</strong><span className="mt-1 block text-sm font-bold text-slate-600">{displayPhone(phone)}</span></span><span className="grid h-10 w-10 place-items-center rounded-full bg-[#ff4a1d] text-white"><Phone size={17}/></span></a>)}</div>
        {!contactSettings.phoneSecondary.trim() && <p className="mt-4 rounded-xl bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-800">Only the primary number is configured. Add the alternate number in Sanity Studio → Site Settings → Contact → Secondary Call Number.</p>}
      </section>
    </div>}

    <footer className="bg-[#09276f] px-5 py-5 text-center text-xs text-white/75">© {new Date().getFullYear()} Persona Institute. Learn · Practice · Grow.</footer>
  </main>;
}
