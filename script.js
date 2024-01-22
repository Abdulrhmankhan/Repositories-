let currentPage = 1;
let repositoriesPerPage = 10;
let repositoriesCount = 0;

function fetchRepositories() {
    const username = $('#username').val();

    if (!username || typeof username !== 'string' || !username.trim()) {
        alert('Please enter a valid GitHub username.');
        return;
    }

    $('#userProfile').empty();
    $('#repositories').empty();
    $('#pagination').empty();

    $.ajax({
        url: `https://api.github.com/users/${username}`,
        method: 'GET',
        success: function (user) {
            displayUserProfile(user);
        },
        error: function (error) {
            console.error('Error fetching user profile:', error);
            $('#userProfile').html('<p>Error fetching user profile. Please try again.</p>');
        }
    });

    fetchAllRepositories(username);
}

function fetchAllRepositories(username) {
    $.ajax({
        url: `https://api.github.com/users/${username}/repos`,
        method: 'GET',
        success: function (repositories, textStatus, xhr) {
            repositoriesCount = repositories.length;

            // Display repositories for the first page
            displayRepositoriesPage(repositories.slice(0, repositoriesPerPage));

            // Display pagination for all pages
            updatePaginationButtons();
        },
        error: function (error) {
            console.error('Error fetching repositories:', error);
            $('#repositories').html('<p>Error fetching repositories. Please try again.</p>');
        }
    });
}

function displayUserProfile(user) {
    const userProfileContainer = $('#userProfile');

    userProfileContainer.html(`
        <div class="card user-profile-card">
            <img src="${user.avatar_url}" class="card-img-top user-profile-image" alt="User Avatar">
            <div class="card-body user-profile-details">
                <h5 class="card-title">${user.login}</h5>
                <p class="card-text">${user.bio || 'No bio available'}</p>
                <a href="${user.html_url}" class="btn btn-primary" target="_blank">View Profile</a>
            </div>
        </div>
    `);
}

function displayRepositoriesPage(repositories) {
    const repositoriesContainer = $('#repositories');

    if (repositories.length === 0) {
        repositoriesContainer.html('<p>No repositories found.</p>');
        return;
    }

    repositoriesContainer.html('<div class="list-group"></div>'); // Wrap repositories in a list group

    const listGroup = repositoriesContainer.find('.list-group');

    repositories.forEach(repository => {
        listGroup.append(`
            <a href="${repository.html_url}" class="list-group-item list-group-item-action">
                <h5 class="mb-1">${repository.name}</h5>
                <p class="mb-1">${repository.description || 'No description available'}</p>
                <small>${repository.language || 'Unknown language'}</small>
            </a>
        `);
    });
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(repositoriesCount / repositoriesPerPage);
    const paginationContainer = $('#pagination');
    
    for (let page = 1; page <= totalPages; page++) {
        const pageButton = $(`<button class="btn btn-outline-primary mr-2" onclick="fetchRepositoriesPage(${page})">${page}</button>`);
        paginationContainer.append(pageButton);
    }
}

function fetchRepositoriesPage(page) {
    const username = $('#username').val();

    if (!username || typeof username !== 'string' || !username.trim()) {
        alert('Please enter a valid GitHub username.');
        return;
    }

    $.ajax({
        url: `https://api.github.com/users/${username}/repos?page=${page}&per_page=${repositoriesPerPage}`,
        method: 'GET',
        success: function (repositories) {
            displayRepositoriesPage(repositories);
        },
        error: function (error) {
            console.error('Error fetching repositories:', error);
            $('#repositories').html('<p>Error fetching repositories. Please try again.</p>');
        }
    });
}

fetchRepositories();  // Initial fetch for the first page
