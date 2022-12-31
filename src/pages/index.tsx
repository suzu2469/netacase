import * as React from 'react'
import type { NextPage } from 'next'
import { invoke } from '@tauri-apps/api/tauri'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Container, Title, Input, Button, Group, Stack } from '@mantine/core'
import type { GetTokenResponse } from '../types/GetTokenResponse'

type FormData = {
    github: string
    atlassian: string
    linear: string
}

const Index: NextPage = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const query = useQuery('token', () => invoke<GetTokenResponse>('get_token'))
    const mutation = useMutation(
        'set_token',
        (values: FormData) => invoke('set_token', { token: values }),
        {
            onSettled: (_, context) => {
                queryClient.resetQueries('token')
            },
        },
    )

    const form = useForm<FormData>({
        defaultValues: {
            github: '',
            atlassian: '',
            linear: '',
        },
    })

    const clickSubmit = React.useCallback(
        (data: FormData) => {
            mutation
                .mutateAsync(data)
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
            <Container py="24px">
                <Title order={1}>Setup</Title>
                <Stack spacing="lg" mt="24px">
                    <Stack spacing="xs">
                        <Title order={2}>Github</Title>
                        <Input {...form.register('github')} w="256px" />
                    </Stack>
                    <Stack spacing="xs">
                        <Title order={2}>linear</Title>
                        <Input {...form.register('linear')} w="256px" />
                    </Stack>
                    <Stack spacing="xs">
                        <Title order={2}>Atlassian</Title>
                        <Input {...form.register('atlassian')} w="256px" />
                    </Stack>
                    <Group>
                        <Button type="submit" w="158px">
                            次へ
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </form>
    )
}

export default Index
