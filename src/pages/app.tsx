import { NextPage } from 'next'
import NextLink from 'next/link'
import GithubPRTable from '../components/GithubPRTable'
import LinearIssuesTable from '../components/LinearIssuesTable'
import { Container, Group, Stack, Title } from '@mantine/core'

const App: NextPage = () => {
    return (
        <Container>
            <Group>
                <NextLink href="/">Settings</NextLink>
                <NextLink href="/members">Members</NextLink>
            </Group>
            <Stack spacing="lg" mt="48px">
                <div>
                    <Title order={2}>Github</Title>
                    <Title order={3} mt="8px">
                        Pull Requests
                    </Title>
                    <GithubPRTable />
                </div>
                <div>
                    <Title order={2}>Linear</Title>
                    <LinearIssuesTable />
                </div>
                {/*<div>*/}
                {/*    <Title order={2}>Atlassian</Title>*/}
                {/*    <Title order={3}>Confluence</Title>*/}
                {/*</div>*/}
            </Stack>
        </Container>
    )
}

export default App
