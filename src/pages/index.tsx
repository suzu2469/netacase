import type { NextPage } from 'next'
import { invoke } from '@tauri-apps/api/tauri'
import {
    Text,
    Container,
    Row,
    Input,
    Grid,
    Col,
    Button,
} from '@nextui-org/react'
import { useRouter } from 'next/router'

const Index: NextPage = () => {
    const router = useRouter()

    const clickSubmit = () => {
        invoke('set_token', {
            token: {
                github: 'github',
                atlassian: 'atlassian',
                linear: 'linear',
            },
        })
            .then(() => {
                router.push('/app')
            })
            .catch(console.error)
    }

    return (
        <Container xs>
            <Row>
                <Text h1>Setup</Text>
            </Row>
            <Row css={{ mt: '24px' }}>
                <Col>
                    <Text h2 size={24}>
                        GitHub
                    </Text>
                    <Input css={{ mt: '16px' }} width="256px" />
                </Col>
            </Row>
            <Row css={{ mt: '24px' }}>
                <Col>
                    <Text h2 size={24}>
                        Atlassian
                    </Text>
                    <Input css={{ mt: '16px' }} width="256px" />
                </Col>
            </Row>
            <Row css={{ mt: '24px' }}>
                <Col>
                    <Text h2 size={24}>
                        Linear
                    </Text>
                    <Input css={{ mt: '16px' }} width="256px" />
                </Col>
            </Row>
            <Row css={{ mt: '48px' }}>
                <Button size="sm" onClick={clickSubmit}>
                    次へ
                </Button>
            </Row>
        </Container>
    )
}

export default Index
