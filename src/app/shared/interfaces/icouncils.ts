export interface Icouncils {
  id: string
  name: string
  description: string
  head: string
  created_at: string
  updated_at: string
}

export interface IcouncilsRequest {
  name: string
  description: string
  head_id?: string
}

export interface IcouncilsUpdate {
  id: string
  name: string
  description: string
  head_id?: string
}