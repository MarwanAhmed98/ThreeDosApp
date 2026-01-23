export interface ISession {
  id: string
  title: string
  date: string
  description: string
  material: string
  council: string
  created_at: string
  updated_at: string
}


export interface ISessionRequest {
  title: string
  date: string
  description: string
  material: string
  council_id: string
}

export interface ISessionUpdate {
  id: string
  title: string
  date: string
  description: string
  material: string
  council_id: string
}

