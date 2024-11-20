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

// Check if the course container is overflowing
const courseContainer = document.getElementById("CourseContainer");
const isOverflowing = isSectionOverflowing(courseContainer);
if (!isOverflowing) {
    const toggleButton = document.getElementById("ShowAllBtn");
    if (toggleButton) toggleButton.style.display = "none";
}

// Pagination logic
function changePage(page) {
    // Get the current page from the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // Get the current page number from the query parameters or set to 1 if not provided
    let currentPage = parseInt(params.get("page")) || 1;

    if (page === "prev") {
        currentPage -= 1;
    } else if (page === "next") {
        currentPage += 1;
    }

    // page transitions
    currentPage = Math.max(currentPage, 1);
    params.set("page", currentPage);
    url.search = params.toString();
    window.location.href = url.toString();
}

// Đối tượng lưu các mục đã chọn
const selectedItems = {
    topic: [],
    price: [],
    level: [],
    skill: [],
};

// Theo dõi dropdown hiện tại
let activeDropdown = null;

// Hàm mở/đóng dropdown
function toggleDropdown(field) {
    const dropdown = document.getElementById(`dropdown-${field}`);

    if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.add("hidden");
    }

    // Kiểm tra xem dropdown có đang mở không
    const isHidden = dropdown.classList.contains("hidden");
    // Đóng tất cả dropdown khác
    document
        .querySelectorAll(".dropdown")
        .forEach((item) => item.classList.add("hidden"));
    // Nếu dropdown đang ẩn thì mở nó, nếu đã mở thì ẩn đi
    if (isHidden) {
        dropdown.classList.remove("hidden");
        activeDropdown = dropdown;
    } else {
        dropdown.classList.add("hidden");
        activeDropdown = null;
    }
}
window.addEventListener("DOMContentLoaded", (event) => {
    updateSliderProgress(); // Đảm bảo tiến độ thanh range được cập nhật khi trang được tải
});
// Hàm xử lý khi chọn một item từ dropdown
function toggleSelection(item, field) {
    const selectedContainer = document.getElementById(`${field}-tags`);
    const dropdown = document.getElementById(`dropdown-${field}`);

    // Kiểm tra nếu item đã được chọn
    if (selectedItems[field].includes(item)) {
        selectedItems[field] = selectedItems[field].filter((i) => i !== item);
    } else {
        selectedItems[field].push(item);
    }

    // Cập nhật giao diện
    updateTags(selectedContainer, field);
    showButtonSubmit();
    // Đóng dropdown
    dropdown.classList.add("hidden");
}

// Hàm cập nhật thẻ (tags)
function updateTags(container, field) {
    container.innerHTML = ""; // Xóa các tag cũ

    if (field === "price") {
        const minPrice = selectedItems[field][0];
        const maxPrice = selectedItems[field][1];
        if (minPrice && maxPrice) {
            const tag = document.createElement("span");
            tag.className =
                "px-2 py-1 bg-[#4f75ff] text-white rounded-full flex items-center";
            tag.innerHTML = `From $${minPrice} to $${maxPrice} <button class="ml-2" onclick="removeSelection('${minPrice}', '${field}')">&times;</button>`;
            container.appendChild(tag);
            return;
        }
    }

    if (selectedItems[field].length === 0) {
        const span = document.createElement("span");
        container.appendChild(span);
    } else {
        selectedItems[field].forEach((item) => {
            const tag = document.createElement("span");
            tag.className =
                "px-2 py-1 bg-[#4f75ff] text-white rounded-full flex items-center";
            tag.innerHTML = `${item} <button class="ml-2" onclick="removeSelection('${item}', '${field}')">&times;</button>`;
            container.appendChild(tag);
        });
    }
}

// Hàm xử lý khi xóa một tag
function removeSelection(item, field) {
    if (field === "price") {
        selectedItems[field] = [];
        const container = document.getElementById(`${field}-tags`);
        updateTags(container, field);
        hiddenButtonSubmit();
        return;
    }

    selectedItems[field] = selectedItems[field].filter((i) => i !== item);
    const container = document.getElementById(`${field}-tags`);
    updateTags(container, field);
    hiddenButtonSubmit();
}

