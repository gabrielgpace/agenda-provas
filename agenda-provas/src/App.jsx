import { useState, useMemo } from "react";

// ── Dados reais extraídos das imagens ──
const EXAM_DATA = [
  // ── PROVA INTEGRADA (todas as turmas) ──
  { id: 1,  materia: "Prova Integrada", turma: "Turma A", data: "2026-03-23", turno: "Noite" },
  { id: 2,  materia: "Prova Integrada", turma: "Turma B", data: "2026-03-23", turno: "Noite" },
  { id: 3,  materia: "Prova Integrada", turma: "Turma C", data: "2026-03-23", turno: "Noite" },
  { id: 4,  materia: "Prova Integrada", turma: "Turma D", data: "2026-03-23", turno: "Noite" },

  // ── TURMA A ──
  { id: 10, materia: "Redes de Computadores",           turma: "Turma A", data: "2026-04-06", turno: "Noite" },
  { id: 11, materia: "Programação para Web I",          turma: "Turma A", data: "2026-04-08", turno: "Noite" },
  { id: 12, materia: "Indústria 4.0",                   turma: "Turma A", data: "2026-03-31", turno: "Noite" },
  { id: 13, materia: "Interface Humano Computador",     turma: "Turma A", data: "2026-04-07", turno: "Noite" },
  { id: 14, materia: "Lab. Prog. Orient. a Objetos",    turma: "Turma A", data: "2026-04-10", turno: "Noite" },
  { id: 15, materia: "Programação Orientada a Objeto",  turma: "Turma A", data: "2026-03-31", turno: "Noite" },

  // ── TURMA B ──
  { id: 20, materia: "Redes de Computadores",           turma: "Turma B", data: "2026-04-06", turno: "Noite" },
  { id: 21, materia: "Programação para Web I",          turma: "Turma B", data: "2026-04-08", turno: "Noite" },
  { id: 22, materia: "Indústria 4.0",                   turma: "Turma B", data: "2026-03-31", turno: "Noite" },
  { id: 23, materia: "Interface Humano Computador",     turma: "Turma B", data: "2026-04-07", turno: "Noite" },
  { id: 24, materia: "Lab. Prog. Orient. a Objetos",    turma: "Turma B", data: "2026-04-10", turno: "Noite" },
  { id: 25, materia: "Programação Orientada a Objeto",  turma: "Turma B", data: "2026-03-31", turno: "Noite" },

  // ── TURMA C ──
  { id: 30, materia: "Redes de Computadores",           turma: "Turma C", data: "2026-04-10", turno: "Noite" },
  { id: 31, materia: "Programação para Web I",          turma: "Turma C", data: "2026-04-01", turno: "Noite" },
  { id: 32, materia: "Indústria 4.0",                   turma: "Turma C", data: "2026-03-31", turno: "Noite" },
  { id: 33, materia: "Interface Humano Computador",     turma: "Turma C", data: "2026-03-30", turno: "Noite" },
  { id: 34, materia: "Lab. Prog. Orient. a Objetos",    turma: "Turma C", data: "2026-04-02", turno: "Noite" },
  { id: 35, materia: "Programação Orientada a Objeto",  turma: "Turma C", data: "2026-04-06", turno: "Noite" },

  // ── TURMA D ──
  { id: 40, materia: "Redes de Computadores",           turma: "Turma D", data: "2026-04-10", turno: "Noite" },
  { id: 41, materia: "Programação para Web I",          turma: "Turma D", data: "2026-04-01", turno: "Noite" },
  { id: 42, materia: "Indústria 4.0",                   turma: "Turma D", data: "2026-03-31", turno: "Noite" },
  { id: 43, materia: "Interface Humano Computador",     turma: "Turma D", data: "2026-04-06", turno: "Noite" },
  { id: 44, materia: "Lab. Prog. Orient. a Objetos",    turma: "Turma D", data: "2026-04-02", turno: "Noite" },
  { id: 45, materia: "Programação Orientada a Objeto",  turma: "Turma D", data: "2026-03-30", turno: "Noite" },
];

const TURMAS = ["Turma A", "Turma B", "Turma C", "Turma D"];

