import { FormEvent, useMemo, useRef, useState } from 'react'

type IconName =
  | 'arrow-left'
  | 'attach'
  | 'check'
  | 'chevron'
  | 'emoji'
  | 'menu'
  | 'message'
  | 'search'
  | 'send'
  | 'status'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    'arrow-left': <path d="m15 18-6-6 6-6" />,
    attach: <path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 0 1-2.8-2.8l8.9-8.9" />,
    check: <><path d="m2 12 4 4L16 6" /><path d="m9 15 1 1L22 5" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    emoji: <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
    menu: <><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></>,
    message: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4-.9L3 21l1.7-4.6A8.5 8.5 0 1 1 21 11.5Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    status: <><path d="M20 11a8 8 0 0 0-7-7.9M4 6a9 9 0 0 0-1 3M4 18a9 9 0 0 0 3 2M15 20a9 9 0 0 0 4-3" /><path d="m9 12 2 2 4-5" /></>,
  }

  return (
    <svg aria-hidden="true" className="shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

type Message = { id: number; text: string; time: string; mine: boolean; read?: boolean }
type Chat = {
  id: number
  phone: string
  name: string
  initials: string
  color: string
  online: string
  unread?: number
  messages: Message[]
}

const initialChats: Chat[] = [
  {
    id: 1, phone: '+54 9 11 4268-1932', name: 'Sofía Martínez', initials: 'SM', color: 'avatar-coral', online: 'en línea', unread: 2,
    messages: [
      { id: 1, text: '¡Hola! ¿Cómo estás?', time: '10:28', mine: false },
      { id: 2, text: 'Muy bien, terminando unos pendientes. ¿Vos?', time: '10:29', mine: true, read: true },
      { id: 3, text: 'Todo bien 😊 Te quería consultar si viste el diseño nuevo.', time: '10:31', mine: false },
      { id: 4, text: 'Sí, lo vi recién. Me gusta mucho cómo quedó la pantalla principal.', time: '10:33', mine: true, read: true },
      { id: 5, text: '¡Genial! Entonces mañana avanzamos con los últimos detalles.', time: '10:35', mine: false },
    ],
  },
  {
    id: 2, phone: '+54 9 11 5830-4471', name: 'Mateo Ruiz', initials: 'MR', color: 'avatar-blue', online: 'últ. vez hoy a las 09:42',
    messages: [
      { id: 1, text: '¿Llegaste bien ayer?', time: '09:12', mine: false },
      { id: 2, text: 'Sí, todo perfecto. Gracias por preguntar.', time: '09:14', mine: true, read: true },
      { id: 3, text: 'Buenísimo, nos vemos el viernes entonces', time: '09:16', mine: false },
    ],
  },
  {
    id: 3, phone: '+54 9 11 6201-7759', name: 'Valentina López', initials: 'VL', color: 'avatar-violet', online: 'en línea', unread: 1,
    messages: [
      { id: 1, text: 'Te mandé los archivos por mail', time: 'Ayer', mine: false },
      { id: 2, text: 'Perfecto, ahora los reviso. ¡Gracias!', time: 'Ayer', mine: true, read: true },
      { id: 3, text: 'Avisame cualquier cosa', time: 'Ayer', mine: false },
    ],
  },
  {
    id: 4, phone: '+54 9 11 3984-2106', name: 'Lucas Fernández', initials: 'LF', color: 'avatar-green', online: 'últ. vez ayer a las 22:10',
    messages: [
      { id: 1, text: 'Dale, perfecto. Nos vemos ahí', time: 'Ayer', mine: true, read: true },
      { id: 2, text: 'De una, llego tipo ocho', time: 'Ayer', mine: false },
    ],
  },
  {
    id: 5, phone: '+54 9 11 7492-0638', name: 'Camila Torres', initials: 'CT', color: 'avatar-amber', online: 'últ. vez el lunes a las 18:24',
    messages: [
      { id: 1, text: '¡Qué buena noticia!', time: 'Lunes', mine: false },
      { id: 2, text: 'Sí, todavía no lo puedo creer', time: 'Lunes', mine: true, read: true },
    ],
  },
  {
    id: 6, phone: '+54 9 11 2155-8890', name: 'Tomás Silva', initials: 'TS', color: 'avatar-sky', online: 'últ. vez el domingo a las 12:05',
    messages: [{ id: 1, text: 'Después te cuento bien', time: 'Domingo', mine: false }],
  },
]

export default function App() {
  const [chats, setChats] = useState(initialChats)
  const [activeId, setActiveId] = useState(1)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const active = chats.find((chat) => chat.id === activeId) ?? chats[0]
  const filteredChats = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return chats.filter((chat) => `${chat.name} ${chat.phone}`.toLowerCase().includes(normalized))
  }, [chats, query])

  function selectChat(id: number) {
    setActiveId(id)
    setMobileChatOpen(true)
    setChats((items) => items.map((chat) => chat.id === id ? { ...chat, unread: undefined } : chat))
    window.setTimeout(() => inputRef.current?.focus(), 100)
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    setChats((items) => items.map((chat) => chat.id === activeId
      ? { ...chat, messages: [...chat.messages, { id: Date.now(), text, time: now, mine: true, read: true }] }
      : chat))
    setDraft('')
  }

  return (
    <main className="app-shell">
      <section className={`sidebar ${mobileChatOpen ? 'mobile-hidden' : ''}`}>
        <header className="side-header">
          <span className="avatar avatar-me">TA</span>
          <nav className="header-actions" aria-label="Acciones">
            <button className="icon-button" aria-label="Estados"><Icon name="status" /></button>
            <button className="icon-button" aria-label="Nuevo chat"><Icon name="message" /></button>
            <button className="icon-button" aria-label="Menú"><Icon name="menu" /></button>
          </nav>
        </header>

        <div className="search-wrap">
          <label className="search-field">
            <Icon name="search" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar un chat o iniciar uno nuevo" />
          </label>
        </div>

        <div className="chat-list" aria-label="Lista de chats">
          {filteredChats.map((chat) => {
            const last = chat.messages.at(-1)
            return (
              <button key={chat.id} className={`chat-row ${chat.id === activeId ? 'chat-row-active' : ''}`} onClick={() => selectChat(chat.id)}>
                <span className="chat-row-content">
                  <span className="chat-row-top">
                    <span className="chat-phone">{chat.phone}</span>
                    <span className={chat.unread ? 'chat-time unread-time' : 'chat-time'}>{last?.time}</span>
                  </span>
                  <span className="chat-row-bottom">
                    <span className="chat-preview">{last?.mine && <Icon name="check" size={17} />}{last?.text}</span>
                    {chat.unread && <span className="unread-badge">{chat.unread}</span>}
                  </span>
                </span>
              </button>
            )
          })}
          {!filteredChats.length && <p className="empty-search">No se encontraron chats</p>}
        </div>
      </section>

      <section className={`conversation ${mobileChatOpen ? '' : 'mobile-hidden'}`}>
        <header className="conversation-header">
          <button className="icon-button back-button" aria-label="Volver a chats" onClick={() => setMobileChatOpen(false)}><Icon name="arrow-left" /></button>
          <button className="contact-summary" aria-label="Información del contacto">
            <span>
              <strong>{active.phone}</strong>
            </span>
          </button>
          <nav className="header-actions" aria-label="Acciones del chat">
            <button className="icon-button" aria-label="Buscar"><Icon name="search" /></button>
            <button className="icon-button" aria-label="Menú"><Icon name="menu" /></button>
          </nav>
        </header>

        <div className="message-area">
          <div className="date-chip">HOY</div>
          <div className="messages">
            {active.messages.map((message) => (
              <div key={message.id} className={`message-row ${message.mine ? 'message-row-mine' : ''}`}>
                <div className={`bubble ${message.mine ? 'bubble-mine' : 'bubble-theirs'}`}>
                  <span className="bubble-text">{message.text}</span>
                  <span className="bubble-meta">
                    {message.time}
                    {message.mine && <span className="read-check"><Icon name="check" size={16} /></span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <button type="button" className="icon-button" aria-label="Emoji"><Icon name="emoji" size={23} /></button>
          <button type="button" className="icon-button optional-action" aria-label="Adjuntar archivo"><Icon name="attach" size={23} /></button>
          <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribe un mensaje" aria-label="Escribe un mensaje" />
          {draft.trim() && (
            <button className="send-button send-button-active" type="submit" aria-label="Enviar mensaje">
              <Icon name="send" size={22} />
            </button>
          )}
        </form>
      </section>
    </main>
  )
}
