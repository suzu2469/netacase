import * as React from 'react'
import { Table, Link, Badge } from '@nextui-org/react'
import { OctokitContext } from '../../context/octokit'
import { useQuery } from 'react-query'

type Props = {}
const GithubPRTable: React.FC<Props> = (props) => {
    const octokit = React.useContext(OctokitContext)
    const query = useQuery(
        `pullrequests/suzu2469/soba`,
        async () => {
            return await octokit.request('GET /repos/{owner}/{repo}/pulls', {
                owner: 'suzu2469',
                repo: 'soba',
            })
        },
        {
            enabled: !!octokit,
        },
    )

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
                <Table.Row key={1}>
                    <Table.Cell>
                        <Link
                            onClick={(e) =>
                                open('https://github.com/suzu2469/anytickets')
                            }
                        >
                            suzu2469/anytickets
                        </Link>
                    </Table.Cell>
                    <Table.Cell>#31 現在地情報を取得する</Table.Cell>
                    <Table.Cell>
                        <Badge color="success">Open</Badge>
                    </Table.Cell>
                </Table.Row>
                <Table.Row key={2}>
                    <Table.Cell>
                        <Link
                            onClick={(e) =>
                                open('https://github.com/suzu2469/anytickets')
                            }
                        >
                            suzu2469/anytickets
                        </Link>
                    </Table.Cell>
                    <Table.Cell>#31 現在地情報を取得する</Table.Cell>
                    <Table.Cell>
                        <Badge color="secondary">Closed</Badge>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    )
}

export default GithubPRTable
