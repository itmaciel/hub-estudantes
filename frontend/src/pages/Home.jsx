import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/Home.css";

function CalendarWidget() {
  const WEEK_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const cells = [];
  const MONTH_START_OFFSET = 4;
  const MONTH_DAYS = 31;
  const TODAY = 11;

  for (let i = 0; i < MONTH_START_OFFSET; i++) {
    cells.push(
      <div className="cal-day other-month" key={`prev-${i}`}>
        {27 + i}
      </div>
    );
  }

  for (let d = 1; d <= MONTH_DAYS; d++) {
    const isToday = d === TODAY;
    cells.push(
      <div className={`cal-day ${isToday ? "today" : ""}`} key={`day-${d}`}>
        {d}
      </div>
    );
  }

  return (
    <section className="apple-card widget-calendario">
      <div className="cal-header">
        <h3>Maio 2026</h3>
        <Link to="/calendario" className="cal-view-more">
          Ver tudo
        </Link>
      </div>

      <div className="cal-grid">
        {WEEK_LABELS.map((l) => (
          <div className="cal-day-label" key={l}>
            {l}
          </div>
        ))}
        {cells}
      </div>
    </section>
  );
}

function FocoWidget() {
  const TOTAL_SECONDS = 25 * 60;
  const CIRCUMFERENCE = 2 * Math.PI * 50;
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (!running && remaining === 0) setRemaining(TOTAL_SECONDS);
    setRunning((r) => !r);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = remaining / TOTAL_SECONDS;
  const offset = (CIRCUMFERENCE * (1 - pct)).toFixed(2);

  return (
    <section className="apple-card widget-foco">
      <div className="card-header-actions">
        <h3>Sessão de Foco</h3>
        <Link to="/foco" className="cal-view-more">
          Expandir
        </Link>
      </div>

      <div className="foco-timer-display">
        <div className="timer-ring-wrapper">
          <svg viewBox="0 0 110 110" aria-hidden="true">
            <circle className="timer-ring-bg" cx="55" cy="55" r="50" />
            <circle
              className="timer-ring-fg"
              cx="55"
              cy="55"
              r="50"
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          <div className="timer-text">
            {mm}:{ss}
          </div>
        </div>

        <div className="foco-controls">
          <button type="button" className="btn-play" onClick={handlePlayPause}>
            {running ? "⏸" : "▶"}
          </button>
        </div>
      </div>
    </section>
  );
}

function CompromissosWidget() {
  return (
    <section className="apple-card widget-compromissos">
      <h3>Próximos Compromissos</h3>

      <div className="compromisso-item border-blue">
        <h4>Prova de Cálculo - I</h4>
        <p>
          Quinta-feira às <span className="time-tag">14:00</span>
        </p>
      </div>

      <div className="compromisso-item border-gray">
        <h4>Entrega de Trabalho - IHC</h4>
        <p>Sexta-feira (Dia todo)</p>
      </div>
    </section>
  );
}

function GerenciadorTarefas() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Load on mount
  useEffect(() => {
    axios.get("/api/tasks", authHeader()).then((r) => setTasks(r.data));
  }, []);

  const toggleTask = async (id, done) => {
    const { data } = await axios.patch(`/api/tasks/${id}`, { done: !done }, authHeader());
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const { data } = await axios.post("/api/tasks", { text: newTaskText }, authHeader());
    setTasks((prev) => [...prev, data]);
    setNewTaskText("");
  };
  return (
    <section className="apple-card widget-gerenciador-tarefas grid-right-notes">
      <div className="card-header-actions">
        <h2>Minhas Tarefas</h2>
        <span className="task-count">
          {tasks.filter((t) => !t.done).length} pendentes
        </span>
      </div>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="home-tasks-list">
        {tasks.map((task) => (
          <div
          className="task-item"
          key={task._id}
          onClick={() => toggleTask(task._id, task.done)}
          onKeyDown={(e) => e.key === "Enter" && toggleTask(task._id, task.done)}
            role="button"
            tabIndex={0}
          >
            <div className={`task-checkbox${task.done ? " done" : ""}`} />
            <span className={`task-text-label ${task.done ? "text-done" : ""}`}>
              {task.text}
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="empty-tasks">Nenhuma tarefa pendente. Parabéns!</p>
        )}
      </div>
    </section>
  );
}

export default function Home({ user }) {
  const displayName = user?.username || "Estudante";

  return (
    <>
      <header className="dashboard-header">
        <h1>Olá, {displayName}.</h1>
      </header>

      <main className="dashboard-grid">
        <div className="grid-left-center">
          <CalendarWidget />
          <FocoWidget />
          <CompromissosWidget />
        </div>

        <GerenciadorTarefas />
      </main>
    </>
  );
}
