// export interface ITeam {
//   id: string;
//   team_number: string;
//   council_id: string;
//   council_name?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface ITeamMember {
//   id: string;
//   name?: string;
//   team_id: string;
//   user_id: string;
//   email?: string;
//   rate: number;
//   role: 'member' | 'leader' | 'co-leader';
//   task: string;
//   created_at?: string;
//   updated_at?: string;
// }
export interface ITeam {
  id: string
  team_number: string
  council_name: string
  task_link: any
  created_at: string
  updated_at: string
  team_members: ITeamMember[]
}

export interface ITeamMember {
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
