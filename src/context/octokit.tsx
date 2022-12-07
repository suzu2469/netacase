import * as React from 'react'
import { Octokit } from 'octokit'
import { tokenContext } from './token'

export const OctokitContext = React.createContext<Octokit | null>(null)

export const OctokitProvider: React.FC<React.PropsWithChildren<{}>> = (
    props,
) => {
    const [client, setClient] = React.useState<Octokit | null>(null)
    const token = React.useContext(tokenContext)

    React.useEffect(() => {
        setClient(new Octokit({ auth: token.github }))
    }, [token.github])

    return (
        <OctokitContext.Provider value={client}>
            {props.children}
        </OctokitContext.Provider>
    )
}
