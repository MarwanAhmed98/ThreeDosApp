// export interface ISession {
//   id: string
//   title: string
//   date: string
//   description: string
//   material: string
//   council: string
//   created_at: string
//   updated_at: string
// }
export interface ISession {
  id: string;
  title: string;
  date: string;
  description: string;
  material: any;
  council: string;    // اسم المجلس للعرض في الجدول
  council_id?: string; // الـ ID المطلوب لربط الـ Select عند التعديل
  created_at: string;
  updated_at: string;
  attendance_count: number;
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

