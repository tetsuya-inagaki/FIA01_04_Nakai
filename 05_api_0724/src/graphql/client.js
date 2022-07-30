import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql'
})
const authLink = setContext((_, { headers }) => {
    const token = import.meta.env.VITE_GH_TOKEN
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

export default new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})