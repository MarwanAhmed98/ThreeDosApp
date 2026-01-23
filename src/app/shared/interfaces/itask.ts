export interface Itask {
  id: string
  title: string
  description: string
  status: string | null
  due_date: string
  created_at: string
  updated_at: string
  council_id: string | null
  council_session_id: string | null
  council_session: string
  council_name: string
}

export interface ITaskRequest {
  title: string
  description: string
  status: string
  due_date: string
  council_session_id: string
}

export interface ITaskUpdate {
  id: string
  title: string
  status: string
  description: string
  due_date: string
  council_session_id: string
}
