'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, BookOpenText, ChartNoAxesCombined, CheckCircle2, LockKeyhole, Mail, Smartphone, UsersRound, PlayCircle, GraduationCap, BarChart3 } from 'lucide-react';

function RollingNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => { let frame = 0; let start = 0; const duration = 1500; const tick = (time: number) => { if (!start) start = time; const progress = Math.min((time - start) / duration, 1); setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [value]);
  return <>{current.toLocaleString('en-IN')}{suffix}</>;
}

export default function LoginPage() {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [identity, setIdentity] = useState('');
  const [notice, setNotice] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = identity.trim();
    if (method === 'mobile' && !/^[6-9]\d{9}$/.test(clean)) {
      setNotice('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setNotice('Please enter a valid email address.');
      return;
    }
    setNotice('Your details look valid. OTP sign-in will be enabled when the authentication API is connected.');
  }

  return (
    <main className="login-page min-h-screen bg-white text-[#102f55]">
      <div className="login-layout">
        <section className="login-story">
          <Link href="/" className="login-brand" aria-label="Persona Institute home">
            <Image src="/images/persona-logo.png" alt="Persona Institute logo" width={88} height={88} priority />
            <span><strong>Persona Institute</strong><small>Learn · Practice · Grow</small></span>
          </Link>
          <div className="login-story-content">
            <div className="login-doodle login-doodle-cap" aria-hidden="true"><GraduationCap size={58} strokeWidth={1.4} /></div>
            <div className="login-doodle login-doodle-note" aria-hidden="true">Learn<br />Practice<br />Grow <span>↙</span></div>
            <div className="login-dots login-dots-top" aria-hidden="true" />
            <p className="login-kicker">YOUR ENGLISH JOURNEY STARTS HERE</p>
            <h1>The Future of<br /><span>Education</span> is Here</h1>
            <p className="login-story-intro">With an all in one platform for<br className="hidden sm:block" /> the teaching world.</p>
            <div className="login-benefits">
              <div><span className="benefit-icon benefit-red"><PlayCircle size={22} /></span><b>Live & Recorded<br />Classes</b></div>
              <div><span className="benefit-icon benefit-blue"><BookOpenText size={22} /></span><b>Practice Tests<br />& Worksheets</b></div>
              <div><span className="benefit-icon benefit-green"><ChartNoAxesCombined size={22} /></span><b>Track Your Progress</b></div>
              <div><span className="benefit-icon benefit-orange"><UsersRound size={22} /></span><b>Learn Anytime,<br />Anywhere</b></div>
            </div>
            <div className="login-teacher-wrap">
              <div className="login-teacher-glow" />
              <Image src="/images/ajay-sir-cutout.png" alt="Ajay Sir, Persona Institute" width={682} height={764} className="login-teacher" priority />
              <div className="login-proof login-proof-learners"><span className="proof-icon"><UsersRound size={22} /></span><span><b><RollingNumber value={10000} suffix="+" /></b><small>Happy Learners</small></span></div>
              <div className="login-proof login-proof-progress"><span className="proof-icon proof-red"><ChartNoAxesCombined size={22} /></span><span><b><RollingNumber value={95} suffix="%" /></b><small>Visible Improvement</small></span></div>
            </div>
            <div className="login-chart-doodle" aria-hidden="true"><span /><span /><span /></div>
            <p className="login-handwriting">Same Guidance<br />Real Progress<br />With <b>Ajay Sir ♡</b></p>
          </div>
          <p className="login-copyright">© 2026 Persona Institute. Learn with confidence.</p>
        </section>

        <section className="login-form-panel">
          <div className="login-topline"><span>New here?</span><Link href="/contact" className="login-create-link">Create an Account</Link></div>
          <div className="login-card">
            <Link href="/" className="login-card-logo" aria-label="Back to Persona Institute home"><Image src="/images/persona-logo.png" alt="Persona Institute" width={150} height={150} priority /></Link>
            <h2>Welcome to <span>Persona English!</span></h2>
            <p className="login-card-subtitle">Login to continue your learning journey.</p>
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <label htmlFor="login-identity">{method === 'mobile' ? 'Your Mobile Number' : 'Your Email Address'}</label>
              <div className="login-input-wrap">
                {method === 'mobile' ? <span className="login-country-code">+91</span> : <span className="login-input-icon"><Mail size={19} /></span>}
                <input id="login-identity" autoComplete={method === 'mobile' ? 'tel-national' : 'email'} inputMode={method === 'mobile' ? 'numeric' : 'email'} value={identity} onChange={(event) => { setIdentity(event.target.value); setNotice(''); }} placeholder={method === 'mobile' ? 'Enter your mobile number' : 'Enter your email address'} maxLength={method === 'mobile' ? 10 : 120} />
                {method === 'mobile' && <Smartphone size={19} className="login-input-end-icon" />}
              </div>
              <div className="login-or"><span />OR<span /></div>
              <button type="button" className="login-switch-method" onClick={() => { setMethod(method === 'mobile' ? 'email' : 'mobile'); setIdentity(''); setNotice(''); }}>
                {method === 'mobile' ? <><Mail size={22} /> Use your email instead</> : <><Smartphone size={22} /> Use your mobile number instead</>}
              </button>
              <button type="submit" className="login-submit">Proceed Securely <ArrowRight size={22} /></button>
              {notice && <p role="status" className={`login-notice ${notice.startsWith('Your details') ? 'login-notice-success' : ''}`}>{notice.startsWith('Your details') && <CheckCircle2 size={17} />}{notice}</p>}
            </form>
            <p className="login-security"><LockKeyhole size={15} fill="currentColor" /> Your information is safe and secure with us.</p>
            <p className="login-terms">By continuing, you agree to the <Link href="/contact">Terms and Conditions</Link> and <Link href="/contact">Privacy Policy</Link>.</p>
          </div>
          <p className="login-panel-footer">New to Persona? <Link href="/courses">Explore courses</Link> or <Link href="/free-tests">try a free test</Link>.</p>
        </section>
      </div>
    </main>
  );
}
