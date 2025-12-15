document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector(".mainContent");
    const navLinks = document.querySelectorAll(".nav-link");
    let counter = 0;
    let percent = document.getElementById("percent");
    let fill = document.getElementById("progressFill");
    let loader = document.getElementById("loader");
    let content = document.getElementById("content");

    let loading = setInterval(() => {
        counter++;
        percent.textContent = counter + "%";
        fill.style.width = counter + "%";

        if (counter >= 100) {
            clearInterval(loading);

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
                content.style.display = "block";
                document.body.style.overflow = "auto";
            }, 800);
        }
    }, 20);

    document.getElementById("exploreBtn").addEventListener("click", () => {
        document.body.classList.add("open");
    });

    const addRevealToText = () => {
        const textSelectors =
            "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,small,.muted,.btn,.work-btn";
        const sectionsScope = mainContent.querySelectorAll(".section");
        sectionsScope.forEach((section) => {
            section.querySelectorAll(textSelectors).forEach((el) => {
                if (!el.classList.contains("reveal"))
                    el.classList.add("reveal");
            });
        });
    };
    addRevealToText();

    const applyStagger = () => {
        const sectionsScope = mainContent.querySelectorAll(".section");
        sectionsScope.forEach((section) => {
            const items = Array.from(section.querySelectorAll(".reveal"));
            items.forEach((el, i) => {
                const delay = Math.min(i, 5) * 90; // ms
                el.style.transitionDelay = delay + "ms";
            });
        });
    };
    applyStagger();

    const sections = Array.from(mainContent.querySelectorAll(".section"));
    const setActive = (id) => {
        navLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("data-section") === id);
        });
    };
    const spyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        },
        {
            root: mainContent,
            threshold: 0.6,
        }
    );
    sections.forEach((sec) => spyObserver.observe(sec));
    setActive("home");

    const revealItems = Array.from(mainContent.querySelectorAll(".reveal"));
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                } else {
                    entry.target.classList.remove("in");
                }
            });
        },
        { root: mainContent, threshold: 0.2 }
    );
    revealItems.forEach((el) => revealObserver.observe(el));

    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);

        fetch("server.php", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                showPopup(data.status, data.message);

                if (data.status === "success") {
                    contactForm.reset();
                }
            })
            .catch(() => {
                showPopup("error", "Something went wrong. Please try again.");
            });
    });
});

function showPopup(type, message) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popupMessage");

    msg.textContent = message;
    popup.classList.add("show");
}

function closePopup() {
    document.getElementById("popup").classList.remove("show");
}
