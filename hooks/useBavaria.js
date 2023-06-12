import { createVendiaClient } from '@vendia/client'

const client = createVendiaClient({
    apiUrl: `https://m26x8xlq8b.execute-api.us-west-2.amazonaws.com/graphql/`,
    websocketUrl: `wss://cijmj8g3jc.execute-api.us-west-2.amazonaws.com/graphql`,
    apiKey: 'HRGDEBPC2iWHwxfdFuyjvU2Cj2NGEp6RqjnJRQ43iDnJ' , // <---- API key
  })

const {entities} = client;

const useBavaria = () => {
    return {entities}
}

export default useBavaria;