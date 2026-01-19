export interface Itask {
    id: number;
    name: string;
    deadline: string;
    council: string;
    councilColor: string;
    status: 'In Progress' | 'Pending' | 'Completed';
    icon: string;
    iconBg: string;
}
// export interface Root {
//   id: string
//   title: string
//   description: string
//   due_date: string
//   status: string
//   created_at: string
//   updated_at: string
//   council_session_id: any
// }
