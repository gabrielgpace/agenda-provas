import { useState, useMemo, useEffect } from "react";

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
 
const DIAS_SEMANA_FULL = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const DIAS_SEMANA_MIN  = ["D","S","T","Q","Q","S","S"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const HIGHLIGHT_START = new Date(2026, 2, 27);
const HIGHLIGHT_END   = new Date(2026, 3, 10);
 
function getDIM(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFD(y, m)  { return new Date(y, m, 1).getDay(); }
function inRange(y, m, d) { const dt = new Date(y, m, d); return dt >= HIGHLIGHT_START && dt <= HIGHLIGHT_END; }
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}
 
export default function AgendaProvas() {
  const today   = new Date();
  const isMobile = useIsMobile();
  const [curY, setCurY] = useState(today.getFullYear());
  const [curM, setCurM] = useState(today.getMonth());
  const [selTurmas, setSelTurmas] = useState(new Set(TURMAS));
  const [selExam, setSelExam]     = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("calendar"); // "calendar" | "list"
  const [selDay, setSelDay] = useState(null); // for mobile day tap
 
  const toggle = t => setSelTurmas(p => { const s = new Set(p); s.has(t) ? s.delete(t) : s.add(t); return s; });
 
  const filtered = useMemo(() => EXAM_DATA.filter(e => selTurmas.has(e.turma)), [selTurmas]);
  const byDate   = useMemo(() => {
    const map = {};
    filtered.forEach(e => (map[e.data] = map[e.data] || []).push(e));
    return map;
  }, [filtered]);
 
  const dim  = getDIM(curY, curM);
  const fd   = getFD(curY, curM);
  const prev = getDIM(curY, curM - 1);
  const cells = [];
  for (let i = fd - 1; i >= 0; i--) cells.push({ d: prev - i, type: "prev" });
  for (let d = 1; d <= dim; d++)     cells.push({ d, type: "cur" });
  while (cells.length < 42)          cells.push({ d: cells.length - dim - fd + 1, type: "next" });
 
  const nav = dir => {
    let m = curM + dir, y = curY;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setCurM(m); setCurY(y);
  };
  const goToday = () => { setCurM(today.getMonth()); setCurY(today.getFullYear()); };
 
  const isToday = (d, t) => t === "cur" && d === today.getDate() && curM === today.getMonth() && curY === today.getFullYear();
  const isWknd  = col => col === 0 || col === 6;
 
  const cellInfo = (cell) => {
    let y = curY, m = curM;
    if (cell.type === "prev") { m--; if (m < 0) { m = 11; y--; } }
    if (cell.type === "next") { m++; if (m > 11) { m = 0; y++; } }
    return { y, m, ds: `${y}-${String(m+1).padStart(2,"0")}-${String(cell.d).padStart(2,"0")}` };
  };
 
  // Sorted exam list for list view
  const sortedExams = useMemo(() => {
    const monthStr = `${curY}-${String(curM+1).padStart(2,"0")}`;
    const thisMonth = filtered.filter(e => e.data.startsWith(monthStr));
    return [...thisMonth].sort((a,b) => a.data.localeCompare(b.data));
  }, [filtered, curY, curM]);
 
  // Group list by date
  const examsByDateList = useMemo(() => {
    const groups = {};
    sortedExams.forEach(e => (groups[e.data] = groups[e.data] || []).push(e));
    return Object.entries(groups).sort(([a],[b]) => a.localeCompare(b));
  }, [sortedExams]);
 
  const DIAS_SEMANA = isMobile ? DIAS_SEMANA_MIN : DIAS_SEMANA_FULL;
 
  // Day detail panel (mobile tap)
  const selDayExams = selDay ? (byDate[selDay] || []) : [];
 
  return (
    <div className="app-root">
 
      {/* ── SIDEBAR (desktop) / DRAWER (mobile) ── */}
      {(drawerOpen || !isMobile) && (
        <>
          {isMobile && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
          <div className={`sidebar ${isMobile ? "sidebar-drawer" : ""}`}>
 
            {isMobile && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 16px 8px" }}>
                <span style={{ fontWeight:600, fontSize:16, color:"#202124" }}>Filtros & Info</span>
                <button onClick={() => setDrawerOpen(false)} style={{ border:"none", background:"none", fontSize:22, cursor:"pointer", color:"#5f6368" }}>×</button>
              </div>
            )}
 
            {!isMobile && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 16px 14px" }}>
                <div style={{ background:"linear-gradient(135deg,#4285f4,#34a853)", borderRadius:8, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14, flexShrink:0 }}>P</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:15, color:"#202124", lineHeight:1.2 }}>Agenda de Provas</div>
                  <div style={{ fontSize:11, color:"#70757a" }}>Turno Noite · 2026</div>
                </div>
              </div>
            )}
 
            {!isMobile && (
              <div style={{ padding:"0 12px 12px" }}>
                <button onClick={goToday} className="btn-today">Hoje</button>
              </div>
            )}
 
            {/* Mini cal — desktop only */}
            {!isMobile && (
              <div style={{ padding:"0 16px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:"#3c4043" }}>{MESES[curM].slice(0,3)} {curY}</span>
                  <div style={{ display:"flex" }}>
                    {["‹","›"].map((ch,i) => (
                      <button key={i} onClick={() => nav(i ? 1 : -1)}
                        style={{ border:"none", background:"none", cursor:"pointer", fontSize:18, color:"#5f6368", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>{ch}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1 }}>
                  {["D","S","T","Q","Q","S","S"].map((d,i) => (
                    <div key={i} style={{ textAlign:"center", fontSize:10, color:i===0||i===6?"#c0392b":"#70757a", fontWeight:600, padding:"2px 0" }}>{d}</div>
                  ))}
                  {cells.map((cell, i) => {
                    const wk = (i%7)===0||(i%7)===6;
                    const { ds } = cellInfo(cell);
                    const hasDot = (byDate[ds]||[]).length > 0;
                    return (
                      <div key={i} style={{ textAlign:"center", fontSize:11, padding:"2px 0", borderRadius:"50%",
                        color: isToday(cell.d,cell.type)?"#fff":!cell.type==="cur"?"#bdc1c6":wk?"#c0392b":"#202124",
                        background: isToday(cell.d,cell.type)?"#1a73e8":"transparent", position:"relative" }}>
                        {cell.d}
                        {hasDot && cell.type==="cur" && <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:"#1a73e8" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
 
            <div className="divider" />
 
            {/* Turmas */}
            <div style={{ padding:"0 16px" }}>
              <div className="section-label">Turmas</div>
              {TURMAS.map(turma => {
                const col = TURMA_COLORS[turma];
                const checked = selTurmas.has(turma);
                return (
                  <div key={turma} onClick={() => toggle(turma)} className="turma-row">
                    <div style={{ width:18, height:18, borderRadius:3, border:`2px solid ${checked?col.bg:"#bdc1c6"}`, background:checked?col.bg:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ fontSize:14, color:"#202124", flex:1 }}>{turma}</span>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:col.bg, opacity:checked?1:0.25 }} />
                  </div>
                );
              })}
            </div>
 
            <div className="divider" />
 
            {/* Legenda */}
            <div style={{ padding:"0 16px 16px" }}>
              <div className="section-label">Legenda</div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:12, color:"#3c4043", marginBottom:8 }}>
                <div style={{ width:14, height:14, borderRadius:3, background:"#fff8e1", border:"2px solid #f9a825", flexShrink:0, marginTop:1 }} />
                <div><div style={{ fontWeight:500 }}>Período de provas</div><div style={{ color:"#70757a", fontSize:11 }}>27/mar – 10/abr</div></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:"#c0392b" }}>
                <div style={{ width:14, height:14, borderRadius:3, background:"#fff0f0", border:"2px solid #ffcdd2", flexShrink:0 }} />
                <span>Fim de semana</span>
              </div>
            </div>
          </div>
        </>
      )}
 
      {/* ── MAIN ── */}
      <div className="main">
 
        {/* Top bar */}
        <div className="topbar">
          {isMobile ? (
            <>
              <button onClick={() => setDrawerOpen(true)} className="icon-btn">☰</button>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <button onClick={() => nav(-1)} className="icon-btn">‹</button>
                <span style={{ fontSize:16, fontWeight:500, color:"#202124", minWidth:140, textAlign:"center" }}>{MESES[curM].slice(0,3)} {curY}</span>
                <button onClick={() => nav(1)} className="icon-btn">›</button>
              </div>
              <button onClick={goToday} className="btn-today-sm">Hoje</button>
            </>
          ) : (
            <>
              <button onClick={goToday} className="btn-today">Hoje</button>
              <div style={{ display:"flex" }}>
                <button onClick={() => nav(-1)} className="icon-btn">‹</button>
                <button onClick={() => nav(1)}  className="icon-btn">›</button>
              </div>
              <h1 style={{ fontSize:22, fontWeight:400, color:"#202124", margin:0 }}>{MESES[curM]} de {curY}</h1>
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, background:"#fff8e1", border:"1px solid #ffe082", borderRadius:20, padding:"5px 14px", fontSize:12, color:"#e65100", fontWeight:500 }}>
                ⚠️ Período de provas: 27/mar – 10/abr
              </div>
            </>
          )}
        </div>
 
        {/* Mobile: aviso período + tabs */}
        {isMobile && (
          <>
            <div style={{ background:"#fff8e1", borderBottom:"1px solid #ffe082", padding:"7px 14px", fontSize:12, color:"#e65100", fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>
              ⚠️ Período de provas: 27/mar – 10/abr
            </div>
            <div style={{ display:"flex", borderBottom:"1px solid #dadce0" }}>
              {["calendar","list"].map(v => (
                <button key={v} onClick={() => { setView(v); setSelDay(null); }}
                  style={{ flex:1, padding:"10px 0", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:500,
                    color: view===v?"#1a73e8":"#5f6368",
                    borderBottom: view===v?"2px solid #1a73e8":"2px solid transparent" }}>
                  {v === "calendar" ? "📅 Calendário" : "📋 Lista"}
                </button>
              ))}
            </div>
          </>
        )}
 
        {/* ── CALENDAR VIEW ── */}
        {view === "calendar" && (
          <>
            {/* Day headers */}
            <div className="day-headers">
              {DIAS_SEMANA.map((d,i) => (
                <div key={i} style={{ textAlign:"center", padding: isMobile?"6px 0":"8px 0", fontSize: isMobile?10:11, fontWeight:600, letterSpacing:0.5,
                  color: isWknd(i)?"#c0392b":"#70757a",
                  background: isWknd(i)?"#fff0f0":"transparent",
                  borderRight: i<6?"1px solid #dadce0":"none" }}>{d}</div>
              ))}
            </div>
 
            {/* Grid */}
            <div className="cal-grid">
              {cells.map((cell, i) => {
                const col = i % 7;
                const wknd = isWknd(col);
                const { y, m, ds } = cellInfo(cell);
                const hi = inRange(y, m, cell.d);
                const exams = byDate[ds] || [];
                const todayCell = isToday(cell.d, cell.type);
                const isCur = cell.type === "cur";
                const isSelDay = selDay === ds;
 
                let bg = hi ? (isCur?"#fffde7":"#fffef5") : wknd ? (isCur?"#fff0f0":"#fdf5f5") : (isCur?"#fff":"#f8f9fa");
 
                const integrada = exams.filter(e => e.materia === "Prova Integrada");
                const outros    = exams.filter(e => e.materia !== "Prova Integrada");
 
                return (
                  <div key={i} onClick={() => {
                    if (isMobile && exams.length > 0) {
                      setSelDay(isSelDay ? null : ds);
                    }
                  }}
                    style={{ borderRight:"1px solid #dadce0", borderBottom:"1px solid #dadce0", padding: isMobile?"4px 2px 3px":"5px 3px 3px",
                      background: isSelDay ? "#e8f0fe" : bg,
                      display:"flex", flexDirection:"column", gap:2, position:"relative", minHeight:0,
                      cursor: isMobile && exams.length>0 ? "pointer":"default",
                      outline: isSelDay?"2px solid #1a73e8 inset":"none" }}>
 
                    {hi && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#f9a825,#fdd835)", opacity:isCur?1:0.4 }} />}
 
                    <div style={{ fontSize: isMobile?12:13, fontWeight:todayCell?500:400,
                      color:!isCur?(wknd?"#e08080":"#bdc1c6"):todayCell?"#fff":wknd?"#c0392b":"#202124",
                      width: isMobile?22:26, height: isMobile?22:26,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      borderRadius:"50%", background:todayCell?"#1a73e8":"transparent",
                      marginBottom:1, alignSelf:"center" }}>{cell.d}</div>
 
                    {/* Mobile: colored dots only */}
                    {isMobile ? (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:2, justifyContent:"center", paddingBottom:2 }}>
                        {integrada.length > 0 && <div style={{ width:7, height:7, borderRadius:"50%", background:"#5f6368" }} />}
                        {outros.map(e => <div key={e.id} style={{ width:7, height:7, borderRadius:"50%", background:TURMA_COLORS[e.turma].bg }} />)}
                      </div>
                    ) : (
                      <>
                        {integrada.length > 0 && (
                          <div onClick={()=>setSelExam(integrada[0])}
                            style={{ background:"#5f6368", color:"#fff", borderRadius:4, padding:"2px 5px", fontSize:10, fontWeight:600, cursor:"pointer", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:3 }}>
                            <span>📋</span><span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>Prova Integrada</span>
                          </div>
                        )}
                        {outros.slice(0, integrada.length>0?2:3).map(exam => {
                          const c = TURMA_COLORS[exam.turma];
                          return (
                            <div key={exam.id} onClick={() => setSelExam(exam)}
                              style={{ background:c.bg, color:"#fff", borderRadius:4, padding:"2px 5px", fontSize:10, fontWeight:500, cursor:"pointer", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:3 }}>
                              <span style={{ fontSize:9 }}>📝</span>
                              <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{exam.turma.replace("Turma ","")} · {exam.materia}</span>
                            </div>
                          );
                        })}
                        {outros.length > (integrada.length>0?2:3) && (
                          <div style={{ fontSize:10, color:"#70757a", padding:"0 3px" }}>+{outros.length-(integrada.length>0?2:3)} mais</div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
 
        {/* ── LIST VIEW (mobile) ── */}
        {view === "list" && isMobile && (
          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
            {examsByDateList.length === 0 && (
              <div style={{ textAlign:"center", color:"#70757a", marginTop:40, fontSize:14 }}>Nenhuma prova neste mês para as turmas selecionadas.</div>
            )}
            {examsByDateList.map(([dateStr, exs]) => {
              const dt = new Date(dateStr + "T12:00:00");
              const label = dt.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" });
              return (
                <div key={dateStr} style={{ marginBottom:20 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#5f6368", marginBottom:8, borderBottom:"1px solid #e8eaed", paddingBottom:4 }}>{label}</div>
                  {exs.map(exam => {
                    const c = exam.materia === "Prova Integrada" ? { bg:"#5f6368", light:"#f1f3f4", text:"#3c4043" } : TURMA_COLORS[exam.turma];
                    return (
                      <div key={exam.id} onClick={() => setSelExam(exam)}
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#fff", borderRadius:10, marginBottom:8, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", cursor:"pointer", borderLeft:`4px solid ${c.bg}` }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:600, color:"#202124" }}>{exam.materia}</div>
                          <div style={{ fontSize:12, color:"#70757a", marginTop:2 }}>{exam.materia==="Prova Integrada"?"Todas as turmas":exam.turma} · Noite</div>
                        </div>
                        <span style={{ fontSize:18 }}>›</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
 
        {/* Mobile day detail bottom sheet */}
        {isMobile && selDay && selDayExams.length > 0 && view === "calendar" && (
          <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderRadius:"16px 16px 0 0", boxShadow:"0 -4px 24px rgba(0,0,0,0.15)", zIndex:50, padding:"12px 16px 32px", animation:"slideUp .2s ease" }}>
            <div style={{ width:36, height:4, borderRadius:2, background:"#dadce0", margin:"0 auto 14px" }} />
            <div style={{ fontSize:13, fontWeight:600, color:"#5f6368", marginBottom:12 }}>
              {new Date(selDay+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
            </div>
            {selDayExams.map(exam => {
              const c = exam.materia==="Prova Integrada" ? { bg:"#5f6368", light:"#f1f3f4" } : TURMA_COLORS[exam.turma];
              return (
                <div key={exam.id} onClick={() => { setSelExam(exam); setSelDay(null); }}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, marginBottom:8, background:c.light, cursor:"pointer" }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:c.bg, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:"#202124" }}>{exam.materia}</div>
                    <div style={{ fontSize:12, color:"#70757a" }}>{exam.materia==="Prova Integrada"?"Todas as turmas":exam.turma}</div>
                  </div>
                  <span style={{ color:"#70757a" }}>›</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
 
      {/* ── MODAL ── */}
      {selExam && (
        <div onClick={() => setSelExam(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, display:"flex", alignItems: isMobile?"flex-end":"center", justifyContent:"center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#fff", borderRadius: isMobile?"16px 16px 0 0":"16px", width: isMobile?"100%":"420px",
              boxShadow:"0 24px 64px rgba(0,0,0,0.2)", overflow:"hidden", animation: isMobile?"slideUp .25s ease":"fadeIn .18s ease",
              maxHeight: isMobile?"90vh":"auto", overflowY:"auto" }}>
 
            <div style={{ background: selExam.materia==="Prova Integrada"?"#5f6368":TURMA_COLORS[selExam.turma].bg, padding:"22px 24px 18px", color:"#fff" }}>
              {isMobile && <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.4)", margin:"0 auto 14px" }} />}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:600, opacity:0.8, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>
                    {selExam.materia==="Prova Integrada" ? "Todas as Turmas" : selExam.turma}
                  </div>
                  <div style={{ fontSize:22, fontWeight:600, lineHeight:1.2 }}>{selExam.materia}</div>
                  <div style={{ fontSize:13, opacity:0.85, marginTop:5 }}>Turno: {selExam.turno}</div>
                </div>
                <button onClick={() => setSelExam(null)} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
              </div>
            </div>
 
            <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ fontSize:20, width:26, textAlign:"center" }}>📅</span>
                <div>
                  <div style={{ fontSize:11, color:"#70757a", fontWeight:500, marginBottom:2 }}>Data</div>
                  <div style={{ fontSize:15, color:"#202124", fontWeight:500 }}>
                    {new Date(selExam.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                  </div>
                </div>
              </div>
 
              {selExam.materia === "Prova Integrada" ? (
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <span style={{ fontSize:20, width:26, textAlign:"center" }}>👥</span>
                  <div>
                    <div style={{ fontSize:11, color:"#70757a", fontWeight:500, marginBottom:6 }}>Turmas</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {TURMAS.map(t => (
                        <span key={t} style={{ background:TURMA_COLORS[t].light, color:TURMA_COLORS[t].text, borderRadius:12, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:20, width:26, textAlign:"center" }}>🏫</span>
                  <div>
                    <div style={{ fontSize:11, color:"#70757a", fontWeight:500, marginBottom:2 }}>Turma</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:TURMA_COLORS[selExam.turma].bg }} />
                      <span style={{ fontSize:14, color:"#202124" }}>{selExam.turma}</span>
                    </div>
                  </div>
                </div>
              )}
 
              {(() => {
                const same = filtered.filter(e => e.data===selExam.data && e.id!==selExam.id && e.materia!=="Prova Integrada");
                if (!same.length) return null;
                return (
                  <div style={{ background:"#f8f9fa", borderRadius:8, padding:"12px 14px" }}>
                    <div style={{ fontSize:11, color:"#70757a", fontWeight:600, marginBottom:8, letterSpacing:0.5 }}>OUTRAS PROVAS NESTE DIA</div>
                    {same.map(e => (
                      <div key={e.id} onClick={() => setSelExam(e)} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, cursor:"pointer", padding:"4px 0" }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:TURMA_COLORS[e.turma].bg, flexShrink:0 }} />
                        <span style={{ fontSize:13, color:"#202124" }}>{e.turma} · {e.materia}</span>
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
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
 
        .app-root {
          display: flex;
          height: 100dvh;
          font-family: 'Google Sans', Roboto, sans-serif;
          background: #fff;
          color: #202124;
          overflow: hidden;
          position: relative;
        }
 
        /* Sidebar desktop */
        .sidebar {
          width: 260px;
          border-right: 1px solid #dadce0;
          display: flex;
          flex-direction: column;
          padding: 8px 0;
          flex-shrink: 0;
          overflow-y: auto;
          background: #fff;
          z-index: 100;
        }
 
        /* Drawer mobile */
        .sidebar-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 85%;
          max-width: 320px;
          border-right: 1px solid #dadce0;
          box-shadow: 4px 0 24px rgba(0,0,0,0.15);
          animation: slideRight .22s ease;
        }
        .drawer-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 99;
        }
 
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
 
        .topbar {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-bottom: 1px solid #dadce0;
          gap: 10px;
          flex-shrink: 0;
        }
 
        .day-headers {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border-bottom: 1px solid #dadce0;
          flex-shrink: 0;
        }
 
        .cal-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(6, 1fr);
          overflow: auto;
        }
 
        .btn-today {
          border: 1px solid #dadce0;
          background: #fff;
          border-radius: 20px;
          padding: 6px 18px;
          cursor: pointer;
          font-size: 14px;
          color: #3c4043;
          font-weight: 500;
          font-family: inherit;
          white-space: nowrap;
        }
        .btn-today:hover { background: #f1f3f4; }
 
        .btn-today-sm {
          border: 1px solid #dadce0;
          background: #fff;
          border-radius: 14px;
          padding: 4px 12px;
          cursor: pointer;
          font-size: 12px;
          color: #3c4043;
          font-weight: 500;
          font-family: inherit;
        }
 
        .icon-btn {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 22px;
          color: #5f6368;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          font-family: inherit;
        }
        .icon-btn:hover { background: #f1f3f4; }
 
        .divider { height: 1px; background: #dadce0; margin: 8px 0 12px; }
        .section-label { font-size: 11px; font-weight: 600; color: #5f6368; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase; }
 
        .turma-row {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 8px; border-radius: 8px; cursor: pointer; margin-bottom: 2px;
        }
        .turma-row:hover { background: #f1f3f4; }
 
        @keyframes fadeIn    { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp   { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideRight{ from{transform:translateX(-100%)} to{transform:translateX(0)} }
      `}</style>
    </div>
  );
}
 