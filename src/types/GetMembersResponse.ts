export type GetMembersResponse = {
    members: Member[]
}

export type Member = {
    githubId: string
    linearId: string
}
