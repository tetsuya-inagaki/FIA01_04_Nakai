import { useState, useEffect } from 'react'
import '../style/App.css'
import { firebaseApp, db, auth } from '../firebase'
import { StyledFirebaseAuth } from 'react-firebaseui'
import firebase from 'firebase/compat/app'
import { useNavigate } from 'react-router-dom'

function Top() {
  const uiConfig = {
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    signInSuccessUrl: '/chat-room',
    callbacks: {
      signInSuccessWithAuthResult: () => {
        usersRef.get().then((querySnapshot) => {
          // firestoreに登録済みか確認する
          const arr = querySnapshot.docs.filter(i => i.uid === uid )
          // 未登録であればドキュメント追加する
          if (arr.length === 0) {
            usersRef.add({
              uid,
              displayName,
              photoUrl
            })
          }
        })
      }
    }
  }
  const [loginUser, setLoginUser] = useState(undefined)
  let uid
  let displayName
  let photoUrl
  const navigate = useNavigate()
  const usersRef = db.collection('users')
  const doNavigation = () => {
    if (loginUser) {
      navigate('/chat-room', { state: { loginUid: loginUser.uid, loginUserName: loginUser.displayName, loginPhotoUrl: loginUser.photoURL }})
    }
  }
  // ログイン状態の取得
  useEffect(() => {
    const unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((user) => {
      setLoginUser(user)
      uid = user?.uid
      displayName = user?.displayName
      photoUrl = user?.photoURL
    })
    return () => unregisterAuthObserver()
  }, [])

  // ログインしたら/していたら画面遷移
  useEffect(() => {
    doNavigation()
  }, [loginUser])
  return (
    <div>
      <h1>ログイン</h1>
      <div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    </div>
  )
}

export default Top
