'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound, GraduationCap, MapPin, Mail, Phone, CalendarDays, Pencil, Upload, Award, School, FileText, ChevronDown, ChevronUp, CheckCircle2, Save, X, BookOpen, CreditCard, ClipboardList } from 'lucide-react';
import PortalShell from '@/components/PortalShell';

type ProfileValues = Record<string, string>;
const initialValues: ProfileValues = {
  'Full name':'Jatin', 'Email address':'jatin@example.com', 'Mobile number':'+91 9876543210', 'Date of birth':'Not added',
  'City':'Khandwa, Madhya Pradesh', 'Address':'Add your full address', 'College / University Name':'Not added',
  'Marks in College (in %)':'Not added', 'School Name':'Not added', 'Marks in XII (in %)':'Not added', 'Marks in X (in %)':'Not added'
};
const sections=[
  {id:1,title:'Basic Information',sub:'Your name and account details',icon:UserRound,items:['Full name','Email address']},
  {id:2,title:'Personal Details',sub:'Your personal and contact information',icon:FileText,items:['Mobile number','Date of birth']},
  {id:3,title:'Address',sub:'Current and permanent address details',icon:MapPin,items:['City','Address']},
  {id:4,title:'Educational Details',sub:'Your academic details and documents',icon:GraduationCap,items:['College / University Name','Marks in College (in %)','School Name','Marks in XII (in %)','Marks in X (in %)']}
];
export default function ProfilePage(){
  const [expanded,setExpanded]=useState(4); const [editing,setEditing]=useState(false); const [values,setValues]=useState(initialValues); const [draft,setDraft]=useState(initialValues); const [toast,setToast]=useState('');
  const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),2400)};
  const beginEdit=()=>{setDraft({...values});setEditing(true)};
  const save=()=>{setValues({...draft});setEditing(false);notify('Profile changes saved in this demo. Connect the profile API to persist them.');};
  const cancel=()=>{setDraft({...values});setEditing(false)};
  const fieldIcon=(label:string)=>label.toLowerCase().includes('marks')?<Award size={18}/>:label.toLowerCase().includes('school')||label.toLowerCase().includes('college')?<School size={18}/>:label.toLowerCase().includes('address')||label==='City'?<MapPin size={18}/>:label.toLowerCase().includes('email')?<Mail size={18}/>:label.toLowerCase().includes('mobile')?<Phone size={18}/>:label.toLowerCase().includes('birth')?<CalendarDays size={18}/>:<FileText size={18}/>;
  return <PortalShell title="My Profile"><div className="mx-auto max-w-[1650px] px-3 pt-3 sm:px-5 xl:px-6">
    <motion.section initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="profile-hero">
      <div className="profile-avatar-wrap"><span className="profile-avatar-large">J</span><button onClick={()=>notify('Profile photo upload will be available with account APIs.')} aria-label="Edit profile photo"><Pencil size={16}/></button></div>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-black text-[#10264c] sm:text-3xl">{values['Full name']||'Student'}</h1><span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700"><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500"/>Active Student</span></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#526b8d]"><span className="flex items-center gap-2"><Mail size={16}/>{values['Email address']}</span><span className="flex items-center gap-2"><Phone size={16}/>{values['Mobile number']}</span><span className="flex items-center gap-2"><MapPin size={16}/>{values.City}</span></div></div>
      <div className="profile-last-login"><CalendarDays size={19}/><span><small>Last login</small><b>23 Oct 2026 · 10:56 AM</b></span></div><div className="profile-hero-art"><GraduationCap size={80}/><div className="profile-books">📚</div></div>
      <div className="profile-global-actions">{editing?<><button className="profile-cancel-all" onClick={cancel}><X size={16}/> Cancel</button><button className="profile-save-all" onClick={save}><Save size={16}/> Save changes</button></>:<button className="profile-save-all" onClick={beginEdit}><Pencil size={16}/> Edit profile</button>}</div>
    </motion.section>
    <div className="profile-tabs">{[{label:'Info',icon:UserRound,href:'/profile'},{label:'Batches',icon:CalendarDays,href:'/batches'},{label:'Courses',icon:BookOpen,href:'/courses'},{label:'Payments',icon:CreditCard,href:'/payments'},{label:'Assignments',icon:ClipboardList,href:'/assignments'}].map(({label,icon:Icon,href})=><a key={label} href={href} className={label==='Info'?'active':''}><Icon size={18}/>{label}</a>)}</div>
    {editing&&<div className="profile-edit-banner"><Pencil size={17}/><span><b>Edit mode is on.</b> Update any details below, then save everything together once.</span></div>}
    <div className="mt-4 space-y-3">{sections.map((s,i)=>{const Icon=s.icon;return <motion.section key={s.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} className={`profile-accordion ${expanded===s.id?'expanded':''}`}>
      <button type="button" className="profile-accordion-head" onClick={()=>setExpanded(expanded===s.id?0:s.id)}><span className="profile-step">{s.id}</span><span className={`profile-section-icon ${s.id%2?'blue':'orange'}`}><Icon size={23}/></span><span className="min-w-0 flex-1 text-left"><b>{s.title}</b><small>{s.sub}</small></span>{expanded===s.id?<ChevronUp size={20}/>:<ChevronDown size={20}/>}</button>
      {expanded===s.id&&<div className="profile-detail-grid">{s.items.map(label=><div key={label} className="profile-detail-row"><span className="profile-detail-icon">{fieldIcon(label)}</span><span className="min-w-0 flex-1"><b>{label}</b>{editing?<input className="profile-edit-input" aria-label={label} value={draft[label]||''} onChange={e=>setDraft(prev=>({...prev,[label]:e.target.value}))} placeholder={`Enter ${label.toLowerCase()}`}/>:<small>{values[label]||'Not added'}</small>}</span></div>)}
      {s.id===4&&['College Result','XII Result','X Result'].map(doc=><div key={doc} className="profile-detail-row"><span className="profile-detail-icon upload-icon"><Upload size={18}/></span><span className="min-w-0 flex-1"><b>Upload {doc}</b><small>No file uploaded</small></span><button type="button" className="profile-upload-button" onClick={()=>notify('Document upload will be enabled after storage API integration.')}><Upload size={14}/> Upload</button></div>)}
      </div>}</motion.section>})}</div>
    <div className="profile-bottom-note"><CheckCircle2 size={17}/> Your profile details are private and only used to personalize your learning experience.</div>
  </div>{toast&&<div className="fixed bottom-5 left-1/2 z-[110] -translate-x-1/2 -translate-y-0 rounded-xl bg-[#102b52] px-4 py-3 text-sm font-bold text-white shadow-xl">{toast}</div>}</PortalShell>
}
