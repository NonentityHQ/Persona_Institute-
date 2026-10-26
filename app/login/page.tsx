'use client';

import Image from 'next/image';
import { AnimatePresence, m } from 'framer-motion';
import TransitionLink from '@/components/motion/TransitionLink';
import { useRouteTransition } from '@/components/motion/RouteTransition';
import { EASE_OUT } from '@/lib/motion';
import CountUp from '@/components/motion/CountUp';
import { useEffect, useRef, useState, type FormEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, ChartNoAxesCombined, CheckCircle2, LockKeyhole, Mail, Smartphone, UsersRound, PlayCircle, GraduationCap, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const { navigate } = useRouteTransition();
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [identity, setIdentity] = useState('');
  const [notice, setNotice] = useState('');
  const [step, setStep] = useState<'identity' | 'otp'>('identity');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpState, setOtpState] = useState<'idle' | 'orbiting' | 'success' | 'error'>('idle');
  const [resendSeconds, setResendSeconds] = useState(25);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0) return;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, resendSeconds]);

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
    // Front-end prototype: show the OTP screen. Connect an SMS/email provider for real delivery.
    setOtp(['', '', '', '']);
    setOtpState('idle');
    setOtpNotice('Demo preview: OTP delivery is not connected yet. Enter any 4 digits to preview verification.');
    setResendSeconds(25);
    setStep('otp');
    window.setTimeout(() => otpRefs.current[0]?.focus(), 300);
  }

  function beginOtpOrbit() {
    setOtpState('orbiting');
    setOtpNotice('Verifying your code…');
    window.setTimeout(() => {
      setOtpState('success');
      setOtpNotice('You’re verified! Opening your learning dashboard…');
      window.setTimeout(() => navigate('/batches'), 900);
    }, 1180);
  }

  function updateOtp(index: number, raw: string) {
    if (otpState === 'orbiting' || otpState === 'success') return;
    const entered = raw.replace(/\D/g, '').slice(0, 4);
    const next = [...otp];
    if (entered.length > 1) {
      entered.split('').forEach((digit, offset) => { if (index + offset < 4) next[index + offset] = digit; });
    } else {
      next[index] = entered;
    }
    setOtp(next);
    setOtpState('idle');
    setOtpNotice('');
    if (entered.length > 1) otpRefs.current[Math.min(index + entered.length, 3)]?.focus();
    else if (entered && index < 3) otpRefs.current[index + 1]?.focus();
    if (next.every(Boolean)) beginOtpOrbit();
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    if (otpState === 'orbiting' || otpState === 'success') return;
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4).split('');
    const next = [...digits, ...Array(Math.max(0, 4 - digits.length)).fill('')];
    setOtp(next);
    setOtpState('idle');
    setOtpNotice('');
    otpRefs.current[Math.min(digits.length, 3)]?.focus();
    if (next.every(Boolean)) beginOtpOrbit();
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 3) otpRefs.current[index + 1]?.focus();
  }

  function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otpState === 'orbiting' || otpState === 'success') return;
    if (otp.some((digit) => !digit)) { setOtpState('error'); setOtpNotice('Please enter all 4 digits to continue.'); return; }
    beginOtpOrbit();
  }

  function resendOtp() {
    if (resendSeconds > 0) return;
    setOtp(['', '', '', '']);
    setOtpState('idle');
    setResendSeconds(25);
    setOtpNotice('Demo preview: resend action shown; connect your OTP provider to send a real code.');
    otpRefs.current[0]?.focus();
  }

  return (
    <main className="login-page min-h-screen bg-white text-[#102f55]">
      <div className="login-layout">
        <section className="login-story">
          <TransitionLink href="/" className="login-brand" aria-label="Persona Institute home">
            <Image src="/images/persona-logo.png" alt="Persona Institute logo" width={88} height={88} priority />
            <span><strong>Persona Institute</strong><small>Learn · Practice · Grow</small></span>
          </TransitionLink>
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
              <div className="login-proof login-proof-learners"><span className="proof-icon"><UsersRound size={22} /></span><span><b><CountUp value={10000} suffix="+" /></b><small>Happy Learners</small></span></div>
              <div className="login-proof login-proof-progress"><span className="proof-icon proof-red"><ChartNoAxesCombined size={22} /></span><span><b><CountUp value={95} suffix="%" /></b><small>Visible Improvement</small></span></div>
            </div>
            <div className="login-chart-doodle" aria-hidden="true"><span /><span /><span /></div>
            <p className="login-handwriting">Same Guidance<br />Real Progress<br />With <b>Ajay Sir ♡</b></p>
          </div>
          <p className="login-copyright">© 2026 Persona Institute. Learn with confidence.</p>
        </section>

        <section className="login-form-panel">
          <div className="login-topline"><span>New here?</span><TransitionLink href="/contact" className="login-create-link">Create an Account</TransitionLink></div>
          <div className="login-card">
            <TransitionLink href="/" className="login-card-logo" aria-label="Back to Persona Institute home"><Image src="/images/persona-logo.png" alt="Persona Institute" width={150} height={150} priority /></TransitionLink>
            <AnimatePresence mode="wait" initial={false}>
            <m.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_OUT } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}>
            <h2>{step === 'identity' ? <>Welcome to <span>Persona English!</span></> : <>Verify <span>it’s you</span></>}</h2>
            <p className="login-card-subtitle">{step === 'identity' ? 'Login to continue your learning journey.' : <>Enter the 4-digit code sent to <strong>{method === 'mobile' ? `+91 ${identity.slice(0, 2)}•••••${identity.slice(-2)}` : identity.replace(/^(.).+(@.*)$/, '$1•••$2')}</strong></>}</p>
            {step === 'identity' ? <>
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
                <button type="submit" className="login-submit">Send OTP <ArrowRight size={22} /></button>
                {notice && <p role="status" className="login-notice">{notice}</p>}
              </form>
              <p className="login-security"><LockKeyhole size={15} fill="currentColor" /> Your information is safe and secure with us.</p>
              <p className="login-terms">By continuing, you agree to the <TransitionLink href="/contact">Terms and Conditions</TransitionLink> and <TransitionLink href="/contact">Privacy Policy</TransitionLink>.</p>
            </> : <>
              <form onSubmit={verifyOtp} className={`otp-form otp-state-${otpState}`} noValidate>
                <div className={`otp-emblem ${otpState === 'success' ? 'otp-emblem-success' : otpState === 'error' ? 'otp-emblem-error' : otpState === 'orbiting' ? 'otp-emblem-orbiting' : ''}`} aria-hidden="true">
                  {otpState === 'success' ? <CheckCircle2 size={25} /> : otpState === 'orbiting' ? <RefreshCw className="otp-verifying-icon" size={23} /> : <LockKeyhole size={23} />}
                  <span className="otp-emblem-pulse" />
                </div>
                <div className={`otp-slots ${otp.every(Boolean) ? 'otp-slots-complete' : ''} ${otpState === 'error' ? 'otp-slots-error' : ''} ${otpState === 'orbiting' ? 'otp-slots-orbiting' : ''} ${otpState === 'success' ? 'otp-slots-success' : ''}`}>
                  {otp.map((digit, index) => <input key={index} ref={(node) => { otpRefs.current[index] = node; }} aria-label={`OTP digit ${index + 1}`} className={`otp-slot ${digit ? 'otp-slot-filled' : ''}`} style={{ animationDelay: `${index * 90}ms` }} value={digit} onChange={(event) => updateOtp(index, event.target.value)} disabled={otpState === 'orbiting' || otpState === 'success'} onKeyDown={(event) => handleOtpKeyDown(index, event)} onPaste={handleOtpPaste} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} />)}
                </div>
                <div className="otp-progress-dots" aria-hidden="true">{otp.map((digit, index) => <span key={index} className={digit ? 'is-filled' : ''} />)}</div>
                <p className="otp-demo-note"><ShieldCheck size={15} /> Secure verification · Demo mode</p>
                {otpNotice && <p role="status" className={`login-notice ${otpState === 'success' ? 'login-notice-success' : ''}`}>{otpNotice}</p>}
                <button type="submit" className={`login-submit otp-verify-button ${otpState === 'success' ? 'otp-button-success' : ''}`} disabled={otpState === 'success' || otpState === 'orbiting'}>{otpState === 'success' ? <><CheckCircle2 size={19} /> Verified successfully</> : otpState === 'orbiting' ? <><RefreshCw size={18} className="otp-verifying-icon" /> Verifying securely…</> : <>Verify code <ArrowRight size={20} /></>}</button>
                <div className="otp-resend-row"><span>Didn’t receive the code?</span><button type="button" disabled={resendSeconds > 0 || otpState === 'success'} onClick={resendOtp}>{resendSeconds > 0 ? `Resend in ${resendSeconds}s` : <><RefreshCw size={13} /> Resend OTP</>}</button></div>
                <button type="button" className="otp-back-button" onClick={() => { setStep('identity'); setOtp(['', '', '', '']); setOtpState('idle'); setOtpNotice(''); setResendSeconds(0); }}><ArrowLeft size={15} /> Change {method === 'mobile' ? 'mobile number' : 'email address'}</button>
              </form>
              <p className="login-security"><LockKeyhole size={15} fill="currentColor" /> Your information is safe and secure with us.</p>
            </>}
            </m.div>
            </AnimatePresence>
          </div>
          <p className="login-panel-footer">New to Persona? <TransitionLink href="/courses">Explore courses</TransitionLink> or <TransitionLink href="/free-tests">try a free test</TransitionLink>.</p>
        </section>
      </div>
    </main>
  );
}
