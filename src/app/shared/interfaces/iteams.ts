export interface ITeam {
  id: string;
  team_number: string;
  council_id: string;
  council_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ITeamMember {
  id: string;
  name?: string;
  team_id: string;
  user_id: string;
  email?: string;
  rate: number;
  role: 'member' | 'leader' | 'co-leader';
  task: string;
  created_at?: string;
  updated_at?: string;
}
