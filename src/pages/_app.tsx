import { NextUIProvider } from '@nextui-org/react'
import { TokenProvider } from '../context/token'
import { ApolloProvider } from '../context/apollo'
import { OctokitProvider } from '../context/octokit'
import { ReactQueryProvider } from '../context/reactQuery'

function MyApp({ Component, pageProps }) {
    return (
        <NextUIProvider>
            <TokenProvider>
                <ReactQueryProvider>
                    <ApolloProvider>
                        <OctokitProvider>
                            <Component {...pageProps} />
                        </OctokitProvider>
                    </ApolloProvider>
                </ReactQueryProvider>
            </TokenProvider>
        </NextUIProvider>
    )
}

export default MyApp
