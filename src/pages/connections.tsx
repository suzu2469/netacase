import * as React from 'react'
import { NextPage } from 'next'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Container,
    Table,
    Title,
    TextInput,
    Button,
    Group,
    ActionIcon,
    Loader,
} from '@mantine/core'
import {
    IconCheck,
    IconCircleX,
    IconDownload,
    IconPlus,
    IconTrash,
} from '@tabler/icons'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { GetConnectionResponse } from '../types/GetConnectionResponse'
import { invoke } from '@tauri-apps/api/tauri'
import Link from 'next/link'

type FormData = {
    row: { value: string }[]
}

const schema = z.object({
    row: z
        .object({
            value: z
                .string()
                .min(1, 'Required')
                .regex(
                    /^.+\/.+$/,
                    'Repository name must be "repo/owner" format',
                ),
        })
        .array(),
})

const Connections: NextPage = () => {
    const queryClient = useQueryClient()
    const query = useQuery('connection', () =>
        invoke<GetConnectionResponse>('get_connection'),
    )
    const mutation = useMutation(
        'set_connections',
        (data: FormData) =>
            invoke('set_connection', {
                connection: {
                    github: data.row.map((r) => ({
                        owner:
                            r.value.match(/^.+\//)?.[0]?.replace('/', '') ?? '',
                        repo:
                            r.value.match(/\/.+$/)?.[0]?.replace('/', '') ?? '',
                    })),
                } as GetConnectionResponse,
            }),
        {
            onSettled: () => queryClient.resetQueries('connection'),
        },
    )

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            row: [],
        },
    })

    const fieldArray = useFieldArray({
        control: form.control,
        name: 'row',
    })

    const addField = () => {
        fieldArray.append({ value: '' })
    }

    const submit = (values: FormData) => {
        mutation.mutate(values)
    }
    const removeField = (index: number) => () => {
        fieldArray.remove(index)
    }

    React.useEffect(() => {
        if (!query.isSuccess) return
        form.setValue(
            'row',
            query.data?.github.map((r) => ({
                value: `${r.owner}/${r.repo}`,
            })) ?? [],
        )
    }, [query.isSuccess, form.setValue])

    if (query.isLoading) return <Loader />
    if (query.isError) return <div>エラーが発生しました</div>
    return (
        <Container>
            <Link href="/app">{`< TOP`}</Link>
            <form onSubmit={form.handleSubmit(submit)}>
                <Title mt="24px" order={1}>
                    Connections
                </Title>
                <Group mt="24px">
                    <Title order={2}>Github</Title>
                    <Button
                        leftIcon={
                            mutation.isLoading ? (
                                <Loader />
                            ) : mutation.isSuccess ? (
                                <IconCheck />
                            ) : mutation.isError ? (
                                <IconCircleX />
                            ) : (
                                <IconDownload />
                            )
                        }
                        color={
                            mutation.isSuccess
                                ? 'green'
                                : mutation.isError
                                ? 'red'
                                : 'blue'
                        }
                        type="submit"
                    >
                        {mutation.isError ? 'エラー' : '保存'}
                    </Button>
                </Group>
                <Table mt="12px">
                    <thead>
                        <tr>
                            <th>Repository</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fieldArray.fields.map((field, index) => (
                            <tr key={field.id}>
                                <td>
                                    <TextInput
                                        error={
                                            form.formState.errors.row?.[index]
                                                ?.value && (
                                                <div>
                                                    {
                                                        form.formState.errors
                                                            .row?.[index]?.value
                                                            .message
                                                    }
                                                </div>
                                            )
                                        }
                                        {...form.register(`row.${index}.value`)}
                                    />
                                </td>
                                <td>
                                    <ActionIcon
                                        color="red"
                                        onClick={removeField(index)}
                                    >
                                        <IconTrash size="18px" />
                                    </ActionIcon>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button
                    mt="12px"
                    leftIcon={<IconPlus />}
                    onClick={addField}
                    type="button"
                >
                    Add
                </Button>
            </form>
        </Container>
    )
}

export default Connections
