import { useState, useEffect } from 'react'
import './App.css'
// firebase関連
import { collection, query, onSnapshot, addDoc, QuerySnapshot } from 'firebase/firestore'
import { db, auth } from './firebase'
import Add from './Add'


function App() {
  const [data, setData] = useState([
    {
      id: '',
      title: '',
      title2: ''
    }
  ])

  // 登録用のuseState
  const [titleValue, setTitleValue] = useState('')
  const [title2Value, setTitle2Value] = useState('')

  // 入力項目変更時イベント
  const handleInputChange = (e) => {
    setTitleValue(e.target.value)
  }
  const handleInputChange2 = (e) => {
    setTitle2Value(e.target.value)
  }

  // ボタン押下時イベント
  const addData = async () => {
    await addDoc(
      collection(db, 'group'),
      {
        title: titleValue,
        title2: title2Value,
      }
    )
    setTitleValue('')
    setTitle2Value('')
  }

  // 画面表示の際にfirebaseにデータを取りに行く
  useEffect(() => {
    // group を取得
    const q = query(collection(db, 'group'))
    // 
    const unsub = onSnapshot(q, (que) => {
      setData(
        que.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          title2: doc.data().title2,
        }))
      )
    })

    return () => unsub()
  }, [])
  return (
    <div className="App">
      <h1>REACT</h1>
      {data.map((item, index) => (
        <div key={item.id}>
          <div>{index}</div>
          <div>{item.id}</div>
          <div>{item.title}</div>
          <div>{item.title2}</div>
        </div>
      ))}

      <hr />
      
      {/* <input type="text" value={titleValue} onChange={handleInputChange} />
    
      <button onClick={addData}>送信</button> */}
      <Add
        addData={addData}
        titleValue={titleValue}
        title2Value={title2Value}
        handleInputChange={handleInputChange}
        handleInputChange2={handleInputChange2}
       />
    </div>
  )
}

export default App
