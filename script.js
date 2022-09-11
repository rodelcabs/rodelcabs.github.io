console.log(document.getElementById("other-skills"))
document.getElementById("other-skills").addEventListener("click", (ev) => {
    let listMenu = document.getElementById("other-skills-list"),
        icon = document.getElementById("chevron-icon"),
        isOpen = listMenu.classList.contains("open-other-skills");

    icon.classList.toggle("rotate");

    isOpen
        ? listMenu.classList.remove("open-other-skills")
        : listMenu.classList.add("open-other-skills");
})