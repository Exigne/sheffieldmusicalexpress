"use client";

import Modal from '@/components/Modal';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InboxPopOut() {
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
      router.push('/sign-in');
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
      } catch (e) {}
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
    const messageToSend = newMessage;
    setNewMessage(""); 
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user, receiver: activeContact, content: messageToSend })
      });
      if (!contacts.includes(activeContact)) setContacts([activeContact, ...contacts]);
      const res = await fetch(`/api/messages?user1=${user}&user2=${activeContact}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {}
  };

  const handleStartNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    setActiveContact(newContactName.trim());
    setNewContactName("");
  };

  if (!user) return null;

  return (
    <Modal>
      <div style={{ padding: '0', height: '75vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '15px 20px', borderBottom: '2px solid var(--rust)', background: 'var(--paper-dark)' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', margin: 0 }}>Private Inbox</h2>
        </div>

        {/* Standard Flex Container */}
        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          
          {/* SIDEBAR */}
          <div className={`modal-sidebar ${activeContact ? 'active-chat' : ''}`} style={{ 
            flex: '0 0 200px', 
            borderRight: '1px solid var(--aged)', 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'var(--paper)'
          }}>
            <div style={{ padding: '10px', borderBottom: '1px solid var(--aged)', background: '#fdfdfc' }}>
              <form onSubmit={handleStartNewChat} style={{ display: 'flex', gap: '5px' }}>
                <input type="text" placeholder="Username..." className="form-input" style={{ flexGrow: 1, padding: '6px', fontSize: '0.8rem', minWidth: 0 }} value={newContactName} onChange={(e) => setNewContactName(e.target.value)} />
                <button type="submit" className="btn-submit" style={{ padding: '6px', fontSize: '0.8rem' }}>Chat</button>
              </form>
            </div>
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              {contacts.map(contact => (
                <div key={contact} onClick={() => setActiveContact(contact)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid var(--aged)', background: activeContact === contact ? 'var(--aged)' : 'transparent', fontWeight: activeContact === contact ? 'bold' : 'normal' }}>
                  👤 {contact}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className={`modal-chat ${!activeContact ? 'inactive-chat' : ''}`} style={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            background: '#fdfdfc',
            minWidth: 0
          }}>
            {activeContact && (
              <>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--aged)', background: 'var(--paper)', display: 'flex', alignItems: 'center' }}>
                  {/* NEW MOBILE BACK BUTTON */}
                  <button 
                    className="mobile-back-btn" 
                    onClick={() => setActiveContact(null)} 
                    style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '4px 10px', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', marginRight: '15px', cursor: 'pointer' }}
                  >
                    ← BACK
                  </button>
                  <div style={{ fontWeight: 'bold' }}>
                    Chatting with <span style={{ color: 'var(--rust)' }}>{activeContact}</span>
                  </div>
                </div>
                
                <div style={{ flexGrow: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {messages.map(msg => {
                    const isMe = msg.sender_username === user;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          maxWidth: '90%', 
                          padding: '8px 12px', 
                          borderRadius: '12px', 
                          fontSize: '0.9rem', 
                          background: isMe ? 'var(--ink)' : 'var(--aged)', 
                          color: isMe ? 'var(--paper)' : 'var(--ink)', 
                          borderBottomRightRadius: isMe ? '2px' : '12px', 
                          borderBottomLeftRadius: isMe ? '12px' : '2px',
                          wordBreak: 'break-word' 
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                <div style={{ padding: '10px', borderTop: '1px solid var(--aged)', background: 'var(--paper)' }}>
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Type a message..." 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      style={{ flexGrow: 1, minWidth: 0 }} 
                      autoComplete="off" 
                    />
                    <button type="submit" className="btn-submit" disabled={!newMessage.trim()}>Send</button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
