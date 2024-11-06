function getCourseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("courseId"); // Retrieves the courseId from the URL
}

function renderCourseDetails() {}

renderCourseDetails(); // Call the function to render course details

let isOpen = false;

function toggleContent(module) {
    const content = document.getElementById(module);

    if (isOpen) {
        content.classList.remove("slide-down");
        content.classList.add("slide-up");
        setTimeout(() => content.classList.add("hidden"), 300);
    } else {
        content.classList.remove("hidden", "slide-up");
        content.classList.add("slide-down");
    }

    isOpen = !isOpen;
}
