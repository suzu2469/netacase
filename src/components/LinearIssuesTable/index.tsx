import * as React from 'react'
import { useQuery } from 'react-query'
import { Table, Badge, Text } from '@mantine/core'
import parse from 'date-fns/fp/parse'
import orderBy from 'lodash/fp/orderBy'

import { LinearContext } from '../../context/linear'
import { Issue } from '@linear/sdk'
import { open } from '@tauri-apps/api/shell'

type Props = {
    linearId: string
}
const LinearIssuesTable: React.FC<Props> = (props) => {
    const linearClient = React.useContext(LinearContext)
    const res = useQuery(
        `linear/issues?assignee=${props.linearId}`,
        () =>
            linearClient?.issues({
                filter: {
                    or: [
                        {
                            and: [
                                {
                                    assignee: {
                                        id: {
                                            eq: props.linearId,
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
                                        id: {
                                            eq: props.linearId,
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
        <Table>
            <thead>
                <tr>
                    <th style={{ minWidth: '96px' }}>ID</th>
                    <th>Issue</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {issues.map((issue) => (
                    <tr key={issue.id}>
                        <td>
                            <Text
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                                onClick={() => open(issue.url)}
                            >
                                {issue.identifier}
                            </Text>
                        </td>
                        <td>{issue.title}</td>
                        <td>
                            <StatusBadge
                                completedAt={issue.completedAt}
                                startedAt={issue.startedAt}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
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
    if (issue.completedAt) return <Badge color="violet">Done</Badge>
    if (issue.startedAt) return <Badge>In Progress</Badge>
    return <Badge color="gray">Backlog</Badge>
}

export default LinearIssuesTable
