document.addEventListener('DOMContentLoaded', function() {
    fetch('data/teacher_data.json')
        .then(response => response.json())
        .then(data => {
            populateDashboard(data);
        })
        .catch(error => {
            console.error('Error fetching teacher data:', error);
            const mainContent = document.querySelector('main');
            mainContent.innerHTML = '<div class="alert alert-danger">Could not load dashboard data. Please try again later.</div>';
        });
});

function populateDashboard(data) {
    // Populate user info
    document.getElementById('user-name-nav').textContent = data.teacher.name;
    document.getElementById('user-name-header').textContent = data.teacher.name;
    document.getElementById('user-avatar-nav').src = data.teacher.avatar;

    // Populate managed courses
    const coursesContainer = document.getElementById('managed-courses');
    coursesContainer.innerHTML = ''; // Clear existing content
    data.managed_courses.forEach(course => {
        const courseCard = `
            <div class="col-md-6">
                <div class="card h-100 course-card shadow-sm">
                    <img src="${course.thumbnail}" class="card-img-top" alt="${course.title}">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">
                            <span class="badge bg-primary">${course.enrollment} Students</span>
                        </p>
                    </div>
                    <div class="card-footer bg-white border-0">
                         <a href="#" class="btn btn-primary btn-sm">Manage Course</a>
                    </div>
                </div>
            </div>
        `;
        coursesContainer.innerHTML += courseCard;
    });

    // Populate recent submissions
    const submissionsContainer = document.getElementById('recent-submissions');
    submissionsContainer.innerHTML = ''; // Clear existing content
    if (data.recent_submissions.length > 0) {
        data.recent_submissions.forEach(submission => {
            const submittedAt = new Date(submission.submitted_at);
            const submissionItem = `
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${submission.student_name}</h6>
                            <small class="text-muted">${submission.assignment} in ${submission.course_title}</small>
                        </div>
                        <span class="text-muted small">${submittedAt.toLocaleDateString()}</span>
                    </div>
                </li>
            `;
            submissionsContainer.innerHTML += submissionItem;
        });
    } else {
        submissionsContainer.innerHTML = '<li class="list-group-item text-muted">No recent submissions.</li>';
    }

    // Populate upcoming deadlines
    const deadlinesContainer = document.getElementById('upcoming-deadlines');
    deadlinesContainer.innerHTML = ''; // Clear existing content
    if(data.upcoming_deadlines.length > 0) {
        data.upcoming_deadlines.forEach(deadline => {
            const dueDate = new Date(deadline.due_date);
            const deadlineItem = `
                 <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${deadline.assignment}</h6>
                        <small class="text-muted">${deadline.course_title}</small>
                    </div>
                    <span class="badge bg-danger">${dueDate.toLocaleDateString()}</span>
                </li>
            `;
            deadlinesContainer.innerHTML += deadlineItem;
        });
    } else {
        deadlinesContainer.innerHTML = '<li class="list-group-item text-muted">No upcoming deadlines.</li>';
    }
}
