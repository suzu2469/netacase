import * as React from 'react'
import { LinearClient } from '@linear/sdk'
import { useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import type { GetTokenResponse } from '../types/GetTokenResponse'

export const LinearContext = React.createContext<LinearClient | null>(null)

export const LinearProvider: React.FC<React.PropsWithChildren> = (props) => {
    const [client, setClient] = React.useState(null)
    const { data: token, isLoading } = useQuery('token', () =>
        invoke<GetTokenResponse>('get_token'),
    )

    React.useEffect(() => {
        if (isLoading) return
        if (!token) return
        if (token.linear === '') return
        setClient(new LinearClient({ apiKey: token.linear }))
    }, [token, isLoading])

    return (
        <LinearContext.Provider value={client}>
            {props.children}
        </LinearContext.Provider>
    )
}
