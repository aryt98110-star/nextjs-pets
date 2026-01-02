import Pusher from "pusher-js"
import { useState, useEffect, useRef } from "react"

//فایلی برای کنترل کنند های کلیک
export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [socketId, setSocketId] = useState()
  const [messageLog, setMessageLog] = useState([])
  cons[userMessage, setUserMessage] = usrState("")
  const chatField = useRef(null)
  const chatLogElement = useRef(null)
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHERKEY, {
      cluster: "ap2"
    })
    pusher.connection.bind("connected", () => {
      setSocketId(pusher.connection.socket_id)
    })
    const channel = pusher.subscribe("private-petchat")
    channel.bind("massage", data => {
      setMessageLog(prev => [...prev, data])
    })
  }, [])
  useEffect(() => {
    if (messageLog.length) {
      chatLogElement.current.scrollTop = chatLogElement.current.scrollHeight
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1)
      }
    }
  }, [messageLog])
  function openChatClick() {
    setIsChatOpen(true)
    setUnreadCount(0)
    setTimeout(() => {
      chatField.current.focus()
    }, 350)
  }
  function closeChatClick() {
    setIsChatOpen(false)

  }
  function handleChatSubnit(e) {
    e.preventDefault()
    fetch("/admin/send-chat", {
      method: "POST",
      headers: {
        "Contet-Type": "application/json"
      },
      body: JSON.stringify({ massage: "", socket_id })
    })
    setMessageLog(prev => [...prev, { selfMessage: true, message: userMessage }])
    setUserMessage("")
  }
  function handleInputChange(e) {
    setUserMessage(e.target.value)
  }
  return (
    <>
      <div className="open-chat" onClick={openChatClick}>
        {unreadCount > 0 && <span className="chat-unread-badge">{unreadCount} </span>}

        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-chat-text" viewBox="0 0 16 16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
        </svg>
      </div>
      <div className={isChatOpen ? "chat-container  chat-container--visible" : "chat-container"}>
        <div className="chat-title-bar">
          <h4>Staff Team Chat </h4>
          <svg onClick={closeChatClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-backspace" viewBox="0 0 16 16">
            <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l 02L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
          </svg>
        </div>
        <div ref={chatLogElement} className="chat-log">
          {messageLog.map((item, index) => {
            return (
              <div key={index} className={item.selfMessage ? "chat-message chat-massage--self" : "chat-message"}>
                <div className="chat-massage-inner">{item.message} </div>
              </div>
            )
          })}

          <div className="chat-massage">
            <div className="chat-massage-inner">We need to reach out </div>
          </div>
          <div className="chat-massage">
            <div className="chat-massage-inner">Bob can you do </div>
          </div>
          <div className="chat-massage">
            <div className="chat-massage-inner">We need to reach out </div>
          </div>
          <div className="chat-massage">
            <div className="chat-massage-inner">Bob can you do </div>
          </div>

          <div className="chat-massage chat-massage--self">
            <div className="chat-massage-inner">Lorem ipsum dolor</div>
          </div>
        </div>
        <form onSubmit={handleChatSubnit} >
          <input value={userMessage} ref={chatField} onChange={handleInputChange} type="text" autoComplete="off" placeholder="Your massage here" />
        </form>
      </div>
    </>
  )

}