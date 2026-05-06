import { useState } from "react";

const B = {
  bg: "#faf6ef",
  bgAlt: "#f3ede2",
  bgCard: "#ffffff",
  gold: "#b8943f",
  goldLight: "#d4ae6a",
  goldDark: "#8a6c2a",
  goldFaint: "#f5ead6",
  ink: "#1a1410",
  inkMid: "#3a2e20",
  inkLight: "#6b5a40",
  inkFaint: "#a89070",
  border: "#e0d0b8",
  borderGold: "#c9a84c",
  pass: "#3a7a3a",
  passBg: "#eaf4ea",
  fail: "#8a2e20",
  failBg: "#f9ecea",
  shadow: "0 2px 16px rgba(90,60,20,0.10)",
};

const lawQuestions = [
  { id:1, scenario:"A litigation associate uses an AI tool to draft a motion. The AI cites three cases — two are real, one does not exist. The associate files the motion without verifying citations.", question:"What is the primary ethical violation?", options:["Using AI tools in legal practice","Failing to supervise and verify AI-generated work before filing","Not disclosing AI use to the client","Using a non-approved vendor"], correct:1, explanation:"Competence under Model Rules requires attorneys to supervise all work product, including AI-generated content. Filing unverified citations is a candor violation." },
  { id:2, scenario:"A client asks their attorney if they can share case details with a new AI research tool that stores data on third-party servers to improve its model.", question:"What is the attorney's primary obligation before using this tool?", options:["Obtain informed client consent and assess confidentiality risks","Check whether the tool is ABA-approved","Ensure the tool has a privacy policy","Consult with the firm's IT department"], correct:0, explanation:"Model Rule 1.6 requires protecting client confidential information. Sharing data with a third-party AI system requires informed consent and a confidentiality risk assessment." },
  { id:3, scenario:"An AI contract review tool flags a clause as 'high risk' in 94% of similar contracts. The attorney relies solely on this flag to advise the client to reject the clause.", question:"What ethical principle is most at risk?", options:["Competence — the attorney must independently evaluate AI outputs","Loyalty — the attorney is prioritizing the AI over the client","Communication — the client wasn't told about the AI tool","Diligence — the attorney should have reviewed more contracts manually"], correct:0, explanation:"Attorneys must exercise independent professional judgment. Statistical AI outputs cannot substitute for legal analysis specific to the client's situation." },
  { id:4, scenario:"A law firm deploys an AI chatbot on its website that answers legal questions. The chatbot does not state it is AI, and a visitor relies on its advice without retaining the firm.", question:"Which issue is most immediately raised?", options:["Unauthorized practice of law by the AI system","Potential formation of attorney-client relationship and duty of care","GDPR violation for collecting user data","Marketing ethics — failure to disclose AI use in advertising"], correct:1, explanation:"Courts have found attorney-client relationships can form when a person reasonably believes they are receiving legal advice. An undisclosed AI chatbot creates serious duty-of-care exposure." },
  { id:5, scenario:"A public defender's office implements a recidivism prediction AI to help prioritize case resources. The model was trained on historical arrest data from a jurisdiction with documented racial disparities in policing.", question:"What is the most critical concern with this deployment?", options:["The AI may be slower than manual review","Algorithmic bias may systematically disadvantage already-marginalized clients","The vendor contract may not be properly executed","The tool has not been peer-reviewed"], correct:1, explanation:"AI models trained on biased historical data can perpetuate and amplify systemic inequities. In a public defense context, this raises equal protection and ineffective assistance concerns." },
  { id:6, scenario:"An attorney uses AI to summarize 2,000 pages of discovery. The summary is accurate but omits three documents that, while seemingly minor, are actually critical to the case theory.", question:"What does this illustrate about AI use in legal practice?", options:["AI is not yet reliable enough for discovery review","Human oversight is essential — AI can produce accurate-seeming outputs that miss legally significant nuance","The attorney should have used a different AI model","Discovery review should always be done manually"], correct:1, explanation:"AI summarization tools optimize for general relevance, not legal strategy. Attorneys must define what is material and review accordingly — this is a competence and diligence issue." },
  { id:7, scenario:"A client discovers their attorney used AI to draft their will. They are upset and feel they received less personal service. They did not consent to AI use.", question:"What best describes the attorney's obligation going forward?", options:["Apologize and offer a discount","Explain that AI use is standard practice and not subject to consent","Review disclosure policies — many jurisdictions and bar associations are moving toward requiring informed consent for AI use","Redo the will manually at no charge"], correct:2, explanation:"Emerging bar guidance in multiple jurisdictions indicates that clients should be informed when AI plays a substantial role in their representation, particularly for high-stakes personal documents." },
  { id:8, scenario:"An AI legal research tool confidently states that a statute was amended in 2022 to include a new provision. The attorney cannot find the amendment in the official code.", question:"What is the appropriate next step?", options:["Trust the AI — it has access to more data sources","Report a bug to the vendor","Verify through official primary sources before relying on this information","Ask a colleague who uses the same tool"], correct:2, explanation:"AI tools can hallucinate legislative history and statutory text. Attorneys must always verify legal authority through official, authoritative primary sources." },
  { id:9, scenario:"A junior associate is asked by a partner to use an AI tool the firm has not vetted. The associate suspects the tool may store confidential data insecurely.", question:"What should the associate do?", options:["Use the tool — the partner authorized it","Refuse and report the partner","Raise the concern with the partner and escalate to firm leadership or ethics counsel if unresolved","Use the tool but avoid inputting sensitive client data"], correct:2, explanation:"Professional responsibility obligations run to the client, not the supervising partner. Associates have a duty to raise ethical concerns — this is a supervisory responsibility issue under Model Rule 5.2." },
  { id:10, scenario:"A firm's AI billing tool automatically rounds up time entries by 6 minutes per task. The firm is unaware this is happening.", question:"When discovered, what is the firm's obligation?", options:["Disclose to affected clients and issue corrective billing","Fix the tool going forward — past bills are already paid","Investigate whether the rounding was within billing guidelines","This is a vendor issue, not a firm ethics issue"], correct:0, explanation:"Billing irregularities created by AI systems remain the firm's responsibility. Discovery of systematic overbilling requires disclosure, remediation, and potentially bar notification under Model Rule 8.3." },
  { id:11, scenario:"An opposing party's AI-generated brief contains fabricated citations. You discover this during trial preparation.", question:"What is your obligation?", options:["Use this information strategically in your arguments","Notify the court — you have a duty of candor to the tribunal regardless of which party's filing contains misrepresentations","Inform opposing counsel privately and allow them to correct it","Wait and see if the judge notices"], correct:1, explanation:"Model Rule 3.3 requires candor toward the tribunal. When an attorney knows that false statements of law have been made to the court, they must take reasonable remedial measures." },
  { id:12, scenario:"A client asks you to use AI to predict the outcome of their case based on similar verdicts. The AI gives an 82% probability of success.", question:"How should you communicate this to the client?", options:["Share the 82% figure as a reliable prediction","Contextualize the statistical output: explain its limitations, the factors the model cannot assess, and provide your independent professional judgment","Do not share AI predictions with clients","Only share the prediction if it is above 90%"], correct:1, explanation:"Predictive AI outputs are probabilistic, not determinative. Competent counsel must translate AI outputs into meaningful advice, not delegate judgment to a confidence score." },
  { id:13, scenario:"Your firm is considering an AI tool that would analyze client emails to improve service delivery. Clients have not been notified.", question:"What must happen before deployment?", options:["IT security review","Informed client consent and updated engagement letters addressing AI data use","Partner approval only","A 90-day pilot with select clients"], correct:1, explanation:"Client communications are confidential under Model Rule 1.6. Using them to train or power AI systems without client knowledge and consent is a confidentiality violation." },
  { id:14, scenario:"A solo practitioner uses a free AI tool to draft client agreements. The tool's terms of service state it may use inputs to train future models.", question:"What is the primary risk?", options:["The agreements may be lower quality than attorney-drafted ones","Client confidential information may be used to train third-party AI models without consent","Free tools are not reliable enough for legal use","The attorney could be accused of using unauthorized software"], correct:1, explanation:"Free AI tools that train on user inputs can expose client confidences to third parties. Attorneys must review vendor data practices before inputting any client information." },
  { id:15, scenario:"A law firm's AI intake tool automatically declines potential clients based on a proprietary risk score. The scoring criteria are not disclosed to applicants.", question:"What ethical issues does this raise?", options:["Firms have no obligation to accept any client — this is permissible","Potential discrimination, lack of transparency, and failure to ensure the AI reflects the firm's professional judgment on intake decisions","The tool should be disclosed only if it uses protected class data","This is a business practice issue, not an ethics issue"], correct:1, explanation:"AI intake systems can encode discriminatory patterns. Firms are responsible for ensuring their intake processes — including AI-assisted ones — comply with anti-discrimination obligations and reflect genuine professional judgment." },
];

