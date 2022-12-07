import * as React from 'react'
import type { NextPage } from 'next'
import { invoke } from '@tauri-apps/api/tauri'
import { Text, Container, Row, Input, Col, Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import type { GetTokenResponse } from '../types/GetTokenResponse'

type FormData = {
    github: string
    atlassian: string
    linear: string
}

const Index: NextPage = () => {
    const router = useRouter()
    const query = useQuery('token', () => invoke<GetTokenResponse>('get_token'))

    const form = useForm<FormData>({
        defaultValues: {
            github: '',
            atlassian: '',
            linear: '',
        },
    })

    const clickSubmit = React.useCallback(
        (data: FormData) => {
            invoke('set_token', {
                token: {
                    github: data.github,
                    atlassian: data.atlassian,
                    linear: data.linear,
                },
            })
                .then(() => {
                    router.push('/app')
                })
                .catch(console.error)
        },
        [form],
    )

    React.useEffect(() => {
        form.reset(query.data)
    }, [query.data])

    return (
        <form onSubmit={form.handleSubmit(clickSubmit)}>
            <Container xs>
                <Row>
                    <Text h1>Setup</Text>
                </Row>
                <Row css={{ mt: '24px' }}>
                    <Col>
                        <Text h2 size={24}>
                            GitHub
                        </Text>
                        <Input
                            {...form.register('github')}
                            css={{ mt: '16px' }}
                            width="256px"
                        />
                    </Col>
                </Row>
                <Row css={{ mt: '24px' }}>
                    <Col>
                        <Text h2 size={24}>
                            Atlassian
                        </Text>
                        <Input
                            {...form.register('atlassian')}
                            css={{ mt: '16px' }}
                            width="256px"
                        />
                    </Col>
                </Row>
                <Row css={{ mt: '24px' }}>
                    <Col>
                        <Text h2 size={24}>
                            Linear
                        </Text>
                        <Input
                            {...form.register('linear')}
                            css={{ mt: '16px' }}
                            width="256px"
                        />
                    </Col>
                </Row>
                <Row css={{ mt: '48px' }}>
                    <Button size="sm" type="submit">
                        次へ
                    </Button>
                </Row>
            </Container>
        </form>
    )
}

export default Index
