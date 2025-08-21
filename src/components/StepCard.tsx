import type { ProjectDetails, ProjectId } from '../types.ts'

type StepCardProps = {
	projectDetails: ProjectDetails
	openModal: (projectId: ProjectId) => void
}

export default function StepCard({ projectDetails, openModal }: StepCardProps) {
	return (
		<div className="card step-card">
			<div className="card-header">Step 2: Build Portfolio Projects (4-6 weeks)</div>
			<div className="card-body">
				<p>Select a project and follow the steps and libraries.</p>
				<div className="row g-3">
					{Object.entries(projectDetails).map(([id, project]) => (
						<div className="col-md-6" key={id}>
							<div className="p-3 border rounded h-100">
								<h5 className="mb-2">{project.title}</h5>
								<ul className="mb-3">
									{project.steps.slice(0, 3).map((s) => (
										<li key={s}>{s}</li>
									))}
								</ul>
								<button className="btn btn-primary" onClick={() => openModal(id as ProjectId)}>
									View Details
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}


