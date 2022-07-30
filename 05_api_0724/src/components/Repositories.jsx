import React, { useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_ASSIGNMENT } from '../graphql/query'
import ReactMarkdown from 'react-markdown'
import '../App.css'

const Repositories = () => {
  const [ getData, { loading, error, data }] = useLazyQuery(GET_ASSIGNMENT)
  const inputRef = useRef(null)
  const [filterd, setFilterd] = useState(false)

  // 外部ファイルに切り出すまでもないかなと思いべた書き
  const targetList = ['FIA01_01_Tokida', 'FIA01_02_Hashimoto', 'FIA01_03_inagaki', 'FIA01_04_Nakai', 'FIA01_05_shirai', 'FIA01_06_yoshimoto', 'FIA01_07_yamamoto', 'FIA01_08_Kataoka', 'FIA01_09_Gotoda', 'FIA01_10_Zhang', 'FIA01_11_Kawanishi', 'FIA01_12_Shimizu', 'FIA01_13_Ishizawa', 'FIA01_14_Osada', 'FIA01_15_Nagamori', 'FIA01_16_Yokogi', 'FIA01_17_Ogura', 'FIA01_18_Matsuoka', 'FIA01_19_Morioka']
  return (
    <div>
        <p>
            <input ref={inputRef} />
            <button onClick={() => getData({ variables: { smallCapital: `main:${inputRef.current.value}/readme.md`, largeCapital: `main:${inputRef.current.value}/README.md`}})}>取得</button>
        </p>
        {data && <p>
                        <button onClick={() => setFilterd(!filterd)}>{filterd ? 'すべて表示する' : 'READMEがあるものだけ表示する' }</button>
        </p>}
        {loading && <p>...loading</p>}
        {error && <p>{error.message}</p>}
        {data && data.organization.repositories.nodes.map(i => {
            if (filterd) {
                if (targetList.includes(i.name) && !!(i.README ? i.README?.text : i.readme?.text)) {
                    return (
                        <div key={i.name}>
                            <div className="name"><h1>{i.name}</h1></div>
                            <div className="time">プッシュ時間: {i.pushedAt}</div>
                            <div className="url">リポジトリURL: <a href={`https://github.com${i.resourcePath}/tree/main/${inputRef.current.value}`}>https://github.com{i.resourcePath}/{inputRef.current.value}</a></div>
                            <div className="readme">README</div>
                            <ReactMarkdown
                                className="reactMarkDown">{`${(i.README ? i.README?.text : i.readme?.text) ?? '# READMEが無いよ～' }`}</ReactMarkdown>
                                
                        </div>
                    )
                }
            }
            else { 
                if (targetList.includes(i.name)) {
                    return (
                        <div key={i.name}>
                            <div className="name"><h1>{i.name}</h1></div>
                            <div className="time">プッシュ時間: {i.pushedAt}</div>
                            <div className="url">リポジトリURL: <a href={`https://github.com${i.resourcePath}/tree/main/${inputRef.current.value}`}>https://github.com{i.resourcePath}/{inputRef.current.value}</a></div>
                            <div className="readme">README</div>
                            <ReactMarkdown
                                className="reactMarkDown">{`${(i.README ? i.README?.text : i.readme?.text) ?? '# READMEが無いよ～' }`}</ReactMarkdown>
                                
                        </div>
                    )
                }
            }
        }).sort((a, b) => {
            // リポジトリ名でソート（昇順）
            if (a.key > b.key) { return 1}
            if (a.key < b.key) { return -1}
            return 0
        })}
    </div>

  )

}

export default Repositories