"use client";

import PublicHeader from "@/components/PublicHeader";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight, Search, Menu, X, GraduationCap, BarChart3, Star, Users,
  BookOpen, Play, ChevronLeft, ChevronRight, SlidersHorizontal, MapPin,
  Trophy, Sparkles, Globe2, Video, CheckCircle2
} from "lucide-react";

const categories = ["All Stories", "Persona English", "English with Khushi", "School Students", "College Students", "Working Professionals", "Competitive Exams"];
const stories = [
  { name: "Rohit Sharma", role: "Working Professional", city: "Indore, MP", course: "Persona English", quote: "Earlier I was afraid to speak English in my office meetings. Now I can present my ideas confidently.", image: "/images/hero-teacher.jpg", person: "/images/ajay-sir-persona.jpg", time: "3:12", title: "Speak Confidently" },
  { name: "Sneha Patel", role: "College Student", city: "Ahmedabad, Gujarat", course: "English with Khushi", quote: "Saurabh Sir’s daily use sentences helped me in real life situations. Now I can easily talk to anyone in English.", image: "/images/video-day1.jpg", person: "/images/course-khushi.jpg", time: "2:45", title: "Daily English for Real Life" },
  { name: "Karan Malhotra", role: "12th Student", city: "Lucknow, UP", course: "Persona English", quote: "His grammar classes are very simple and easy to understand. My confidence has improved a lot.", image: "/images/video-tenses.jpg", person: "/images/ajay-sir-persona.jpg", time: "4:01", title: "Grammar Made Easy" },
  { name: "Pooja Mehta", role: "Working Professional", city: "Jaipur, Rajasthan", course: "English with Khushi", quote: "I can now have natural conversations in English. The practice sessions are really helpful.", image: "/images/course-khushi.jpg", person: "/images/course-khushi.jpg", time: "3:36", title: "Real Conversations" },
  { name: "Neha Gupta", role: "Competitive Exam Aspirant", city: "Patna, Bihar", course: "Persona English", quote: "My vocabulary has improved so much. I now use better words in my daily communication.", image: "/images/course-vocabulary.jpg", person: "/images/course-khushi.jpg", time: "2:58", title: "Build Your Vocabulary" },
  { name: "Aman Singh", role: "College Student", city: "Kota, Rajasthan", course: "English with Khushi", quote: "I used to translate in my mind, but now I think in English. This has helped me a lot in my studies.", image: "/images/video-sentences.jpg", person: "/images/ajay-sir-persona.jpg", time: "3:19", title: "Think in English" },
  { name: "Priya Singh", role: "Working Professional", city: "Delhi, NCR", course: "Persona English", quote: "Saurabh Sir’s interview preparation sessions helped me crack my job interview with confidence.", image: "/images/course-live-spoken.jpg", person: "/images/course-khushi.jpg", time: "4:27", title: "Interview Preparation" },
  { name: "Vivek Yadav", role: "College Student", city: "Chandigarh", course: "English with Khushi", quote: "I was nervous to speak in group discussions, but now I can speak confidently in front of everyone.", image: "/images/course-persona.jpg", person: "/images/ajay-sir-persona.jpg", time: "2:51", title: "Speak Like a Pro" },
];

const metrics = [
  { icon: GraduationCap, value: "10,000+", label: "Successful Learners" },
  { icon: BarChart3, value: "95%", label: "Report Visible Improvement" },
  { icon: Star, value: "4.8/5", label: "Average Student Rating" },
  { icon: Users, value: "500+", label: "Success Stories Shared" },
];

