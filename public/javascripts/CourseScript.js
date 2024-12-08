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
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

    // Fetch the new data
    fetchCoursesData(params);
}

function fetchCoursesData(params) {
    const xhr = new XMLHttpRequest();
    const endpoint = `/courses/api/course-list-data?${params.toString()}`;

    // Cấu hình XHR
    xhr.open("GET", endpoint, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                updateCoursesContainer(response.courses);
                updatePagination(response.currentPage, response.totalPages);
            } else {
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function updateCoursesContainer(courses) {
    const coursesContainer = document.getElementById("courses-container");
    coursesContainer.innerHTML = courses
        .map(
            (course) => `
            <a href="/courses/${course._id}">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <img src="${course.Img}" alt="${course.Title}" class="w-full h-72 object-cover" />
                <div class="p-6 flex-grow">
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <div class="mr-2 border border-slate-300 rounded-md inline-block py-0.5 px-2">${course.Duration} Weeks</div> | 
                        <span class="ml-2 border border-slate-300 rounded-md inline-block py-0.5 px-2">${course.Level}</span>
                        <div class="ml-auto inline-block py-0.5 px-2 text-right font-semibold text-lg text-black">
                        $${course.Price}
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold">${course.Title}</h3>
                    <p class="text-gray-400 text-sm mt-2">${course.ShortDesc}</p>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-auto mb-3 p-3">
                    <button class="mt-4 w-full bg-gray-100 text-black py-2 rounded-md">Get it Now</button>
                    <button id="seeMore-btn" class="mt-4 w-full bg-gray-100 text-black py-2 rounded-md" 
                    onclick="window.location.href='/courses/${course._id}'">See detail</button>
                </div>
            </div>
            </a>`
        )
        .join("");
}

function updatePagination(currentPage, totalPages) {
    currentPage = parseInt(currentPage);
    totalPages = parseInt(totalPages);
    const paginationContainer = document.getElementById("Pagination");

    const nextDisabled = currentPage === totalPages ? "disabled" : "";
    const prevDisabled = currentPage === 1 ? "disabled" : "";

    // Cập nhật phân trang
    paginationContainer.innerHTML = `
        <button id="prev-btn" class="px-4 py-2 bg-gray-800 text-white rounded-md disabled:bg-gray-300 text-gray-700" 
            onclick="changePage('prev')" ${prevDisabled}>Previous</button>
        <div id="page-info" class="text-gray-700 font-medium inline-block relative top-2">Page ${currentPage} of ${totalPages}</div>
        <button id="next-btn" class="px-4 py-2 bg-gray-800 text-white rounded-md disabled:bg-gray-300 text-gray-700" 
            onclick="changePage('next')" ${nextDisabled}>Next</button>`;
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
    //set params in url
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set(field, selectedItems[field].join(","));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    fetchCoursesData(params);
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
    } else{
        selectedItems[field] = selectedItems[field].filter((i) => i !== item);    
    }

    const container = document.getElementById(`${field}-tags`);
    updateTags(container, field);
    hiddenButtonSubmit();
    
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    if (selectedItems[field].length > 0) {
        params.set(field, selectedItems[field].join(","));
    } else {
        params.delete(field); // Optionally, you can delete the parameter if the array is empty
    }
    
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    fetchCoursesData(params);
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

    // Update URL parameters and fetch new data
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (selectedItems.price.length > 0) {
        params.set("price", selectedItems.price.join(","));
    } else {
        params.delete("price");
    }

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    fetchCoursesData(params);
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



function appliedSort(field, direction) {
    document.getElementById("dropdown-sort").classList.add("hidden");
    // Update the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("sort", field);
    params.set("order", direction);
    if(field === "None") {
        params.delete("sort");
        params.delete("order");
    }
    changeSortInfo(field, direction);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    fetchCoursesData(params);
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
        default:
            sortText = "None";
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
