export interface IUserDahboard {
  gpa: number
  total_submissions: number
  grade_distribution: GradeDistribution
  attendance_rate: number
  total_classes: number
  present_count: number
  absent_count: number
  late_count: number
  task_stats: TaskStats
  recent_submissions: any[]
  joined_at: string
}

export interface GradeDistribution {
  A: number
  B: number
  C: number
  D: number
  F: number
}

export interface TaskStats {
  total_tasks: number
  submitted_tasks: number
  not_submitted_tasks: number
  submitted_but_pending: number
  graded_tasks: number
  completion_rate: number
}
