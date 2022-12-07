import { NextUIProvider } from '@nextui-org/react'
import { ApolloProvider } from '../context/apollo'
import { OctokitProvider } from '../context/octokit'
import { ReactQueryProvider } from '../context/reactQuery'

function MyApp({ Component, pageProps }) {
    return (
        <NextUIProvider>
            <ReactQueryProvider>
                <ApolloProvider>
                    <OctokitProvider>
                        <Component {...pageProps} />
                    </OctokitProvider>
                </ApolloProvider>
            </ReactQueryProvider>
        </NextUIProvider>
    )
}

export default MyApp
