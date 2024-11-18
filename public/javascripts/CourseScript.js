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

function isSectionOverflowing(section) {
    return section.scrollHeight > section.clientHeight;
}

const courseContainer = document.getElementById("CourseContainer");
const isOverflowing = isSectionOverflowing(courseContainer);
if (!isOverflowing) {
    const toggleButton = document.getElementById("ShowAllBtn");
    toggleButton.style.display = "none";
}

function changePage(page) {
    // Lấy URL hiện tại
    const url = new URL(window.location.href);

    // Lấy các tham số query hiện tại
    const params = new URLSearchParams(url.search);

    // Lấy trang hiện tại (nếu không có, mặc định là 1)
    let currentPage = parseInt(params.get("page")) || 1;

    // Cập nhật trang mới
    if (page === "prev") {
        currentPage -= 1;
    } else if (page === "next") {
        currentPage += 1;
    }

    // Đảm bảo trang không nhỏ hơn 1
    currentPage = Math.max(currentPage, 1);

    // Cập nhật tham số 'page' trong URL
    params.set("page", currentPage);

    // Thiết lập lại URL với tham số 'page' đã được thay đổi
    url.search = params.toString();

    // Chuyển hướng tới URL mới
    window.location.href = url.toString();
}
