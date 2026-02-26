{/* 📩 NEW MESSAGE SELLER BUTTON */}
{!item.is_sold && (
  <div style={{ marginTop: '40px', borderTop: '4px solid var(--ink)', paddingTop: '30px', display: 'flex', gap: '15px' }}>
    {/* Redirects to Inbox with a ?chat=username parameter */}
    <a 
      href={`/messages?chat=${item.username}`} 
      style={{ 
        background: 'var(--rust)', 
        color: 'white', 
        padding: '15px 30px', 
        textDecoration: 'none', 
        fontFamily: 'Bebas Neue', 
        fontSize: '1.5rem', 
        display: 'inline-block',
        boxShadow: '6px 6px 0px var(--ink)',
        border: '3px solid var(--ink)'
      }}
    >
      MESSAGE SELLER →
    </a>

    <a 
      href={`mailto:?subject=SME Gear Inquiry: ${item.title}`} 
      style={{ 
        background: 'white', 
        color: 'var(--ink)', 
        padding: '15px 30px', 
        textDecoration: 'none', 
        fontFamily: 'Bebas Neue', 
        fontSize: '1.5rem', 
        display: 'inline-block',
        border: '3px solid var(--ink)'
      }}
    >
      EMAIL
    </a>
  </div>
)}
