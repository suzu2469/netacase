import { NextPage } from 'next'
import NextLink from 'next/link'
import { open } from '@tauri-apps/api/shell'
import { Container, Row, Text, Table, Badge, Link } from '@nextui-org/react'
import GithubPRTable from '../components/GithubPRTable'

const App: NextPage = () => {
    return (
        <Container>
            <Row css={{ mt: '24px' }}>
                <Text h2>Github</Text>
            </Row>
            <Row>
                <Text h3>Pull Requests</Text>
            </Row>
            <Row>
                <GithubPRTable />
            </Row>
            <Row css={{ mt: '48px' }}>
                <Text h2>Atlassian</Text>
            </Row>
            <Row>
                <Text h3>Confluence</Text>
            </Row>
            <Row>
                <Table containerCss={{ minWidth: '100%' }}>
                    <Table.Header>
                        <Table.Column>Article</Table.Column>
                        <Table.Column>Activity</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>ああああああああああああ</Table.Cell>
                            <Table.Cell>
                                <Badge color="primary">Created</Badge>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>いいいいいいいいい</Table.Cell>
                            <Table.Cell>
                                <Badge color="default">Commented</Badge>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>うううううううううう</Table.Cell>
                            <Table.Cell>
                                <Badge color="warning">Updated</Badge>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Row>
            <Row css={{ mt: '48px' }}>
                <Text h2>Linear</Text>
            </Row>
            <Row>
                <Table containerCss={{ minWidth: '100%' }}>
                    <Table.Header>
                        <Table.Column>Issue</Table.Column>
                        <Table.Column>Status</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>aaaaaaaaaaa</Table.Cell>
                            <Table.Cell>
                                <Badge color="default">Backlog</Badge>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>aaaaaaaaaaa</Table.Cell>
                            <Table.Cell>
                                <Badge color="warning">In Progress</Badge>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>aaaaaaaaaaa</Table.Cell>
                            <Table.Cell>
                                <Badge color="primary">In Review</Badge>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>aaaaaaaaaaa</Table.Cell>
                            <Table.Cell>
                                <Badge color="secondary">Done</Badge>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Row>
        </Container>
    )
}

export default App