const TURMA_COLORS = {
  "Turma A": { bg: "#1a73e8", light: "#e8f0fe", text: "#1a73e8" },
  "Turma B": { bg: "#0f9d58", light: "#e6f4ea", text: "#0f9d58" },
  "Turma C": { bg: "#f4511e", light: "#fce8e6", text: "#f4511e" },
  "Turma D": { bg: "#9334e6", light: "#f3e8fd", text: "#9334e6" },
};

const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const HIGHLIGHT_START = new Date(2026, 2, 27);
const HIGHLIGHT_END   = new Date(2026, 3, 10);

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }
function inRange(y, m, d)     { const dt = new Date(y, m, d); return dt >= HIGHLIGHT_START && dt <= HIGHLIGHT_END; }

export default function AgendaProvas() {
  const today = new Date();
  const [curYear,  setCurYear]  = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [selTurmas, setSelTurmas] = useState(new Set(TURMAS));
  const [selExam,  setSelExam]  = useState(null);
  const [miniM, setMiniM] = useState(today.getMonth());
  const [miniY, setMiniY] = useState(today.getFullYear());

  const toggle = (t) => setSelTurmas(prev => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s; });

  const filtered = useMemo(() => EXAM_DATA.filter(e => selTurmas.has(e.turma)), [selTurmas]);
  const byDate   = useMemo(() => {
    const m = {};
    filtered.forEach(e => { (m[e.data] = m[e.data] || []).push(e); });
    return m;
  }, [filtered]);

  // Build grid cells
  const dim = getDaysInMonth(curYear, curMonth);
  const fd  = getFirstDay(curYear, curMonth);
  const prevDim = getDaysInMonth(curYear, curMonth - 1);
  const cells = [];
  for (let i = fd - 1; i >= 0; i--) cells.push({ d: prevDim - i, type: "prev" });
  for (let d = 1; d <= dim; d++)     cells.push({ d, type: "cur" });
  while (cells.length < 42)          cells.push({ d: cells.length - dim - fd + 1, type: "next" });

  const nav = (dir) => {
    let m = curMonth + dir, y = curYear;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setCurMonth(m); setCurYear(y);
  };
  const goToday = () => { setCurMonth(today.getMonth()); setCurYear(today.getFullYear()); setMiniM(today.getMonth()); setMiniY(today.getFullYear()); };

  // Mini cal cells
  const mDim = getDaysInMonth(miniY, miniM);
  const mFd  = getFirstDay(miniY, miniM);
  const mPrev = getDaysInMonth(miniY, miniM - 1);
  const miniCells = [];
  for (let i = mFd - 1; i >= 0; i--) miniCells.push({ d: mPrev - i, cur: false });
  for (let d = 1; d <= mDim; d++)      miniCells.push({ d, cur: true });
  while (miniCells.length < 42)        miniCells.push({ d: miniCells.length - mDim - mFd + 1, cur: false });

  const isToday  = (d, t) => t === "cur" && d === today.getDate() && curMonth === today.getMonth() && curYear === today.getFullYear();
  const isMToday = (d, c) => c && d === today.getDate() && miniM === today.getMonth() && miniY === today.getFullYear();
  const isWknd   = (col) => col === 0 || col === 6;

  const cellDate = (cell, i) => {
    let y = curYear, m = curMonth;
    if (cell.type === "prev") { m--; if (m < 0) { m = 11; y--; } }
    if (cell.type === "next") { m++; if (m > 11) { m = 0; y++; } }
    return { y, m, ds: `${y}-${String(m+1).padStart(2,"0")}-${String(cell.d).padStart(2,"0")}` };
  };

  // Count exams per turma this month
  const monthStr = `${curYear}-${String(curMonth+1).padStart(2,"0")}`;

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Google Sans',Roboto,sans-serif", background:"#fff", color:"#202124", overflow:"hidden" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:260, borderRight:"1px solid #dadce0", display:"flex", flexDirection:"column", padding:"8px 0", flexShrink:0, overflowY:"auto" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 16px 14px" }}>
          <div style={{ background:"linear-gradient(135deg,#4285f4,#34a853)", borderRadius:8, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14, flexShrink:0 }}>P</div>
          <div>
            <div style={{ fontWeight:600, fontSize:15, color:"#202124", lineHeight:1.2 }}>Agenda de Provas</div>
            <div style={{ fontSize:11, color:"#70757a" }}>Turno Noite · 2026</div>
          </div>
        </div>

        <div style={{ padding:"0 12px 12px" }}>
          <button onClick={goToday} style={{ border:"1px solid #dadce0",background:"#fff",borderRadius:20,padding:"6px 18px",cursor:"pointer",fontSize:14,color:"#3c4043",fontWeight:500 }}
            onMouseEnter={e=>e.target.style.background="#f1f3f4"} onMouseLeave={e=>e.target.style.background="#fff"}>Hoje</button>
        </div>

        {/* Mini cal */}
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:13,fontWeight:500,color:"#3c4043" }}>{MESES[miniM].slice(0,3)} {miniY}</span>
            <div style={{ display:"flex" }}>
              {["‹","›"].map((ch,i)=>(
                <button key={i} onClick={()=>{ let m=miniM+(i?1:-1),y=miniY; if(m<0){m=11;y--;}if(m>11){m=0;y++;} setMiniM(m);setMiniY(y); }}
                  style={{ border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#5f6368",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",padding:0 }}>{ch}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1 }}>
            {["D","S","T","Q","Q","S","S"].map((d,i)=>(
              <div key={i} style={{ textAlign:"center",fontSize:10,color:i===0||i===6?"#c0392b":"#70757a",fontWeight:600,padding:"2px 0" }}>{d}</div>
            ))}
            {miniCells.map((cell,i)=>{
              const col=i%7, wk=col===0||col===6;
              return <div key={i} onClick={()=>{ if(cell.cur){setCurMonth(miniM);setCurYear(miniY);}}}
                style={{ textAlign:"center",fontSize:11,padding:"3px 0",borderRadius:"50%",cursor:cell.cur?"pointer":"default",
                  color:isMToday(cell.d,cell.cur)?"#fff":!cell.cur?"#bdc1c6":wk?"#c0392b":"#202124",
                  background:isMToday(cell.d,cell.cur)?"#1a73e8":"transparent",fontWeight:isMToday(cell.d,cell.cur)?600:400 }}>{cell.d}</div>;
            })}
          </div>
        </div>

        <div style={{ height:1,background:"#dadce0",margin:"0 0 12px" }} />

        {/* Turmas */}
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontSize:11,fontWeight:600,color:"#5f6368",letterSpacing:1,marginBottom:8,textTransform:"uppercase" }}>Turmas</div>
          {TURMAS.map(turma => {
            const col = TURMA_COLORS[turma];
            const checked = selTurmas.has(turma);
            const cnt = EXAM_DATA.filter(e=>e.turma===turma && e.data.startsWith(monthStr) && selTurmas.has(e.turma)).length;
            return (
              <div key={turma} onClick={()=>toggle(turma)}
                style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 8px",borderRadius:8,cursor:"pointer",marginBottom:2 }}
                onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ width:18,height:18,borderRadius:3,border:`2px solid ${checked?col.bg:"#bdc1c6"}`,background:checked?col.bg:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize:14,color:"#202124",flex:1 }}>{turma}</span>
                {checked && cnt > 0 && <span style={{ fontSize:11,background:col.light,color:col.text,borderRadius:10,padding:"1px 7px",fontWeight:600 }}>{cnt}</span>}
                <div style={{ width:8,height:8,borderRadius:"50%",background:col.bg,opacity:checked?1:0.25 }} />
              </div>
            );
          })}
        </div>

        <div style={{ height:1,background:"#dadce0",margin:"12px 0" }} />

        {/* Legenda */}
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontSize:11,fontWeight:600,color:"#5f6368",letterSpacing:1,marginBottom:8,textTransform:"uppercase" }}>Legenda</div>
          <div style={{ display:"flex",alignItems:"flex-start",gap:10,fontSize:12,color:"#3c4043",padding:"3px 0",marginBottom:5 }}>
            <div style={{ width:14,height:14,borderRadius:3,background:"#fff8e1",border:"2px solid #f9a825",flexShrink:0,marginTop:1 }} />
            <div><div style={{ fontWeight:500 }}>Período de provas</div><div style={{ color:"#70757a",fontSize:11 }}>27/mar – 10/abr</div></div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,color:"#c0392b",padding:"3px 0" }}>
            <div style={{ width:14,height:14,borderRadius:3,background:"#fff0f0",border:"2px solid #ffcdd2",flexShrink:0 }} />
            <span>Fim de semana</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>

        {/* Top bar */}
        <div style={{ display:"flex",alignItems:"center",padding:"8px 20px",borderBottom:"1px solid #dadce0",gap:12,flexWrap:"wrap" }}>
          <button onClick={goToday} style={{ border:"1px solid #dadce0",background:"#fff",borderRadius:20,padding:"7px 18px",cursor:"pointer",fontSize:14,color:"#3c4043",fontWeight:500 }}
            onMouseEnter={e=>e.target.style.background="#f1f3f4"} onMouseLeave={e=>e.target.style.background="#fff"}>Hoje</button>
          <div style={{ display:"flex" }}>
            <button onClick={()=>nav(-1)} style={{ border:"none",background:"none",cursor:"pointer",fontSize:22,color:"#5f6368",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
            <button onClick={()=>nav(1)}  style={{ border:"none",background:"none",cursor:"pointer",fontSize:22,color:"#5f6368",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
          </div>
          <h1 style={{ fontSize:22,fontWeight:400,color:"#202124",margin:0 }}>{MESES[curMonth]} de {curYear}</h1>
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"#fff8e1",border:"1px solid #ffe082",borderRadius:20,padding:"5px 14px",fontSize:12,color:"#e65100",fontWeight:500 }}>
            ⚠️ Período de provas: 27/mar – 10/abr
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid #dadce0" }}>
          {DIAS_SEMANA.map((d,i)=>(
            <div key={d} style={{ textAlign:"center",padding:"8px 0",fontSize:11,fontWeight:600,letterSpacing:0.8,
              color:isWknd(i)?"#c0392b":"#70757a", background:isWknd(i)?"#fff0f0":"transparent",
              borderRight:i<6?"1px solid #dadce0":"none" }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex:1,display:"grid",gridTemplateColumns:"repeat(7,1fr)",gridTemplateRows:"repeat(6,1fr)",overflow:"auto" }}>
          {cells.map((cell, i) => {
            const col = i % 7;
            const wknd = isWknd(col);
            const { y, m, ds } = cellDate(cell, i);
            const hi = inRange(y, m, cell.d);
            const exams = byDate[ds] || [];
            const todayCell = isToday(cell.d, cell.type);
            const isCur = cell.type === "cur";

            let bg = hi ? (isCur?"#fffde7":"#fffef5") : wknd ? (isCur?"#fff0f0":"#fdf5f5") : (isCur?"#fff":"#f8f9fa");

            // Group exams: prova integrada first, then others
            const integrada = exams.filter(e => e.materia === "Prova Integrada");
            const outros    = exams.filter(e => e.materia !== "Prova Integrada");

            // For integrada show merged pill if multiple turmas
            const integradaTurmas = integrada.map(e=>e.turma);
            const showIntegrada = integrada.length > 0;

            return (
              <div key={i} style={{ borderRight:"1px solid #dadce0",borderBottom:"1px solid #dadce0",padding:"5px 3px 3px",background:bg,display:"flex",flexDirection:"column",gap:2,position:"relative",minHeight:0 }}>
                {hi && <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#f9a825,#fdd835)",opacity:isCur?1:0.4 }} />}

                <div style={{ fontSize:13,fontWeight:todayCell?500:400,
                  color:!isCur?(wknd?"#e08080":"#bdc1c6"):todayCell?"#fff":wknd?"#c0392b":"#202124",
                  width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",
                  borderRadius:"50%",background:todayCell?"#1a73e8":"transparent",
                  marginBottom:1,alignSelf:"center" }}>{cell.d}</div>

                {/* Prova integrada — pill cinza especial */}
                {showIntegrada && (
                  <div onClick={()=>setSelExam(integrada[0])}
                    style={{ background:"#5f6368",color:"#fff",borderRadius:4,padding:"2px 5px",fontSize:10,fontWeight:600,cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:3 }}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    <span>📋</span>
                    <span style={{ overflow:"hidden",textOverflow:"ellipsis" }}>Prova Integrada</span>
                  </div>
                )}

                {outros.slice(0, showIntegrada ? 2 : 3).map(exam => {
                  const c = TURMA_COLORS[exam.turma];
                  return (
                    <div key={exam.id} onClick={()=>setSelExam(exam)}
                      style={{ background:c.bg,color:"#fff",borderRadius:4,padding:"2px 5px",fontSize:10,fontWeight:500,cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:3,transition:"opacity .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
                      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      <span style={{ fontSize:9,flexShrink:0 }}>📝</span>
                      <span style={{ overflow:"hidden",textOverflow:"ellipsis",fontSize:10 }}>{exam.turma.replace("Turma ","")} · {exam.materia}</span>
                    </div>
                  );
                })}

                {(outros.length > (showIntegrada?2:3)) && (
                  <div style={{ fontSize:10,color:"#70757a",padding:"0 3px" }}>+{outros.length-(showIntegrada?2:3)} mais</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL ── */}
      {selExam && (
        <div onClick={()=>setSelExam(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:16,width:420,boxShadow:"0 24px 64px rgba(0,0,0,0.2)",overflow:"hidden",animation:"fadeIn .18s ease" }}>

            {/* Header */}
            <div style={{ background: selExam.materia==="Prova Integrada"?"#5f6368":TURMA_COLORS[selExam.turma].bg, padding:"22px 24px 18px",color:"#fff" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:10,fontWeight:600,opacity:0.8,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5 }}>
                    {selExam.materia==="Prova Integrada" ? "Todas as Turmas" : selExam.turma}
                  </div>
                  <div style={{ fontSize:22,fontWeight:600,lineHeight:1.2 }}>{selExam.materia}</div>
                  <div style={{ fontSize:13,opacity:0.85,marginTop:5 }}>Turno: {selExam.turno}</div>
                </div>
                <button onClick={()=>setSelExam(null)} style={{ background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding:24,display:"flex",flexDirection:"column",gap:16 }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
                <span style={{ fontSize:20,width:26,textAlign:"center" }}>📅</span>
                <div>
                  <div style={{ fontSize:11,color:"#70757a",fontWeight:500,marginBottom:2 }}>Data</div>
                  <div style={{ fontSize:15,color:"#202124",fontWeight:500 }}>
                    {new Date(selExam.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                  </div>
                </div>
              </div>

              {selExam.materia === "Prova Integrada" ? (
                <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
                  <span style={{ fontSize:20,width:26,textAlign:"center" }}>👥</span>
                  <div>
                    <div style={{ fontSize:11,color:"#70757a",fontWeight:500,marginBottom:6 }}>Turmas</div>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                      {TURMAS.map(t=>(
                        <span key={t} style={{ background:TURMA_COLORS[t].light,color:TURMA_COLORS[t].text,borderRadius:12,padding:"3px 10px",fontSize:12,fontWeight:600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <span style={{ fontSize:20,width:26,textAlign:"center" }}>🏫</span>
                  <div>
                    <div style={{ fontSize:11,color:"#70757a",fontWeight:500,marginBottom:2 }}>Turma</div>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ width:10,height:10,borderRadius:"50%",background:TURMA_COLORS[selExam.turma].bg }} />
                      <span style={{ fontSize:14,color:"#202124" }}>{selExam.turma}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Outras provas no mesmo dia */}
              {(() => {
                const same = filtered.filter(e => e.data === selExam.data && e.id !== selExam.id && e.materia !== "Prova Integrada");
                if (!same.length) return null;
                return (
                  <div style={{ background:"#f8f9fa",borderRadius:8,padding:"12px 14px" }}>
                    <div style={{ fontSize:11,color:"#70757a",fontWeight:600,marginBottom:8,letterSpacing:0.5 }}>OUTRAS PROVAS NESTE DIA</div>
                    {same.map(e=>(
                      <div key={e.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5,cursor:"pointer" }} onClick={()=>setSelExam(e)}>
                        <div style={{ width:8,height:8,borderRadius:"50%",background:TURMA_COLORS[e.turma].bg,flexShrink:0 }} />
                        <span style={{ fontSize:13,color:"#202124" }}>{e.turma} · {e.materia}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}
