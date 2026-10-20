import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { courses } from '@/lib/data';

export function generateStaticParams() { return courses.map((course) => ({ slug: course.id })); }
export default async function CourseDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((item) => item.id === slug);
  if (!course) notFound();
  return <main className="min-h-screen bg-[#fffdfc] text-persona-navy">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-2 text-sm font-bold"><ArrowLeft size={17}/> Persona Institute</Link><Link href="/#courses" className="text-sm font-semibold text-persona-red">All courses</Link></header>
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-8 md:grid-cols-[1.05fr_.95fr] md:py-14">
      <div className="overflow-hidden rounded-3xl shadow-soft"><Image src={course.image} alt={course.title} width={1000} height={700} priority className="aspect-[1.25/1] w-full object-cover"/></div>
      <div>{course.tag&&<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-persona-red">{course.tag}</span>}<p className="mt-4 text-xs font-black tracking-[.2em] text-persona-red">PERSONA INSTITUTE COURSE</p><h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.045em] sm:text-5xl">{course.title}</h1><p className="mt-4 text-lg leading-relaxed text-slate-600">{course.description}</p><div className="mt-6 flex items-center gap-3"><b className="text-3xl">₹ {course.price.toLocaleString('en-IN')}</b>{course.oldPrice&&<span className="text-slate-400 line-through">₹ {course.oldPrice.toLocaleString('en-IN')}</span>}</div><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><Clock3 size={16}/> {course.duration} access</p><Link href="/#courses" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-persona-red px-6 py-3 font-bold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5">Enroll / Buy Now <ArrowRight size={17}/></Link><p className="mt-3 text-xs text-slate-400">Demo course information. Pricing and enrollment will be loaded from the backend API when provided.</p></div>
    </section>
    <section className="mx-auto max-w-6xl px-5 pb-16"><div className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-3">{[{title:'Structured learning',desc:'Lessons designed for step-by-step progress.'},{title:'Practice focused',desc:'Apply what you learn with guided exercises.'},{title:'Learn at your pace',desc:'Revisit course content as you build confidence.'}].map(item=><div key={item.title} className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-persona-red" size={20}/><div><b>{item.title}</b><p className="mt-1 text-sm text-slate-500">{item.desc}</p></div></div>)}</div><div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><ShieldCheck size={17}/> Secure payment and access control will be handled by the backend when connected.</div></section>
  </main>;
}
