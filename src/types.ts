export type Project = {
  title: string
  steps: string[]
  libraries: string[]
}

export type ProjectId = 'project1' | 'project2' | 'project3' | 'project4'

export type ProjectDetails = Record<ProjectId, Project>



