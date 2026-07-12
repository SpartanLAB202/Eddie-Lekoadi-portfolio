/* ==========================================================
   DEVLLOPE PORTFOLIO — MAIN APPLICATION SCRIPT
   Handles: AOS init, navbar, mobile menu, smooth scroll,
   active-nav highlighting, scroll progress, animated counters,
   cursor glow, button ripple, project case-study modals,
   contact form validation, back-to-top.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------
       AOS (Animate On Scroll) init
    --------------------------------------------- */
    if (window.AOS) {
        AOS.init({
            duration: 900,
            once: true,
            easing: "ease-out-cubic",
            offset: 60
        });
    }

    /* ---------------------------------------------
       Sticky / blurred navbar on scroll
    --------------------------------------------- */
    const navbar = document.querySelector(".navbar");

    const handleNavbarScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* ---------------------------------------------
       Mobile hamburger menu
    --------------------------------------------- */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");
            hamburger.classList.toggle("open", isOpen);
            hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
            document.body.classList.toggle("no-scroll", isOpen);
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                hamburger.classList.remove("open");
                hamburger.setAttribute("aria-expanded", "false");
                document.body.classList.remove("no-scroll");
            });
        });
    }

    /* ---------------------------------------------
       Smooth scroll for in-page anchors
    --------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            history.replaceState(null, "", targetId);
        });
    });

    /* ---------------------------------------------
       Active navigation link on scroll
    --------------------------------------------- */
    const sections = document.querySelectorAll("main section[id], section[id]");
    const navLinkEls = document.querySelectorAll(".nav-links a");

    const updateActiveLink = () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });
        navLinkEls.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    };
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    /* ---------------------------------------------
       Scroll progress bar
    --------------------------------------------- */
    const progress = document.createElement("div");
    progress.className = "progress-bar";
    document.body.appendChild(progress);

    window.addEventListener("scroll", () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const ratio = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        progress.style.width = ratio + "%";
    }, { passive: true });

    /* ---------------------------------------------
       Animated stat counters (trigger once, in view)
    --------------------------------------------- */
    const counters = document.querySelectorAll(".stat-card h1[data-count]");

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute("data-count"), 10) || 0;
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
            const progressRatio = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progressRatio, 3);
            const value = Math.floor(eased * target);
            el.textContent = value + suffix;
            if (progressRatio < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        };
        requestAnimationFrame(step);
    };

    if (counters.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(animateCounter);
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });

        const statsWrap = document.querySelector(".stats");
        if (statsWrap) statsObserver.observe(statsWrap);
    }

    /* ---------------------------------------------
       Cursor glow (desktop / fine-pointer only)
    --------------------------------------------- */
    if (window.matchMedia("(pointer: fine)").matches) {
        const glow = document.createElement("div");
        glow.className = "cursor-glow";
        document.body.appendChild(glow);

        let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const followLoop = () => {
            curX += (mouseX - curX) * 0.12;
            curY += (mouseY - curY) * 0.12;
            glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
            requestAnimationFrame(followLoop);
        };
        requestAnimationFrame(followLoop);
    }

    /* ---------------------------------------------
       Button ripple effect
    --------------------------------------------- */
    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement("span");
            const size = Math.max(rect.width, rect.height);
            ripple.className = "ripple";
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });

    /* ---------------------------------------------
       Back to top button
    --------------------------------------------- */
    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------------------------------------------
       Generic modal open/close helper
       Works for: [data-modal-target] triggers -> #modal-id overlays
    --------------------------------------------- */
    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".modal-overlay.active, .lightbox.active")) {
            document.body.classList.remove("no-scroll");
        }
    };

    document.querySelectorAll("[data-modal-target]").forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = document.querySelector(trigger.getAttribute("data-modal-target"));
            openModal(modal);
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal(overlay);
        });
        const closeBtn = overlay.querySelector(".modal-close");
        if (closeBtn) closeBtn.addEventListener("click", () => closeModal(overlay));
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const activeOverlay = document.querySelector(".modal-overlay.active");
            if (activeOverlay) closeModal(activeOverlay);
        }
    });

    /* Expose for gallery.js */
    window.DevllopeModal = { open: openModal, close: closeModal };

    /* ---------------------------------------------
       Contact form validation (client-side, no backend)
    --------------------------------------------- */
    const form = document.getElementById("contact-form");
    if (form) {
        const nameField = form.querySelector("#name");
        const emailField = form.querySelector("#email");
        const messageField = form.querySelector("#message");
        const statusBox = form.querySelector(".form-status");

        const showError = (field, message) => {
            field.classList.add("invalid");
            const errorEl = form.querySelector(`.field-error[data-for="${field.id}"]`);
            if (errorEl) errorEl.textContent = message;
        };

        const clearError = (field) => {
            field.classList.remove("invalid");
            const errorEl = form.querySelector(`.field-error[data-for="${field.id}"]`);
            if (errorEl) errorEl.textContent = "";
        };

        [nameField, emailField, messageField].forEach(field => {
            if (!field) return;
            field.addEventListener("input", () => clearError(field));
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let valid = true;

            if (!nameField.value.trim() || nameField.value.trim().length < 2) {
                showError(nameField, "Please enter your name.");
                valid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value.trim())) {
                showError(emailField, "Please enter a valid email address.");
                valid = false;
            }

            if (!messageField.value.trim() || messageField.value.trim().length < 10) {
                showError(messageField, "Please write a message (at least 10 characters).");
                valid = false;
            }

            if (!valid) {
                statusBox.className = "form-status error";
                statusBox.textContent = "Please fix the highlighted fields and try again.";
                return;
            }

            statusBox.className = "form-status loading";
            statusBox.textContent = "Sending your message...";

            const subject = encodeURIComponent(`Portfolio enquiry from ${nameField.value.trim()}`);
            const body = encodeURIComponent(
                `Name: ${nameField.value.trim()}\nEmail: ${emailField.value.trim()}\n\n${messageField.value.trim()}`
            );

            setTimeout(() => {
                window.location.href = `mailto:eddielekoadi14@gmail.com?subject=${subject}&body=${body}`;
                statusBox.className = "form-status success";
                statusBox.textContent = "Your email client should now open with your message pre-filled. Prefer another way to reach me? Use the details on the left.";
                form.reset();
            }, 500);
        });
    }

});
