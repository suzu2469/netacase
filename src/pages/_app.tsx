import { NextUIProvider } from '@nextui-org/react'
import { OctokitProvider } from '../context/octokit'
import { ReactQueryProvider } from '../context/reactQuery'
import { LinearProvider } from '../context/linear'

function MyApp({ Component, pageProps }) {
    return (
        <NextUIProvider>
            <ReactQueryProvider>
                <OctokitProvider>
                    <LinearProvider>
                        <Component {...pageProps} />
                    </LinearProvider>
                </OctokitProvider>
            </ReactQueryProvider>
        </NextUIProvider>
    )
}

export default MyApp
