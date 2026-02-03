export interface Idelegatesteams {
    id: string
    team_number: string
    council_name: string
    task_link: any
    created_at: string
    updated_at: string
    team_members: TeamMember[]
}

export interface TeamMember {
    id: string
    team_id: string
    user_id: string
    name: string
    email: string
    rate?: number
    role: string
    task: any
    created_at: string
    updated_at: string
}
