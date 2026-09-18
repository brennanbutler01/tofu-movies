// noinspection JSUnresolvedLibraryURL

import { createGetInitialProps } from '@mantine/next'
import Document, { Head, Html, Main, NextScript } from 'next/document'

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
    static getInitialProps = getInitialProps

    render() {
        return (
            <Html>
                <Head>
                    <link rel='shortcut icon' href='/images/cute-tofu.png' />
                    <link
                        rel='apple-touch-icon'
                        sizes='180x180'
                        href='/images/cute-tofu.png'
                    />
                    <link
                        rel='icon'
                        type='image/png'
                        sizes='32x32'
                        href='/images/cute-tofu.png'
                    />
                    <link
                        rel='icon'
                        type='image/png'
                        sizes='16x16'
                        href='/images/cute-tofu.png'
                    />
                    <link
                        rel='preconnect'
                        href='https://fonts.googleapis.com'
                    />
                    <link
                        rel='preconnect'
                        href='https://fonts.gstatic.com'
                        crossOrigin={''}
                    />
                    <link
                        href='https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&display=swap'
                        rel='stylesheet'
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
