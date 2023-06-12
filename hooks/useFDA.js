import { createVendiaClient } from '@vendia/client'

const client = createVendiaClient({
    apiUrl: `https://kilt9i4ttg.execute-api.us-west-2.amazonaws.com/graphql/`,
    websocketUrl: `wss://nd1uubruzi.execute-api.us-west-2.amazonaws.com/graphql`,
    apiKey: '9HtHVs83oHadJb59EGaKhwW9nY45k6Ds4YfKFHHqbC23' , // <---- API key
  })

const {entities} = client;

const useFDA = () => {
    return {entities}
}

export default useFDA;