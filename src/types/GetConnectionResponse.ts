export type GetConnectionResponse = {
    github: ConnectionGithubRepositories[]
}

export type ConnectionGithubRepositories = {
    owner: string
    repo: string
}
