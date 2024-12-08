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
    
    const xhr = new XMLHttpRequest();
    const endpoint = `/courses?${params.toString()}`;

    // Cấu hình XHR
    xhr.open("GET", endpoint, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // 4 = DONE
            if (xhr.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xhr.responseText, "text/html");
                const courseContainer = document.getElementById("course-container");
                const newCourseContainer = doc.querySelector("#course-container");
                const paggingContainer = document.getElementById("pagging");
                const newPaggingContainer = doc.querySelector("#pagging");
                courseContainer.innerHTML = newCourseContainer.innerHTML;
                paggingContainer.innerHTML = newPaggingContainer.innerHTML;
                window.history.pushState({}, "", endpoint);
            } else {
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    };

    xhr.send();
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
        removeSelection(item, field);
    } else {
        selectedItems[field].push(item);
        showButtonSubmit();
    }

    // Cập nhật giao diện
    updateTags(selectedContainer, field);
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

    //deletel all search params except page, sort, order
    const params = new URLSearchParams(url.search);
    for (const key of params.keys()) {
        if (key !== "page" && key !== "sort" && key !== "order") {
            params.delete(key);
        }
    }

    // Add the selected items to the URL
    for (const field in selectedItems) {
        if (selectedItems[field].length > 0) {
            params.set(field, selectedItems[field].join(","));
        }
    }

    clearAllFilters();
    url.search = params.toString();
    window.location.href = url.toString();
}

const searchInput = document.getElementById("search");
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            params.set("search", query);
            url.search = params.toString();
            window.location.href = url.toString();
        }
    }
});

function appliedSort(field, direction) {
    if (field === "default") {
        document.getElementById("dropdown-sort").classList.add("hidden");
        return;
    }
    // Update the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("sort", field);
    params.set("order", direction);
    url.search = params.toString();
    window.location.href = url.toString();
}

function changeSortInfo(field, direction) {
    // Update the sort info text based on the selected option
    const sortInfo = document.getElementById("sort-info");

    // Determine the text to display based on the field and direction
    let sortText = "";
    switch (field) {
        case "Title":
            sortText =
                direction === "asc" ? "By Name ( A - Z )" : "By Name ( Z - A )";
            break;
        case "Price":
            sortText =
                direction === "asc"
                    ? "By Price ( Low - High )"
                    : "By Price ( High - Low )";
            break;
        case "Duration":
            sortText =
                direction === "asc"
                    ? "By Duration ( Short - Long )"
                    : "By Duration ( Long - Short )";
            break;
    }

    // Update the #sort-info element's text
    sortInfo.textContent = sortText;
}

// chỉnh lại sort info khi trang được tải
window.addEventListener("DOMContentLoaded", (event) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const sortField = params.get("sort");
    const sortOrder = params.get("order");

    if (sortField && sortOrder) {
        changeSortInfo(sortField, sortOrder);
    } else {
    }
});