const generalQuestions = [
  { id:1, scenario:"A company deploys an AI customer service agent without disclosing to customers that they are not speaking with a human.", question:"Which ethical principle is most directly violated?", options:["Efficiency — the AI is slowing response times","Transparency — users have a right to know they are interacting with AI","Privacy — customer data may be at risk","Fairness — some customers prefer human agents"], correct:1, explanation:"Transparency is a foundational AI ethics principle. Users must be able to know when they are interacting with an AI system, particularly in contexts that may affect their decisions." },
  { id:2, scenario:"An AI hiring tool trained on 10 years of employee data consistently rates candidates from certain universities significantly higher, regardless of qualifications.", question:"What type of AI failure does this represent?", options:["Technical error — the model needs retraining","Historical bias encoded into the model's training data","A calibration issue with the scoring threshold","Overfitting to recent employee data"], correct:1, explanation:"When AI models learn from historical data that reflects past human biases, they encode and often amplify those biases. This is a systemic fairness problem, not merely a technical one." },
  { id:3, scenario:"A healthcare organization uses AI to prioritize patients for follow-up care. The model uses zip code as a proxy variable. Patients in lower-income zip codes consistently receive lower priority scores.", question:"What does this illustrate?", options:["Proxy discrimination — variables that seem neutral can produce discriminatory outcomes","The model is correctly prioritizing patients with better access to care","Geographic data should never be used in healthcare AI","The model needs more training data from low-income areas"], correct:0, explanation:"Proxy discrimination occurs when neutral-seeming variables correlate with protected characteristics. Zip code often proxies for race and income. Outcomes must be audited for disparate impact, not just inputs." },
  { id:4, scenario:"An organization wants to deploy a generative AI tool for internal communications. An employee asks: 'Who is accountable if the AI produces harmful content?'", question:"What is the correct answer?", options:["The AI vendor is solely accountable","The employee who prompted the output","The organization that deployed the tool — accountability cannot be delegated to an AI system","No one — AI outputs are unpredictable and therefore no one is responsible"], correct:2, explanation:"Human accountability is a core AI ethics principle. Organizations that deploy AI systems are responsible for the outcomes those systems produce, regardless of vendor agreements." },
  { id:5, scenario:"A journalist asks a company to explain why its AI system denied a customer's loan application. The company says the model is proprietary and the decision cannot be explained.", question:"What principle does this violate?", options:["Explainability — individuals affected by AI decisions have a right to meaningful explanation","Efficiency — explainable AI is slower to deploy","Accuracy — unexplainable models are less accurate","Security — explaining models exposes them to adversarial attack"], correct:0, explanation:"The right to explanation is enshrined in frameworks including the EU AI Act and GDPR. High-stakes automated decisions must be explainable to those they affect." },
  { id:6, scenario:"A nonprofit uses an AI content moderation tool to remove harmful posts. The tool removes significantly more content from users who write in non-standard English dialects.", question:"What is happening and why does it matter?", options:["The tool is working as intended — non-standard English is harder to parse","The tool exhibits linguistic bias, disproportionately silencing certain communities","This is a training data volume problem — the model needs more data","Content moderation is inherently subjective and cannot be evaluated for bias"], correct:1, explanation:"NLP models trained predominantly on standard English consistently perform worse on dialectal variations, leading to disparate moderation outcomes that silence marginalized voices." },
  { id:7, scenario:"An AI system is deployed to assist judges in sentencing recommendations. Defense attorneys request access to the model's methodology. The vendor refuses, citing trade secrets.", question:"What is the core tension here?", options:["Intellectual property rights vs. due process and the right to confront evidence","Efficiency vs. accuracy in sentencing","Vendor liability vs. judicial independence","Public safety vs. defendant privacy"], correct:0, explanation:"When proprietary AI influences legal outcomes, trade secret protections conflict with constitutional due process rights. This tension is actively being litigated in US courts." },
  { id:8, scenario:"A company trains a large language model on publicly scraped internet data. The model reproduces copyrighted text verbatim when prompted.", question:"What responsibility does the deploying organization have?", options:["None — the data was publicly available","The organization must implement safeguards to prevent verbatim reproduction of protected content","The user who prompted the output is liable","Responsibility depends on whether the reproduction is discovered"], correct:1, explanation:"Organizations deploying AI systems are responsible for outputs those systems produce. 'Publicly available' does not mean copyright-free. Responsible AI deployment requires output safeguards." },
  { id:9, scenario:"An AI system used in employee performance reviews assigns scores, but managers can override them. In practice, overrides only happen for senior employees.", question:"What does this reveal about human-AI interaction?", options:["The AI is more accurate for junior employees","Meaningful human oversight must be equitably applied — selective override undermines fairness guarantees","Senior employees have more complex performance data","The override feature should be removed to ensure consistency"], correct:1, explanation:"Human oversight provisions only provide ethical protection if they are applied equitably. Selective oversight can compound, rather than correct, AI-driven inequities." },
  { id:10, scenario:"A tech company releases an AI model to the public before completing a bias audit, citing competitive pressure.", question:"What responsible AI principle is violated?", options:["Speed to market — the model should have launched sooner","Safety and due diligence — known risks should be assessed before deployment, not after","Transparency — the company should have announced the audit was incomplete","Fairness — the audit should be done by a third party"], correct:1, explanation:"Responsible AI development requires that foreseeable harms be assessed before deployment. Competitive pressure does not justify releasing systems with unassessed risk." },
  { id:11, scenario:"An AI wellness app collects user mood data to personalize recommendations. The app's privacy policy allows this data to be sold to third parties, but this is disclosed only in paragraph 47 of a 52-paragraph terms of service.", question:"What consent principle is at issue?", options:["The disclosure is legally sufficient — it was in the terms of service","Informed consent requires meaningful disclosure — burying data-sharing terms undermines genuine user understanding and autonomy","Users should read terms of service in full","Health data is not protected unless it is clinical in nature"], correct:1, explanation:"Meaningful consent requires that individuals actually understand what they are consenting to. Obscuring material data practices in lengthy legal documents violates the spirit of informed consent." },
  { id:12, scenario:"An AI system designed to detect fraud flags transactions from customers with certain names at a higher rate. The engineering team says the name variable is not in the model — it uses only behavioral data.", question:"What may be occurring?", options:["Nothing — names are not in the model so there is no issue","Behavioral data may be correlating with names as a proxy, producing discriminatory outcomes through indirect channels","The model needs to be retrained with name data to correct the pattern","This is a data quality issue — behavioral data is inherently unreliable"], correct:1, explanation:"Discrimination can emerge through complex correlations in behavioral data even when protected attributes are excluded. Responsible AI requires outcomes-based auditing, not just input-based exclusion." },
  { id:13, scenario:"A city government uses AI to predict which neighborhoods will have the highest crime rates, and allocates police resources accordingly.", question:"What is the primary ethical concern with this approach?", options:["The model may not be accurate enough for government use","Predictive policing based on historical crime data can create self-fulfilling cycles that perpetuate over-policing of marginalized communities","Government AI use requires legislative approval","The model should use real-time data, not historical data"], correct:1, explanation:"Historical crime data reflects past policing patterns, not underlying crime rates. Deploying AI on this data to allocate future policing resources creates feedback loops that entrench historical disparities." },
  { id:14, scenario:"A foundation wants to use AI to help identify grant applicants likely to achieve high impact. They ask: 'How do we know if our AI is fair?'", question:"What is the most complete answer?", options:["If the model treats all applications the same way, it is fair","Fairness requires defining which fairness metric matters for this context — equal treatment, equal outcomes, and equal opportunity can conflict with each other","Use a model trained on previous successful grantees","Fairness is subjective and cannot be measured"], correct:1, explanation:"There is no single definition of algorithmic fairness. Practitioners must explicitly choose and defend which fairness criterion applies to their context — and understand the tradeoffs between criteria." },
  { id:15, scenario:"An organization's AI ethics policy states: 'We are committed to responsible AI.' The policy has no implementation guidelines, no audit schedule, and no accountability structure.", question:"What does this represent?", options:["A solid foundation — detailed policies can be added over time","Ethics washing — aspirational statements without operationalization provide no meaningful protection","An appropriate starting point for a pre-revenue organization","This is standard practice in the industry"], correct:1, explanation:"Ethics washing occurs when organizations adopt the language of responsible AI without the structures to implement it. Meaningful AI governance requires specific commitments, measurable practices, and clear accountability." },
];

