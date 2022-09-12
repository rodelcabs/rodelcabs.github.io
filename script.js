document.getElementById("other-skills").addEventListener("click", (ev) => {
    let listMenu = document.getElementById("other-skills-list"),
        icon = document.getElementById("chevron-icon"),
        isOpen = listMenu.classList.contains("open-other-skills");

    icon.classList.toggle("rotate");

    isOpen
        ? listMenu.classList.remove("open-other-skills")
        : listMenu.classList.add("open-other-skills");
})

let currentProjectChevron = null;

// projects handling
document.querySelectorAll(".project").forEach(el => el.addEventListener("click", ev => {
    let parentEl = ev.target.parentElement;

    if(parentEl && !parentEl.classList.contains("project-list")){
        // search for parent
        while (!parentEl.classList.contains("project")) {
            // traverse parent element
            parentEl = parentEl.parentElement;
        }

        //remove
        document.querySelectorAll(".active-content").forEach(el => el.classList.remove("active-content"));
        document.querySelectorAll(".project-chevron, .rotate").forEach(el => el.classList.remove("rotate"))
        
        // show
        let children = [...parentEl.children],
            title = children.find(el => el.classList.contains("project-title")),
            chevron = [...title.children].find(el => el.classList.contains("project-chevron")),
            content = children.find(el => el.classList.contains("project-description"));

        chevron.classList.add("rotate");
        content.classList.add("active-content");
    }
}));