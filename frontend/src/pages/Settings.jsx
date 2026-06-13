import React, { useState } from "react";
import "../style/Settings.css";

export default function Settings({ user, setUser }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    setMessage({ text: "Alterações salvas com sucesso!", type: "success" });
    
    if (setUser) {
      setUser({ ...user, username: formData.username, email: formData.email });
    }
  };

  return (
    <div className="settings-page-container">
      <header className="settings-header">
        <h1>Editar Perfil</h1>
        <p>Atualize suas informações de acesso do Hub.</p>
      </header>

      <form onSubmit={handleSave} className="settings-card">
        {message.text && (
          <div className={message.type === "success" ? "settings-alert-success" : "settings-alert-error"}>
            {message.text}
          </div>
        )}

        <div className="settings-field-group">
          <label>Nome de Usuário</label>
          <input
            className="settings-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="settings-field-group">
          <label>E-mail</label>
          <input
            className="settings-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="settings-field-group">
          <label>Nova Senha</label>
          <input
            className="settings-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Deixe em branco para não alterar"
          />
        </div>

        <button type="submit" className="btn-settings-save">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
