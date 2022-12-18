import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { createGetInitialProps } from '@mantine/next'

const getInitialProps = createGetInitialProps()

class MyDocument extends Document {
    static getInitialProps = getInitialProps

    render() {
        return (
            <Html lang="ja">
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
