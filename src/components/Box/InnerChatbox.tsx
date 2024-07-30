import React, { useState, useEffect, useRef } from "react";
import { sendMessage } from "../../api/api";
import { Message } from "../../api/types";
import AI from "../icons/AI";
import UserIcon from "../icons/UserIcon";
import { v4 as uuidv4 } from 'uuid';
import iconProfile from '../../assets/iconprofile.svg';
import ErrorIcon from "../icons/ErrorIcon";
import LoadingDots from "../Loading/Loading";
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from "@table-library/react-table-library/theme";
import { DEFAULT_OPTIONS, getTheme } from "@table-library/react-table-library/mantine";

const InnerChatbox = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationId] = useState<string>(uuidv4()); // UUID único
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatText = (text: string) => {
    return text.replace(/\n/g, '<br>').replace(/<[^>]+>/g, match => match);
  };

  const renderMessage = (message: any, index: number) => {
    const isAI = message.sender === "AI";
    return (
      <div
        key={index}
        className={`flex my-3 text-gray-600 text-sm ${
          isAI ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <span className="relative flex items-start shrink-0 overflow-hidden rounded-full w-8 h-8">
          <div className="rounded-full bg-gray-100 border p-1 flex items-center justify-center">
            {isAI ? <AI /> : <UserIcon />}
          </div>
        </span>
        <div className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg ${isAI ? 'items-start' : 'items-end'}`}>
          <span className="block font-bold text-gray-700 mb-1 mr-2 ml-2">
            {isAI ? "AI" : "Tú"}
          </span>
          <p
            className="leading-relaxed bg-gray-100 p-2 rounded-lg break-words"
            dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
          ></p>
          {message.tabla && renderTable(message.tabla)}
        </div>
      </div>
    );
  };

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]).map(key => ({
      label: key,
      renderCell: (item: any) => item[key]
    }));

    console.log("Columns: ", columns); // Debugging log
    console.log("Data: ", data); // Debugging log

    const mantineTheme = getTheme({
      ...DEFAULT_OPTIONS,
      striped: true,
      highlightOnHover: true,
    });

    const customTheme = {
      Table: `
        --data-table-library_grid-template-columns: 110px repeat(2, minmax(0, 1fr));
        margin: 16px 0px;
        border-collapse: collapse;
        width: 100%;
      `,
      BaseRow: `
        &:nth-of-type(odd) {
          background-color: #f3f4f6;
        }
        &:hover {
          background-color: #e5e7eb;
        }
      `,
      HeaderRow: `
        background-color: #f9fafb;
        font-weight: bold;
      `,
      Cell: `
        padding: 8px 16px;
        border: 1px solid #e5e7eb;
      `
    };

    const theme = useTheme([mantineTheme, customTheme]);

    return (
      <div className="overflow-x-auto mt-4">
        <CompactTable
          columns={columns}
          data={{ nodes: data }}
          theme={theme}
          layout={{ custom: true }}
        />
      </div>
    );
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const userMessage: Message = { sender: "User", text: newMessage };
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setError(null);
    setIsLoading(true);

    try {
      const payload = { conversation_id: conversationId, question: newMessage };
      const response = await sendMessage(payload);

      const newMessages = [...messages, userMessage];
      if (response.tabla && response.tabla.length > 0) {
        newMessages.push({ sender: 'AI', text: response.answer, tabla: response.tabla });
      } else {
        newMessages.push({ sender: 'AI', text: response.answer });
      }

      setMessages(newMessages);
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error sending the message!", error);
      setError("Error en el servidor. Status: 500");
      setMessages([...messages, userMessage, { sender: 'AI', text: 'No podemos encontrar lo que buscaste.' }]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col space-y-1.5 pb-6">
          <div className="flex items-center space-x-3">
            <img src={iconProfile} alt="Profile" className="w-8 h-8 " />
            <div>
              <h2 className="font-semibold text-lg tracking-tight">Tecpetrol Expert Chat</h2>
              <div className="flex items-center pt-1">
                <span className="inline-block w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                <p className="text-sm text-[#6b7280] leading-3">En línea</p>
              </div>
            </div>
          </div>
        </div>
        <section className="flex-grow overflow-y-auto pr-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div key={index}>
              {renderMessage(message, index)}
            </div>
          ))}
          {isLoading && (
            <LoadingDots />
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-100 text-red-400 p-2 rounded mt-4 text-sm shadow-lg">
              <ErrorIcon /> 
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <section className="pt-2 border-t mt-2">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow h-10 rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Escribe tu mensaje..."
            />
            <button
              type="submit"
              disabled={newMessage.trim() === ""}
              className={`inline-flex items-center justify-center rounded-full text-sm font-medium text-[#f9fafb] h-10 px-6 py-2 ${
                newMessage.trim() === ""
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#62A846] hover:bg-[#4B9946]"
              }`}
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default InnerChatbox;
