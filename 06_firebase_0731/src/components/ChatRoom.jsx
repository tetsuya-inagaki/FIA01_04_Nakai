import { useState, useEffect, useRef } from 'react'
import '../style/App.css'
import Avatar from '@mui/material/Avatar'
import { db } from '../firebase'
import { useLocation } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import CallModal from './CallModal'
import PhoneIcon from '@mui/icons-material/Phone'

import Peer, { SfuRoom } from 'skyway-js'

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

  const [showModal, setShowModal] = useState(false)
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

  const openModal = () => {
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
  }
  const handleInputChange = (e) => {
    setInputMsg(e.target.value)
  }

 //以下skyway
  const peer = useRef(new Peer({ key: import.meta.env.VITE_SKYWAY_API_KEY }))
  const [remoteVideo, setRemoteVideo] = useState([])
  const [localStream, setLocalStream] = useState()
  const [room, setRoom] = useState()

  const roomId = 'gs_talkroom01'

  const setLS = (s) => {
    setLocalStream(s)
  }
  const onStart = () => {
    openModal()
    if (peer.current) {
      if (!peer.current.open) {
        return
      }
      console.log(localStream, '地点1')
      const tmpRoom = peer.current.joinRoom(roomId, {
        mode: 'sfu',
        stream: localStream
      })
      tmpRoom.once('open', () => {
        console.log('ルームに入りました。')
        console.log(localStream, '地点2')
      })
      tmpRoom.on('peerJoin', peerId => {
        console.log(`${peerId}が参加しました。`)
      })
      tmpRoom.on('stream', async stream => {
        setRemoteVideo(prev => [
            ...prev,
            { stream, peerId: stream.peerId }
        ])
      })
      tmpRoom.on('peerLeave', peerId => {
        setRemoteVideo(prev => {
          return prev.filter(video => {
            if (video.peerId === peerId) {
                video.stream.getTracks().forEach(track => track.stop())
            }
            return video.peerId != peerId
          })
        })
        console.log(`${peerId}が退出しました。`)
      })
      setRoom(tmpRoom)
    }
  }
  const onEnd = () => {
    closeModal()
    if (room) {
      room.close()
      setRemoteVideo(prev => {
        return prev.filter(video => {
            video.stream.getTracks().forEach(track => track.stop())
            return false
        })
      })
    }
  }


  return (
    <div className="App">
      <div className="top-bar">
        <h1 className="title">ChatRoom</h1>
        <PhoneIcon onClick={() => onStart()} fontSize='large' />
      </div>
      <div className="chat-area">
        <CallModal showFlag={showModal} closeModal={onEnd} remoteVideo={remoteVideo} setLocalStream={setLS}/>
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
