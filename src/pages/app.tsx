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
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates'
import { useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import { GetMembersResponse } from '../types/GetMembersResponse'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

const App: NextPage = () => {
    const [datePickerValue, setDatePickerValue] =
        React.useState<DateRangePickerValue>([
            dayjs().date(1).toDate(),
            dayjs().date(31).toDate(),
        ])
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
                <NextLink href="/connections">Connections</NextLink>
            </Group>
            <Group mt="48px">
                <Select
                    label="メンバー"
                    onChange={setFormMemberId}
                    value={formMemberId}
                    data={memberSelectItems}
                />
                <DateRangePicker
                    label="期間"
                    value={datePickerValue}
                    onChange={setDatePickerValue}
                />
            </Group>
            <div style={{ marginTop: '24px', paddingBottom: '48px' }}>
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
                        startDate={datePickerValue[0]}
                        endDate={datePickerValue[1]}
                    />
                )}
            </div>
        </Container>
    )
}

type MainContentProps = {
    githubId: string
    linearId: string
    startDate: Date
    endDate: Date
}
const MainContent: React.FC<MainContentProps> = (props) => {
    return (
        <Stack spacing="lg">
            <div>
                <Title order={2}>Github</Title>
                <Title order={3} mt="8px">
                    Pull Requests
                </Title>
                <GithubPRTable
                    startDate={props.startDate}
                    endDate={props.endDate}
                    githubId={props.githubId}
                />
            </div>
            <div>
                <Title order={2}>Linear</Title>
                <LinearIssuesTable
                    startDate={props.startDate}
                    endDate={props.endDate}
                    linearId={props.linearId}
                />
            </div>
            {/*<div>*/}
            {/*    <Title order={2}>Atlassian</Title>*/}
            {/*    <Title order={3}>Confluence</Title>*/}
            {/*</div>*/}
        </Stack>
    )
}

export default App
