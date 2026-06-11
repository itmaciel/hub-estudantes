import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/Calendario.css";

export default function Calendario() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [compromissos, setCompromissos] = useState({}); // { "YYYY-MM-DD": { _id, title } }

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Load all events and reshape into the map your UI already uses
  useEffect(() => {
    axios.get("/api/events", authHeader()).then(({ data }) => {
      const map = {};
      data.forEach((e) => { map[e.date] = { _id: e._id, title: e.title }; });
      setCompromissos(map);
    });
  }, []);

  const handleDayClick = async (value) => {
    const dateKey = value.toISOString().split("T")[0];
    const titulo = prompt(
      `Adicionar evento para o dia ${value.getDate()}/${value.getMonth() + 1}:`
    );
    if (!titulo?.trim()) return;

    const { data } = await axios.post("/api/events", { date: dateKey, title: titulo }, authHeader());
    setCompromissos((prev) => ({ ...prev, [dateKey]: { _id: data._id, title: data.title } }));
  };

  const renderTileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateKey = date.toISOString().split("T")[0];
    const evento = compromissos[dateKey];
    return evento ? <div className="react-cal-event">{evento.title}</div> : null;
  };

  return (
    <div className="calendario-page-container">
      <header className="calendario-header">
        <h1>Calendário Acadêmico</h1>
        <p>
          Selecione qualquer dia para agendar suas provas ou trabalhos de
          faculdade.
        </p>
      </header>

      <div className="apple-calendar-wrapper">
        <Calendar
          onChange={setDataSelecionada}
          value={dataSelecionada}
          onClickDay={handleDayClick}
          tileContent={renderTileContent}
          locale="pt-BR"
        />
      </div>
    </div>
  );
}
