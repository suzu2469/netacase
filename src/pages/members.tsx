import { NextPage } from 'next'
import {
    Container,
    Title,
    Table,
    Input,
    Button,
    ActionIcon,
    Select,
    SelectItem,
    Group,
    Avatar,
    Text,
    Loader,
} from '@mantine/core'
import { IconPlus, IconTrash, IconSearch, IconLoader } from '@tabler/icons'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as React from 'react'
import { OctokitContext } from '../context/octokit'
import { useQuery } from 'react-query'
import { useDebouncedState } from '@mantine/hooks'
import { LinearContext } from '../context/linear'

type GithubSelect = SelectItem & {
    image: string
}

type FormRow = {
    github: string
    githubSearch: string
    linear: string
}
type FormData = {
    rows: FormRow[]
}
const Members: NextPage = () => {
    const octokit = React.useContext(OctokitContext)
    const linear = React.useContext(LinearContext)

    const [debouncedSearch, setDebouncedSearch] = useDebouncedState('', 500)

    const form = useForm<FormData>({
        defaultValues: {
            rows: [],
        },
    })
    const fieldArray = useFieldArray<FormData>({
        control: form.control,
        name: 'rows',
    })

    const appendRow = React.useCallback(() => {
        fieldArray.append({ github: '', githubSearch: '', linear: '' })
    }, [fieldArray])

    const removeRow = React.useCallback(
        (index: number) => () => {
            fieldArray.remove(index)
        },
        [fieldArray],
    )

    const githubMembersQuery = useQuery(
        `github/members/${debouncedSearch}`,
        () => octokit?.rest.search.users({ q: debouncedSearch, per_page: 10 }),
        { enabled: !!octokit && debouncedSearch !== '' },
    )

    const linearMembersQuery = useQuery(
        `linear/members`,
        () => linear?.users(),
        { enabled: !!linear },
    )

    const githubSelect = React.useMemo((): GithubSelect[] => {
        return (
            githubMembersQuery.data?.data.items.map((m) => ({
                label: m.login,
                value: m.login,
                image: m.avatar_url,
            })) ?? []
        )
    }, [githubMembersQuery.data])

    const linearSelect = React.useMemo((): SelectItem[] => {
        return (
            linearMembersQuery.data?.nodes.map((m) => ({
                label: m.displayName,
                value: m.id,
            })) ?? []
        )
    }, [linearMembersQuery.data])

    return (
        <Container mt="48px">
            <Title order={1}>Members</Title>
            <Table>
                <thead>
                    <tr>
                        <th>Github</th>
                        <th>Linear</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {fieldArray.fields.map((row, index) => (
                        <tr key={row.id}>
                            <td>
                                <Controller
                                    name={`rows.${index}.githubSearch`}
                                    control={form.control}
                                    render={({ field: searchField }) => (
                                        <Controller
                                            name={`rows.${index}.github`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    searchable
                                                    ref={field.ref}
                                                    itemComponent={SelectItem}
                                                    data={githubSelect}
                                                    value={field.value}
                                                    onBlur={field.onBlur}
                                                    onChange={field.onChange}
                                                    searchValue={
                                                        searchField.value
                                                    }
                                                    onSearchChange={(s) => {
                                                        searchField.onChange(s)
                                                        setDebouncedSearch(s)
                                                    }}
                                                    icon={
                                                        githubMembersQuery.isLoading ? (
                                                            <Loader size={14} />
                                                        ) : (
                                                            <IconSearch
                                                                size={14}
                                                            />
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </td>
                            <td>
                                <Controller
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            searchable
                                            data={linearSelect}
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={field.onChange}
                                        />
                                    )}
                                    name={`rows.${index}.linear`}
                                />
                            </td>
                            <td>
                                <ActionIcon
                                    color="red"
                                    onClick={removeRow(index)}
                                >
                                    <IconTrash size="18" />
                                </ActionIcon>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button mt="24px" leftIcon={<IconPlus />} onClick={appendRow}>
                追加
            </Button>
        </Container>
    )
}

const SelectItem = React.forwardRef<HTMLDivElement, GithubSelect>(
    ({ image, label, ...props }, ref) => {
        return (
            <div ref={ref} {...props}>
                <Group noWrap>
                    <Avatar src={`${image}`} size={24} radius="xl" />
                    <div>
                        <Text size="sm">{label}</Text>
                    </div>
                </Group>
            </div>
        )
    },
)

export default Members
