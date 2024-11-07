import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectando ao backend na porta 3001

function Chat() {
  const [mensagem, setMensagem] = useState("");
  const [historicoMensagens, setHistoricoMensagens] = useState([]);

  useEffect(() => {
    socket.on("mensagem", (data) => {
      setHistoricoMensagens((prev) => [...prev, data]);
    });

    return () => {
      socket.off("mensagem"); // Remove o evento quando o componente é desmontado
    };
  }, []);

  const enviarMensagem = () => {
    socket.emit("mensagem", { mensagem }); // Envia a mensagem para o servidor
    setMensagem(""); // Limpa o campo de mensagem após o envio
  };

  return (
    <div>
      <div>
        {historicoMensagens.map((msg, index) => (
          <p key={index}>{msg.mensagem}</p>
        ))}
      </div>
      <input
        type="text"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
      />
      <button onClick={enviarMensagem}>Enviar</button>
    </div>
  );
}

export default Chat;
