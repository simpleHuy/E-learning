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
