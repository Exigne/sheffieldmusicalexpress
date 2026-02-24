"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  
  // State for the Inbox
  const [contacts, setContacts] = useState<string[]>([]);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newContactName, setNewContactName] = useState(""); // For starting a brand new chat
  
  // Auto-scroll reference
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Kick out guests and load the Contact List
  useEffect(() => {
    const loggedInUser = localStorage.getItem('sme_user');
    if (!loggedInUser) {
      router.push('/sign-in');
      return;
    }
    setUser(loggedInUser);

    fetch(`/api/messages/contacts?username=${loggedInUser}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setContacts(data);
      });
  }, [router]);

  // 2. The Polling Engine: Fetch messages for the active chat every 3 seconds
  useEffect(() => {
    if (!user || !activeContact) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?user1=${user}&user2=${activeContact}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (e) {
        console.error("Failed to fetch messages");
      }
    };

    fetchMessages(); // Fetch immediately on click
    const interval = setInterval(fetchMessages, 3000); // Then fetch every 3 seconds

    return () => clearInterval(interval); // Clean up when you click away
  }, [user, activeContact]);

  // 3. Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeContact) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Instantly clear the input box for a snappy feel

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user, receiver: activeContact, content: messageToSend })
      });
      
      // If this is a brand new contact, add them to the sidebar list
      if (!contacts.includes(activeContact)) {
        setContacts([activeContact, ...contacts]);
      }
      
      // Fetch the updated chat immediately
      const res = await fetch(`/api/messages?user1=${user}&user2=${activeContact}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
      
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  // 5. Start a new conversation manually
  const handleStartNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    setActiveContact(newContactName.trim());
    setNewContactName("");
  };

  if (!user) return null; // Prevent flash of content before kick

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "1000px", margin: "0 auto", padding: 0 }}>
        
        {/* INBOX HEADER */}
        <div style={{ padding: '20px', borderBottom: '2px solid var(--rust)', background: 'var(--paper-dark)' }}>
          <nav className="breadcrumb" style={{ marginBottom: '10px' }}>
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'var(--rust)' }}>Messages</span>
          </nav>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', margin: 0 }}>Private Inbox</h1>
        </div>

        {/* INBOX LAYOUT: Sidebar (Left) & Chat (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: '600px', background: 'var(--paper)', border: '1px solid var(--ink)', borderTop: 'none' }}>
          
          {/* SIDEBAR */}
          <div style={{ borderRight: '1px solid var(--aged)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Start New Chat Form */}
            <div style={{ padding: '15px', borderBottom: '1px solid var(--aged)', background: '#fdfdfc' }}>
              <form onSubmit={handleStartNewChat} style={{ display: 'flex', gap: '5px' }}>
                <input 
                  type="text" 
                  placeholder="Username..." 
                  className="form-input" 
                  style={{ padding: '8px', fontSize: '0.8rem' }}
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                />
                <button type="submit" className="btn-submit" style={{ padding: '8px', fontSize: '0.8rem' }}>Chat</button>
              </form>
            </div>

            {/* Contact List */}
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              {contacts.length === 0 ? (
                <div style={{ padding: '20px', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                  No active conversations.
                </div>
              ) : (
                contacts.map(contact => (
                  <div 
                    key={contact} 
                    onClick={() => setActiveContact(contact)}
                    style={{ 
                      padding: '15px', cursor: 'pointer', borderBottom: '1px solid var(--aged)',
                      background: activeContact === contact ? 'var(--aged)' : 'transparent',
                      fontWeight: activeContact === contact ? 'bold' : 'normal',
                      color: 'var(--ink)'
                    }}
                  >
                    👤 {contact}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#fdfdfc' }}>
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--aged)', background: 'var(--paper)', fontWeight: 'bold' }}>
                  Chatting with <Link href={`/profile/${activeContact}`} style={{ color: 'var(--rust)', textDecoration: 'none' }}>{activeContact}</Link>
                </div>

                {/* Messages Area */}
                <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px' }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
                      This is the beginning of your conversation with {activeContact}.
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMe = msg.sender_username === user;
                      return (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{ 
                            maxWidth: '70%', padding: '10px 15px', borderRadius: '15px', fontSize: '0.95rem', lineHeight: '1.4',
                            background: isMe ? 'var(--ink)' : 'var(--aged)',
                            color: isMe ? 'var(--paper)' : 'var(--ink)',
                            borderBottomRightRadius: isMe ? '2px' : '15px',
                            borderBottomLeftRadius: isMe ? '15px' : '2px'
                          }}>
                            {msg.content}
                            <div style={{ fontSize: '0.65rem', marginTop: '5px', textAlign: 'right', color: isMe ? '#999' : '#666' }}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {/* Invisible div to snap the scrollbar to the bottom */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <div style={{ padding: '15px', borderTop: '1px solid var(--aged)', background: 'var(--paper)' }}>
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      style={{ flexGrow: 1 }}
                      autoComplete="off"
                    />
                    <button type="submit" className="btn-submit" disabled={!newMessage.trim()}>Send</button>
                  </form>
                </div>
              </>
            ) : (
              // Empty State (When no contact is selected)
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '3rem' }}>✉️</div>
                <div>Select a conversation or start a new one to begin.</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
