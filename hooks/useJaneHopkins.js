import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
    apiUrl: 'https://8jjjp1ezah.execute-api.us-west-2.amazonaws.com/graphql/',
    websocketUrl: 'wss://cq47aav96c.execute-api.us-west-2.amazonaws.com/graphql',
    apiKey: '3qFgwVrE3xDJ4GYGpmo86DdSxkRBKN2SNZbRTxR1WthS',
})

const { entities } = client;

const useJaneHopkins = () => {
    return { entities }
}

export default useJaneHopkins;

