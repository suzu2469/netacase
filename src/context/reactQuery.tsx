import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const ReactQueryProvider: React.FC<React.PropsWithChildren<{}>> = (
    props,
) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    )
}
