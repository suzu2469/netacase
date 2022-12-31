import * as React from 'react'
import { Table, Text, Badge, Loader, Group } from '@mantine/core'
import { OctokitContext } from '../../context/octokit'
import { useQueries, useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/shell'
import { GetConnectionResponse } from '../../types/GetConnectionResponse'
import { Octokit } from 'octokit'
import flow from 'lodash/fp/flow'
import flatMap from 'lodash/fp/flatMap'
import orderBy from 'lodash/fp/orderBy'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { components } from '@octokit/openapi-types'

type Props = {
    githubId: string
    startDate: Date | null
    endDate: Date | null
}
const GithubPRTable: React.FC<Props> = (props) => {
    const octokit = React.useContext(OctokitContext)

    const connectionQuery = useQuery('connection', () =>
        invoke<GetConnectionResponse>('get_connection'),
    )

    if (!octokit || connectionQuery.isLoading) return <div>Loading...</div>
    if (!connectionQuery.data) return <div>Loading...</div>
    if (!props.startDate || !props.endDate)
        return <div>期間を設定してください</div>
    return (
        <TableRepositories
            octokit={octokit}
            connection={connectionQuery.data}
            githubId={props.githubId}
            startDate={props.startDate}
            endDate={props.endDate}
        />
    )
}

const TableRepositories: React.FC<{
    octokit: Octokit
    connection: GetConnectionResponse
    githubId: string
    startDate: Date | null
    endDate: Date | null
}> = (props) => {
    const startDate = dayjs(props.startDate).format('YYYY-MM-DD')
    const endDate = dayjs(props.endDate).format('YYYY-MM-DD')
    const repoQueries = useQueries(
        props.connection.github.map((repo) => ({
            queryKey: `pullrequests/${repo.owner}/${repo.repo}?author=${props.githubId}&start=${startDate}&end=${endDate}`,
            queryFn: () =>
                props.octokit.request('GET /search/issues', {
                    q: [
                        `repo:${repo.owner}/${repo.repo}`,
                        `is:pr`,
                        `author:${props.githubId}`,
                        `created:${startDate}..${endDate}`,
                    ].join(' '),
                }),
        })) ?? [],
    )

    const pullRequests = React.useMemo(() => {
        return flow<
            [typeof repoQueries],
            components['schemas']['issue-search-result-item'][],
            components['schemas']['issue-search-result-item'][]
        >(
            flatMap((q) => (q.isLoading || q.isError ? [] : q.data.data.items)),
            orderBy<components['schemas']['issue-search-result-item']>(
                ['draft', (pr) => pr.state === 'closed'],
                ['desc', 'asc'],
            ),
        )(repoQueries)
    }, [repoQueries])

    return (
        <div>
            <Group>
                <div>
                    {
                        repoQueries.filter((p) => !p.isLoading && p.isSuccess)
                            .length
                    }{' '}
                    / {repoQueries.length}
                </div>
                {repoQueries.some((p) => p.isLoading) && <Loader size={16} />}
            </Group>
            <Table>
                <thead>
                    <tr>
                        <th>Repository</th>
                        <th>PR</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {pullRequests.map((pr) => (
                        <tr key={pr.id}>
                            <td>
                                <Text
                                    style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        open(
                                            `https://github.com/${
                                                pr.url.match(
                                                    /repos\/(.*)\/issues/,
                                                )[1]
                                            }`,
                                        )
                                    }
                                >
                                    {pr.url.match(/repos\/(.*)\/issues/)[1]}
                                </Text>
                            </td>
                            <td>
                                <Text
                                    style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => open(pr.html_url)}
                                >
                                    {pr.title}
                                </Text>
                            </td>
                            <td>{stateToBadge(pr.state, pr.draft)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

const stateToBadge = (state: string, draft: boolean) => {
    if (draft) return <Badge color="gray">Draft</Badge>
    switch (state) {
        case 'open':
            return <Badge>Open</Badge>
        case 'closed':
            return <Badge color="violet">Closed</Badge>
    }
}

export default GithubPRTable
