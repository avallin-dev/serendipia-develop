import React from 'react'
import Widget from "@/components/widget";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 5,
            retryDelay: 1000,
        },
    },
})

const Bot = () => {
    return <div>
        <QueryClientProvider client={queryClient}>
            <Widget/>
        </QueryClientProvider>
    </div>
}

export default Bot