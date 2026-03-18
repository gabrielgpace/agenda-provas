import { useState, useMemo } from "react";

const EXAM_DATA = [
  { id: 1, materia: "Prova Integrada", turma: "Turma A", data: "2026-03-23", horario: "08:00", sala: "Sala 101", duracao: "2h", professor: "Prof. Silva" },
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

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }
function isInHighlightRange(year, month, day) {
  const d = new Date(year, month, day);
  return d >= HIGHLIGHT_START && d <= HIGHLIGHT_END;
}

export default function AgendaProvas() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedTurmas, setSelectedTurmas] = useState(new Set(TURMAS));
  const [selectedExam, setSelectedExam] = useState(null);
  const [miniMonth, setMiniMonth] = useState(today.getMonth());
  const [miniYear, setMiniYear] = useState(today.getFullYear());

  const toggleTurma = (turma) => {
    setSelectedTurmas(prev => {
      const next = new Set(prev);
      next.has(turma) ? next.delete(turma) : next.add(turma);
      return next;
    });
  };

  const filteredExams = useMemo(() =>
    EXAM_DATA.filter(e => selectedTurmas.has(e.turma)), [selectedTurmas]);

  const examsByDate = useMemo(() => {
    const map = {};
    filteredExams.forEach(e => {
      if (!map[e.data]) map[e.data] = [];
      map[e.data].push(e);
    });
    return map;
  }, [filteredExams]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false, prev: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false, next: true });

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y-1); } else setCurrentMonth(m => m-1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y+1); } else setCurrentMonth(m => m+1); };
  const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setMiniMonth(today.getMonth()); setMiniYear(today.getFullYear()); };

  const miniDaysInMonth = getDaysInMonth(miniYear, miniMonth);
  const miniFirstDay = getFirstDayOfMonth(miniYear, miniMonth);
  const miniPrevDays = getDaysInMonth(miniYear, miniMonth - 1);
  const miniCells = [];
  for (let i = miniFirstDay - 1; i >= 0; i--) miniCells.push({ day: miniPrevDays - i, cur: false });
  for (let d = 1; d <= miniDaysInMonth; d++) miniCells.push({ day: d, cur: true });
  while (miniCells.length < 42) miniCells.push({ day: miniCells.length - miniDaysInMonth - miniFirstDay + 1, cur: false });

  const isToday = (d, cur) => cur && d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  const isMiniToday = (d, cur) => cur && d === today.getDate() && miniMonth === today.getMonth() && miniYear === today.getFullYear();
  const isWeekend = (col) => col === 0 || col === 6;

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Google Sans',Roboto,sans-serif", background:"#fff", color:"#202124", overflow:"hidden" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:256, borderRight:"1px solid #dadce0", display:"flex", flexDirection:"column", padding:"8px 0", flexShrink:0, overflowY:"auto" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 16px 16px" }}>
          <div style={{ background:"linear-gradient(135deg,#4285f4,#34a853)", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 }}>P</div>
          <span style={{ fontWeight:600, fontSize:17, color:"#202124", letterSpacing:-0.3 }}>Agenda de Provas</span>
        </div>

        {/* Hoje btn */}
        <div style={{ padding:"0 12px 12px" }}>
          <button onClick={goToday}
            style={{ border:"1px solid #dadce0", background:"#fff", borderRadius:20, padding:"6px 18px", cursor:"pointer", fontSize:14, color:"#3c4043", fontWeight:500 }}
            onMouseEnter={e=>e.target.style.background="#f1f3f4"}
            onMouseLeave={e=>e.target.style.background="#fff"}>Hoje</button>
        </div>

        {/* Mini cal */}
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:500, color:"#3c4043" }}>{MESES[miniMonth].slice(0,3)} {miniYear}</span>
            <div style={{ display:"flex" }}>
              {["‹","›"].map((ch,i) => (
                <button key={i} onClick={() => {
                  if (i===0){ if(miniMonth===0){setMiniMonth(11);setMiniYear(y=>y-1);}else setMiniMonth(m=>m-1); }
                  else { if(miniMonth===11){setMiniMonth(0);setMiniYear(y=>y+1);}else setMiniMonth(m=>m+1); }
                }} style={{ border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#5f6368",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",padding:0 }}>{ch}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1 }}>
            {["D","S","T","Q","Q","S","S"].map((d,i)=>(
              <div key={i} style={{ textAlign:"center", fontSize:10, color: i===0||i===6?"#c0392b":"#70757a", fontWeight:600, padding:"2px 0" }}>{d}</div>
            ))}
            {miniCells.map((cell,i)=>{
              const col = i%7; const wknd = col===0||col===6;
              return (
                <div key={i} onClick={()=>{ if(cell.cur){setCurrentMonth(miniMonth);setCurrentYear(miniYear);}}}
                  style={{ textAlign:"center",fontSize:11,padding:"3px 0",borderRadius:"50%",cursor:cell.cur?"pointer":"default",
                    color: isMiniToday(cell.day,cell.cur)?"#fff":!cell.cur?"#bdc1c6":wknd?"#c0392b":"#202124",
                    background: isMiniToday(cell.day,cell.cur)?"#1a73e8":"transparent",
                    fontWeight: isMiniToday(cell.day,cell.cur)?600:400 }}>{cell.day}</div>
              );
            })}
          </div>
        </div>

        <div style={{ height:1, background:"#dadce0", margin:"0 0 12px" }} />

        {/* Turmas */}
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#5f6368", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Turmas</div>
          {TURMAS.map(turma => {
            const col = TURMA_COLORS[turma];
            const checked = selectedTurmas.has(turma);
            return (
              <div key={turma} onClick={()=>toggleTurma(turma)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"7px 8px", borderRadius:8, cursor:"pointer", marginBottom:2 }}
                onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ width:18,height:18,borderRadius:3,border:`2px solid ${checked?col.bg:"#bdc1c6"}`,background:checked?col.bg:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0 }}>
                  {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize:14, color:"#202124" }}>{turma}</span>
                <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%", background:col.bg, opacity:checked?1:0.3 }} />
              </div>
            );
          })}
        </div>

        <div style={{ height:1, background:"#dadce0", margin:"12px 0" }} />

        {/* Legenda */}
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#5f6368", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Legenda</div>
          <div style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:12, color:"#3c4043", padding:"4px 0", marginBottom:6 }}>
            <div style={{ width:14,height:14,borderRadius:3,background:"#fff8e1",border:"2px solid #f9a825",flexShrink:0,marginTop:1 }} />
            <div><div style={{ fontWeight:500 }}>Período de provas</div><div style={{ color:"#70757a", fontSize:11 }}>27/mar – 10/abr</div></div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:"#c0392b", padding:"4px 0" }}>
            <div style={{ width:14,height:14,borderRadius:3,background:"#fff0f0",border:"2px solid #ffcdd2",flexShrink:0 }} />
            <span>Fim de semana</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", padding:"8px 20px", borderBottom:"1px solid #dadce0", gap:12 }}>
          <button onClick={goToday}
            style={{ border:"1px solid #dadce0",background:"#fff",borderRadius:20,padding:"7px 18px",cursor:"pointer",fontSize:14,color:"#3c4043",fontWeight:500 }}
            onMouseEnter={e=>e.target.style.background="#f1f3f4"} onMouseLeave={e=>e.target.style.background="#fff"}>Hoje</button>
          <div style={{ display:"flex" }}>
            <button onClick={prevMonth} style={{ border:"none",background:"none",cursor:"pointer",fontSize:22,color:"#5f6368",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
            <button onClick={nextMonth} style={{ border:"none",background:"none",cursor:"pointer",fontSize:22,color:"#5f6368",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
          </div>
          <h1 style={{ fontSize:22, fontWeight:400, color:"#202124", margin:0 }}>{MESES[currentMonth]} de {currentYear}</h1>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:7, background:"#fff8e1", border:"1px solid #ffe082", borderRadius:20, padding:"5px 14px", fontSize:13, color:"#e65100", fontWeight:500 }}>
            <span>⚠️</span><span>Período de provas: 27/mar – 10/abr</span>
          </div>
        </div>

        {/* Week day headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"1px solid #dadce0" }}>
          {DIAS_SEMANA.map((d,i)=>(
            <div key={d} style={{
              textAlign:"center", padding:"8px 0", fontSize:11, fontWeight:600, letterSpacing:0.8,
              color: isWeekend(i)?"#c0392b":"#70757a",
              background: isWeekend(i)?"#fff0f0":"transparent",
              borderRight: i<6?"1px solid #dadce0":"none",
            }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex:1, display:"grid", gridTemplateColumns:"repeat(7,1fr)", gridTemplateRows:"repeat(6,1fr)", overflow:"auto" }}>
          {cells.map((cell, i) => {
            const col = i % 7;
            const weekend = isWeekend(col);

            let cellYear = currentYear, cellMonth = currentMonth;
            if (cell.prev) { cellMonth = currentMonth===0?11:currentMonth-1; cellYear = currentMonth===0?currentYear-1:currentYear; }
            else if (cell.next) { cellMonth = currentMonth===11?0:currentMonth+1; cellYear = currentMonth===11?currentYear+1:currentYear; }

            const highlighted = isInHighlightRange(cellYear, cellMonth, cell.day);
            const dateStr = `${cellYear}-${String(cellMonth+1).padStart(2,"0")}-${String(cell.day).padStart(2,"0")}`;
            const exams = examsByDate[dateStr] || [];
            const todayCell = isToday(cell.day, cell.current);

            // bg priority: highlight > weekend > default
            let bg;
            if (highlighted) bg = cell.current ? "#fffde7" : "#fffef5";
            else if (weekend) bg = cell.current ? "#fff0f0" : "#fdf5f5";
            else bg = cell.current ? "#fff" : "#f8f9fa";

            return (
              <div key={i} style={{
                borderRight:"1px solid #dadce0",
                borderBottom:"1px solid #dadce0",
                padding:"5px 3px 3px",
                background: bg,
                display:"flex", flexDirection:"column", gap:2,
                position:"relative",
              }}>
                {/* Highlight top stripe */}
                {highlighted && (
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:3, background:"linear-gradient(90deg,#f9a825,#fdd835)", opacity: cell.current?1:0.5 }} />
                )}

                {/* Day number */}
                <div style={{
                  fontSize:13, fontWeight: todayCell?500:400,
                  color: !cell.current
                        ? (weekend?"#e08080":"#bdc1c6")
                        : todayCell?"#fff"
                        : weekend?"#c0392b"
                        : "#202124",
                  width:26, height:26,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  borderRadius:"50%",
                  background: todayCell?"#1a73e8":"transparent",
                  marginBottom:1, alignSelf:"center",
                }}>{cell.day}</div>

                {exams.slice(0,3).map(exam => {
                  const c = TURMA_COLORS[exam.turma];
                  return (
                    <div key={exam.id} onClick={()=>setSelectedExam(exam)}
                      style={{ background:c.bg, color:"#fff", borderRadius:4, padding:"2px 6px", fontSize:11, fontWeight:500, cursor:"pointer", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:3, transition:"opacity .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
                      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      <span style={{ fontSize:10 }}>📝</span>
                      <span style={{ overflow:"hidden",textOverflow:"ellipsis" }}>{exam.horario} {exam.materia}</span>
                    </div>
                  );
                })}
                {exams.length>3 && <div style={{ fontSize:11,color:"#70757a",padding:"0 4px" }}>+{exams.length-3} mais</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL ── */}
      {selectedExam && (
        <div onClick={()=>setSelectedExam(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:16,width:400,boxShadow:"0 24px 64px rgba(0,0,0,0.18)",overflow:"hidden",animation:"fadeIn .2s ease" }}>
            <div style={{ background:TURMA_COLORS[selectedExam.turma].bg, padding:"24px 24px 20px", color:"#fff" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:11,fontWeight:600,opacity:0.85,letterSpacing:1,textTransform:"uppercase",marginBottom:4 }}>Prova</div>
                  <div style={{ fontSize:24,fontWeight:600 }}>{selectedExam.materia}</div>
                  <div style={{ fontSize:14,opacity:0.9,marginTop:4 }}>{selectedExam.turma}</div>
                </div>
                <button onClick={()=>setSelectedExam(null)} style={{ background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
              </div>
            </div>
            <div style={{ padding:24,display:"flex",flexDirection:"column",gap:14 }}>
              {[
                { icon:"📅", label:"Data", value: new Date(selectedExam.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}) },
                { icon:"🕐", label:"Horário", value:`${selectedExam.horario} · Duração: ${selectedExam.duracao}` },
                { icon:"📍", label:"Sala", value:selectedExam.sala },
                { icon:"👨‍🏫", label:"Professor", value:selectedExam.professor },
              ].map(item=>(
                <div key={item.label} style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
                  <span style={{ fontSize:18,width:24,textAlign:"center",flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:11,color:"#70757a",fontWeight:500,marginBottom:1 }}>{item.label}</div>
                    <div style={{ fontSize:14,color:"#202124" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"0 24px 24px" }}>
              <div style={{ background:TURMA_COLORS[selectedExam.turma].light,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:10,height:10,borderRadius:"50%",background:TURMA_COLORS[selectedExam.turma].bg,flexShrink:0 }} />
                <span style={{ fontSize:13,color:TURMA_COLORS[selectedExam.turma].text,fontWeight:500 }}>{selectedExam.turma}</span>
              </div>
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
