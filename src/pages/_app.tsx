import { OctokitProvider } from '../context/octokit'
import { ReactQueryProvider } from '../context/reactQuery'
import { LinearProvider } from '../context/linear'
import { MantineProvider } from '@mantine/core'

function MyApp({ Component, pageProps }) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <ReactQueryProvider>
                <OctokitProvider>
                    <LinearProvider>
                        <Component {...pageProps} />
                    </LinearProvider>
                </OctokitProvider>
            </ReactQueryProvider>
        </MantineProvider>
    )
}

export default MyApp
