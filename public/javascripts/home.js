const faq = document.querySelectorAll(".faq");

faq.forEach((item) => {
  const open_close = item.querySelector(".open_close");
  const detail = item.querySelector(".detail");
  const img = open_close.querySelector(".img_btn");
  open_close.addEventListener("click", () => {
    if (detail.style.display === "none") {
      detail.style.display = "block";
      img.src = "../assets/icon/close_ques.svg";
    } else {
      detail.style.display = "none";
      img.src = "../assets/icon/open_ques.svg";
    }
  });
});
