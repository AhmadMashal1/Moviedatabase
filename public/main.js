document.addEventListener("DOMContentLoaded", () => {
    let page = 1;
    const perPage = 10;

    const loadMovieData = async (title = null) => {
        try {
            const apiUrl = title ? `/api/movies?title=${title}&page=${page}` : `/api/movies?page=${page}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            const tableBody = document.getElementById("moviesTableBody");
            tableBody.innerHTML = data.map(movie => {
                return `
                    <tr data-id="${movie._id}" 
                        data-title="${movie.title}" 
                        data-poster="${movie.poster || ''}" 
                        data-directors="${movie.directors.join(', ')}" 
                        data-plot="${movie.fullplot || 'No plot available'}" 
                        data-cast="${movie.cast.join(', ') || 'N/A'}" 
                        data-awards="${movie.awards.text || 'N/A'}" 
                        data-rating="${movie.imdb.rating || 'N/A'}" 
                        data-votes="${movie.imdb.votes || 'N/A'}"
                        data-bs-toggle="modal" 
                        data-bs-target="#detailsModal">
                        <td>${movie.year}</td>
                        <td>${movie.title}</td>
                        <td>${movie.plot || 'N/A'}</td>
                        <td>${movie.rated || 'N/A'}</td>
                        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                    </tr>
                `;
            }).join('');

            const tableRows = document.querySelectorAll("#moviesTableBody tr");
            tableRows.forEach(row => {
                row.addEventListener("click", () => {
                    document.getElementById("exampleModalLabel").innerText = row.getAttribute("data-title");
                    document.getElementById("modalPoster").src = row.getAttribute("data-poster");
                    document.getElementById("modalDirectors").innerText = row.getAttribute("data-directors");
                    document.getElementById("modalPlot").innerText = row.getAttribute("data-plot");
                    document.getElementById("modalCast").innerText = row.getAttribute("data-cast");
                    document.getElementById("modalAwards").innerText = row.getAttribute("data-awards");
                    document.getElementById("modalRating").innerText = row.getAttribute("data-rating");
                    document.getElementById("modalVotes").innerText = row.getAttribute("data-votes");
                });
            });

            updatePaginationButtons(data.length);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    };

    const updatePaginationButtons = (dataLength) => {
        const currentPageElement = document.getElementById("current-page");
        currentPageElement.innerText = page;

        const previousPageElement = document.getElementById("previous-page");
        const nextPageElement = document.getElementById("next-page");

        if (page === 1) {
            previousPageElement.classList.add("disabled");
        } else {
            previousPageElement.classList.remove("disabled");
        }

        const totalPage = Math.ceil(dataLength / perPage);

        if (page === totalPage || dataLength === 0) {
            nextPageElement.classList.add("disabled");
        } else {
            nextPageElement.classList.remove("disabled");
        }
    };

    document.getElementById("previous-page").addEventListener("click", () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    document.getElementById("next-page").addEventListener("click", async () => {
        document.getElementById("next-page").disabled = true;
        page++;
        await loadMovieData();
        document.getElementById("next-page").disabled = false;
    });

    document.getElementById("searchForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        page = 1;
        loadMovieData(title);
    });

    document.getElementById("clearForm").addEventListener("click", () => {
        document.getElementById("title").value = '';
        page = 1;
        loadMovieData();
    });

    // Add click event for the close button in the modal header
    const closeButton = document.querySelector("#detailsModal .btn-close");
    closeButton.addEventListener("click", () => {
        closeModal();
    });

    // Function to close the modal
    const closeModal = () => {
        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.hide();
    };

    // Initial load without search parameters
    loadMovieData();
});
