import * as React from 'react'
import { Table, Link, Badge } from '@nextui-org/react'
import { OctokitContext } from '../../context/octokit'
import { QueriesOptions, useQueries, useQuery } from 'react-query'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/shell'
import { GetConnectionResponse } from '../../types/GetConnectionResponse'
import { Octokit } from 'octokit'

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

    console.log(repoQueries)

    const pullRequests = React.useMemo(() => {
        return repoQueries
            .flatMap((q) => (q.isLoading ? [] : q.data.data.items))
            .sort((a, b) => (a.draft > b.draft ? 1 : -1))
            .sort((a, b) => (a.state === 'closed' ? 1 : -1))
    }, [repoQueries])

    return (
        <Table
            containerCss={{
                minWidth: '100%',
                height: 'auto',
            }}
        >
            <Table.Header>
                <Table.Column>Repository</Table.Column>
                <Table.Column>PR</Table.Column>
                <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
                {pullRequests.map((pr) => (
                    <Table.Row key={pr.id}>
                        <Table.Cell css={{ maxWidth: '200px' }}>
                            <Link
                                onPress={(e) =>
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
                            </Link>
                        </Table.Cell>
                        <Table.Cell css={{ maxWidth: '256px' }}>
                            <Link onPress={() => open(pr.html_url)}>
                                {pr.title}
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            {stateToBadge(pr.state, pr.draft)}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

const stateToBadge = (state: string, draft: bolean) => {
    if (draft) return <Badge color="default">Draft</Badge>
    switch (state) {
        case 'open':
            return <Badge color="success">Open</Badge>
        case 'closed':
            return <Badge color="secondary">Closed</Badge>
    }
}

export default GithubPRTable
