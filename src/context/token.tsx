import * as React from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export type TokenContext = {
    github: string
    atlassian: string
    linear: string
}

type GetTokenInvokeResponse = {
    github: string
    atlassian: string
    linear: string
}

export const tokenContext = React.createContext<TokenContext>({
    github: '',
    atlassian: '',
    linear: '',
})

export const TokenProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [token, setToken] = React.useState<TokenContext>({
        github: '',
        atlassian: '',
        linear: '',
    })

    React.useEffect(() => {
        invoke<GetTokenInvokeResponse>('get_token').then((res) => {
            setToken(res)
        })
    }, [])

    return (
        <tokenContext.Provider value={token}>
            {props.children}
        </tokenContext.Provider>
    )
}
