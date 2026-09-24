import { useState, useEffect, useRef } from 'react';
import { GOOGLE_SHEETS_WEB_APP_URL, SKYDO_PAYMENT_URL } from './lib/config';


type MetaFbq = ((...args: unknown[]) => void) & {
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaFbq;
  }
}

const META_PIXEL_ID = '1346550847551454';

function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    return;
  }

  if (parameters) {
    window.fbq('track', eventName, parameters);
  } else {
    window.fbq('track', eventName);
  }
}

/*
 * ⚠️ TEMPORARY QA-ONLY CODE — MUST BE REMOVED AFTER PIXEL TESTING ⚠️
 * These constants exist ONLY to verify the Meta Pixel "Purchase" event from
 * a real browser session. The matching useEffect inside App() fires Purchase
 * exclusively when the site is opened with the QA trigger URL:
 *   https://dentagrow-website.wasmer.app/?pixel_test=purchase
 * It does NOT fire on a normal page load, and it does NOT fire when the
 * Skydo payment button is clicked. Delete this block and the matching
 * useEffect inside App() once the Purchase event has been verified.
 */
const QA_PIXEL_TEST_PARAM = 'pixel_test';
const QA_PIXEL_TEST_VALUE = 'purchase';
let qaPurchaseEventFired = false; // guarantees at most one Purchase event per page load

