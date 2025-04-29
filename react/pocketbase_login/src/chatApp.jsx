import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './App.css';

const client = new PocketBase('http://seuip:8090');
client.autoCancellation(false);

export default function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        async function fetchMessages() {
            const resultList = await client.collection('messages').getList(1, 500, { sort: '-created' });
            setMessages(resultList.items);
        }

        fetchMessages();

        let unsubscribeFunc;

        async function subscribeToMessages() {
            const unsubscribe = await client.collection('messages').subscribe('*', (e) => {
                fetchMessages();
            });
            unsubscribeFunc = unsubscribe;
        }

        subscribeToMessages();

        return () => {
            if (unsubscribeFunc) {
                unsubscribeFunc();
            }
        };
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (text.trim() !== '') {
            await client.collection('messages').create({ text });
            setText('');
        }
    }

    return (
        <div className="chat-container">
            <h1 className="chat-title">Chat Realtime 🚀</h1>

            <ul className="chat-list">
                {messages.map((msg) => (
                    <li key={msg.id} className="chat-message">
                        {msg.text}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="chat-input"
                />
                <button type="submit" className="chat-button">Enviar</button>
            </form>
        </div>
    );
}
