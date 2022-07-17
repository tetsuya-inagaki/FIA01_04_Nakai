import { useState, useEffect } from 'react'
import './App.css'
// MUI Basic Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// MUI Button
import Button from '@mui/material/Button';
// contentEditable
import ContentEditable from 'react-contenteditable'

function App() {
  const getData = () => {
    const data = localStorage.getItem('allData')
    return JSON.parse(data) ?? []
  }
  const [rows, setRows] = useState(getData)
  useEffect(() => {
    localStorage.setItem('allData', JSON.stringify(rows))
  }, [rows])
  const tableColumns = ['#', '名前', '都道府県', '行きたい度', 'Map']

  const addRow = () => {
    // 追加する行番号
    const rowNum = rows.length + 1
    const blankRow = {
      num: rowNum,
      name: '',
      prefecture: '',
      rate: '',
      map: ''
    }
    setRows([...rows, blankRow])
  }

  const nameChanged = (e, row) => {
    const { num } = row
    // 参照渡しでは再描画されないため、値渡しで別配列を作成する。
    // const modifiedRows = rows.slice(0, rows.length)
    // modifiedRows[num - 1].name = e.target.value

    // 再現用 上の記載だと画面が再描画されるが、下の記載だと画面が再描画されない（MAPがでてこない）
    rows[num - 1].name = e.target.value
    
    // mapURLを作成
    const endpoint = 'https://www.google.com/maps/search/?api=1&query='
    const encodedQuery = encodeURI(e.target.value)
    // modifiedRows[num -1].map = endpoint+encodedQuery
    rows[num -1].map = endpoint+encodedQuery

    setRows(rows)
  }

  const prefectureChanged = (e, row) => {
    const { num } = row
    // 参照渡しでは再描画されないため、値渡しで別配列を作成する。
    const modifiedRows = rows.slice(0, rows.length)
    modifiedRows[num - 1].prefecture = e.target.value
    setRows(modifiedRows)
  }

  const rateChanged = (e, row) => {
    const { num } = row
    // 参照渡しでは再描画されないため、値渡しで別配列を作成する。
    const modifiedRows = rows.slice(0, rows.length)
    modifiedRows[num - 1].rate = e.target.value
    setRows(modifiedRows)
  }

  return (
    <div className="App">
      <h1>行きたいとこリスト</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableColumns.map(i => (<TableCell key={i}>{i}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  {row.num}
                </TableCell>
                <TableCell>
                  <ContentEditable html={row.name} onChange={ e => nameChanged(e, row) }/>
                </TableCell>
                <TableCell>
                  <ContentEditable html={row.prefecture} onChange={ e => prefectureChanged(e, row) }/>
                </TableCell>
                <TableCell>
                  <ContentEditable html={row.rate} onChange={e => rateChanged(e, row) }/>
                </TableCell>
                <TableCell>
                  { !!row.map && (
                    <a href={row.map} target="_blank" rel="noopener noreferrer">Map</a>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Button variant="text" onClick={addRow}>追加</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default App
