import React, { useRef, useEffect } from 'react'
import '../style/App.css'
import CallEndIcon from '@mui/icons-material/CallEnd';

function CallModal ({ showFlag, closeModal, remoteVideo, setLocalStream }) {

  const localVideoRef = useRef(null)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream)
        console.log(localVideoRef)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          localVideoRef.current.play().catch(e => console.error(e))
        }
      })
      .catch(e => {
        console.error(e)
      })
  }, [showFlag])

  const castVideo = () => {
    return remoteVideo.map(video => {
      return <RemoteVideo video={video} key={video.peerId} />
    })
  }

  return (
    <div>
        {showFlag ? (
            <div className="modal-bg">
                <div className="call-modal">
                    <div className="modal-main">
                      <video ref={localVideoRef} playsInline></video>
                      {castVideo()}
                    </div>
                    <div className="modal-bottom">
                        <CallEndIcon onClick={() => closeModal()} style={{color: "red"}} />
                    </div>
                </div>
            </div>
        ) : (<></>)}
    </div>
  )
}

const RemoteVideo = (props) => {
    const videoRef = useRef(null)
        useEffect(() => {
            if (videoRef.current) {
            videoRef.current.srcObject = props.video.stream
            videoRef.current.play().catch(e => console.error(e))
            }
        }, [props.video])
        return <video ref={videoRef} playsInline></video>
    }
export default CallModal