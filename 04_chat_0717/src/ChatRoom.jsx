import { useState, useEffect } from 'react'
import './App.css'
import Avatar from '@mui/material/Avatar'
import { db } from './firebase'
import { useLocation } from 'react-router-dom'
import firebase from 'firebase/compat/app'

function ChatRoom() {
  const [msgs, setMsgs] = useState([{
    uid: '',
    time: '',
    name: '',
    icon: '',
    msg: ''
  }])

  const [inputMsg, setInputMsg] = useState('')

  const location = useLocation()
  const chatRef = db.collection('chatTrans')

  useEffect(() => {
    const unsub = chatRef.onSnapshot((querySnapshot) => {
      const arr = querySnapshot.docs.map(item => ({
        uid: item.data().uid,
        time: item.data().time.toDate().toLocaleString(),
        name: item.data().name,
        icon: item.data().icon,
        msg: item.data().msg
      }))
      arr.sort((a, b) => {
        const aTime = a.time
        const bTime = b.time
        if (a.time < b.time) { return -1}
        if (b.time < a.time) { return 1}
      })
      setMsgs(arr)
    })
    return () => unsub()
  },[])

  const sendMsg = () => {
    const data = {
      uid: location.state.loginUid,
      time: firebase.firestore.Timestamp.fromDate(new Date()),
      name: location.state.loginUserName,
      icon: location.state.loginPhotoUrl,
      msg: inputMsg
    }
    chatRef.add(data)
      .catch(error => {
        console.error('error occurd:', error)
      })
    setInputMsg('')
  }

  const handleInputChange = (e) => {
    setInputMsg(e.target.value)
  }
  return (
    <div className="App">
      <div className="top-bar">
        <h1 className="title">ChatRoom</h1>
      </div>
      <div className="chat-area">
        {msgs.map(item => (
          item.uid !== location.state.loginUid ? (
            <div key={item.time} className="opponent">
              <div className='left-side'>
                <Avatar alt={item.name} src={item.icon} />
              </div>
              <div className='right-side'>
                  <p className='opponent-name'>{item.name}</p>
                  <p className='opponent-msg'>{item.msg}</p>
                  <p className='opponent-time'>{item.time}</p>
              </div>
            </div>) : (
            <div key={item.time} className="self">
              <div className='left-side'>
                  <p className='self-msg'>{item.msg}</p>
                  <p className='self-time'>{item.time}</p>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="type-area">
        <input type="text" className="msg-input" value={inputMsg} onChange={handleInputChange}></input>
        <button onClick={sendMsg}>送信</button>
      </div>
    </div>
  )
}

export default ChatRoom
