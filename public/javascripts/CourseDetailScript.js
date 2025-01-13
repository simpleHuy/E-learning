// click on module will show lessons
function toggleContent(module) {
    const content = document.getElementById(module);
    const OpenFlag = content.classList.contains("hidden");
    if (OpenFlag) {
        content.classList.remove("hidden", "slide-up");
        content.classList.add("slide-down");
    } else {
        content.classList.remove("slide-down");
        content.classList.add("slide-up");
        setTimeout(() => content.classList.add("hidden"), 300);
    }
}

function showAllCourses() {
    const toggleButton = document.getElementById("ShowAllBtn");
    const courseContainer = document.getElementById("CourseContainer");
    const Flag = courseContainer.classList.contains("custom-max-h");
    if (Flag) {
        courseContainer.classList.remove("custom-max-h");
        courseContainer.classList.remove("overflow-hidden");
        toggleButton.innerText = "Show Less";
    } else {
        courseContainer.classList.add("custom-max-h");
        courseContainer.classList.add("overflow-hidden");
        toggleButton.innerText = "Show All";
    }
}

// Check if the section is overflowing
function isSectionOverflowing(section) {
    if (!section) {
        return false;
    }
    return section.scrollHeight > section.clientHeight;
}

let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 6000); // Change image every 2 seconds
}

// Check if the course container is overflowing
const courseContainer = document.getElementById("CourseContainer");
const isOverflowing = isSectionOverflowing(courseContainer);
if (!isOverflowing) {
    const toggleButton = document.getElementById("ShowAllBtn");
    if (toggleButton) toggleButton.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const reviewsContainer = document.getElementById("reviews-container");
    const pagination = document.getElementById("pagination");

    let currentPage = 1;
    let reviewsPerPage = 3;
    // Fetch and render reviews
    function fetchReviews(page = 1) {
        fetch(
            `/reviews?courseId=${Course._id}&page=${page}&limit=${reviewsPerPage}`
        )
            .then((response) => response.json())
            .then((data) => {
                renderReviews(data.reviews);
                renderPagination(data.totalPages, page);
            });
    }
    const commentInput = document.getElementById("Comment");
    if (isLoggedIn) {
        const submitReview = document.getElementById("submit-review");
        submitReview.addEventListener("click", function () {
            const comment = commentInput.value.trim();
            if (comment) {
                fetch("/reviews", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        User: user.id,
                        Course: Course._id,
                        Comment: comment,
                    }),
                })
                    .then(function (response) {
                        if (response.ok) {
                            commentInput.value = "";
                            fetchReviews();
                        } else {
                            alert("Failed to post review");
                        }
                    })
                    .catch(function (error) {
                        console.error("Error posting review:", error);
                    });
            }
        });
    }
    // Render reviews
    function renderReviews(reviews) {
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = `
                <div class="text-gray-500 text-center py-4">
                    No reviews for this course yet.
                </div>
            `;
            return;
        }
        console.log(reviews);
        reviewsContainer.innerHTML = reviews
            .map(
                (review) => `
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <div class="flex items-center gap-4 mb-2">
                        <img src="${review.User.Img}" alt="${
                    review.User.username
                }" class="w-12 h-12 rounded-full border-2 border-blue-500">
                        <div>
                            <p class="font-semibold">${review.User.username}</p>
                            <p class="text-gray-500 text-sm">${new Date(
                                review.Date
                            ).toLocaleString()}</p>
                        </div>
                    </div>
                    <p class="text-gray-800">${review.Comment}</p>
                </div>
            `
            )
            .join("");
    }

    // Render pagination buttons
    function renderPagination(totalPages, currentPage) {
        pagination.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = `px-4 py-2 rounded-lg ${
                i === currentPage ? "bg-blue-700 text-white" : "bg-gray-200"
            }`;
            button.addEventListener("click", () => {
                fetchReviews(i);
            });
            pagination.appendChild(button);
        }
    }

    // Initial fetch
    fetchReviews();
});
