import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 350px;
  max-height: 500px;
  background: #242424;
  border: 1px solid #ccc;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 1000;
`;

const Messages = styled.div`
  border: 1px solid #ccc;
  background: #f9f9f9;
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Bubble = styled.div`
  background: ${({ isOwn }) => (isOwn ? '#3a7a5d' : '#625eb4')};
  align-self: ${({ isOwn }) => (isOwn ? 'flex-end' : 'flex-start')};
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  max-width: 70%;
  color: white;
`;

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ChatBox = ({ familyId, userId, role }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch initial messages from API
    const loadMessages = async () => {
        try {
            const res = await axios.get(`/api/v1/chat/${familyId}/${userId}`, {
                withCredentials: true,
            });
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error('Failed to load chat messages:', err);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !socketRef.current?.readyState === WebSocket.OPEN) return;

        const chatMessage = {
            senderId: userId,
            senderRole: role,
            message: text.trim(),
            timestamp: new Date().toISOString(),
            familyId,
        };

        // Send only via WebSocket (server handles saving to Redis)
        socketRef.current.send(JSON.stringify(chatMessage));
        setText('');
    };

    // Setup WebSocket
    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:3000');

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.familyId === familyId) {
                setMessages(prev => [...prev, data]);
            }
        };

        socketRef.current.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        socketRef.current.onclose = () => {
            console.warn('WebSocket disconnected');
        };

        return () => {
            socketRef.current?.close();
        };
    }, [familyId]);

    useEffect(() => {
        loadMessages();
    }, [familyId, userId]);

    return (
        <Container>
            <h3>Family Group Chat</h3>
            <Messages>
                {messages.map((msg, i) => {
                    const time = new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    return (
                        <Bubble key={i} isOwn={msg.senderId === userId}>
                            <strong>{msg.senderId === userId ? 'You' : msg.senderRole}:</strong> {msg.message}
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
                                {time}
                            </div>
                        </Bubble>
                    )
                })}
                <div ref={messagesEndRef} />
            </Messages>

            <Form onSubmit={sendMessage}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message"
                    style={{ flex: 1, padding: '0.5rem' }}
                />
                <button type="submit" style={{ backgroundColor: '#0000f0', color: 'white' }}>
                    Send
                </button>
            </Form>
        </Container>
    );
};

export default ChatBox;