const examData = {
  law: { title:"Law", subtitle:"AI Ethics in Legal Practice", color: B.gold, colorBg: B.goldFaint, questions: lawQuestions, passMark:70, credential:"Ponder™ AI Associate — Law", description:"Covers attorney competence, confidentiality, bias, supervision, and emerging bar obligations in AI-assisted legal practice." },
  general: { title:"General", subtitle:"AI Ethics & Responsible AI Fundamentals", color:"#3a6b7a", colorBg:"#eaf3f6", questions: generalQuestions, passMark:70, credential:"Ponder™ AI Associate — General", description:"Covers transparency, accountability, fairness, bias, explainability, and responsible deployment across industries." },
};

const mockLearner = { name:"Alex Morgan", role:"Senior Associate", org:"Meridian Legal Group", exams:[{ name:"Law Associate", score:80, passed:true, date:"Apr 18, 2026", credential:"Ponder™ AI Associate — Law" },{ name:"General Associate", score:67, passed:false, date:"Apr 20, 2026", credential:null }], credentialsEarned:1, nextExam:"Law Professional" };
const mockAdmin = { org:"Meridian Legal Group", totalEnrolled:47, credentialsIssued:31, avgScore:76, revenue:11703, recentActivity:[{ name:"Jordan T.", exam:"Law Associate", score:85, passed:true, date:"Today" },{ name:"Priya K.", exam:"General Associate", score:62, passed:false, date:"Today" },{ name:"Marcus W.", exam:"Law Professional", score:78, passed:true, date:"Yesterday" },{ name:"Sofia R.", exam:"Law Associate", score:91, passed:true, date:"Yesterday" },{ name:"Theo B.", exam:"General Associate", score:70, passed:true, date:"Apr 19" }], verticalBreakdown:[{ name:"Law", count:32, pct:68 },{ name:"General", count:15, pct:32 }] };

