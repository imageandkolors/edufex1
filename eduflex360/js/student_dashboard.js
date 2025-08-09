document.addEventListener('DOMContentLoaded', function() {
    fetch('data/student_data.json')
        .then(response => response.json())
        .then(data => {
            populateDashboard(data);
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
            // Display an error message to the user
            const mainContent = document.querySelector('main');
            mainContent.innerHTML = '<div class="alert alert-danger">Could not load dashboard data. Please try again later.</div>';
        });
});

function populateDashboard(data) {
    // Populate user info
    document.getElementById('user-name-nav').textContent = data.student.name;
    document.getElementById('user-name-header').textContent = data.student.name;
    document.getElementById('user-avatar-nav').src = data.student.avatar;

    // Populate enrolled courses
    const coursesContainer = document.getElementById('enrolled-courses');
    coursesContainer.innerHTML = ''; // Clear existing content
    data.enrolled_courses.forEach(course => {
        const courseCard = `
            <div class="col-md-6">
                <div class="card h-100 course-card shadow-sm">
                    <img src="${course.thumbnail}" class="card-img-top" alt="${course.title}">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text text-muted">${course.instructor}</p>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar" role="progressbar" style="width: ${course.progress}%;" aria-valuenow="${course.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="card-text mt-2"><small class="text-muted">${course.progress}% complete</small></p>
                    </div>
                    <div class="card-footer bg-white border-0">
                         <a href="#" class="btn btn-primary btn-sm">Go to Course</a>
                    </div>
                </div>
            </div>
        `;
        coursesContainer.innerHTML += courseCard;
    });

    // Populate upcoming quizzes
    const quizzesContainer = document.getElementById('upcoming-quizzes');
    quizzesContainer.innerHTML = ''; // Clear existing content
    if (data.upcoming_quizzes.length > 0) {
        data.upcoming_quizzes.forEach(quiz => {
            const dueDate = new Date(quiz.due_date);
            const quizItem = `
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${quiz.quiz_title}</h6>
                            <small class="text-muted">${quiz.course_title}</small>
                        </div>
                        <span class="badge bg-warning text-dark">${dueDate.toLocaleDateString()}</span>
                    </div>
                </li>
            `;
            quizzesContainer.innerHTML += quizItem;
        });
    } else {
        quizzesContainer.innerHTML = '<li class="list-group-item text-muted">No upcoming quizzes.</li>';
    }

    // Populate recent grades
    const gradesContainer = document.getElementById('recent-grades');
    gradesContainer.innerHTML = ''; // Clear existing content
    if(data.recent_grades.length > 0) {
        data.recent_grades.forEach(grade => {
            const gradeItem = `
                 <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${grade.assignment}</h6>
                        <small class="text-muted">${grade.course_title}</small>
                    </div>
                    <span class="badge bg-success">${grade.grade}</span>
                </li>
            `;
            gradesContainer.innerHTML += gradeItem;
        });
    } else {
        gradesContainer.innerHTML = '<li class="list-group-item text-muted">No recent grades.</li>';
    }
}
