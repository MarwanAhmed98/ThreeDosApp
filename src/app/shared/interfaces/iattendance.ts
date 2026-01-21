export interface IAttendance {
  id?: string;
  user_id: string;
  council_session_id: string;
  status: 'present' | 'absent' | 'late';
  created_at?: string;
  updated_at?: string;
}
