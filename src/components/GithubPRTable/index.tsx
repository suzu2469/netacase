import * as React from 'react'
import { Table, Text, Badge } from '@mantine/core'
import { OctokitContext } from '../../context/octokit'
import { QueriesOptions, useQueries, useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/shell'
import { GetConnectionResponse } from '../../types/GetConnectionResponse'
import { Octokit } from 'octokit'
import flow from 'lodash/fp/flow'
import flatMap from 'lodash/fp/flatMap'
import orderBy from 'lodash/fp/orderBy'

type Props = {}
const GithubPRTable: React.FC<Props> = (props) => {
    const octokit = React.useContext(OctokitContext)

    const connectionQuery = useQuery('connection', () =>
        invoke<GetConnectionResponse>('get_connection'),
    )

    if (!octokit || connectionQuery.isLoading) return <div>Loading...</div>
    return (
        <TableRepositories
            octokit={octokit}
            connection={connectionQuery.data}
        />
    )
}

const TableRepositories: React.FC<{
    octokit: Octokit
    connection: GetConnectionResponse
}> = (props) => {
    const repoQueries = useQueries(
        props.connection.github.map((repo) => ({
            queryKey: `pullrequests/${repo.owner}/${repo.repo}`,
            queryFn: () =>
                props.octokit.request('GET /search/issues', {
                    q: [
                        `repo:${repo.owner}/${repo.repo}`,
                        `is:pr`,
                        `author:suzu2469`,
                        `created:2022-12-01..2022-12-31`,
                    ].join(' '),
                }),
        })) ?? [],
    )

    const pullRequests = React.useMemo(() => {
        return flow(
            flatMap((q) => (q.isLoading ? [] : q.data.data.items)),
            orderBy(['draft', (pr) => pr.state === 'closed'], ['desc', 'asc']),
        )(repoQueries)
    }, [repoQueries])

    return (
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
                                onClick={(e) =>
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
