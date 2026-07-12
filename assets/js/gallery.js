/* ==========================================================
   DEVLLOPE PORTFOLIO — DESIGN PORTFOLIO GALLERY & LIGHTBOX
   Folder tile -> gallery modal (grid) -> fullscreen lightbox.
   Lightbox supports ESC, click-outside, arrow-key navigation
   and disables page/wheel scrolling while open.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));
    if (!galleryCards.length) return;

    /* Build the lightbox markup once and append to body */
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
        <span class="lightbox-counter"></span>
        <button class="lightbox-nav prev" aria-label="Previous image" type="button">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
        <figure class="lightbox-figure">
            <img src="" alt="">
            <figcaption class="lightbox-caption">
                <strong class="lightbox-title"></strong>
                <span class="lightbox-desc"></span>
            </figcaption>
        </figure>
        <button class="lightbox-nav next" aria-label="Next image" type="button">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
        <button class="lightbox-close" aria-label="Close image viewer" type="button">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector("img");
    const lbTitle = lightbox.querySelector(".lightbox-title");
    const lbDesc = lightbox.querySelector(".lightbox-desc");
    const lbCounter = lightbox.querySelector(".lightbox-counter");
    const lbClose = lightbox.querySelector(".lightbox-close");
    const lbPrev = lightbox.querySelector(".lightbox-nav.prev");
    const lbNext = lightbox.querySelector(".lightbox-nav.next");

    let currentIndex = 0;

    const renderSlide = (index) => {
        currentIndex = (index + galleryCards.length) % galleryCards.length;
        const card = galleryCards[currentIndex];
        const fullSrc = card.getAttribute("data-full") || card.querySelector("img").src;
        const title = card.getAttribute("data-title") || "";
        const desc = card.getAttribute("data-desc") || "";

        lbImg.src = fullSrc;
        lbImg.alt = title;
        lbTitle.textContent = title;
        lbDesc.textContent = desc;
        lbCounter.textContent = `${currentIndex + 1} / ${galleryCards.length}`;
    };

    const openLightbox = (index) => {
        renderSlide(index);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        lbClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".modal-overlay.active")) {
            document.body.classList.remove("no-scroll");
        }
    };

    galleryCards.forEach((card, index) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `View ${card.getAttribute("data-title") || "image"} full size`);

        card.addEventListener("click", () => openLightbox(index));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => renderSlide(currentIndex - 1));
    lbNext.addEventListener("click", () => renderSlide(currentIndex + 1));

    /* Click outside the figure closes the viewer */
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    /* Keyboard shortcuts: ESC closes, arrows navigate */
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            renderSlide(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
            renderSlide(currentIndex + 1);
        }
    });

    /* Disable mouse-wheel / touch scrolling of the page while the
       lightbox is open (the image itself never needs to scroll). */
    const blockScroll = (e) => {
        if (lightbox.classList.contains("active")) {
            e.preventDefault();
        }
    };
    lightbox.addEventListener("wheel", blockScroll, { passive: false });
    lightbox.addEventListener("touchmove", blockScroll, { passive: false });

    /* Basic touch swipe support */
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) {
            delta > 0 ? renderSlide(currentIndex - 1) : renderSlide(currentIndex + 1);
        }
    }, { passive: true });

});
