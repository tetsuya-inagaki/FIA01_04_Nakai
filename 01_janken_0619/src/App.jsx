import { useState } from 'react'
import './App.css'
import gu from './gu-.png'
import pa from './pa-.png'
import choki from './choki.png'

const gameMsg = '最初はグー、ジャン、ケン、ポン！！'
const aikoMsg = 'あーいーこーで～、、、、、しょ！！'

function App() {
  // ゲームステータス 開始前→開始→結果
  const [ gameStatus, setGameStatus ] = useState('開始前')
  // ユーザの手
  const [ playerHand, setPlayerHand ] = useState(-1)
  // 相手の手
  const [ opponentHand, setOpponentHand ] = useState(-1)
  // 結果
  const [ result, setResult ] = useState([])
  // プレイ回数
  const [ playCount, setPlayCount ] = useState(0)
  // あいこかどうか
  const [ isAiko, setIsAiko ] = useState(false)

  /**
   * 画面中央Playボタン押下イベント
   * @returns {void}
   */
  const startGame = () => {
    resetHands()
    setGameStatus('開始')
    setPlayCount(playCount + 1)
  }
  /**
   * じゃんけんの手選択イベント 
   * @param {Number} index 
   * @returns {void}
   */
  const imgClicked = (index) => {
    if (gameStatus === '開始') {
      setPlayerHand(index)
      const opHand = decideOpponentHand()
      setOpponentHand(opHand)
      // useStateの更新は即時反映されないため、引数で手を渡す
      judgeResult(index, opHand)
    }
  }

  /**
   * 相手の手をランダムで生成する
   * @returns {Number} 相手の手
   */
  const decideOpponentHand = () => {
    const max = 3
    return Math.floor(Math.random() * max)
  }

  // 相手の手とプレイヤーの手から勝敗を判定するためのマッパ
  const resultMapper = {
    0: {
      0: 'あいこ',
      1: 'まけ',
      2: 'かち'
    },
    1: {
      0: 'かち',
      1: 'あいこ',
      2: 'まけ'
    },
    2: {
      0: 'まけ',
      1: 'かち',
      2: 'あいこ'
    }
  }

  // じゃんけんの手を導出するためのマッパ
  const handMapper = {
    0: 'グー',
    1: 'チョキ',
    2: 'パー'
  }

  /**
   * 勝敗判定 
   * @param {Number} pH プレイヤの手
   * @param {Number} oH 相手の手
   * @returns {void}
   */
  const judgeResult = (pH, oH) => {
    // pH: playerHand, oH: opponentHand
    setGameStatus('結果')
    const gameResult = resultMapper[oH][pH]
    if (gameResult === 'あいこ') {
      setGameStatus('開始')
      setIsAiko(true)
    } else {
      setGameStatus('開始前')
      setIsAiko(false)
      setResult([...result, { player: handMapper[pH], opponent: handMapper[oH], gameResult }])
    }
  }

  /**
   * リセット処理 
   */
  const resetHands = () => {
    setPlayerHand(-1)
    setOpponentHand(-1)
  }

  // ゲーム結果を成形し、表示用にリストを返す
  const resultList =
    result.map((item, index) => <li key={ index }>{ index + 1 }回目: { item.gameResult }<br />あなた：{ item.player }<br />相手：{ item.opponent }</li>)

  return (
    <div className='App'>
      <h1 className='title'>じゃんけんゲーム</h1>
        <div className='game-wrapper'>
          <div className='game-area'>
            <div className='player-area'>
              <h3 className='center-literal'>相手</h3>
              <div className='player-hand'>
                <img src={ gu }
                  className={ opponentHand === 0 ? 'choosen' : '' } />
                <img src={ choki }
                  className={ opponentHand === 1 ? 'choosen' : '' } />
                <img src={ pa }
                  className={ opponentHand === 2 ? 'choosen' : '' } />
              </div>
            </div>
            { gameStatus === '開始前' && (
              <button className='play-button'
                onClick={ startGame }>Play</button>
            )}
            { gameStatus === '開始' && !isAiko && (
            <h1 className='gameMsg'>{ gameMsg }</h1>
            )}
            { gameStatus === '開始' && isAiko && (
            <h1 className='gameMsg'>{ aikoMsg }</h1>
            )}
            <div className='player-area'>
              <h3 className='center-literal'>あなた</h3>
              <div className="player-hand">
                <img src={ gu }
                  onClick={() => imgClicked(0) }
                  className={ playerHand === 0 ? 'choosen player-hand1' : 'player-hand1' } />
                <img src={ choki }
                  onClick={() => imgClicked(1) }
                  className={ playerHand === 1 ? 'choosen player-hand2' : 'player-hand2' } />
                <img src={ pa }
                  onClick={() => imgClicked(2) }
                  className={ playerHand === 2 ? 'choosen player-hand3' : 'player-hand3' } />
              </div>
            </div>
          </div>
          <div className='game-result-area'>
            <ul>{ resultList }</ul>
          </div>
        </div>
    </div>
  )
}

export default App