// Hàm xử lý với checkbox
function toggleCheckboxSelection(checkbox, field) {
    const selectedContainer = document.getElementById(`${field}-tags`);

    if (checkbox.checked) {
        selectedItems[field].push(checkbox.value);
    } else {
        selectedItems[field] = selectedItems[field].filter(
            (item) => item !== checkbox.value
        );
    }

    // Cập nhật giao diện
    updateTags(selectedContainer, field);
    showButtonSubmit();
}

// Ẩn dropdown khi nhấp ra ngoài
window.addEventListener("click", (e) => {
    // Kiểm tra xem người dùng có nhấn ngoài các dropdown không
    if (!e.target.closest(".relative") && activeDropdown) {
        activeDropdown.classList.add("hidden");
        activeDropdown = null;
    }
});

// Lấy các phần tử cần thiết
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const minRangeInput = document.getElementById("minRange");
const maxRangeInput = document.getElementById("maxRange");
const progress = document.getElementById("progress");

// Cập nhật giá trị của input khi người dùng kéo thanh range
minRangeInput.addEventListener("input", function () {
    // Nếu min vượt quá max, điều chỉnh min bằng max - 100
    if (parseInt(minRangeInput.value) >= parseInt(maxRangeInput.value)) {
        minRangeInput.value = maxRangeInput.value - 100; // Khoảng cách tối thiểu là 100
    }
    minPriceInput.value = minRangeInput.value; // Cập nhật giá trị minPrice
    updateSliderProgress(); // Cập nhật thanh tiến độ
});

maxRangeInput.addEventListener("input", function () {
    // Nếu max nhỏ hơn min, điều chỉnh max bằng min + 100
    if (parseInt(maxRangeInput.value) <= parseInt(minRangeInput.value)) {
        maxRangeInput.value = parseInt(minRangeInput.value) + 100; // Khoảng cách tối thiểu là 100
    }
    maxPriceInput.value = maxRangeInput.value; // Cập nhật giá trị maxPrice
    updateSliderProgress(); // Cập nhật thanh tiến độ
});

// Hàm cập nhật tiến độ của thanh range
function updateSliderProgress() {
    const min = parseInt(minRangeInput.value, 10);
    const max = parseInt(maxRangeInput.value, 10);
    const minPercentage = (min / maxRangeInput.max) * 100;
    const maxPercentage = (max / maxRangeInput.max) * 100;

    // Cập nhật thanh tiến độ
    progress.style.left = `${minPercentage}%`;
    progress.style.right = `${100 - maxPercentage}%`;
}

function showButtonSubmit() {
    const submitButton = document.getElementById("SubmitFilterButton");
    if (submitButton.classList.contains("hidden"))
        submitButton.classList.remove("hidden");
}

function hiddenButtonSubmit() {
    const submitButton = document.getElementById("SubmitFilterButton");
    if (
        !submitButton.classList.contains("hidden") &&
        Object.values(selectedItems).every((item) => item.length === 0)
    )
        submitButton.classList.add("hidden");
}

function acceptPriceRange() {
    const dropdown = document.getElementById("dropdown-price");
    dropdown.classList.add("hidden");
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    selectedItems.price = [minPrice, maxPrice];
    showButtonSubmit();
    const selectedContainer = document.getElementById("price-tags");
    updateTags(selectedContainer, "price");
}

function clearAllFilters() {
    selectedItems.topic = [];
    selectedItems.price = [];
    selectedItems.level = [];
    selectedItems.skill = [];
    const selectedContainers = document.querySelectorAll(".selected-tags");
    selectedContainers.forEach((container) => {
        container.innerHTML = "";
    });
    hiddenButtonSubmit();
}

function SubmitFilter() {
    const url = new URL(window.location.href);
    // please delete all query params related to filters
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(selectedItems)) {
        // make it like topic=A&topic=B&topic=C
        if (value.length > 0) {
            value.forEach((item) => {
                params.append(key, item);
            });
        }
    }
    clearAllFilters();
    url.search = params.toString();
    window.location.href = url.toString();
}
