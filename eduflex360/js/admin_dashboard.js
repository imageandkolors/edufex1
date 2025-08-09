document.addEventListener('DOMContentLoaded', function() {
    fetch('data/admin_data.json')
        .then(response => response.json())
        .then(data => {
            populateDashboard(data);
        })
        .catch(error => {
            console.error('Error fetching admin data:', error);
            const mainContent = document.querySelector('main');
            mainContent.innerHTML = '<div class="alert alert-danger">Could not load dashboard data. Please try again later.</div>';
        });
});

function populateDashboard(data) {
    // Populate user info
    document.getElementById('user-name-nav').textContent = data.admin.name;
    document.getElementById('user-avatar-nav').src = data.admin.avatar;

    // Populate stats cards
    const statsContainer = document.getElementById('stats-cards');
    statsContainer.innerHTML = `
        <div class="col-md-6 col-lg-3">
            <div class="card stat-card text-white">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${data.stats.total_users}</h5>
                        <p class="card-text">Total Users</p>
                    </div>
                    <i class="fas fa-users fa-3x opacity-50"></i>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card stat-card text-white">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${data.stats.total_courses}</h5>
                        <p class="card-text">Total Courses</p>
                    </div>
                    <i class="fas fa-book fa-3x opacity-50"></i>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card stat-card text-white">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${data.stats.total_schools}</h5>
                        <p class="card-text">Total Schools</p>
                    </div>
                    <i class="fas fa-school fa-3x opacity-50"></i>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card stat-card text-white">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${data.stats.active_students}</h5>
                        <p class="card-text">Active Students</p>
                    </div>
                    <i class="fas fa-user-graduate fa-3x opacity-50"></i>
                </div>
            </div>
        </div>
    `;

    // Populate users table
    const usersTableBody = document.getElementById('users-table-body');
    usersTableBody.innerHTML = '';
    data.users.forEach(user => {
        const userRow = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.school}</td>
                <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        usersTableBody.innerHTML += userRow;
    });

    // Populate courses table
    const coursesTableBody = document.getElementById('courses-table-body');
    coursesTableBody.innerHTML = '';
    data.courses.forEach(course => {
        const courseRow = `
            <tr>
                <td>${course.id}</td>
                <td>${course.title}</td>
                <td>${course.school}</td>
                <td>${course.instructor}</td>
                <td>${course.enrollment}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        coursesTableBody.innerHTML += courseRow;
    });
}