// ── Shared components ──────────────────────────────────────────────────────

const Logo = ({ size="md" }) => {
  const s = { sm:{ main:17, period:21 }, md:{ main:24, period:29 }, lg:{ main:36, period:42 } }[size];
  return (
    <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, letterSpacing:"-0.01em" }}>
      <span style={{ color: B.ink, fontSize: s.main }}>Ponder</span>
      <span style={{ color: B.gold, fontSize: s.period }}>.</span>
    </span>
  );
};

const Chip = ({ label, color=B.gold, bg }) => (
  <span style={{ display:"inline-block", padding:"3px 11px", borderRadius:2, background: bg||"transparent", border:`1px solid ${color}`, color, fontSize:11, fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase" }}>{label}</span>
);

// ── Home ───────────────────────────────────────────────────────────────────

function HomeScreen({ onStart, onDashboard, onBackToSite }) {
  return (
    <div style={{ minHeight:"100vh", background: B.bg, display:"flex", flexDirection:"column" }}>
      {/* Nav */}
      <div style={{ background: B.bgCard, borderBottom:`1px solid ${B.border}`, padding:"18px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow: B.shadow }}>
        <Logo size="md" />
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <span style={{ color: B.inkLight, fontSize:13, fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:"italic" }}>Practitioner Certification</span>
          {onBackToSite && <button onClick={onBackToSite} style={{ background:"transparent", border:"1px solid #e0d0b8", color:"#6b5a40", borderRadius:3, cursor:"pointer", fontSize:13, padding:"6px 16px", fontFamily:"inherit" }}>← Back to Site</button>}
          <button onClick={onDashboard} style={{ padding:"8px 20px", background:"transparent", border:`1px solid ${B.borderGold}`, color: B.goldDark, borderRadius:3, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Dashboard</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 24px", textAlign:"center" }}>
        <div style={{ marginBottom:16 }}><Chip label="Associate · Exam Preview" /></div>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:"clamp(30px,5vw,52px)", color: B.ink, margin:"0 0 16px", lineHeight:1.15, maxWidth:660 }}>
          AI Ethics Certification<br/>
          <span style={{ color: B.gold }}>for Working Professionals</span>
        </h1>
        <p style={{ color: B.inkLight, fontSize:17, maxWidth:500, lineHeight:1.75, margin:"0 0 48px", fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:"italic" }}>
          Practitioner-first. Scenario-based. Built for the people actually deploying AI — not theorists observing from a distance.
        </p>

        {/* Exam cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, width:"100%", maxWidth:680, marginBottom:48 }}>
          {Object.entries(examData).map(([key, exam]) => (
            <div key={key} onClick={() => onStart(key)} style={{ background: B.bgCard, border:`1px solid ${B.border}`, borderTop:`4px solid ${exam.color}`, borderRadius:6, padding:28, cursor:"pointer", textAlign:"left", boxShadow: B.shadow, transition:"box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="0 6px 32px rgba(90,60,20,0.16)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow=B.shadow; e.currentTarget.style.transform="none"; }}>
              <div style={{ marginBottom:12 }}><Chip label={exam.title} color={exam.color} /></div>
              <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:19, color: B.ink, marginBottom:8 }}>{exam.subtitle}</div>
              <div style={{ color: B.inkLight, fontSize:14, lineHeight:1.65, marginBottom:20 }}>{exam.description}</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color: B.inkFaint, borderTop:`1px solid ${B.border}`, paddingTop:12 }}>
                <span>15 questions</span><span>Pass: 70%</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: B.inkFaint, fontSize:13 }}>Credentials renew every 2 years · Powered by <Logo size="sm" /></div>
      </div>
    </div>
  );
}

// ── Exam ───────────────────────────────────────────────────────────────────

function ExamScreen({ examKey, onComplete, onBack }) {
  const exam = examData[examKey];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const q = exam.questions[current];
  const progress = (current / exam.questions.length) * 100;

  const handleNext = () => {
    const newAnswers = [...answers, { correct: selected === q.correct }];
    if (current + 1 >= exam.questions.length) { onComplete(newAnswers); }
    else { setAnswers(newAnswers); setCurrent(current+1); setSelected(null); setRevealed(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background: B.bg, display:"flex", flexDirection:"column" }}>
      {/* Nav */}
      <div style={{ background: B.bgCard, borderBottom:`1px solid ${B.border}`, padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow: B.shadow }}>
        <Logo size="sm" />
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <Chip label={exam.title} color={exam.color} />
          <span style={{ color: B.inkLight, fontSize:14 }}>Question {current+1} of {exam.questions.length}</span>
        </div>
        <button onClick={onBack} style={{ background:"transparent", border:"none", color: B.inkLight, cursor:"pointer", fontSize:22, lineHeight:1 }}>✕</button>
      </div>

      {/* Progress */}
      <div style={{ height:4, background: B.border }}>
        <div style={{ height:"100%", width:`${progress}%`, background: exam.color, transition:"width 0.4s ease" }} />
      </div>

      {/* Body */}
      <div style={{ flex:1, padding:"36px 24px", display:"flex", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:700 }}>

          {/* Scenario */}
          <div style={{ background: exam.colorBg, border:`1px solid ${exam.color}30`, borderLeft:`4px solid ${exam.color}`, borderRadius:6, padding:"20px 24px", marginBottom:28 }}>
            <div style={{ color: exam.color, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:8, fontWeight:600 }}>Scenario</div>
            <p style={{ color: B.inkMid, fontSize:16, lineHeight:1.8, margin:0 }}>{q.scenario}</p>
          </div>

          {/* Question */}
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:21, color: B.ink, marginBottom:24, lineHeight:1.4 }}>{q.question}</div>

          {/* Options */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
            {q.options.map((opt, idx) => {
              let bg = B.bgCard, border = B.border, color = B.inkMid, borderL = "transparent";
              if (revealed) {
                if (idx === q.correct) { bg = B.passBg; border = B.pass; color = B.pass; borderL = B.pass; }
                else if (idx === selected && idx !== q.correct) { bg = B.failBg; border = B.fail; color = B.fail; borderL = B.fail; }
                else { color = B.inkFaint; }
              } else if (idx === selected) { border = exam.color; bg = exam.colorBg; borderL = exam.color; }
              return (
                <div key={idx} onClick={() => !revealed && setSelected(idx)} style={{ background: bg, border:`1px solid ${border}`, borderLeft:`4px solid ${revealed || idx===selected ? borderL||border : B.border}`, borderRadius:6, padding:"16px 20px", cursor: revealed?"default":"pointer", color, fontSize:15, lineHeight:1.6, transition:"all 0.2s", display:"flex", alignItems:"flex-start", gap:14 }}>
                  <span style={{ fontFamily:"monospace", fontSize:12, color: idx===selected||revealed?border:B.inkFaint, minWidth:22, paddingTop:2, fontWeight:700 }}>{String.fromCharCode(65+idx)}.</span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div style={{ background:"#fdfaf5", border:`1px solid ${B.border}`, borderRadius:6, padding:"18px 22px", marginBottom:24 }}>
              <div style={{ color: B.gold, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:8, fontWeight:600 }}>Why this matters</div>
              <p style={{ color: B.inkMid, fontSize:15, lineHeight:1.75, margin:0 }}>{q.explanation}</p>
            </div>
          )}

          {/* Actions */}
          {!revealed ? (
            <button onClick={() => selected!==null && setRevealed(true)} disabled={selected===null} style={{ width:"100%", padding:"15px", background: selected!==null ? exam.color : B.border, color: selected!==null ? "#fff" : B.inkFaint, border:"none", borderRadius:6, cursor: selected!==null?"pointer":"not-allowed", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:17, transition:"background 0.2s" }}>Check Answer</button>
          ) : (
            <button onClick={handleNext} style={{ width:"100%", padding:"15px", background: exam.color, color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:17 }}>
              {current+1>=exam.questions.length ? "View Results →" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────────────

function ResultsScreen({ examKey, answers, onRetake, onHome }) {
  const exam = examData[examKey];
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round((correct/answers.length)*100);
  const passed = pct >= exam.passMark;

  return (
    <div style={{ minHeight:"100vh", background: B.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40 }}>
      <div style={{ width:"100%", maxWidth:540, textAlign:"center" }}>
        <div style={{ marginBottom:28 }}><Logo size="lg" /></div>

        {/* Score */}
        <div style={{ width:148, height:148, borderRadius:"50%", border:`5px solid ${passed?B.pass:B.fail}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", background: passed?B.passBg:B.failBg, boxShadow: B.shadow }}>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:44, color: passed?B.pass:B.fail, lineHeight:1 }}>{pct}%</div>
          <div style={{ fontSize:13, color: B.inkLight, marginTop:4 }}>{correct}/{answers.length} correct</div>
        </div>

        <div style={{ marginBottom:14 }}><Chip label={passed?"Credential Earned":"Not Yet Passed"} color={passed?B.pass:B.fail} bg={passed?B.passBg:B.failBg} /></div>

        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:30, color: B.ink, margin:"0 0 12px" }}>{passed?"Congratulations.":"Keep Going."}</h2>
        <p style={{ color: B.inkLight, fontSize:16, lineHeight:1.75, margin:"0 0 32px", fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:"italic" }}>
          {passed ? `You've demonstrated practitioner-level AI ethics competency in ${exam.title}. Your credential is being prepared.` : `You scored ${pct}% — a passing score of ${exam.passMark}% is required. Review the material and try again when ready.`}
        </p>

        {passed && (
          <div style={{ background: B.bgCard, border:`1px solid ${B.borderGold}`, borderTop:`4px solid ${B.gold}`, borderRadius:6, padding:"22px 28px", marginBottom:28, textAlign:"left", boxShadow: B.shadow }}>
            <div style={{ color: B.gold, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:10, fontWeight:600 }}>Credential Issued</div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:20, color: B.inkMid, marginBottom:6 }}>{exam.credential}</div>
            <div style={{ color: B.inkLight, fontSize:13 }}>Valid 2 years · Issued {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
          </div>
        )}

        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onRetake} style={{ flex:1, padding:"13px", background:"transparent", border:`1px solid ${B.border}`, color: B.inkLight, borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontSize:15 }}>Retake Exam</button>
          <button onClick={onHome} style={{ flex:1, padding:"13px", background: exam.color, color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:15 }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

function DashboardScreen({ onBack }) {
  const [view, setView] = useState("learner");

  return (
    <div style={{ minHeight:"100vh", background: B.bg, display:"flex", flexDirection:"column" }}>
      <div style={{ background: B.bgCard, borderBottom:`1px solid ${B.border}`, padding:"18px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow: B.shadow }}>
        <Logo size="sm" />
        <div style={{ display:"flex", gap:8 }}>
          {["learner","admin"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding:"8px 20px", borderRadius:3, cursor:"pointer", background: view===v ? B.gold : "transparent", color: view===v ? "#fff" : B.inkLight, border:`1px solid ${view===v ? B.gold : B.border}`, fontFamily:"inherit", fontSize:13, textTransform:"capitalize", transition:"all 0.2s" }}>{v} view</button>
          ))}
        </div>
        <button onClick={onBack} style={{ background:"transparent", border:"none", color: B.inkLight, cursor:"pointer", fontSize:14 }}>← Back</button>
      </div>

      <div style={{ padding:"32px 40px", maxWidth:960, margin:"0 auto", width:"100%" }}>
        {view==="learner" ? (
          <>
            <div style={{ marginBottom:32 }}>
              <div style={{ color: B.inkFaint, fontSize:13, marginBottom:4 }}>{mockLearner.org}</div>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:28, color: B.ink, margin:"0 0 6px" }}>{mockLearner.name}</h2>
              <div style={{ color: B.inkLight, fontSize:14 }}>{mockLearner.role}</div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
              {[{ label:"Exams Taken", value: mockLearner.exams.length },{ label:"Credentials Earned", value: mockLearner.credentialsEarned },{ label:"Next Tier", value: mockLearner.nextExam.split(" ")[1] }].map((s,i) => (
                <div key={i} style={{ background: B.bgCard, border:`1px solid ${B.border}`, borderRadius:6, padding:"22px", textAlign:"center", boxShadow: B.shadow }}>
                  <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:36, color: B.gold, marginBottom:4 }}>{s.value}</div>
                  <div style={{ color: B.inkLight, fontSize:13 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: B.bgCard, border:`1px solid ${B.border}`, borderRadius:6, padding:"24px 28px", boxShadow: B.shadow }}>
              <div style={{ color: B.gold, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:20, fontWeight:600 }}>Exam History</div>
              {mockLearner.exams.map((e,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom: i<mockLearner.exams.length-1 ? `1px solid ${B.border}` : "none" }}>
                  <div>
                    <div style={{ color: B.ink, fontSize:15, marginBottom:3 }}>{e.name}</div>
                    <div style={{ color: B.inkFaint, fontSize:12 }}>{e.date}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:24, color: e.passed?B.pass:B.fail }}>{e.score}%</div>
                    <Chip label={e.passed?"Passed":"Not Passed"} color={e.passed?B.pass:B.fail} />
                  </div>
                </div>
              ))}
            </div>

            {mockLearner.exams.filter(e=>e.passed).map((e,i) => (
              <div key={i} style={{ background: B.bgCard, border:`1px solid ${B.borderGold}`, borderTop:`4px solid ${B.gold}`, borderRadius:6, padding:"20px 28px", marginTop:16, boxShadow: B.shadow }}>
                <div style={{ color: B.gold, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:8, fontWeight:600 }}>Active Credential</div>
                <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:19, color: B.inkMid }}>{e.credential}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div style={{ marginBottom:32 }}>
              <div style={{ color: B.inkFaint, fontSize:13, marginBottom:4 }}>Organization Admin</div>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:28, color: B.ink, margin:0 }}>{mockAdmin.org}</h2>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
              {[{ label:"Enrolled", value: mockAdmin.totalEnrolled },{ label:"Credentials Issued", value: mockAdmin.credentialsIssued },{ label:"Avg. Score", value:`${mockAdmin.avgScore}%` },{ label:"Revenue", value:`$${mockAdmin.revenue.toLocaleString()}` }].map((s,i) => (
                <div key={i} style={{ background: B.bgCard, border:`1px solid ${B.border}`, borderRadius:6, padding:"20px", textAlign:"center", boxShadow: B.shadow }}>
                  <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:800, fontSize:28, color: B.gold, marginBottom:4 }}>{s.value}</div>
                  <div style={{ color: B.inkLight, fontSize:12 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background: B.bgCard, border:`1px solid ${B.border}`, borderRadius:6, padding:"24px 28px", boxShadow: B.shadow }}>
                <div style={{ color: B.gold, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:20, fontWeight:600 }}>Recent Activity</div>
                {mockAdmin.recentActivity.map((a,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom: i<mockAdmin.recentActivity.length-1?`1px solid ${B.border}`:"none" }}>
                    <div>
                      <div style={{ color: B.ink, fontSize:14 }}>{a.name}</div>
                      <div style={{ color: B.inkFaint, fontSize:12 }}>{a.exam} · {a.date}</div>
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:20, color: a.passed?B.pass:B.fail }}>{a.score}%</div>
                  </div>
                ))}
              </div>

              <div style={{ background: B.bgCard, border:`1px solid ${B.border}`, borderRadius:6, padding:"24px 28px", boxShadow: B.shadow }}>
                <div style={{ color: B.gold, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:20, fontWeight:600 }}>Enrollment by Vertical</div>
                {mockAdmin.verticalBreakdown.map((v,i) => (
                  <div key={i} style={{ marginBottom:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ color: B.ink, fontSize:14 }}>{v.name}</span>
                      <span style={{ color: B.inkLight, fontSize:13 }}>{v.count} enrolled</span>
                    </div>
                    <div style={{ height:8, background: B.bgAlt, borderRadius:4 }}>
                      <div style={{ height:"100%", width:`${v.pct}%`, background: B.gold, borderRadius:4 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:24, padding:"16px", background: B.bgAlt, borderRadius:4, borderLeft:`4px solid ${B.pass}` }}>
                  <div style={{ color: B.inkLight, fontSize:12, marginBottom:4 }}>Overall Pass Rate</div>
                  <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:28, color: B.pass }}>{Math.round((mockAdmin.credentialsIssued/mockAdmin.totalEnrolled)*100)}%</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

export default function Demo({ onBack }) {
  const [screen, setScreen] = useState("home");
  const [activeExam, setActiveExam] = useState(null);
  const [results, setResults] = useState(null);

  const startExam = (key) => { setActiveExam(key); setResults(null); setScreen("exam"); };
  const goHome = () => { setScreen("home"); setActiveExam(null); setResults(null); };

  if (screen==="home") return <HomeScreen onStart={startExam} onDashboard={() => setScreen("dashboard")} onBackToSite={onBack} />;
  if (screen==="exam") return <ExamScreen examKey={activeExam} onComplete={r => { setResults(r); setScreen("results"); }} onBack={goHome} />;
  if (screen==="results") return <ResultsScreen examKey={activeExam} answers={results} onRetake={() => startExam(activeExam)} onHome={goHome} />;
  if (screen==="dashboard") return <DashboardScreen onBack={goHome} />;
}
