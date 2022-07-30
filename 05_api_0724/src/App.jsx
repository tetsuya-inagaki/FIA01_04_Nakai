import { useState } from 'react'
import './App.css'
import client from './graphql/client'
import { ApolloProvider } from '@apollo/client'
import Repositories from './components/Repositories'

function App() {

  return (
    <ApolloProvider client={client}>
      <h1>リポジトリスキャナー</h1>
      <p>課題名を入力してね（05_api_0724 等）</p>
      <Repositories />
    </ApolloProvider>
  )
}

export default App
