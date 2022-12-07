import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider as OriginalProvider,
} from '@apollo/client'

export const ApolloProvider: React.FC<React.PropsWithChildren<{}>> = (
    props,
) => {
    const client = new ApolloClient({
        uri: '',
        cache: new InMemoryCache(),
    })
    return <OriginalProvider client={client}>{props.children}</OriginalProvider>
}