export default function SuccessStoriesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All Stories");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const filteredStories = useMemo(() => stories.filter((story) => {
    const categoryMatch = category === "All Stories" || story.course === category || story.role === category.replace("School Students", "School Student");
    const q = query.trim().toLowerCase();
    const queryMatch = !q || [story.name, story.role, story.city, story.course, story.quote, story.title].some(v => v.toLowerCase().includes(q));
    return categoryMatch && queryMatch;
  }), [category, query]);
  const featured = stories[featuredIndex % stories.length];
  const nav = [["Home","/"],["Courses","/courses"],["Free Tests","/free-tests"],["Success Stories","/reviews"],["About Us","/about"],["Contact","/contact"]];
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#102d70]">
      <PublicHeader active="/reviews" />

      <section className="success-hero-section relative isolate overflow-hidden bg-[#fff2e7]">
        <div aria-hidden="true" className="success-hero-bg absolute inset-0 -z-20" style={{backgroundImage:"url('/images/success-hero-background.png')"}} />
        <div aria-hidden="true" className="success-hero-fade absolute inset-0 -z-10" />
        <div aria-hidden="true" className="success-hero-bottom-fade absolute inset-x-0 bottom-0 -z-10 h-12 md:h-16" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-5 px-5 pb-8 pt-7 sm:px-7 md:min-h-[340px] md:grid-cols-[minmax(0,1fr)_235px] md:gap-7 md:px-10 lg:min-h-[360px] lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-10">
          <div className="success-hero-copy relative z-10 max-w-[690px]">
            <span className="inline-flex rounded-full bg-white/75 px-3 py-1 text-[10px] font-extrabold tracking-[.12em] text-[#e94125] shadow-sm">REAL LEARNERS. REAL RESULTS.</span>
            <h1 className="mt-3 max-w-[660px] text-[clamp(2.3rem,4.5vw,4.1rem)] font-black leading-[.98] tracking-[-.05em] text-[#102d70]">Success Stories<br/>That <span className="text-[#f04422]">Inspire</span></h1>
            <p className="mt-3 max-w-[510px] text-sm leading-relaxed text-[#203f78] sm:text-base">Meet our students who transformed their English communication skills and built confidence with guidance from Saurabh Sir at Persona Institute.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[["Real Students","From across India",Users],["Real Journeys","From confusion to confidence",Sparkles],["Real Growth","In English & in Life",BookOpen]].map(([title,desc,Icon]: any) => <div key={title} className="flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 shadow-sm backdrop-blur-sm"><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#f05a2a]"><Icon size={16}/></span><span><b className="block text-[10px] leading-tight">{title}</b><small className="text-[9px] text-slate-600">{desc}</small></span></div>)}
            </div>
          </div>
          <aside className="success-hero-metrics relative z-10 grid grid-cols-2 gap-2 rounded-[22px] border border-white/90 bg-white/90 p-3 shadow-[0_16px_42px_rgba(74,46,25,.16)] backdrop-blur-xl md:grid-cols-1 md:gap-3 md:p-4">
            {metrics.map(({icon:Icon,value,label}) => <div key={label} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-50 text-[#f04b27] sm:h-10 sm:w-10"><Icon size={20}/></span><span><b className="block text-sm font-black sm:text-lg">{value}</b><small className="block text-[9px] leading-tight text-[#52658d] sm:text-[11px]">{label}</small></span></div>)}
          </aside>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-2 max-w-[1440px] px-4 sm:px-7 lg:px-10">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-sm">
          {categories.map((item,i) => <button key={item} onClick={() => setCategory(item)} className={`story-filter flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-bold ${category===item ? "bg-gradient-to-r from-[#ff4a16] to-[#ff7014] text-white shadow-md" : "bg-white text-[#173879] hover:bg-orange-50"}`}>{i===0 ? <SlidersHorizontal size={15}/> : i===1 ? <BookOpen size={15}/> : i===2 ? <Sparkles size={15}/> : i===3 ? <GraduationCap size={15}/> : i===4 ? <BookOpen size={15}/> : i===5 ? <Users size={15}/> : <Trophy size={15}/>} {item}</button>)}
        </div>
      </section>

      <section id="featured-story" className="mx-auto max-w-[1440px] px-5 pb-5 pt-5 sm:px-7 lg:px-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div><h2 className="text-xl font-black tracking-tight sm:text-2xl">Featured Success Story</h2><p className="mt-1 text-xs text-[#52658d] sm:text-sm">A real story of confidence, fluency and personal growth with the guidance of Saurabh Sir.</p></div>
          <div className="flex shrink-0 gap-2"><button aria-label="Previous story" onClick={() => setFeaturedIndex((featuredIndex + stories.length - 1) % stories.length)} className="grid h-9 w-9 place-items-center rounded-full border border-orange-200 text-orange-600 transition hover:bg-orange-50"><ChevronLeft size={18}/></button><button aria-label="Next story" onClick={() => setFeaturedIndex((featuredIndex + 1) % stories.length)} className="grid h-9 w-9 place-items-center rounded-full border border-orange-200 text-orange-600 transition hover:bg-orange-50"><ChevronRight size={18}/></button></div>
        </div>
        <article className="grid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_28px_rgba(16,45,112,.06)] md:grid-cols-[.92fr_1fr]">
          <div className="relative min-h-[210px] overflow-hidden bg-orange-50 sm:min-h-[260px]"><img src={featured.image} alt={featured.title} className="h-full min-h-[210px] w-full object-cover sm:min-h-[260px]"/><span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-3 py-1 text-[10px] font-bold text-white">{featured.course}</span><button aria-label={`Play ${featured.title}`} className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-black/50 text-white shadow-lg"><Play fill="currentColor" size={23}/></button><span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">{featured.time}</span></div>
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_180px] lg:items-center lg:p-6"><div><p className="text-4xl font-black leading-none text-[#ff5a2b]">“</p><blockquote className="-mt-2 text-base font-bold leading-snug text-[#102d70] sm:text-lg">“{featured.quote}”</blockquote><p className="mt-2 text-xs leading-relaxed text-[#52658d]">Persona Institute gave me the right guidance, daily practice and motivation. Lessons explain everything so clearly that learning English became easy and enjoyable.</p><div className="mt-4 flex items-center gap-3"><img src={featured.person} alt="" className="h-10 w-10 rounded-full border border-orange-100 object-cover"/><div><b className="block text-xs">{featured.name}</b><small className="text-[10px] text-[#52658d]">{featured.role}</small></div><span className="ml-auto flex items-center gap-1 text-[10px] text-[#52658d]"><MapPin size={13} className="text-orange-500"/>{featured.city}</span></div></div><div className="rounded-xl bg-gradient-to-br from-[#fff5f1] to-[#fffaf8] p-4 text-xs leading-relaxed text-[#d64a37]">“The way Saurabh Sir teaches is really practical. His examples and daily practice sessions make a huge difference. I feel much more confident now. Thank you Persona Institute!”</div></div>
        </article>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-7 sm:px-7 lg:px-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-xl font-black tracking-tight sm:text-2xl">More Success Stories from Our Learners</h2><p className="mt-1 text-xs text-[#52658d] sm:text-sm">Real people. Real improvement. Real stories.</p></div>
          <div className="flex gap-2"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:w-[240px] sm:flex-none"><Search size={16} className="shrink-0 text-[#52658d]"/><input id="story-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, city, course..." className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-slate-400"/></label><button onClick={()=>setShowFilters(!showFilters)} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold ${showFilters?"border-orange-300 bg-orange-50":"border-slate-200 bg-white"}`}><SlidersHorizontal size={15}/> Filters</button></div>
        </div>
        {showFilters && <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-orange-100 bg-orange-50/50 p-3">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`rounded-full px-3 py-2 text-xs font-semibold ${category===item?"bg-[#ff4a16] text-white":"bg-white text-[#173879]"}`}>{item}</button>)}<button onClick={()=>{setCategory("All Stories");setQuery("");}} className="rounded-full px-3 py-2 text-xs font-semibold text-orange-700 underline">Clear filters</button></div>}
        {filteredStories.length ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredStories.map((story,index)=><article key={story.name} className="story-card overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_5px_18px_rgba(16,45,112,.05)]">
            <div className="relative h-[190px] overflow-hidden bg-orange-50 sm:h-[145px] lg:h-[115px] xl:h-[145px]"><img src={story.image} alt={story.title} className="story-image h-full w-full object-cover"/><span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-2 py-1 text-[9px] font-bold text-white">{story.course}</span><button aria-label={`Play ${story.title}`} className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-black/50 text-white"><Play size={16} fill="currentColor"/></button><span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-1 text-[10px] font-bold text-white">{story.time}</span></div>
            <div className="p-3"><p className="text-3xl font-black leading-[.7] text-[#ff5a2b]">“</p><p className="mt-1 text-xs leading-relaxed text-[#173879]">“{story.quote}”</p><div className="mt-3 flex items-center gap-2"><img src={story.person} alt="" className="h-9 w-9 rounded-full border border-orange-100 object-cover"/><div className="min-w-0"><b className="block truncate text-[11px]">{story.name}</b><small className="block text-[10px] leading-tight text-[#52658d]">{story.role}</small></div></div><p className="mt-2 flex items-center gap-1 text-[10px] text-[#52658d]"><MapPin size={12} className="text-orange-500"/>{story.city}</p></div>
          </article>)}
        </div> : <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-10 text-center"><p className="font-bold">No stories match your search.</p><button onClick={()=>{setCategory("All Stories");setQuery("");}} className="mt-3 text-sm font-semibold text-orange-600 underline">Clear search and filters</button></div>}
      </section>

      <section className="mx-auto mb-5 grid max-w-[1440px] grid-cols-2 gap-2 px-5 sm:grid-cols-4 sm:px-7 lg:px-10">
        {[["10,000+","Happy Learners",Users],["500+","Success Stories",Users],["95%","Report Improvement",BarChart3],["4.8/5","Average Rating",Star]].map(([value,label,Icon]:any)=><div key={value} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-500"><Icon size={20}/></span><span><b className="block text-lg font-black">{value}</b><small className="text-[10px] text-[#52658d] sm:text-xs">{label}</small></span></div>)}
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-[#fff0e5] via-[#fffaf5] to-[#ffe3cf]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-5 px-5 py-8 sm:px-7 md:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-10">
          <div className="success-hero-copy relative z-10"><span className="inline-flex rounded-full bg-[#ffe4df] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#ed4027]">YOUR SUCCESS STORY COULD BE NEXT</span><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Start Your English Journey <em className="text-[#f04422]">Today</em></h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-[#52658d]">Join thousands of learners who have improved their confidence with the right guidance from Saurabh Sir at Persona Institute.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/courses" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-5 py-3 text-sm font-bold text-white shadow-md">Explore Courses <ArrowRight size={16}/></Link><a href="#featured-story" className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white px-5 py-3 text-sm font-bold"><Play size={15}/> Watch Success Stories</a></div></div>
          <div className="relative overflow-hidden rounded-2xl"><img src="/images/community.jpg" alt="Persona Institute learners" className="h-[190px] w-full rounded-2xl object-cover sm:h-[240px]"/><div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-xl border border-white/80 bg-white/90 px-4 py-2 text-center shadow-lg"><b className="block text-lg font-black">10,000+</b><small className="text-xs text-[#52658d]">Happy Learners</small></div></div>
        </div>
      </section>
      <footer className="bg-[#102f70] py-4 text-center text-[10px] text-white/80">© 2026 Persona Institute. Learn · Practice · Grow.</footer>
    </main>
  );
}
