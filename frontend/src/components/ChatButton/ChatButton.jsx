
import React from "react";
import "./ChatButton.css";
import { useNavigate } from "react-router-dom";

export default function ChatButton({ reservaId }) {
    const navigate = useNavigate();
    const handle = () => navigate(`/mensagens/${reservaId}`);

    return (
        <button className="chat-button" onClick={handle} title="Abrir mensagens">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Mensagens</span>
        </button>
    );
}
