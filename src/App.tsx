import { useState, useEffect, useRef } from 'react';
import { GOOGLE_SHEETS_WEB_APP_URL, SKYDO_PAYMENT_URL } from './lib/config';

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
        source: 'DentaGrow Website',
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
  const PAYMENT_AMOUNT = 199;
  const ORIGINAL_AMOUNT = 399;

  const s1=useTilt(9),s2=useTilt(9),s3=useTilt(9),s4=useTilt(9); const sR=[s1,s2,s3,s4];
  const w1=useTilt(7),w2=useTilt(7),w3=useTilt(7),w4=useTilt(7),w5=useTilt(7),w6=useTilt(7); const wR=[w1,w2,w3,w4,w5,w6];
  const o1=useTilt(7),o2=useTilt(7),o3=useTilt(7),o4=useTilt(7),o5=useTilt(7),o6=useTilt(7); const oR=[o1,o2,o3,o4,o5,o6];
  const t1=useTilt(6),t2=useTilt(6),t3=useTilt(6); const tR=[t1,t2,t3];
  const m1=useTilt(6),m2=useTilt(6),m3=useTilt(6); const mR=[m1,m2,m3];

  const NAV = ['How It Works','Why Us','Results','Contact'];

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
            <div style={{fontSize:9,color:'rgba(0,196,160,0.75)',fontWeight:600,letterSpacing:'0.04em'}}>DentaGrow · Dental Practice Systems</div>
          </div>
        </a>

        <div className="nav-desk">
          {NAV.map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} className="nav-lnk">{l}</a>
          ))}
          <a href="#reserve" className="btn-cta btn-sm">
            <span className="ci">🔒</span>Reserve Consultation · $199<span className="arr">→</span>
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
        <a href="#reserve" className="btn-cta" style={{marginTop:10,justifyContent:'center'}} onClick={()=>setMenuOpen(false)}>
          <span className="ci">🔒</span>Reserve Consultation · $199<span className="arr">→</span>
        </a>
      </div>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',padding:'80px 5% 60px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=60)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.07}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(150deg,rgba(4,13,26,0.97) 0%,rgba(4,26,40,0.92) 55%,rgba(4,13,26,0.97) 100%)'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,196,160,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,160,0.04) 1px,transparent 1px)',backgroundSize:'56px 56px',transform:'perspective(550px) rotateX(8deg)',transformOrigin:'top center',pointerEvents:'none',opacity:0.8}}/>
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
        <div style={{position:'relative',zIndex:2,maxWidth:680,width:'100%'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(0,196,160,0.1)',border:'1px solid rgba(0,196,160,0.3)',borderRadius:100,padding:'6px 14px',marginBottom:24}}><div className="pdot"/><span style={{fontSize:11.5,fontWeight:600,color:'#00c4a0',letterSpacing:'0.04em'}}>AJ Intelligent Group · DentaGrow for Dental Practices</span></div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5.2vw,66px)',lineHeight:1.09,letterSpacing:'-0.04em',color:'#fff',marginBottom:20,textShadow:'0 4px 40px rgba(0,196,160,0.18)'}}><span style={{background:'linear-gradient(90deg,#00e676,#00c4a0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Run More of Your Practice</span><br/>With Less Front-Desk Work</h1>
          <p style={{fontSize:'clamp(13.5px,2vw,17px)',color:'rgba(200,220,255,0.72)',lineHeight:1.72,maxWidth:565,marginBottom:34,fontWeight:300}}>DentaGrow connects patient communication, scheduling, follow-up, recall and reporting into one automation layer — so your team spends less time chasing repetitive tasks and more time taking care of patients.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:32}}><a href="#reserve" className="btn-cta"><span className="ci">🔒</span>Reserve Your Consultation · $199<span className="arr">→</span></a><a href="#reserve" className="btn-ghost">Review the Secure Reservation →</a></div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{['✓ Automate repeatable work','✓ Keep humans in control','✓ Add patient acquisition when needed','✓ Built for dental workflows'].map(t=><span key={t} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:100,padding:'4px 11px',fontSize:11.5,fontWeight:500,color:'rgba(255,255,255,0.65)'}}>{t}</span>)}</div>
        </div>
        <div className="hero-wrap"><div className="hero-dash">
          <div style={{fontSize:10.5,color:'rgba(255,255,255,0.35)',marginBottom:16,display:'flex',alignItems:'center',gap:6}}><div style={{width:6,height:6,borderRadius:'50%',background:'#00c4a0',boxShadow:'0 0 6px #00c4a0'}}/>DentaGrow Practice View · Example</div>
          {[{label:'Appointments Today',value:'18',color:'#00c4a0'},{label:'Follow-ups Due',value:'07',color:'#1e7fff'},{label:'Human Attention',value:'02',color:'#f59e0b'}].map((x,i)=><div key={x.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',animation:`sIn 0.5s ease ${i*0.13}s both`}}><span style={{fontSize:12.5,color:'rgba(255,255,255,0.5)'}}>{x.label}</span><span style={{fontSize:22,fontWeight:900,color:x.color,textShadow:`0 0 18px ${x.color}88`}}>{x.value}</span></div>)}
          <div style={{marginTop:14,background:'rgba(0,196,160,0.08)',border:'1px solid rgba(0,196,160,0.2)',borderRadius:10,padding:'11px 13px'}}><div style={{fontSize:10.5,color:'#00c4a0',fontWeight:600}}>✓ Example: workflow active</div><div style={{fontSize:10.5,color:'rgba(255,255,255,0.35)',marginTop:3}}>Automation routes exceptions to your team</div></div>
          <div className="dl1"/><div className="dl2"/>
        </div></div>
      </section>

      {/* TICKER */}
      <div className="ticker-bar"><div className="ticker-tr">{['⚙ Scheduling workflows','📞 Missed-call recovery','🔁 Recall & reactivation','💬 Patient communication','📊 Practice reporting','🧩 Connected automation','🎯 Local patient acquisition when needed','🧑‍⚕️ Human escalation'].flatMap(t=>[t,t]).map((t,i)=><span key={i} className="tick-i">{t}<span style={{color:'rgba(0,196,160,0.38)',fontSize:9,marginLeft:8}}>◆</span></span>)}</div></div>

      {/* OPERATING SIGNALS */}
      <section id="results" style={{borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%, rgba(0,196,160,0.04) 0%, transparent 70%)',pointerEvents:'none'}}/><div className="sg" style={{maxWidth:1100,margin:'0 auto'}}>{[{num:'01',label:'Capture',sub:'Bring inquiries into one workflow',color:'#00c4a0',rgb:'0,196,160'},{num:'02',label:'Automate',sub:'Run repeatable communication',color:'#1e7fff',rgb:'30,127,255'},{num:'03',label:'Escalate',sub:'Route exceptions to humans',color:'#00e676',rgb:'0,230,118'},{num:'04',label:'Measure',sub:'See what needs attention',color:'#f59e0b',rgb:'245,158,11'}].map((x,i)=><div key={i} className="st" style={{borderRight:i<3?'1px solid rgba(255,255,255,0.06)':'none'}} onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${x.rgb},0.05)`;e.currentTarget.style.transform='translateY(-4px)';}} onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.transform='';}}><div style={{fontWeight:900,fontSize:'clamp(32px,4vw,50px)',color:x.color,lineHeight:1,letterSpacing:'-0.04em',marginBottom:8,textShadow:`0 0 40px ${x.color}55`}}>{x.num}</div><div style={{fontWeight:700,fontSize:13,color:'#f0f6ff',marginBottom:4}}>{x.label}</div><div style={{fontSize:11.5,color:'rgba(200,220,255,0.4)'}}>{x.sub}</div></div>)}</div></section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{padding:'80px 5%',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',bottom:0,left:0,right:0,height:'45%',backgroundImage:'linear-gradient(rgba(30,127,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(30,127,255,0.025) 1px,transparent 1px)',backgroundSize:'40px 40px',transform:'perspective(400px) rotateX(20deg)',transformOrigin:'bottom center',pointerEvents:'none'}}/><div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}><div style={{textAlign:'center',marginBottom:52}}><div className="bdg bteal">The System</div><h2 className="sh2">From patient inquiry to <span className="gteal">practice workflow</span></h2><p className="ssub">DentaGrow connects the repeatable work around the patient journey. Your team stays in control where human judgement matters.</p></div><div style={{position:'relative'}}><div className="cline"/><div className="fg" style={{paddingTop:16}}>{[{step:'01',icon:'📥',title:'Capture Demand',desc:'New inquiries from your existing website, calls, forms, messages or DentaGrow campaigns enter one connected workflow.',color:'#1e7fff'},{step:'02',icon:'🤖',title:'Respond & Qualify',desc:'Configured AI and communication workflows handle routine questions, collect context and route anything that needs a human.',color:'#00c4a0',badge:'⚡ Automation Layer'},{step:'03',icon:'📅',title:'Book & Manage',desc:'Scheduling, confirmations, reminders, rescheduling and follow-up run from the practice rules you define.',color:'#00e676'},{step:'04',icon:'🦷',title:'Doctor Treats',desc:'Your team receives the right information and exceptions. The doctor stays focused on clinical care, not repetitive admin.',color:'#f59e0b'}].map((x,i)=><div key={i} ref={sR[i].ref} onMouseMove={sR[i].onMouseMove} onMouseLeave={sR[i].onMouseLeave} className="c3d" style={{marginTop:14}}><div className="sbdg" style={{color:x.color,border:`1px solid ${x.color}44`,boxShadow:`0 3px 10px ${x.color}33`}}>STEP {x.step}</div><div className="cico">{x.icon}</div><div className="ctit">{x.title}</div><p className="cdsc">{x.desc}</p>{x.badge&&<div className="mbdg" style={{color:'#00e676',background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.25)'}}>{x.badge}</div>}<div className="cgl" style={{background:`linear-gradient(90deg,transparent,${x.color},transparent)`}}/></div>)}</div></div></div></section>

      {/* BENEFITS */}
      <section className="gstrip"><div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,196,160,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,160,0.03) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none'}}/><div style={{maxWidth:860,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}><div className="bdg bgreen">What Changes</div><h2 style={{fontWeight:900,fontSize:'clamp(19px,3.5vw,38px)',letterSpacing:'-0.03em',color:'#fff',marginBottom:14,lineHeight:1.15}}>Less repetitive work. <span style={{background:'linear-gradient(90deg,#00e676,#00c4a0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>More control.</span></h2><p style={{fontSize:'clamp(13px,1.8vw,15.5px)',color:'rgba(200,220,255,0.65)',maxWidth:560,margin:'0 auto',lineHeight:1.7}}>DentaGrow is designed around practical workflow outcomes — not a collection of tools your team has to learn and manage.</p><div className="gicons">{[{icon:'⏱',label:'Save staff time',sub:'Automate repeatable work'},{icon:'📅',label:'Protect the schedule',sub:'Confirm and follow up'},{icon:'🔁',label:'Recover follow-up',sub:'Recall and reactivate'},{icon:'📊',label:'See what matters',sub:'Simple operating visibility'}].map(g=><div key={g.label} className="gi"><div className="giw">{g.icon}</div><div style={{fontWeight:700,fontSize:12.5,color:'#fff',textAlign:'center'}}>{g.label}</div><div style={{fontSize:11,color:'rgba(200,220,255,0.45)',textAlign:'center'}}>{g.sub}</div></div>)}</div></div></section>

      {/* WHY US / FEATURES */}
      <section id="why-us" style={{padding:'80px 5%',background:'rgba(255,255,255,0.015)',borderTop:'1px solid rgba(255,255,255,0.05)',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',top:'-40%',right:'-10%',width:600,height:600,borderRadius:'50%',background:'rgba(0,196,160,0.04)',filter:'blur(80px)',pointerEvents:'none'}}/><div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}><div style={{textAlign:'center',marginBottom:52}}><div className="bdg bgreen">Inside DentaGrow</div><h2 className="sh2">One operating layer. <span className="ggreen">Many connected workflows.</span></h2><p className="ssub">The exact integrations depend on the practice. The principle stays the same: one front-end experience, connected automation behind it.</p></div><div className="tg">{[{icon:'📞',title:'Missed-call recovery',desc:'Route missed calls into a structured callback or message workflow so opportunities do not simply disappear.',color:'#1e7fff'},{icon:'📅',title:'Scheduling workflows',desc:'Confirmations, reminders, rescheduling and open-slot follow-up can run automatically around your calendar.',color:'#00c4a0'},{icon:'🔁',title:'Recall & reactivation',desc:'Identify eligible patients who are due for follow-up or have gone quiet, then run the configured outreach sequence.',color:'#00e676'},{icon:'💬',title:'Patient communication',desc:'Use SMS, email and AI voice workflows for routine communication while routing complex cases to staff.',color:'#f59e0b'},{icon:'📊',title:'Practice visibility',desc:'See inquiries, appointments, follow-ups, exceptions and workflow status in one simple operating view.',color:'#a78bfa'},{icon:'🧩',title:'Connected tools',desc:'n8n can orchestrate your approved CRM, calendar, forms, AI, voice, email, SMS and other systems behind the scenes.',color:'#f43f5e'}].map((c,i)=><div key={i} ref={oR[i].ref} onMouseMove={oR[i].onMouseMove} onMouseLeave={oR[i].onMouseLeave} className="c3d"><div className="wibox" style={{background:`linear-gradient(135deg,${c.color}22,${c.color}08)`,border:`1px solid ${c.color}33`,boxShadow:`0 4px 14px ${c.color}22`}}>{c.icon}</div><div className="ctit">{c.title}</div><p className="cdsc">{c.desc}</p><div style={{position:'absolute',top:0,right:0,width:60,height:60,background:`radial-gradient(circle at top right,${c.color}18,transparent 70%)`,borderRadius:'0 20px 0 0'}}/></div>)}</div></div></section>

      {/* RESULTS / PROOF */}
      <section style={{padding:'80px 5%',position:'relative',overflow:'hidden',background:'rgba(255,255,255,0.015)',borderTop:'1px solid rgba(255,255,255,0.05)'}}><div style={{position:'absolute',top:'10%',left:'-5%',width:500,height:500,borderRadius:'50%',background:'rgba(30,127,255,0.04)',filter:'blur(70px)',pointerEvents:'none'}}/><div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}><div style={{textAlign:'center',marginBottom:48}}><div className="bdg bteal">How We Measure</div><h2 className="sh2">No vanity dashboard. <span className="gteal">Track the workflow.</span></h2><p className="ssub">Your operating view should answer simple questions: what came in, what was handled, what got booked, and what still needs a human.</p></div><div className="tg">{[{result:'Capture',title:'INQUIRIES',desc:'What entered the practice workflow, from which channel, with the relevant context.',color:'#00c4a0'},{result:'Convert',title:'APPOINTMENTS',desc:'What was scheduled, confirmed, rescheduled or cancelled — and what still needs attention.',color:'#1e7fff'},{result:'Escalate',title:'HUMAN ATTENTION',desc:'Which patient or operational situations need a member of your team to step in.',color:'#f59e0b'}].map((x,i)=><div key={i} ref={mR[i].ref} onMouseMove={mR[i].onMouseMove} onMouseLeave={mR[i].onMouseLeave} className="c3d"><div className="rpill" style={{background:`${x.color}18`,border:`1px solid ${x.color}44`,color:x.color}}>{x.result}</div><div style={{fontWeight:900,fontSize:24,color:x.color,margin:'14px 0 8px',letterSpacing:'-0.02em'}}>{x.title}</div><p style={{fontSize:13.5,color:'rgba(200,220,255,0.82)',lineHeight:1.7,margin:0}}>{x.desc}</p><div className="cgl" style={{background:`linear-gradient(90deg,transparent,${x.color},transparent)`}}/></div>)}</div><p style={{fontSize:11.5,color:'rgba(200,220,255,0.3)',textAlign:'center',marginTop:20}}>These are product concepts, not customer results or performance claims.</p></div></section>

      {/* GROWTH MODULE */}
      <section className="ustrip"><div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,196,160,0.05) 1px,transparent 1px)',backgroundSize:'22px 22px',pointerEvents:'none'}}/><div style={{maxWidth:900,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}><div className="bdg bteal">Growth When You Need It</div><h2 style={{fontWeight:900,fontSize:'clamp(17px,3.5vw,34px)',color:'#fff',letterSpacing:'-0.02em',marginBottom:12,lineHeight:1.2}}>Already busy? Keep the operations.<br/><span className="gteal">Need more patients? Add acquisition.</span></h2><p style={{fontSize:'clamp(12.5px,1.8vw,15px)',color:'rgba(200,220,255,0.65)',marginBottom:24,lineHeight:1.65,maxWidth:600,margin:'0 auto 24px'}}>DentaGrow does not require a clinic to need more leads. When growth is the goal, local patient acquisition can plug into the same workflow.</p><div className="tg" style={{textAlign:'left',marginBottom:26}}>{[{icon:'🎯',title:'Local Meta & Google',desc:'Campaigns can be configured around the practice location, services and relevant local service area.',color:'#1e7fff'},{icon:'🖥️',title:'Landing page when needed',desc:'Use the clinic website when it is ready. If not, provide a focused patient-facing landing experience for the campaign.',color:'#00c4a0'},{icon:'💬',title:'Lead capture + follow-up',desc:'New inquiries enter the same workflow instead of becoming another manual process for the front desk.',color:'#00e676'}].map((x,i)=><div key={i} ref={tR[i].ref} onMouseMove={tR[i].onMouseMove} onMouseLeave={tR[i].onMouseLeave} className="c3d"><div className="wibox" style={{background:`linear-gradient(135deg,${x.color}22,${x.color}08)`,border:`1px solid ${x.color}33`,boxShadow:`0 4px 14px ${x.color}22`}}>{x.icon}</div><div className="ctit">{x.title}</div><p className="cdsc">{x.desc}</p></div>)}</div><p style={{fontSize:11.5,color:'rgba(200,220,255,0.3)',maxWidth:650,margin:'0 auto'}}>Geographic targeting improves local relevance; it does not guarantee that every ad impression is the nearest person. Advertising spend and DentaGrow service fees are kept separate.</p></div></section>

      {/* RESERVE / PAYMENT */}
      <section id="reserve" style={{padding:'92px 5%',position:'relative',overflow:'hidden',background:'linear-gradient(145deg,rgba(0,196,160,0.035),rgba(30,127,255,0.04),rgba(4,13,26,0.96))',borderTop:'1px solid rgba(0,196,160,0.12)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{position:'absolute',top:'8%',left:'50%',transform:'translateX(-50%)',width:720,height:420,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,196,160,0.08),transparent 68%)',filter:'blur(20px)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1120,margin:'0 auto',position:'relative',zIndex:2}}>
          <div style={{textAlign:'center',maxWidth:760,margin:'0 auto 42px'}}>
            <div className="bdg bgreen">Secure Your Growth Consultation</div>
            <h2 className="sh2" style={{fontSize:'clamp(28px,4.6vw,52px)',marginBottom:14}}>A serious plan starts with a <span className="ggreen">serious conversation.</span></h2>
            <p className="ssub" style={{maxWidth:660}}>Reserve a dedicated DentaGrow consultation for <span style={{color:'#fff',fontWeight:700}}>$199</span>. The deposit is refundable according to the consultation policy, and the session is built around your actual practice workflow — not a generic sales pitch.</p>
          </div>

          <div className="pay-grid">
            <div className="pay-story">
              <div className="pay-visual" aria-hidden="true">
                <div className="pay-ring ring-a"/><div className="pay-ring ring-b"/>
                <div className="pay-orb"><div className="pay-orb-inner">DG</div></div>
                <div className="pay-float pf-a"><span>✓</span> Secure flow</div>
                <div className="pay-float pf-b"><span>↗</span> Practice-first</div>
                <div className="pay-float pf-c"><span>↺</span> Refundable deposit</div>
              </div>
              <div style={{padding:'0 4px'}}>
                <div className="pay-kicker">WHAT YOU ARE RESERVING</div>
                <h3 style={{fontWeight:800,fontSize:24,color:'#fff',letterSpacing:'-0.03em',margin:'8px 0 12px'}}>Your practice, mapped before we talk solutions.</h3>
                <p style={{fontSize:13.5,color:'rgba(200,220,255,0.56)',lineHeight:1.75,marginBottom:18}}>We use the consultation to understand where repetitive work, missed opportunities or disconnected systems are costing your team time. If DentaGrow is not a fit, we tell you that too.</p>
                <div className="pay-checks">
                  {['Workflow review tailored to your practice','Clear automation opportunities — no tool overload','Human-in-the-loop plan for sensitive work','Practical next steps you can actually implement'].map((x,i)=><div key={i}><span>✓</span>{x}</div>)}
                </div>
              </div>
            </div>

            <div className="pay-card" onMouseEnter={e=>(e.currentTarget.style.transform='perspective(1000px) rotateY(0deg) translateY(-3px)')} onMouseLeave={e=>(e.currentTarget.style.transform='perspective(1000px) rotateY(-2deg) translateY(0)')}>
              <div className="pay-card-top"><div><span className="secure-dot"/> Secure payment</div><span className="skydo-chip">SKYDO</span></div>
              <div style={{marginTop:26}}><div className="pay-old">${ORIGINAL_AMOUNT} <span>Consultation Value</span></div><div className="pay-price"><span className="currency">$</span>{PAYMENT_AMOUNT}<span className="usd">USD</span></div><div className="pay-label">Refundable consultation deposit</div></div>
              <div className="pay-divider"/>
              <div className="pay-includes">
                <div><span>01</span><b>Dedicated consultation</b><small>Practice-specific discussion</small></div>
                <div><span>02</span><b>Workflow assessment</b><small>Find high-value automation points</small></div>
                <div><span>03</span><b>Next-step roadmap</b><small>Clear fit / no-fit decision</small></div>
              </div>
              {SKYDO_PAYMENT_URL ? <a href={SKYDO_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="pay-btn"><span>🔒</span>Continue to Secure Payment <span>→</span></a> : <div className="pay-btn pay-disabled"><span>🔒</span>Payment link being configured</div>}
              <p className="pay-safe"><span>🛡</span> You leave DentaGrow for Skydo to complete payment. We do not collect or store your bank credentials on this website.</p>
              <div className="pay-trust"><span>✓ External payment provider</span><span>✓ No card/bank data stored here</span><span>✓ Refundable deposit policy shown before payment</span></div>
              <div className="pay-policy">By continuing, you are reserving a consultation deposit. Refunds are handled according to the consultation/refund policy and the payment provider's applicable process.</div>
            </div>
          </div>

          <div className="after-pay">
            <div><span className="ap-icon">1</span><div><b>Pay the refundable deposit</b><small>Complete the $199 payment securely through Skydo.</small></div></div>
            <div><span className="ap-icon">2</span><div><b>Book your consultation</b><small>After payment verification, receive your private booking instructions.</small></div></div>
            <div><span className="ap-icon">3</span><div><b>Leave with a clear next step</b><small>Fit, priorities and implementation path — without pressure.</small></div></div>
          </div>
          <div style={{textAlign:'center',marginTop:22}}><p style={{fontSize:11.5,color:'rgba(200,220,255,0.42)',lineHeight:1.6,margin:0}}>Already paid? Keep your Skydo confirmation. We verify payment before sending your private consultation-booking instructions.</p></div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:'80px 5%',background:'linear-gradient(150deg,#040d1a,#041e30,#040d1a)',borderTop:'1px solid rgba(255,255,255,0.06)',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:'rgba(4,13,26,0.9)'}}/><div style={{position:'absolute',bottom:'-20%',right:'-5%',width:500,height:500,borderRadius:'50%',background:'rgba(0,196,160,0.05)',filter:'blur(70px)',pointerEvents:'none'}}/><div className="cg" style={{maxWidth:1060,margin:'0 auto',position:'relative',zIndex:2}}><div><div className="bdg bteal" style={{marginBottom:16}}>Practice Consultation</div><h2 className="sh2" style={{marginBottom:14}}>Let's map your<br/><span className="gteal">practice workflow.</span></h2><p style={{fontSize:14.5,color:'rgba(200,220,255,0.6)',fontWeight:300,lineHeight:1.75,marginBottom:26}}>Tell us where your practice spends the most manual time. We will use that starting point to shape the right automation plan — whether your priority is operations, patient retention, growth, or a combination.</p>{[{icon:'🔎',title:'Workflow-first assessment',desc:'Start with your real patient journey and staff workload.'},{icon:'🧩',title:'Tool-agnostic architecture',desc:'Use the tools that fit the practice instead of forcing one stack.'},{icon:'🧑‍⚕️',title:'Human control where it matters',desc:'Automation handles repeatable work; people handle judgement and exceptions.'}].map(item=><div key={item.title} style={{display:'flex',gap:12,marginBottom:15}}><div style={{width:38,height:38,borderRadius:10,background:'rgba(0,196,160,0.08)',border:'1px solid rgba(0,196,160,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{item.icon}</div><div><div style={{fontWeight:600,fontSize:13.5,color:'#fff',marginBottom:2}}>{item.title}</div><div style={{fontSize:12.5,color:'rgba(200,220,255,0.5)'}}>{item.desc}</div></div></div>)}<div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}><a href="#reserve" className="btn-cta" style={{fontSize:14.5}}><span className="ci">🔒</span>Reserve Your Consultation · $199<span className="arr">→</span></a><a href={`mailto:${EMAIL}`} style={{fontSize:12.5,color:'rgba(200,220,255,0.4)',textDecoration:'none'}} onMouseEnter={e=>(e.currentTarget.style.color='#00c4a0')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(200,220,255,0.4)')}>✉ {EMAIL}</a></div></div><div className="fcard" onMouseEnter={e=>(e.currentTarget.style.transform='perspective(900px) rotateY(0deg)')} onMouseLeave={e=>(e.currentTarget.style.transform='perspective(900px) rotateY(-2deg)')}>{submitState==='done'?<div style={{textAlign:'center',padding:'30px 0'}}><div style={{fontSize:50,marginBottom:14}}>✅</div><h3 style={{fontWeight:800,fontSize:20,color:'#fff',marginBottom:8}}>Request Received</h3><p style={{fontSize:13.5,color:'rgba(200,220,255,0.6)',lineHeight:1.65,maxWidth:320,margin:'0 auto 18px'}}>Your practice details are saved. The next step is to reserve your $199 refundable consultation deposit. Payment is completed securely on Skydo.</p><a href="#reserve" className="btn-cta" style={{fontSize:14,marginBottom:12}}><span className="ci">🔒</span>Continue to $199 Secure Reservation<span className="arr">→</span></a><div><button onClick={()=>setSubmitState('idle')} style={{background:'none',color:'rgba(200,220,255,0.4)',border:'none',cursor:'pointer',fontSize:12.5,marginTop:4,textDecoration:'underline'}}>Edit / Submit Again</button></div></div>:<form onSubmit={handleSubmit}><h3 style={{fontWeight:800,fontSize:19,color:'#fff',marginBottom:5,letterSpacing:'-0.02em'}}>Tell Us About Your Practice</h3><p style={{fontSize:11.5,color:'rgba(200,220,255,0.4)',marginBottom:20}}>No long questionnaire. Just enough context to start the conversation.</p><div className="fr" style={{marginBottom:10}}><div><label className="fl">Your Name *</label><input required style={inp} placeholder="Dr. Jane Smith" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div><div><label className="fl">Phone</label><input style={inp} placeholder="+1 (415) 555-0100" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div></div><div style={{marginBottom:10}}><label className="fl">Email Address *</label><input required type="email" style={inp} placeholder="jane@sfdentalclinic.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div><div style={{marginBottom:10}}><label className="fl">Clinic Name *</label><input required style={inp} placeholder="Pacific Smiles Dental, SF" value={form.clinic_name} onChange={e=>setForm(f=>({...f,clinic_name:e.target.value}))}/></div><div style={{marginBottom:18}}><label className="fl">What would you most like to improve?</label><textarea style={{...inp,resize:'vertical',minHeight:92} as React.CSSProperties} placeholder="e.g. scheduling, missed calls, follow-up, recall, staff workload, patient growth..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/></div>{submitState==='error'&&<div style={{background:'rgba(244,63,94,0.1)',border:'1px solid rgba(244,63,94,0.3)',borderRadius:8,padding:'9px 13px',fontSize:12.5,color:'#f43f5e',marginBottom:12}}>Something went wrong. Please email us directly.</div>}<button type="submit" disabled={submitState==='loading'} className="subbtn" style={{opacity:submitState==='loading'?0.7:1,cursor:submitState==='loading'?'not-allowed':'pointer'}}>{submitState==='loading'?'Sending...':'Start the Conversation →'}</button><p style={{fontSize:10.5,color:'rgba(200,220,255,0.28)',textAlign:'center',marginTop:10}}>🔒 Submitted through the DentaGrow lead workflow.</p></form>}</div></div></section>

      {/* FAQ */}
      <section style={{padding:'80px 5%',borderTop:'1px solid rgba(255,255,255,0.05)',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',bottom:'-30%',right:'-10%',width:600,height:600,borderRadius:'50%',background:'rgba(30,127,255,0.04)',filter:'blur(80px)',pointerEvents:'none'}}/><div style={{maxWidth:780,margin:'0 auto',position:'relative',zIndex:1}}><div style={{textAlign:'center',marginBottom:44}}><h2 className="sh2">Frequently Asked Questions</h2><p className="ssub">Simple answers before you decide whether DentaGrow fits your practice.</p></div><div style={{display:'flex',flexDirection:'column',gap:9}}>{[{q:'Do I need more patients for DentaGrow to be useful?',a:'No. If your practice already has enough patient demand, DentaGrow can start with operations: scheduling workflows, reminders, follow-up, recall, reactivation, communication and reporting. Acquisition can be added only when it makes sense.'},{q:'What happens if my clinic already has a receptionist?',a:'DentaGrow is designed to reduce repetitive workload, not blindly remove the human role. Staff can focus on exceptions, patients in the office and situations that require judgement while automation handles repeatable workflows.'},{q:'What if I do not have a good website or chatbot?',a:'That is not a blocker. When needed, DentaGrow can provide a patient-facing landing page and lead-capture experience as part of the setup so inquiries have a clear place to go.'},{q:'Can DentaGrow bring new patients too?',a:'Yes. When growth is needed, we can add an acquisition layer such as Meta or Google campaigns targeted to the practice’s relevant local service area. Advertising spend and DentaGrow service fees are kept separate.'},{q:'Does DentaGrow replace the doctor?',a:'No. Clinical judgement, diagnosis, treatment decisions and other professional responsibilities stay with the appropriate clinic professionals. DentaGrow focuses on operational and communication workflows.'},{q:'What tools are used behind the scenes?',a:'The exact stack depends on the practice. n8n can orchestrate approved tools such as scheduling, CRM/data stores, email, SMS, AI services, voice agents and reporting. The clinic should not have to manage each tool separately.'},{q:'Can everything be automated?',a:'Not everything should be. The system should automate repeatable work and escalate exceptions. Complex patient issues, sensitive disputes and clinical matters should remain with humans.'},{q:'Why is there a $199 consultation deposit?',a:'The deposit reserves a dedicated consultation and helps keep the conversation focused on practices that are seriously evaluating workflow improvement. It is presented as refundable according to the consultation policy.'},{q:'Is the payment handled by DentaGrow?',a:'The website does not collect or store your bank credentials. The payment button takes you to Skydo to complete the transaction. We do not mark a consultation as paid merely because a button was clicked; payment is verified before booking instructions are released.'},{q:'What happens after I pay?',a:'Complete the $199 payment through Skydo. Keep the payment confirmation; we verify the payment before sending the consultation-booking instructions. The consultation then maps priorities, automation opportunities and the appropriate next step.'},{q:'How does the refund work?',a:'The $199 amount is a refundable consultation deposit subject to the stated consultation/refund policy. Payment-provider processing and settlement rules may affect how a refund or chargeback is handled.'},{q:'How do we get started?',a:'Reserve the consultation, complete the $199 payment through Skydo, keep your payment confirmation, and receive the consultation-booking instructions after verification. We then map the practice workflow, identify the highest-value manual tasks, and decide which automations and integrations belong in the initial setup.'}].map((item,i)=><div key={i} className={`fi ${faqOpen===i?'fo':''}`}><button onClick={()=>setFaqOpen(faqOpen===i?null:i)} className="fb"><span style={{fontWeight:600,fontSize:14.5,color:'#f0f6ff',lineHeight:1.5,textAlign:'left'}}>{item.q}</span><span className={`fic ${faqOpen===i?'fio':''}`}>+</span></button>{faqOpen===i&&<div style={{padding:'0 18px 16px'}}><p style={{fontSize:13.5,color:'rgba(200,220,255,0.62)',lineHeight:1.75,margin:0}}>{item.a}</p></div>}</div>)}</div></div></section>

      {/* FOOTER */}
      <footer style={{background:'rgba(4,8,18,0.99)',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'46px 5% 24px',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,196,160,0.45),transparent)'}}/><div style={{maxWidth:1100,margin:'0 auto'}}><div className="ftg"><div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}><div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#00c4a0,#1e7fff)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(0,196,160,0.4)',transform:'perspective(140px) rotateY(-6deg)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg></div><div><div style={{fontWeight:800,fontSize:13.5,color:'#fff',letterSpacing:'-0.02em'}}>AJ Intelligent Group</div><div style={{fontSize:8.5,color:'rgba(0,196,160,0.6)',fontWeight:600,letterSpacing:'0.04em'}}>DentaGrow · Dental Practice Systems</div></div></div><p style={{fontSize:12.5,color:'rgba(200,220,255,0.38)',lineHeight:1.75,maxWidth:280,marginBottom:14}}>DentaGrow helps dental practices automate repeatable operational work and add patient acquisition when growth is needed.</p><a href={`mailto:${EMAIL}`} style={{fontSize:11.5,color:'rgba(200,220,255,0.4)'}}>✉ {EMAIL}</a></div><div><div className="fth">System</div>{['How It Works','Operations','Patient Growth','Contact'].map(s=><a key={s} href={s==='Contact'?'#contact':s==='Patient Growth'?'#results':'#how-it-works'} className="ftl">{s}</a>)}</div><div><div className="fth">Principles</div>{['Automate repeatable work','Human escalation','Workflow-first','No fake claims'].map(s=><span key={s} className="ftl" style={{cursor:'default'}}>{s}</span>)}</div><div><div className="fth">Get Started</div><p style={{fontSize:12.5,color:'rgba(200,220,255,0.38)',lineHeight:1.7,marginBottom:14}}>Ready to see where automation can remove repetitive work from your practice?</p><a href="#reserve" className="btn-cta btn-sm"><span className="ci">🔒</span>Reserve · $199<span className="arr">→</span></a></div></div><div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:18,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginTop:36}}><p style={{fontSize:11.5,color:'rgba(200,220,255,0.2)'}}>© 2026 AJ Intelligent Group. All rights reserved. · DentaGrow</p><p style={{fontSize:10.5,color:'rgba(200,220,255,0.13)',maxWidth:480,textAlign:'right'}}>Dental practice automation · scheduling workflows · patient communication · recall & reactivation · local patient acquisition</p></div></div></footer>

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
        .pay-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:34px;align-items:center;}
        .pay-story{position:relative;min-height:520px;padding:28px 18px 24px;border-radius:26px;background:linear-gradient(145deg,rgba(8,20,40,0.74),rgba(5,14,28,0.55));border:1px solid rgba(255,255,255,0.07);overflow:hidden;}
        .pay-story:after{content:'';position:absolute;inset:auto 0 0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,160,.45),transparent);}
        .pay-visual{height:250px;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:22px;}
        .pay-ring{position:absolute;border-radius:50%;border:1px solid rgba(0,196,160,.14);transform:rotateX(68deg) rotateZ(-8deg);}
        .ring-a{width:290px;height:290px;box-shadow:0 0 70px rgba(0,196,160,.08);animation:spinRing 13s linear infinite;}
        .ring-b{width:210px;height:210px;border-color:rgba(30,127,255,.16);transform:rotateX(68deg) rotateZ(25deg);animation:spinRing 9s linear infinite reverse;}
        @keyframes spinRing{from{transform:rotateX(68deg) rotateZ(0deg)}to{transform:rotateX(68deg) rotateZ(360deg)}}
        .pay-orb{width:116px;height:116px;border-radius:28px;background:linear-gradient(145deg,rgba(0,196,160,.9),rgba(30,127,255,.85));box-shadow:0 30px 70px rgba(0,196,160,.22),0 0 0 8px rgba(255,255,255,.03);transform:perspective(500px) rotateX(12deg) rotateY(-18deg);display:flex;align-items:center;justify-content:center;position:relative;z-index:2;animation:floatOrb 4.8s ease-in-out infinite;}
        .pay-orb:before{content:'';position:absolute;inset:8px;border-radius:22px;border:1px solid rgba(255,255,255,.35);box-shadow:inset 0 0 30px rgba(255,255,255,.08);}
        .pay-orb-inner{font-size:28px;font-weight:900;letter-spacing:-.08em;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.22);}
        @keyframes floatOrb{0%,100%{transform:perspective(500px) rotateX(12deg) rotateY(-18deg) translateY(0)}50%{transform:perspective(500px) rotateX(16deg) rotateY(-10deg) translateY(-10px)}}
        .pay-float{position:absolute;z-index:3;padding:8px 11px;border-radius:12px;background:rgba(4,13,26,.88);border:1px solid rgba(255,255,255,.09);backdrop-filter:blur(12px);font-size:10.5px;font-weight:700;color:rgba(255,255,255,.72);box-shadow:0 12px 30px rgba(0,0,0,.28);animation:floatCard 5s ease-in-out infinite;}
        .pay-float span{color:#00c4a0;margin-right:5px}.pf-a{top:30px;left:8%}.pf-b{top:80px;right:6%;animation-delay:-1.5s}.pf-c{bottom:18px;left:18%;animation-delay:-2.8s}.pay-float:nth-child(4){animation-delay:-2.8s}
        @keyframes floatCard{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .pay-kicker{font-size:10px;font-weight:800;letter-spacing:.14em;color:#00c4a0;text-transform:uppercase;}
        .pay-checks{display:grid;gap:9px}.pay-checks div{font-size:12.5px;color:rgba(220,235,255,.62);display:flex;gap:9px;align-items:flex-start;line-height:1.5}.pay-checks span{width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(0,196,160,.1);border:1px solid rgba(0,196,160,.22);color:#00c4a0;font-size:10px;font-weight:800;}
        .pay-card{border-radius:24px;padding:26px 24px 22px;background:linear-gradient(150deg,rgba(9,25,47,.98),rgba(4,13,26,.98));border:1px solid rgba(0,196,160,.22);box-shadow:0 25px 80px rgba(0,0,0,.4),0 0 70px rgba(0,196,160,.06);transform:perspective(1000px) rotateY(-2deg);transition:transform .25s ease,box-shadow .25s ease;position:relative;overflow:hidden;}
        .pay-card:before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.05),transparent 30%,transparent 70%,rgba(0,196,160,.04));pointer-events:none;}.pay-card:after{content:'';position:absolute;top:-90px;right:-80px;width:220px;height:220px;border-radius:50%;background:rgba(0,196,160,.09);filter:blur(35px);pointer-events:none;}
        .pay-card-top{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:rgba(220,235,255,.48);position:relative;z-index:2}.pay-card-top>div{display:flex;align-items:center;gap:7px}.secure-dot{width:7px;height:7px;border-radius:50%;background:#00e676;box-shadow:0 0 12px rgba(0,230,118,.8)}.skydo-chip{font-size:9px;letter-spacing:.12em;font-weight:900;color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.11);padding:5px 8px;border-radius:7px;}
        .pay-old{font-size:13px;color:rgba(200,220,255,.38);text-decoration:line-through;text-decoration-thickness:1px}.pay-old span{font-size:10px;text-decoration:none;display:inline-block;margin-left:6px;color:rgba(200,220,255,.25)}.pay-price{font-size:66px;line-height:1;font-weight:900;letter-spacing:-.06em;color:#fff;margin-top:4px;text-shadow:0 0 35px rgba(0,196,160,.14)}.pay-price .currency{font-size:28px;vertical-align:top;position:relative;top:9px;margin-right:2px;color:#00c4a0}.pay-price .usd{font-size:11px;letter-spacing:.12em;color:rgba(200,220,255,.36);font-weight:700;margin-left:7px}.pay-label{font-size:12px;color:#00c4a0;font-weight:700;margin-top:5px}.pay-divider{height:1px;background:rgba(255,255,255,.07);margin:22px 0 8px}.pay-includes{display:grid;gap:0}.pay-includes>div{display:grid;grid-template-columns:28px 1fr;column-gap:9px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)}.pay-includes>div:last-child{border-bottom:0}.pay-includes span{grid-row:span 2;font-size:9px;color:#00c4a0;font-weight:800;padding-top:2px}.pay-includes b{font-size:12.5px;color:#f2f7ff}.pay-includes small{font-size:10.5px;color:rgba(200,220,255,.34);margin-top:2px}.pay-btn{margin-top:13px;display:flex;align-items:center;justify-content:space-between;gap:10px;text-decoration:none;border-radius:12px;padding:14px 15px;background:linear-gradient(100deg,#00c4a0,#00a98a);color:#03130f;font-size:13px;font-weight:900;box-shadow:0 12px 30px rgba(0,196,160,.18);transition:transform .2s ease,box-shadow .2s ease;position:relative;z-index:2}.pay-btn:hover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(0,196,160,.25)}.pay-disabled{opacity:.55;cursor:not-allowed;justify-content:center}.pay-safe{font-size:10.5px;color:rgba(200,220,255,.34);line-height:1.6;text-align:center;margin:10px 8px 0}.pay-safe span{color:#00c4a0}.pay-trust{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:13px}.pay-trust span{font-size:9.5px;color:rgba(220,235,255,.36);padding:4px 7px;border:1px solid rgba(255,255,255,.06);border-radius:100px}.pay-policy{font-size:9.5px;color:rgba(200,220,255,.24);line-height:1.55;text-align:center;margin-top:12px}.after-pay{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:28px;border:1px solid rgba(255,255,255,.06);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}.after-pay>div{display:flex;gap:10px;padding:16px 14px;border-right:1px solid rgba(255,255,255,.06)}.after-pay>div:last-child{border-right:0}.ap-icon{width:24px;height:24px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(0,196,160,.1);border:1px solid rgba(0,196,160,.18);font-size:10px;color:#00c4a0;font-weight:900}.after-pay b{display:block;font-size:11.5px;color:#f0f6ff}.after-pay small{display:block;font-size:9.8px;line-height:1.45;color:rgba(200,220,255,.3);margin-top:3px}


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

        @media(max-width:1024px){.pay-grid{grid-template-columns:1fr}.pay-story{min-height:auto}.pay-card{transform:none}.after-pay{grid-template-columns:1fr}.after-pay>div{border-right:0;border-bottom:1px solid rgba(255,255,255,0.06)}.after-pay>div:last-child{border-bottom:0}.pay-visual{max-width:520px;margin:0 auto 22px}}
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
