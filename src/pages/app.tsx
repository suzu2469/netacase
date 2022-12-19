import { NextPage } from 'next'
import * as React from 'react'
import NextLink from 'next/link'
import GithubPRTable from '../components/GithubPRTable'
import LinearIssuesTable from '../components/LinearIssuesTable'
import {
    Container,
    Group,
    Loader,
    Select,
    SelectItem,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import { GetMembersResponse } from '../types/GetMembersResponse'
import { Controller, useForm } from 'react-hook-form'

const App: NextPage = () => {
    const [formMemberId, setFormMemberId] = React.useState(null)

    const getMembersQuery = useQuery('members', () =>
        invoke<GetMembersResponse>('get_members'),
    )

    const memberData = () => {
        if (formMemberId === null) return null
        return (
            getMembersQuery.data?.members.find(
                (m) => m.githubId === formMemberId,
            ) ?? null
        )
    }

    const memberSelectItems = React.useMemo<SelectItem[]>(() => {
        return (
            getMembersQuery.data?.members.map((m) => ({
                label: `@${m.githubId}`,
                value: m.githubId,
            })) ?? []
        )
    }, [getMembersQuery.data])

    React.useEffect(() => {
        if (
            getMembersQuery.isFetched &&
            !!getMembersQuery.data &&
            getMembersQuery.data.members.length > 0
        ) {
            setFormMemberId(getMembersQuery.data.members[0].githubId)
        }
    }, [getMembersQuery.isSuccess])

    return (
        <Container>
            <Group>
                <NextLink href="/">Settings</NextLink>
                <NextLink href="/members">Members</NextLink>
            </Group>
            <Select
                mt="48px"
                onChange={setFormMemberId}
                value={formMemberId}
                data={memberSelectItems}
            />
            <div style={{ marginTop: '24px' }}>
                {getMembersQuery.isLoading ? (
                    <Loader />
                ) : !memberData() ||
                  formMemberId === null ||
                  getMembersQuery.data.members.length <= 0 ? (
                    <Text>
                        <NextLink href="/members">Members</NextLink>{' '}
                        からメンバーを追加してください
                    </Text>
                ) : (
                    <MainContent
                        githubId={memberData()?.githubId ?? ''}
                        linearId={memberData()?.linearId ?? ''}
                    />
                )}
            </div>
        </Container>
    )
}

type MainContentProps = {
    githubId: string
    linearId: string
}
const MainContent: React.FC<MainContentProps> = (props) => {
    return (
        <Stack spacing="lg">
            <div>
                <Title order={2}>Github</Title>
                <Title order={3} mt="8px">
                    Pull Requests
                </Title>
                <GithubPRTable githubId={props.githubId} />
            </div>
            <div>
                <Title order={2}>Linear</Title>
                <LinearIssuesTable linearId={props.linearId} />
            </div>
            {/*<div>*/}
            {/*    <Title order={2}>Atlassian</Title>*/}
            {/*    <Title order={3}>Confluence</Title>*/}
            {/*</div>*/}
        </Stack>
    )
}

export default App
