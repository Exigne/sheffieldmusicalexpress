"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [contacts, setContacts] = useState<string[]>([]);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newContactName, setNewContactName] = useState(""); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('sme_user');
    if (!loggedInUser) {
      router.push('/login');
      return;
    }
    setUser(loggedInUser);

    const params = new URLSearchParams(window.location.search);
    const targetChat = params.get('chat');

    fetch(`/api/messages/contacts?username=${loggedInUser}`)
      .then(res => res.json())
      .then(data => {
        let loadedContacts = Array.isArray(data) ? data : [];
        if (targetChat) {
          setActiveContact(targetChat);
          if (!loadedContacts.includes(targetChat)) {
            loadedContacts = [targetChat, ...loadedContacts];
          }
        }
        setContacts(loadedContacts);
      });
  }, [router]);

  useEffect(() => {
    if (!user || !activeContact) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?user1=${user}&user2=${activeContact}`);
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (e) { console.error("Failed to fetch messages"); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [user, activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeContact) return;
    const msgCopy = newMessage;
    setNewMessage("");

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user, receiver: activeContact, content: msgCopy })
      });
      if (!contacts.includes(activeContact)) setContacts([activeContact, ...contacts]);
    } catch (err) { alert("Failed to send."); }
  };

  if (!user) return null;

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEAVY BRUTALIST HEADER */}
        <header style={{ borderBottom: '12px solid var(--ink)', paddingBottom: '20px', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', margin: 0, lineHeight: '0.8' }}>PRIVATE INBOX</h1>
          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px' }}>
            GEAR INQUIRIES & DIRECT MESSAGES
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '300px 1fr', 
          background: 'white', 
          border: '6px solid var(--ink)', 
          boxShadow: '15px 15px 0px var(--aged)',
          minHeight: '70vh'
        }}>
          
          {/* SIDEBAR: CONTACTS */}
          <div style={{ borderRight: '6px solid var(--ink)', display: 'flex', flexDirection: 'column', background: '#f9f9f9' }}>
            <div style={{ padding: '20px', borderBottom: '3px solid var(--ink)' }}>
              <form onSubmit={(e) => { e.preventDefault(); if(newContactName) setActiveContact(newContactName); setNewContactName(""); }} style={{ display: 'flex', gap: '5px' }}>
                <input 
                  placeholder="NEW CHAT..." 
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  style={{ flexGrow: 1, padding: '10px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }}
                />
                <button style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '0 15px', fontFamily: 'Bebas Neue' }}>GO</button>
              </form>
            </div>

            <div style={{ overflowY: 'auto' }}>
              {contacts.map(contact => (
                <div 
                  key={contact} 
                  onClick={() => setActiveContact(contact)}
                  style={{ 
                    padding: '20px', 
                    cursor: 'pointer', 
                    borderBottom: '2px solid var(--aged)',
                    background: activeContact === contact ? 'var(--rust)' : 'transparent',
                    color: activeContact === contact ? 'white' : 'var(--ink)',
                    fontFamily: 'Bebas Neue',
                    fontSize: '1.8rem',
                    transition: '0.2s'
                  }}
                >
                  {contact.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeContact ? (
              <>
                <div style={{ padding: '15px 25px', borderBottom: '3px solid var(--ink)', background: 'white' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)' }}>CHATTING WITH: </span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>{activeContact.toUpperCase()}</span>
                </div>

                <div style={{ flexGrow: 1, padding: '30px', overflowY: 'auto', maxHeight: '500px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--paper)' }}>
                  {messages.map((msg, i) => {
                    const isMe = msg.sender_username === user;
                    return (
                      <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        <div style={{ 
                          background: isMe ? 'var(--ink)' : 'white', 
                          color: isMe ? 'white' : 'var(--ink)',
                          padding: '15px 20px',
                          border: '3px solid var(--ink)',
                          boxShadow: isMe ? '4px 4px 0px var(--rust)' : '4px 4px 0px var(--aged)',
                          fontFamily: 'Barlow',
                          fontSize: '1.1rem',
                          lineHeight: '1.4'
                        }}>
                          {msg.content}
                        </div>
                        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', marginTop: '5px', textAlign: isMe ? 'right' : 'left' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '3px solid var(--ink)', background: 'white', display: 'flex', gap: '15px' }}>
                  <input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="WRITE MESSAGE..."
                    style={{ flexGrow: 1, padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }}
                  />
                  <button style={{ background: 'var(--rust)', color: 'white', border: 'none', padding: '0 40px', fontFamily: 'Bebas Neue', fontSize: '1.5rem', cursor: 'pointer' }}>SEND</button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, flexDirection: 'column', opacity: 0.3 }}>
                <span style={{ fontSize: '5rem' }}>✉️</span>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>SELECT A CONVERSATION</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
