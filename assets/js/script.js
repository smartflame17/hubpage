document.addEventListener("DOMContentLoaded", () => {
    const projectContainer = document.getElementById("project-list");

    // Fetch the JSON data
    fetch('assets/data/projects.json')
        .then(response => response.json())
        .then(projects => {
            // Clear the "Loading..." text
            projectContainer.innerHTML = '';

            // Loop through each project and create HTML
            projects.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('card');

                // Create the tags HTML
                const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tags">${tagsHtml}</div>
                    <a href="${project.link}" class="btn" target="${project.isExternal ? '_blank' : '_self'}">View Project &rarr;</a>
                `;

                projectContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectContainer.innerHTML = '<p>Failed to load projects.</p>';
        });
});