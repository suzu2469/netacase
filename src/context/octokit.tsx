import * as React from 'react'
import { Octokit } from 'octokit'
import { useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import { GetTokenResponse } from '../types/GetTokenResponse'

export const OctokitContext = React.createContext<Octokit | null>(null)

export const OctokitProvider: React.FC<React.PropsWithChildren<{}>> = (
    props,
) => {
    const { data: token, isLoading } = useQuery('token', () =>
        invoke<GetTokenResponse>('get_token'),
    )
    const [client, setClient] = React.useState<Octokit | null>(null)

    React.useEffect(() => {
        if (!token) return
        setClient(new Octokit({ auth: token.github }))
    }, [token])

    return (
        <OctokitContext.Provider value={client}>
            {props.children}
        </OctokitContext.Provider>
    )
}
