import * as React from 'react'
import { useQuery } from 'react-query'
import { Table, Badge, Link } from '@nextui-org/react'
import parse from 'date-fns/fp/parse'
import orderBy from 'lodash/fp/orderBy'

import { LinearContext } from '../../context/linear'
import { Issue } from '@linear/sdk'
import { open } from '@tauri-apps/api/shell'

const LinearIssuesTable: React.FC = () => {
    const linearClient = React.useContext(LinearContext)
    const res = useQuery(
        'linear/issues',
        () =>
            linearClient?.issues({
                filter: {
                    or: [
                        {
                            and: [
                                {
                                    assignee: {
                                        displayName: {
                                            contains: 'soumasuzuki',
                                        },
                                    },
                                },
                                {
                                    startedAt: {
                                        gte: parse(new Date())('yyyy-MM-dd')(
                                            '2022-12-01',
                                        ),
                                    },
                                },
                                {
                                    startedAt: {
                                        lte: parse(new Date())('yyyy-MM-dd')(
                                            '2022-12-31',
                                        ),
                                    },
                                },
                            ],
                        },
                        {
                            and: [
                                {
                                    assignee: {
                                        displayName: {
                                            contains: 'soumasuzuki',
                                        },
                                    },
                                },
                                {
                                    createdAt: {
                                        gte: parse(new Date())('yyyy-MM-dd')(
                                            '2022-12-01',
                                        ),
                                    },
                                },
                                {
                                    createdAt: {
                                        lte: parse(new Date())('yyyy-MM-dd')(
                                            '2022-12-31',
                                        ),
                                    },
                                },
                            ],
                        },
                    ],
                },
            }),
        { enabled: !!linearClient },
    )

    const issues = React.useMemo<Issue[]>(() => {
        if (!res.data) return []
        return orderBy(
            [
                (issue: Issue) => !!issue.completedAt,
                (issue: Issue) => !!issue.startedAt,
                'identifier',
            ],
            ['asc', 'asc'],
        )(res.data.nodes)
    }, [res.data])

    if (res.isLoading || !res.data) return <div>Loading...</div>
    return (
        <Table containerCss={{ minWidth: '100%' }}>
            <Table.Header>
                <Table.Column>ID</Table.Column>
                <Table.Column>Issue</Table.Column>
                <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
                {issues.map((issue) => (
                    <Table.Row key={issue.id}>
                        <Table.Cell>
                            <Link onClick={() => open(issue.url)}>
                                {issue.identifier}
                            </Link>
                        </Table.Cell>
                        <Table.Cell>{issue.title}</Table.Cell>
                        <Table.Cell>
                            <StatusBadge
                                completedAt={issue.completedAt}
                                startedAt={issue.startedAt}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

type StatusCondition = {
    startedAt?: Date
    completedAt?: Date
}
const StatusBadge = <T extends StatusCondition>(
    issue: T,
): React.ReactElement => {
    if (issue.completedAt) return <Badge color="secondary">Done</Badge>
    if (issue.startedAt) return <Badge color="warning">In Progress</Badge>
    return <Badge color="default">Backlog</Badge>
}

export default LinearIssuesTable