function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top) / r.height - 0.5) * strength;
    const y = ((e.clientX - r.left) / r.width - 0.5) * -strength;
    el.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) translateZ(10px)`;
    el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), ${-y * 2}px ${x * 2}px 30px rgba(0,196,160,0.15)`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    ref.current.style.boxShadow = '';
  };
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', clinic_name: '', message: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.fbq || document.getElementById('meta-pixel-script')) return;

    const fbq = ((...args: unknown[]) => {
      fbq.queue?.push(args);
    }) as MetaFbq;

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;

    const script = document.createElement('script');
    script.id = 'meta-pixel-script';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('nav') && !t.closest('.mob-drawer')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
      setSubmitState('error');
      return;
    }

    setSubmitState('loading');

    try {
      const data = new URLSearchParams({
        timestamp: new Date().toISOString(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        clinic: form.clinic_name,
        message: form.message,
        source: 'DentaGrow Website - Practice Lead',
        pageUrl: window.location.href,
      });

      // Google Apps Script accepts this simple POST without exposing a
      // Google API key or service-account credentials in the browser.
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
      });

      setSubmitState('done');
      trackMetaEvent('Lead');
      setForm({ name: '', email: '', phone: '', clinic_name: '', message: '' });
    } catch {
      setSubmitState('error');
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10, color: '#f0f6ff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };

  const EMAIL = 'avinashjayaintelligentgroup@gmail.com';
  const PAYMENT_URL = SKYDO_PAYMENT_URL;
  const PAYMENT_AMOUNT = 199;

  /*
   * ⚠️ TEMPORARY QA-ONLY CODE — MUST BE REMOVED AFTER PIXEL TESTING ⚠️
   * (see the QA block at the top of this file)
   * Fires the Meta Pixel "Purchase" event ONLY when the page is opened with
   * the QA trigger URL https://dentagrow-website.wasmer.app/?pixel_test=purchase
   * — never on a normal page load and never on the Skydo payment button click.
   * The qaPurchaseEventFired flag ensures the event fires only once per page load.
   */
  useEffect(() => {
    if (typeof window === 'undefined' || qaPurchaseEventFired) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get(QA_PIXEL_TEST_PARAM) !== QA_PIXEL_TEST_VALUE) return;
    qaPurchaseEventFired = true;
    trackMetaEvent('Purchase', {
      value: PAYMENT_AMOUNT,
      currency: 'USD',
    });
  }, [PAYMENT_AMOUNT]);

  const s1=useTilt(9),s2=useTilt(9),s3=useTilt(9),s4=useTilt(9); const sR=[s1,s2,s3,s4];
  const w1=useTilt(7),w2=useTilt(7),w3=useTilt(7),w4=useTilt(7),w5=useTilt(7),w6=useTilt(7); const wR=[w1,w2,w3,w4,w5,w6];

  const NAV = ['How It Works','Insurance','Why Us','Results','Contact'];

  return (
    <div style={{background:'#040d1a',color:'#f0f6ff',fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh',overflowX:'hidden'}}>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:300,height:62,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 5%',background:scrolled||menuOpen?'rgba(4,10,20,0.97)':'transparent',backdropFilter:scrolled||menuOpen?'blur(20px)':'none',borderBottom:scrolled||menuOpen?'1px solid rgba(255,255,255,0.07)':'none',transition:'background 0.3s,backdrop-filter 0.3s'}}>
        <a href="#" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#00c4a0,#1e7fff)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 18px rgba(0,196,160,0.5)',transform:'perspective(160px) rotateY(-8deg)',transition:'transform 0.3s'}}
            onMouseEnter={e=>(e.currentTarget.style.transform='perspective(160px) rotateY(0deg) scale(1.1)')}
            onMouseLeave={e=>(e.currentTarget.style.transform='perspective(160px) rotateY(-8deg)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:14,color:'#fff',lineHeight:1.1,letterSpacing:'-0.02em'}}>AJ Intelligent Group</div>
            <div style={{fontSize:9,color:'rgba(0,196,160,0.75)',fontWeight:600,letterSpacing:'0.04em'}}>AI Growth Systems · SF Dental</div>
          </div>
        </a>

        <div className="nav-desk">
          {NAV.map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} className="nav-lnk">{l}</a>
          ))}
          <a href="#contact" className="btn-cta btn-sm">
            <span className="ci">✦</span>See If We Can Help<span className="arr">→</span>
          </a>
        </div>

        <button className="hbg" onClick={()=>setMenuOpen(o=>!o)} aria-label="menu">
          <span className={menuOpen?'hb hb-t':'hb'}/>
          <span className={menuOpen?'hb hb-m':'hb'}/>
          <span className={menuOpen?'hb hb-b':'hb'}/>
        </button>
      </nav>

      <div className={`mob-drawer ${menuOpen?'mob-open':''}`}>
        {NAV.map(l=>(
          <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} className="mob-lnk" onClick={()=>setMenuOpen(false)}>{l}</a>
        ))}
        <a href="#contact" onClick={()=>setMenuOpen(false)} className="btn-cta" style={{marginTop:10,justifyContent:'center'}}>
          <span className="ci">✦</span>See If We Can Help<span className="arr">→</span>
        </a>
      </div>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',padding:'80px 5% 60px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=60)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.07}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(150deg,rgba(4,13,26,0.97) 0%,rgba(4,26,40,0.92) 55%,rgba(4,13,26,0.97) 100%)'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,196,160,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,160,0.04) 1px,transparent 1px)',backgroundSize:'56px 56px',transform:'perspective(550px) rotateX(8deg)',transformOrigin:'top center',pointerEvents:'none',opacity:0.8}}/>
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>

        <div style={{position:'relative',zIndex:2,maxWidth:680,width:'100%'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(0,196,160,0.1)',border:'1px solid rgba(0,196,160,0.3)',borderRadius:100,padding:'6px 14px',marginBottom:24}}>
            <div className="pdot"/>
            <span style={{fontSize:11.5,fontWeight:600,color:'#00c4a0',letterSpacing:'0.04em'}}>AJ Intelligent Group · Serving San Francisco Dental Clinics</span>
          </div>

          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5.2vw,66px)',lineHeight:1.09,letterSpacing:'-0.04em',color:'#fff',marginBottom:20,textShadow:'0 4px 40px rgba(0,196,160,0.18)'}}>
            Give Your Dental Team
            <span style={{background:'linear-gradient(90deg,#00e676,#00c4a0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}> Less Repetitive Work</span><br/>
            <span style={{background:'linear-gradient(90deg,#00c4a0,#1e7fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>More Control Over Every Patient Journey</span>
          </h1>

          <p style={{fontSize:'clamp(13.5px,2vw,17px)',color:'rgba(200,220,255,0.72)',lineHeight:1.72,maxWidth:560,marginBottom:34,fontWeight:300}}>
            Your team should not spend the day chasing missed calls, confirmations, follow-ups, recall patients or insurance exceptions. DentaGrow connects those repetitive workflows into one managed system—so your staff can spend more attention where a real person is needed.
          </p>

          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:32}}>
            <a href="#contact" className="btn-cta"><span className="ci">✦</span>See If DentaGrow Fits Your Practice<span className="arr">→</span></a>
            <a href="#how-it-works" className="btn-ghost">See How It Works</a>
          </div>

          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['✓ No payment required to submit your details','✓ Insurance workflow support','✓ Website + chatbot when needed','✓ Human escalation built in'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:100,padding:'4px 11px',fontSize:11.5,fontWeight:500,color:'rgba(255,255,255,0.65)'}}>{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-wrap">
          <div className="hero-dash">
            <div style={{fontSize:10.5,color:'rgba(255,255,255,0.35)',marginBottom:16,display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#00c4a0',boxShadow:'0 0 6px #00c4a0'}}/>
              DentaGrow Dashboard · This Month
            </div>
            {[{label:'New Inquiries',value:'—',color:'#00c4a0'},{label:'Appointments',value:'—',color:'#1e7fff'},{label:'Follow-ups',value:'—',color:'#00e676'}].map((s,i)=>(
              <div key={s.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',animation:`sIn 0.5s ease ${i*0.13}s both`}}>
                <span style={{fontSize:12.5,color:'rgba(255,255,255,0.5)'}}>{s.label}</span>
                <span style={{fontSize:22,fontWeight:900,color:s.color,textShadow:`0 0 18px ${s.color}88`}}>{s.value}</span>
              </div>
            ))}
            <div style={{marginTop:14,background:'rgba(0,196,160,0.08)',border:'1px solid rgba(0,196,160,0.2)',borderRadius:10,padding:'11px 13px'}}>
              <div style={{fontSize:10.5,color:'#00c4a0',fontWeight:600}}>✓ Human attention stays visible</div>
              <div style={{fontSize:10.5,color:'rgba(255,255,255,0.35)',marginTop:3}}>Automations route routine work and escalate exceptions.</div>
            </div>
            <div className="dl1"/><div className="dl2"/>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-bar">
        <div className="ticker-tr">
          {['📝 Start with a practice review','🛡 Insurance workflow support','🌐 Website when needed','💬 Chat + patient capture','📞 Voice + missed-call recovery','♻️ Recall + reactivation','📊 Practice-level reporting','👤 Human escalation built in'].flatMap(t=>[t,t]).map((t,i)=>(
            <span key={i} className="tick-i">{t}<span style={{color:'rgba(0,196,160,0.38)',fontSize:9,marginLeft:8}}>◆</span></span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section id="overview" style={{borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%, rgba(0,196,160,0.04) 0%, transparent 70%)',pointerEvents:'none'}}/>
        <div className="sg" style={{maxWidth:1100,margin:'0 auto'}}>
          {[
            {num:'Lead',label:'First Step',sub:'Your practice details are captured first',color:'#00c4a0',rgb:'0,196,160'},
             {num:'1',label:'Managed System',sub:'Growth + operations + patient workflows',color:'#1e7fff',rgb:'30,127,255'},
            {num:'24/7',label:'Routine Follow-Up',sub:'Automations work beyond office hours',color:'#00e676',rgb:'0,230,118'},
            {num:'Human',label:'Escalation',sub:'Exceptions stay with your team',color:'#f59e0b',rgb:'245,158,11'},
          ].map((s,i)=>(
            <div key={i} className="st" style={{borderRight:i<3?'1px solid rgba(255,255,255,0.06)':'none'}}
              onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${s.rgb},0.05)`;e.currentTarget.style.transform='translateY(-4px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.transform='';}}
            >
              <div style={{fontWeight:900,fontSize:'clamp(32px,4vw,50px)',color:s.color,lineHeight:1,letterSpacing:'-0.04em',marginBottom:8,textShadow:`0 0 40px ${s.color}55`,filter:`drop-shadow(0 6px 12px ${s.color}44)`}}>{s.num}</div>
              <div style={{fontWeight:700,fontSize:13,color:'#f0f6ff',marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:11.5,color:'rgba(200,220,255,0.4)'}}>{s.sub}</div>
              <div style={{position:'absolute',bottom:0,left:'20%',right:'20%',height:2,background:`linear-gradient(90deg,transparent,${s.color}66,transparent)`,borderRadius:2}}/>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{padding:'80px 5%',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'45%',backgroundImage:'linear-gradient(rgba(30,127,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(30,127,255,0.025) 1px,transparent 1px)',backgroundSize:'40px 40px',transform:'perspective(400px) rotateX(20deg)',transformOrigin:'bottom center',pointerEvents:'none'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <div className="bdg bteal">The System</div>
            <h2 className="sh2">One <span className="gteal">System</span> Around the Patient Journey</h2>
            <p className="ssub">DentaGrow handles repetitive work around patient acquisition, communication, scheduling and retention while your team stays in control.</p>
          </div>
          <div style={{position:'relative'}}>
            <div className="cline"/>
            <div className="fg" style={{paddingTop:16}}>
              {[
                {step:'01',icon:'📣',title:'Attract & Capture',desc:'Use the clinic’s existing website or a DentaGrow patient-facing page when needed. Add chatbot and lead capture where appropriate.',color:'#1e7fff'},
                {step:'02',icon:'🤖',title:'Follow Up & Qualify',desc:'Automated SMS, email and voice workflows handle routine follow-up, qualification and missed-call recovery.',color:'#00c4a0'},
                {step:'03',icon:'📅',title:'Schedule & Confirm',desc:'Move qualified patients toward booking, confirmations and rescheduling while routing exceptions to the right human.',color:'#00e676'},
                {step:'04',icon:'♻️',title:'Retain & Reactivate',desc:'Recall and reactivation workflows help the practice stay connected with patients who need another touchpoint.',color:'#f59e0b',badge:'↗ Practice Operations'},
              ].map((s,i)=>(
                <div key={i} ref={sR[i].ref} onMouseMove={sR[i].onMouseMove} onMouseLeave={sR[i].onMouseLeave} className="c3d" style={{marginTop:14}}>
                  <div className="sbdg" style={{color:s.color,border:`1px solid ${s.color}44`,boxShadow:`0 3px 10px ${s.color}33`}}>STEP {s.step}</div>
                  <div className="cico">{s.icon}</div>
                  <div className="ctit">{s.title}</div>
                  <p className="cdsc">{s.desc}</p>
                  {s.badge&&<div className="mbdg" style={{color:'#00e676',background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.25)'}}>{s.badge}</div>}
                  <div className="cgl" style={{background:`linear-gradient(90deg,transparent,${s.color},transparent)`}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" style={{padding:'80px 5%',position:'relative',overflow:'hidden',background:'linear-gradient(150deg,rgba(0,196,160,0.055),rgba(30,127,255,0.045),transparent)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:44}}>
            <div className="bdg bteal">More Than Lead Generation</div>
            <h2 className="sh2">A <span className="gteal">Managed Dental Growth System</span>, Not Another Tool</h2>
            <p className="ssub">If your practice needs more than one automation, DentaGrow connects the pieces instead of asking your team to manage another stack.</p>
          </div>
          <div className="tg">
            {[
              {icon:'🌐',title:'Website When You Need One',desc:'No suitable website? We can provide a focused patient-facing website or landing experience as part of the implementation.',color:'#1e7fff'},
              {icon:'💬',title:'Chatbot + Patient Capture',desc:'Give prospective patients a simple way to ask questions and leave their details while your team is busy.',color:'#00c4a0'},
              {icon:'📞',title:'Voice + Missed-Call Recovery',desc:'Use voice and messaging workflows to respond to routine inquiries and recover opportunities that would otherwise be missed.',color:'#00e676'},
              {icon:'♻️',title:'Recall + Reactivation',desc:'Automate routine patient re-engagement so overdue follow-ups do not depend entirely on manual lists.',color:'#f59e0b'},
              {icon:'📊',title:'Practice-Level Visibility',desc:'See inquiries, bookings, pending follow-ups and human attention in business language—not automation-tool jargon.',color:'#8b5cf6'},
              {icon:'🧑‍⚕️',title:'Humans Stay in Control',desc:'Clinical questions, emergencies, complex billing or insurance issues and other exceptions can be routed to your team.',color:'#f43f5e'},
            ].map((c,i)=>(
              <div key={i} ref={wR[i].ref} onMouseMove={wR[i].onMouseMove} onMouseLeave={wR[i].onMouseLeave} className="c3d">
                <div className="wibox" style={{background:`linear-gradient(135deg,${c.color}22,${c.color}08)`,border:`1px solid ${c.color}33`,boxShadow:`0 4px 14px ${c.color}22`}}>{c.icon}</div>
                <div className="ctit">{c.title}</div>
                <p className="cdsc">{c.desc}</p>
                <div style={{position:'absolute',top:0,right:0,width:60,height:60,background:`radial-gradient(circle at top right,${c.color}18,transparent 70%)`,borderRadius:'0 20px 0 0'}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSURANCE + OPERATIONS */}
      <section id="insurance" style={{padding:'84px 5%',position:'relative',overflow:'hidden',background:'linear-gradient(180deg,rgba(30,127,255,0.035),rgba(0,196,160,0.025))',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{position:'absolute',top:'-20%',left:'-8%',width:520,height:520,borderRadius:'50%',background:'rgba(30,127,255,0.045)',filter:'blur(90px)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div className="bdg bblue">Insurance Intelligence</div>
            <h2 className="sh2">Take the <span className="ggreen">Insurance Workload</span> Out of the Front Desk</h2>
            <p className="ssub">DentaGrow can organize insurance intake, verification and exception workflows alongside the patient journey. Connected-system and payer availability determines what can be automated.</p>
          </div>

          <div className="tg">
            {[
              {icon:'🪪',title:'Insurance Intake',desc:'Collect insurance details and card information through a structured patient workflow so staff are not repeatedly chasing missing basics.',color:'#1e7fff'},
              {icon:'🔎',title:'Eligibility + Benefits',desc:'Where supported by the connected practice or payer workflow, route eligibility and benefit checks into a trackable verification process.',color:'#00c4a0'},
              {icon:'📋',title:'Coverage Summary',desc:'Keep verification results, timestamps and missing-information status organized for the team instead of scattered across messages and notes.',color:'#00e676'},
              {icon:'⚠️',title:'Exception Queue',desc:'Flag cases that need human review—conflicting information, unavailable payer data, unusual coverage questions or incomplete verification.',color:'#f59e0b'},
              {icon:'💰',title:'Estimate Workflow',desc:'Support pre-treatment estimate and financial-discussion workflows where the practice systems and payer process allow it. Coverage is never treated as a guarantee.',color:'#a78bfa'},
              {icon:'📨',title:'Claims Follow-Up',desc:'Organize claim-status and insurance follow-up tasks so outstanding items become visible instead of relying on manual memory.',color:'#f43f5e'},
            ].map((c,i)=>(
              <div key={i} className="c3d" style={{minHeight:190}}>
                <div className="wibox" style={{background:`linear-gradient(135deg,${c.color}22,${c.color}08)`,border:`1px solid ${c.color}33`,boxShadow:`0 4px 14px ${c.color}22`}}>{c.icon}</div>
                <div className="ctit">{c.title}</div>
                <p className="cdsc">{c.desc}</p>
                <div style={{position:'absolute',top:0,right:0,width:60,height:60,background:`radial-gradient(circle at top right,${c.color}18,transparent 70%)`,borderRadius:'0 20px 0 0'}}/>
              </div>
            ))}
          </div>

          <div style={{marginTop:24,padding:'16px 18px',borderRadius:14,background:'rgba(245,158,11,0.055)',border:'1px solid rgba(245,158,11,0.16)',display:'flex',gap:12,alignItems:'flex-start'}}>
            <div style={{fontSize:18}}>🛡</div>
            <div>
              <div style={{fontSize:12.5,fontWeight:800,color:'#fff',marginBottom:4}}>Important: verification is not a coverage guarantee.</div>
              <div style={{fontSize:11.5,color:'rgba(200,220,255,0.48)',lineHeight:1.6}}>Insurance eligibility and benefits can change, payer responses can be incomplete, and some workflows require staff review. DentaGrow is designed to surface that uncertainty instead of hiding it.</div>
            </div>
          </div>

          <div className="insurance-two-col" style={{marginTop:30,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {[
              {title:'What the clinic sees',items:['Verification status','Benefits / coverage information when returned','Missing information','Exceptions needing staff attention','Verification history']},
              {title:'What stays human',items:['Clinical decisions','Final treatment recommendations','Complex insurance interpretation','Patient disputes and complaints','Exceptions requiring professional judgment']},
            ].map((box,i)=>(
              <div key={i} style={{background:'rgba(8,20,40,0.62)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:18,padding:'22px 20px'}}>
                <div style={{fontSize:12,fontWeight:800,color:i===0?'#00c4a0':'#f59e0b',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:13}}>{box.title}</div>
                <div style={{display:'grid',gap:8}}>
                  {box.items.map(item=>(
                    <div key={item} style={{display:'flex',gap:9,alignItems:'flex-start',fontSize:12,color:'rgba(220,230,245,0.58)'}}>
                      <span style={{color:i===0?'#00c4a0':'#f59e0b',fontWeight:900}}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section id="included" style={{padding:'82px 5%',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div className="bdg bgreen">Included With Implementation</div>
            <h2 className="sh2">More Than a <span className="gteal">Lead Funnel</span></h2>
            <p className="ssub">The goal is a connected patient-journey system—not a collection of disconnected automations. Availability depends on the practice's existing software, access and workflow.</p>
          </div>

          <div className="fg">
            {[
              {icon:'🌐',title:'Website When Needed',desc:'A focused patient-facing website or landing experience can be included when the practice needs a better digital entry point.',color:'#1e7fff'},
              {icon:'💬',title:'AI Chat + Patient Capture',desc:'Capture inquiries, answer routine questions and route appointment requests without making patients wait for a reply.',color:'#00c4a0'},
              {icon:'📞',title:'Voice + Missed-Call Recovery',desc:'Create a response path for missed calls and voice workflows, with human escalation for situations automation should not handle.',color:'#00e676'},
              {icon:'📅',title:'Scheduling + Confirmation',desc:'Support appointment requests, confirmations, reminders, rescheduling and open-slot recovery around the practice calendar.',color:'#f59e0b'},
              {icon:'♻️',title:'Recall + Reactivation',desc:'Bring overdue and previously inactive patients back into an organized follow-up workflow.',color:'#a78bfa'},
              {icon:'🛡',title:'Insurance Workflow Layer',desc:'Organize insurance intake, verification status, exceptions and follow-up where payer and software connectivity supports it.',color:'#f43f5e'},
              {icon:'📊',title:'Practice Intelligence',desc:'Give the team a simple view of inquiries, appointments, pending work, insurance exceptions and human attention needed.',color:'#38bdf8'},
              {icon:'👥',title:'Human Escalation',desc:'Routine work can be automated; clinical questions, complex cases, complaints and exceptions stay with qualified staff.',color:'#fb7185'},
            ].map((c,i)=>(
              <div key={i} className="c3d" style={{minHeight:190}}>
                <div className="wibox" style={{background:`linear-gradient(135deg,${c.color}22,${c.color}08)`,border:`1px solid ${c.color}33`,boxShadow:`0 4px 14px ${c.color}22`}}>{c.icon}</div>
                <div className="ctit">{c.title}</div>
                <p className="cdsc">{c.desc}</p>
                <div style={{position:'absolute',top:0,right:0,width:60,height:60,background:`radial-gradient(circle at top right,${c.color}18,transparent 70%)`,borderRadius:'0 20px 0 0'}}/>
              </div>
            ))}
          </div>

          <div style={{marginTop:30,textAlign:'center',fontSize:11,color:'rgba(200,220,255,0.35)'}}>
            <strong style={{color:'rgba(255,255,255,0.5)'}}>Bonus setup items:</strong> workflow mapping, launch configuration, patient-communication templates, reporting setup and implementation guidance where applicable.
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" style={{padding:'80px 5%',background:'rgba(255,255,255,0.015)',borderTop:'1px solid rgba(255,255,255,0.05)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-40%',right:'-10%',width:600,height:600,borderRadius:'50%',background:'rgba(0,196,160,0.04)',filter:'blur(80px)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <div className="bdg bgreen">Why DentaGrow</div>
            <h2 className="sh2">Built Around <span className="ggreen">Practice Workflows</span></h2>
            <p className="ssub">The goal is not to replace every human task. It is to remove repetitive work and make the patient journey easier to manage.</p>
          </div>
          <div className="tg">
            {[
              {icon:'🧩',title:'One Managed Layer',desc:'DentaGrow connects acquisition, communication, scheduling, insurance workflows and retention around the practice instead of leaving your team with disconnected tools.',color:'#1e7fff'},
              {icon:'🌐',title:'Website When Needed',desc:'If the practice lacks a suitable website, a focused patient-facing web experience can be included in the implementation.',color:'#00c4a0'},
              {icon:'🛡',title:'Insurance Workflow Support',desc:'Bring insurance intake, verification status, exceptions and follow-up into the same operational layer where the connected systems support it.',color:'#00e676'},
              {icon:'💬',title:'Chat + Voice Options',desc:'Add chatbot, messaging or voice workflows where they solve a real patient-communication problem.',color:'#f59e0b'},
              {icon:'🧑‍⚕️',title:'Human Escalation',desc:'DentaGrow automates routine work while keeping clinical judgment, complex cases and exceptions with qualified people.',color:'#00c4a0'},
              {icon:'📊',title:'Business Reporting',desc:'Track inquiries, appointments, follow-ups and attention needed without exposing the underlying automation stack to the clinic.',color:'#f43f5e'},
            ].map((c,i)=>(
              <div key={i} ref={wR[i].ref} onMouseMove={wR[i].onMouseMove} onMouseLeave={wR[i].onMouseLeave} className="c3d">
                <div className="wibox" style={{background:`linear-gradient(135deg,${c.color}22,${c.color}08)`,border:`1px solid ${c.color}33`,boxShadow:`0 4px 14px ${c.color}22`}}>{c.icon}</div>
                <div className="ctit">{c.title}</div>
                <p className="cdsc">{c.desc}</p>
                <div style={{position:'absolute',top:0,right:0,width:60,height:60,background:`radial-gradient(circle at top right,${c.color}18,transparent 70%)`,borderRadius:'0 20px 0 0'}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEASUREMENT */}
      <section id="results" style={{padding:'80px 5%',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'10%',left:'-5%',width:500,height:500,borderRadius:'50%',background:'rgba(30,127,255,0.04)',filter:'blur(70px)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div className="bdg bteal">Measure What Matters</div>
            <h2 className="sh2">No Manufactured <span className="gteal">Case Studies</span></h2>
            <p className="ssub">Your dashboard should show your practice's actual activity. DentaGrow will measure results after implementation rather than inventing proof before it exists.</p>
          </div>
          <div className="tg">
            {[
              {icon:'📥',title:'New Patient Inquiries',desc:'Track where inquiries came from and what happened after the first contact.',color:'#00c4a0'},
              {icon:'📅',title:'Appointments',desc:'Separate booked appointments from raw leads so marketing activity can be connected to the schedule.',color:'#1e7fff'},
              {icon:'🕐',title:'Pending Follow-Ups',desc:'See routine follow-ups waiting for automation and exceptions that need human attention.',color:'#00e676'},
              {icon:'🛡',title:'Insurance Exceptions',desc:'Make incomplete or unresolved insurance work visible instead of letting it disappear in the front-desk workload.',color:'#f59e0b'},
              {icon:'♻️',title:'Recall + Reactivation',desc:'Measure how many patients are due, contacted, reactivated or still waiting for follow-up.',color:'#a78bfa'},
              {icon:'👤',title:'Human Attention',desc:'Give staff a clear queue of the cases that genuinely need a person to step in.',color:'#f43f5e'},
            ].map((t,i)=>(
              <div key={i} className="c3d">
                <div className="wibox" style={{background:`${t.color}12`,border:`1px solid ${t.color}33`}}>{t.icon}</div>
                <div className="ctit">{t.title}</div>
                <p className="cdsc">{t.desc}</p>
                <div className="cgl" style={{background:`linear-gradient(90deg,transparent,${t.color},transparent)`}}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,textAlign:'center',fontSize:11.5,color:'rgba(200,220,255,0.36)'}}>Performance numbers shown on this website are not presented as guaranteed results.</div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:'80px 5%',background:'linear-gradient(150deg,#040d1a,#041e30,#040d1a)',borderTop:'1px solid rgba(255,255,255,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'rgba(4,13,26,0.9)'}}/>
        <div style={{position:'absolute',bottom:'-20%',right:'-5%',width:500,height:500,borderRadius:'50%',background:'rgba(0,196,160,0.05)',filter:'blur(70px)',pointerEvents:'none'}}/>
        <div className="cg" style={{maxWidth:1060,margin:'0 auto',position:'relative',zIndex:2}}>
          <div>
            <div className="bdg bteal" style={{marginBottom:16}}>Start the Conversation</div>
            <h2 className="sh2" style={{marginBottom:14}}>See Whether <span className="gteal">DentaGrow Fits</span></h2>
            <p style={{fontSize:14.5,color:'rgba(200,220,255,0.6)',fontWeight:300,lineHeight:1.75,marginBottom:26}}>If your team is spending valuable time chasing calls, confirmations, follow-ups, recall patients or insurance details, tell us where the pressure is. We use your answers to understand what should be automated—and what should stay human.</p>
            {[
              {icon:'🌐',title:'No website? That is okay.',desc:'A patient-facing website or landing experience can be part of the implementation when needed.'},
              {icon:'💬',title:'Need a chatbot?',desc:'We can add patient-facing chat where it helps capture and route inquiries.'},
              {icon:'🧑‍⚕️',title:'Your team stays in control.',desc:'DentaGrow automates routine work and escalates exceptions instead of pretending every task should be handled by AI.'},
            ].map((item,i)=>(
              <div key={i} style={{display:'flex',gap:12,marginBottom:15}}>
                <div style={{width:38,height:38,borderRadius:10,background:'rgba(0,196,160,0.08)',border:'1px solid rgba(0,196,160,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{item.icon}</div>
                <div><div style={{fontWeight:600,fontSize:13.5,color:'#fff',marginBottom:2}}>{item.title}</div><div style={{fontSize:12.5,color:'rgba(200,220,255,0.5)'}}>{item.desc}</div></div>
              </div>
            ))}
            <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>
              <a href="#contact" className="btn-cta" style={{fontSize:14.5}}><span className="ci">✦</span>Start With Your Practice Details<span className="arr">→</span></a>
              <p style={{fontSize:11.5,color:'rgba(200,220,255,0.32)',margin:0}}>Prefer to ask a question first? Email {EMAIL}.</p>
            </div>
          </div>

          <div className="fcard" onMouseEnter={e=>(e.currentTarget.style.transform='perspective(900px) rotateY(0deg)')} onMouseLeave={e=>(e.currentTarget.style.transform='perspective(900px) rotateY(-2deg)')}>
            {submitState==='done'?(
              <div style={{textAlign:'center',padding:'30px 0'}}>
                <div style={{fontSize:50,marginBottom:14,filter:'drop-shadow(0 4px 12px rgba(0,196,160,0.4))'}}>✅</div>
                <h3 style={{fontWeight:800,fontSize:20,color:'#fff',marginBottom:8}}>You Took the First Step</h3>
                <p style={{fontSize:13.5,color:'rgba(200,220,255,0.62)',lineHeight:1.7,maxWidth:330,margin:'0 auto 18px'}}>Your practice details are with the DentaGrow team. If the system looks like a fit, the next step is to reserve your consultation. If you are not ready to pay yet, your inquiry is still received.</p>
                {PAYMENT_URL ? <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackMetaEvent('InitiateCheckout', { value: PAYMENT_AMOUNT, currency: 'USD' })} className="btn-cta" style={{fontSize:14,marginBottom:12}}><span className="ci">🔐</span>Reserve the Consultation · $199<span className="arr">→</span></a> : <div style={{fontSize:12,color:'rgba(200,220,255,0.4)',marginBottom:12}}>Payment link is being configured.</div>}
                <div><button onClick={()=>setSubmitState('idle')} style={{background:'none',color:'rgba(200,220,255,0.4)',border:'none',cursor:'pointer',fontSize:12.5,marginTop:4,textDecoration:'underline'}}>Submit Another Request</button></div>
              </div>
            ):(
              <form onSubmit={handleSubmit}>
                <h3 style={{fontWeight:800,fontSize:19,color:'#fff',marginBottom:5,letterSpacing:'-0.02em'}}>Tell Us About Your Practice</h3>
                <p style={{fontSize:11.5,color:'rgba(200,220,255,0.48)',lineHeight:1.55,marginBottom:7}}>If repetitive front-desk work is taking time away from your patients, tell us where it is happening.</p>
                <p style={{fontSize:11.5,color:'rgba(200,220,255,0.34)',marginBottom:20}}>No sensitive clinical information is needed. There is no payment required to send your details.</p>
                <div className="fr" style={{marginBottom:10}}>
                  <div><label className="fl">Your Name *</label><input required style={inp} placeholder="Dr. Jane Smith" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div><label className="fl">Phone</label><input style={inp} placeholder="+1 (415) 555-0100" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
                </div>
                <div style={{marginBottom:10}}><label className="fl">Email Address *</label><input required type="email" style={inp} placeholder="jane@sfdentalclinic.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
                <div style={{marginBottom:10}}><label className="fl">Clinic Name *</label><input required style={inp} placeholder="Your Dental Practice" value={form.clinic_name} onChange={e=>setForm(f=>({...f,clinic_name:e.target.value}))}/></div>
                <div style={{marginBottom:18}}><label className="fl">What would you like DentaGrow to improve?</label><textarea style={{...inp,resize:'vertical',minHeight:90} as React.CSSProperties} placeholder="Examples: missed calls, scheduling workload, new-patient growth, recall/reactivation, website, chatbot..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/></div>
                {submitState==='error'&&<div style={{background:'rgba(244,63,94,0.1)',border:'1px solid rgba(244,63,94,0.3)',borderRadius:8,padding:'9px 13px',fontSize:12.5,color:'#f43f5e',marginBottom:12}}>Something went wrong. Please email us directly.</div>}
                <button type="submit" disabled={submitState==='loading'} className="subbtn" style={{opacity:submitState==='loading'?0.7:1,cursor:submitState==='loading'?'not-allowed':'pointer'}}>{submitState==='loading'?'Sending Securely...':'See If DentaGrow Fits →'}</button>
                <p style={{fontSize:10.5,color:'rgba(200,220,255,0.28)',textAlign:'center',marginTop:10}}>🔒 Your details are used to review your practice and determine the right next step. Payment comes later, only if you choose to reserve the consultation.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      {submitState==='done' && (
      <section id="reserve" style={{padding:'86px 5%',position:'relative',overflow:'hidden',background:'linear-gradient(135deg,rgba(0,196,160,0.09),rgba(30,127,255,0.08),rgba(4,13,26,0.98))',borderTop:'1px solid rgba(0,196,160,0.18)',borderBottom:'1px solid rgba(0,196,160,0.18)'}}>
        <div className="orb orb1" style={{right:'-260px',top:'-300px'}}/>
        <div style={{maxWidth:1080,margin:'0 auto',position:'relative',zIndex:2,display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:46,alignItems:'center'}}>
          <div>
            <div className="bdg bteal">Secure Your Consultation</div>
            <h2 className="sh2">Start With a <span className="gteal">$199 Refundable Deposit</span></h2>
            <p style={{fontSize:15,color:'rgba(200,220,255,0.68)',lineHeight:1.75,maxWidth:580}}>The consultation is where we review your practice, identify operational and growth bottlenecks, and determine whether DentaGrow is a fit. The deposit is <strong style={{color:'#fff'}}>refundable under the consultation policy</strong>.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:24}}>
              {[
                {icon:'🔐',title:'Hosted by Skydo',desc:'Payment is completed on Skydo—not by entering bank details into this website.'},
                {icon:'💳',title:'$399 → $199',desc:'The consultation offer is presented at $199 for the current launch offer.'},
                {icon:'🧭',title:'Clear Next Step',desc:'After payment, your consultation is the next stage of the DentaGrow process.'},
                {icon:'🛡',title:'No Clinical Automation',desc:'Clinical judgment and patient-care decisions remain with qualified humans.'},
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:14}}>
                  <div style={{fontSize:19}}>{item.icon}</div>
                  <div><div style={{fontWeight:700,fontSize:12.5,color:'#fff'}}>{item.title}</div><div style={{fontSize:11,color:'rgba(200,220,255,0.46)',lineHeight:1.5,marginTop:3}}>{item.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="fcard" style={{transform:'perspective(900px) rotateY(-3deg)',textAlign:'center',position:'relative'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#00c4a0',letterSpacing:'.12em',textTransform:'uppercase'}}>DentaGrow Consultation</div>
            <div style={{marginTop:14,display:'flex',justifyContent:'center',alignItems:'baseline',gap:10}}><span style={{fontSize:24,color:'rgba(255,255,255,0.3)',textDecoration:'line-through'}}>$399</span><span style={{fontSize:52,fontWeight:900,color:'#fff',letterSpacing:'-.05em'}}>$199</span><span style={{fontSize:12,color:'rgba(200,220,255,0.45)'}}>USD</span></div>
            <div style={{fontSize:13,fontWeight:700,color:'#00e676',marginTop:2}}>Refundable consultation deposit</div>
            {PAYMENT_URL ? (
              <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackMetaEvent('InitiateCheckout', { value: PAYMENT_AMOUNT, currency: 'USD' })} className="btn-cta" style={{width:'100%',justifyContent:'center',marginTop:22}}><span className="ci">🔐</span>Pay Securely with Skydo<span className="arr">→</span></a>
            ) : (
              <div style={{marginTop:22,padding:'13px 14px',borderRadius:11,background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',fontSize:12,color:'rgba(255,255,255,0.62)'}}>Secure payment link is being configured. Please use the consultation form below for now.</div>
            )}
            <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginTop:16,fontSize:10.5,color:'rgba(200,220,255,0.34)'}}><span>🔒 Secure hosted payment</span><span>•</span><span>💳 USD</span><span>•</span><span>🛡 Bank details stay off-site</span></div>
            <p style={{fontSize:10.5,color:'rgba(200,220,255,0.27)',lineHeight:1.55,margin:'14px auto 0',maxWidth:320}}>Refunds are subject to the consultation/refund policy and payment-provider processing rules. We do not promise instant or automatic refunds unless the applicable payment process supports them.</p>
          </div>
        </div>
      </section>

      )}

      {/* FAQ */}
      <section style={{padding:'80px 5%',borderTop:'1px solid rgba(255,255,255,0.05)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',bottom:'-30%',right:'-10%',width:600,height:600,borderRadius:'50%',background:'rgba(30,127,255,0.04)',filter:'blur(80px)',pointerEvents:'none'}}/>
        <div style={{maxWidth:780,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:44}}>
            <h2 className="sh2">Frequently Asked Questions</h2>
            <p className="ssub">Everything you need to know before booking your audit.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {[
              {q:'What is the $199 payment?',a:'It is a refundable consultation deposit for a DentaGrow Growth & Practice Automation Consultation. The consultation is used to review your practice, identify bottlenecks and determine whether DentaGrow is a fit. Refunds remain subject to the applicable consultation/refund policy.'},
              {q:'Is payment handled securely?',a:'Yes. The DentaGrow website does not ask you to enter bank credentials. The payment CTA opens the hosted Skydo payment page. Payment-provider terms and processing rules apply.'},
              {q:'Do I need a website already?',a:'No. If your practice does not have a suitable website or patient-facing landing experience, a DentaGrow website experience can be included in the implementation when appropriate.'},
              {q:'Can DentaGrow add a chatbot?',a:'Yes. A website chatbot can be included when it solves a real patient-capture or communication need for the practice.'},
              {q:'Can DentaGrow handle dental insurance workflows?',a:'It can support insurance intake, verification status, benefits information and exception workflows where the practice software and payer connectivity support them. Insurance responses are not treated as guaranteed coverage, and exceptions can be routed to staff for review.'},
              {q:'Does DentaGrow replace my front desk?',a:'No. DentaGrow is designed to automate repetitive communication and workflow tasks while keeping your team in control of clinical, complex or exception-based work.'},
              {q:'What happens after I pay?',a:'The consultation is the next step. We review the practice, discuss the current systems and workflow, and determine what should be automated, what should remain human and what implementation makes commercial sense.'},
              {q:'Will you guarantee a specific number of new patients?',a:'No fixed patient count is promised on this website. Results depend on the practice, market, offer, budget, patient demand, follow-up and operational execution. DentaGrow measures actual performance after implementation.'},
              {q:'What if I already have enough patients?',a:'Acquisition is optional. DentaGrow can focus on operational workflows such as scheduling support, missed-call recovery, reminders, recall, reactivation, patient communication and reporting.'},
            ].map((item,i)=>(
              <div key={i} className={`fi ${faqOpen===i?'fo':''}`}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} className="fb">
                  <span style={{fontWeight:600,fontSize:14.5,color:'#f0f6ff',lineHeight:1.5,textAlign:'left'}}>{item.q}</span>
                  <span className={`fic ${faqOpen===i?'fio':''}`}>+</span>
                </button>
                {faqOpen===i&&<div style={{padding:'0 18px 16px'}}><p style={{fontSize:13.5,color:'rgba(200,220,255,0.62)',lineHeight:1.75,margin:0}}>{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'rgba(4,8,18,0.99)',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'46px 5% 24px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,196,160,0.45),transparent)'}}/>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="ftg">
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#00c4a0,#1e7fff)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(0,196,160,0.4)',transform:'perspective(140px) rotateY(-6deg)'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:13.5,color:'#fff',letterSpacing:'-0.02em'}}>AJ Intelligent Group</div>
                  <div style={{fontSize:8.5,color:'rgba(0,196,160,0.6)',fontWeight:600,letterSpacing:'0.04em'}}>AI Growth Systems · San Francisco</div>
                </div>
              </div>
              <p style={{fontSize:12.5,color:'rgba(200,220,255,0.38)',lineHeight:1.75,maxWidth:255,marginBottom:14}}>DentaGrow — dental practice operations + growth automation. Automate repetitive work while your team stays in control.</p>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <a href={`mailto:${EMAIL}`} style={{fontSize:11.5,color:'rgba(200,220,255,0.4)',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#00c4a0')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(200,220,255,0.4)')}>✉ {EMAIL}</a>
                <span style={{fontSize:11.5,color:'rgba(200,220,255,0.28)'}}>📍 San Francisco, CA, USA</span>
              </div>
            </div>
            <div>
              <div className="fth">System</div>
              {['How It Works','Website + Chatbot','Patient Follow-Up','Recall + Reactivation'].map(s=>(
                <a key={s} href="#how-it-works" className="ftl">{s}</a>
              ))}
            </div>
            <div>
              <div className="fth">Company</div>
              {['Results','Offer','Contact','FAQ'].map(s=>(
                <a key={s} href="#" className="ftl">{s}</a>
              ))}
            </div>
            <div>
              <div className="fth">Get Started</div>
              <p style={{fontSize:12.5,color:'rgba(200,220,255,0.38)',lineHeight:1.7,marginBottom:14}}>Ready to see whether DentaGrow fits your practice?</p>
              <a href="#contact" className="btn-cta btn-sm"><span className="ci">✦</span>See If We Can Help<span className="arr">→</span></a>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:18,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginTop:36}}>
            <p style={{fontSize:11.5,color:'rgba(200,220,255,0.2)'}}>© 2026 AJ Intelligent Group. All rights reserved. · DentaGrow AI Patient System</p>
            <p style={{fontSize:10.5,color:'rgba(200,220,255,0.13)',maxWidth:480,textAlign:'right'}}>DentaGrow dental practice operations and growth automation</p>
          </div>
        </div>
      </footer>

      <style>{`
        *{box-sizing:border-box;}

        .orb{position:absolute;border-radius:50%;pointer-events:none;}
        .orb1{width:700px;height:700px;top:-200px;right:-160px;background:radial-gradient(circle,rgba(0,196,160,0.09) 0%,transparent 70%);animation:fOrb 9s ease-in-out infinite;filter:blur(2px);}
        .orb2{width:500px;height:500px;bottom:-100px;left:-120px;background:radial-gradient(circle,rgba(30,127,255,0.08) 0%,transparent 70%);animation:fOrb 12s ease-in-out infinite reverse;filter:blur(2px);}
        .orb3{width:300px;height:300px;top:40%;left:38%;background:radial-gradient(circle,rgba(0,230,118,0.05) 0%,transparent 70%);animation:fOrb 7s ease-in-out infinite 2s;}
        @keyframes fOrb{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-28px) scale(1.04);}}

        .pdot{width:7px;height:7px;border-radius:50%;background:#00c4a0;animation:pdot 2s ease-out infinite;}
        @keyframes pdot{0%{box-shadow:0 0 0 0 rgba(0,196,160,0.6);}70%{box-shadow:0 0 0 7px rgba(0,196,160,0);}100%{box-shadow:0 0 0 0 rgba(0,196,160,0);}}

        .bdg{display:inline-block;border-radius:100px;padding:5px 14px;margin-bottom:14px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;}
        .bteal{background:rgba(0,196,160,0.1);border:1px solid rgba(0,196,160,0.28);color:#00c4a0;}
        .bblue{background:rgba(30,127,255,0.08);border-color:rgba(30,127,255,0.22);color:#7db4ff;}
        .bgreen{background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.24);color:#00e676;}

        .sh2{font-weight:800;font-size:clamp(22px,4vw,44px);letter-spacing:-0.03em;color:#fff;margin-bottom:12px;line-height:1.12;}
        .ssub{font-size:clamp(13px,1.8vw,16px);color:rgba(200,220,255,0.58);font-weight:300;max-width:500px;margin:0 auto;}
        .gteal{background:linear-gradient(90deg,#00c4a0,#1e7fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .ggreen{background:linear-gradient(90deg,#00e676,#00c4a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}

        .nav-desk{display:flex;align-items:center;gap:24px;}
        .nav-lnk{font-size:13px;font-weight:500;color:rgba(255,255,255,0.62);text-decoration:none;transition:color 0.2s;}
        .nav-lnk:hover{color:#00c4a0;}

        .hbg{display:none;flex-direction:column;justify-content:center;align-items:center;width:40px;height:40px;gap:5px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:9px;cursor:pointer;padding:0;flex-shrink:0;transition:background 0.2s;}
        .hbg:hover{background:rgba(255,255,255,0.12);}
        .hb{display:block;width:19px;height:2px;background:#fff;border-radius:2px;transition:all 0.28s ease;}
        .hb-t{transform:translateY(7px) rotate(45deg);background:#00c4a0;}
        .hb-m{opacity:0;transform:scaleX(0);}
        .hb-b{transform:translateY(-7px) rotate(-45deg);background:#00c4a0;}

        .mob-drawer{position:fixed;top:62px;left:0;right:0;z-index:250;background:rgba(4,10,20,0.98);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.07);padding:0 5%;max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.3s ease;}
        .mob-open{max-height:340px;padding:18px 5% 22px;}
        .mob-lnk{display:block;font-size:15px;font-weight:600;color:rgba(255,255,255,0.8);text-decoration:none;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.06);transition:color 0.2s;}
        .mob-lnk:hover{color:#00c4a0;}

        .ticker-bar{background:linear-gradient(90deg,rgba(0,196,160,0.1),rgba(30,127,255,0.1),rgba(0,196,160,0.1));border-top:1px solid rgba(0,196,160,0.18);border-bottom:1px solid rgba(0,196,160,0.18);padding:12px 0;overflow:hidden;}
        .ticker-tr{display:inline-flex;animation:tick 30s linear infinite;white-space:nowrap;}
        .ticker-tr:hover{animation-play-state:paused;}
        @keyframes tick{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .tick-i{display:inline-flex;align-items:center;gap:8px;margin-right:44px;font-size:12.5px;font-weight:600;color:rgba(200,220,255,0.78);}

        .sg{display:grid;grid-template-columns:repeat(4,1fr);}
        .st{padding:40px 18px;text-align:center;position:relative;transition:transform 0.3s,background 0.3s;cursor:default;}

        .fg{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;position:relative;z-index:1;}
        .tg{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .cg{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start;}
        .ftg{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:36px;}

        .c3d{background:rgba(8,20,40,0.88);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:26px 22px;backdrop-filter:blur(16px);transition:transform 0.15s ease,box-shadow 0.15s ease;transform-style:preserve-3d;cursor:default;position:relative;overflow:visible;box-shadow:0 8px 32px rgba(0,0,0,0.42),0 1px 0 rgba(255,255,255,0.06) inset;}
        .cico{font-size:28px;margin-bottom:12px;display:inline-block;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));}
        .ctit{font-weight:700;font-size:15px;color:#fff;margin-bottom:7px;}
        .cdsc{font-size:12.5px;color:rgba(200,220,255,0.56);line-height:1.7;margin:0;}
        .cgl{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 20px 20px;opacity:0.65;overflow:hidden;}

        .sbdg{position:absolute;top:-13px;left:18px;font-weight:900;font-size:10px;letter-spacing:0.15em;background:#040d1a;border-radius:100px;padding:3px 10px;z-index:2;}
        .mbdg{display:inline-block;margin-top:10px;font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;}
        .wibox{width:48px;height:48px;border-radius:13px;margin-bottom:14px;display:flex;align-items:center;justify-content:center;font-size:22px;}
        .rpill{display:inline-block;border-radius:100px;padding:3px 11px;font-size:10.5px;font-weight:700;}
        .cline{position:absolute;top:46px;left:12.5%;right:12.5%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,160,0.25),rgba(30,127,255,0.25),rgba(0,230,118,0.25),transparent);z-index:0;pointer-events:none;}

        .gstrip{padding:56px 5%;background:linear-gradient(90deg,rgba(0,196,160,0.08),rgba(30,127,255,0.08),rgba(0,196,160,0.08));border-top:1px solid rgba(0,196,160,0.15);border-bottom:1px solid rgba(0,196,160,0.15);position:relative;overflow:hidden;}
        .gicons{display:flex;justify-content:center;gap:32px;flex-wrap:wrap;margin-top:26px;}
        .gi{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:140px;max-width:175px;}
        .giw{width:46px;height:46px;border-radius:50%;background:rgba(0,196,160,0.1);border:1.5px solid rgba(0,196,160,0.3);display:flex;align-items:center;justify-content:center;font-size:20px;}

        .ustrip{padding:50px 5%;background:linear-gradient(135deg,rgba(0,196,160,0.1),rgba(30,127,255,0.1));border-top:1px solid rgba(0,196,160,0.2);border-bottom:1px solid rgba(0,196,160,0.2);position:relative;overflow:hidden;}

        @keyframes shim{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes pring{0%{box-shadow:0 0 0 0 rgba(0,196,160,0.5),0 8px 28px rgba(0,196,160,0.42),0 4px 0 rgba(0,0,0,0.28);}60%{box-shadow:0 0 0 11px rgba(0,196,160,0),0 8px 28px rgba(0,196,160,0.42),0 4px 0 rgba(0,0,0,0.28);}100%{box-shadow:0 0 0 0 rgba(0,196,160,0),0 8px 28px rgba(0,196,160,0.42),0 4px 0 rgba(0,0,0,0.28);}}
        @keyframes cib{0%,100%{transform:translateY(0);}40%{transform:translateY(-3px);}}
        .btn-cta{position:relative;display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:800;color:#fff;text-decoration:none;border:none;cursor:pointer;overflow:hidden;background:linear-gradient(100deg,#00c4a0 0%,#1e7fff 40%,#00e8b8 60%,#1e7fff 80%,#00c4a0 100%);background-size:200% auto;animation:shim 3s linear infinite,pring 2.4s ease-out infinite;transition:transform 0.2s,filter 0.2s;letter-spacing:-0.01em;white-space:nowrap;}
        .btn-cta:hover{transform:translateY(-3px) scale(1.03);filter:brightness(1.12);animation:shim 1.4s linear infinite;}
        .btn-cta .ci{font-size:16px;animation:cib 1.8s ease-in-out infinite;}
        .btn-cta .arr{opacity:0.85;transition:transform 0.2s;}
        .btn-cta:hover .arr{transform:translateX(3px);opacity:1;}
        .btn-sm{padding:9px 18px;font-size:12.5px;border-radius:9px;}
        .btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:12px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.85);text-decoration:none;border:1.5px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.04);transition:background 0.2s,border-color 0.2s,transform 0.2s;white-space:nowrap;}
        .btn-ghost:hover{background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.32);transform:translateY(-2px);}

        .hero-wrap{position:absolute;right:5%;top:50%;transform:translateY(-50%);}
        .hero-dash{background:rgba(8,20,40,0.93);border:1px solid rgba(0,196,160,0.22);border-radius:20px;padding:22px 20px;backdrop-filter:blur(24px);box-shadow:0 40px 100px rgba(0,0,0,0.7),0 1px 0 rgba(255,255,255,0.08) inset,0 -4px 0 rgba(0,196,160,0.4);transform:perspective(900px) rotateY(-14deg) rotateX(4deg);animation:fCard 6s ease-in-out infinite;position:relative;width:282px;transition:transform 0.4s ease,box-shadow 0.4s ease;}
        .hero-dash:hover{transform:perspective(900px) rotateY(-5deg) rotateX(2deg) translateY(-6px);box-shadow:0 60px 120px rgba(0,0,0,0.7),0 1px 0 rgba(255,255,255,0.1) inset,0 -4px 0 rgba(0,196,160,0.5);animation:none;}
        @keyframes fCard{0%,100%{transform:perspective(900px) rotateY(-14deg) rotateX(4deg) translateY(0);}50%{transform:perspective(900px) rotateY(-14deg) rotateX(4deg) translateY(-12px);}}
        .dl1{position:absolute;inset:-2px;border-radius:22px;background:rgba(0,196,160,0.06);transform:translateZ(-10px) translateX(8px) translateY(6px);border:1px solid rgba(0,196,160,0.1);z-index:-1;}
        .dl2{position:absolute;inset:-4px;border-radius:24px;background:rgba(30,127,255,0.04);transform:translateZ(-20px) translateX(16px) translateY(12px);border:1px solid rgba(30,127,255,0.08);z-index:-2;}
        @keyframes sIn{from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);}}

        .fcard{background:rgba(8,20,40,0.88);border:1px solid rgba(255,255,255,0.1);border-radius:22px;padding:28px 24px;backdrop-filter:blur(20px);box-shadow:0 30px 80px rgba(0,0,0,0.5),0 1px 0 rgba(255,255,255,0.07) inset,0 -4px 0 rgba(0,196,160,0.3);transform:perspective(900px) rotateY(-2deg);transition:transform 0.4s;}
        .fr{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .fl{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.48);margin-bottom:5px;}
        .subbtn{width:100%;padding:13px;background:linear-gradient(135deg,#00c4a0,#1e7fff);color:#fff;border:none;border-radius:11px;font-size:15px;font-weight:800;box-shadow:0 8px 28px rgba(0,196,160,0.4),0 3px 0 rgba(0,0,0,0.3);transition:transform 0.2s,box-shadow 0.2s;}

        .fi{background:rgba(8,20,40,0.72);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;transition:border-color 0.2s,background 0.2s;backdrop-filter:blur(10px);}
        .fo{background:rgba(0,196,160,0.05)!important;border-color:rgba(0,196,160,0.3)!important;box-shadow:0 8px 28px rgba(0,196,160,0.1);}
        .fb{width:100%;padding:15px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px;background:none;border:none;cursor:pointer;text-align:left;}
        .fic{color:#00c4a0;font-size:20px;flex-shrink:0;display:inline-block;transition:transform 0.25s;line-height:1;}
        .fio{transform:rotate(45deg);}

        .fth{font-size:10.5px;font-weight:700;color:#00c4a0;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:13px;}
        .ftl{display:block;font-size:12.5px;color:rgba(200,220,255,0.38);text-decoration:none;margin-bottom:8px;transition:color 0.2s;}
        .ftl:hover{color:#fff;}

        @media(max-width:1024px){
          .fg{grid-template-columns:1fr 1fr!important;gap:16px!important;}
          .tg{grid-template-columns:1fr 1fr!important;gap:16px!important;}
          .ftg{grid-template-columns:1fr 1fr!important;}
          .cg{grid-template-columns:1fr!important;gap:32px!important;}
          .hero-wrap{display:none!important;}
          .cline{display:none!important;}
        }
        @media(max-width:768px){
          .nav-desk{display:none!important;}
          .hbg{display:flex!important;}
          .sg{grid-template-columns:1fr 1fr!important;}
          .st{border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.06);}
        }
        @media(max-width:640px){
          .insurance-two-col{grid-template-columns:1fr!important;}

          .fg{grid-template-columns:1fr!important;}
          .tg{grid-template-columns:1fr!important;}
          .ftg{grid-template-columns:1fr!important;}
          .fr{grid-template-columns:1fr!important;}
          .gicons{gap:18px;}
          .btn-cta{padding:12px 20px;font-size:14px;}
          .btn-ghost{padding:12px 18px;font-size:14px;}
          .sh2{font-size:clamp(20px,5vw,32px)!important;}
        }
        @media(max-width:400px){
          .st{padding:26px 12px;}
          .tick-i{font-size:11px;}
        }
      `}</style>
    </div>
  );
}
