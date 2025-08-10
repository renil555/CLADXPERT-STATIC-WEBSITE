//--------------------------------------------
// 1. Utility Functions
//--------------------------------------------
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayCategory() {
    const category = getQueryParam("category");
    document.querySelectorAll('.category-section > div').forEach(section => {
        section.style.display = "none";
    });
    if (category) {
        const sectionToShow = document.getElementById(category + "-section");
        if (sectionToShow) {
            sectionToShow.style.display = "block";
        }
    }
}

//--------------------------------------------
// 2. DOMContentLoaded - Safe DOM Access
//--------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // 2a. View More/Less Button
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener("click", function () {
            const btn = this;
            const sections = [
                { main: "cladding-section", extra: "extra-cladding" },
                { main: "flooring-section", extra: "extra-flooring" },
                { main: "paving-section", extra: "extra-paving" }
            ];

            for (const section of sections) {
                const mainSection = document.getElementById(section.main);
                const extraSection = document.getElementById(section.extra);

                if (mainSection && window.getComputedStyle(mainSection).display !== "none") {
                    const isHidden = window.getComputedStyle(extraSection).display === "none";
                    extraSection.style.display = isHidden ? "block" : "none";
                    btn.textContent = isHidden ? "View Less" : "View More";
                    if (!isHidden) mainSection.scrollIntoView({ behavior: "smooth" });
                    break;
                }
            }
        });
    }

    // 2b. Scroll Button and Circle
    const scrollBtn = document.getElementById("scrollTopBtn");
    const circle = document.querySelector(".progress-ring-circle");
    if (scrollBtn && circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        function handleScrollProgress() {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            setProgress(scrollPercent);

            const menuOpen = document.querySelector(".mobile-menu-overlay")?.classList.contains("show");
            if (scrollTop > 100 && !menuOpen) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        }

        window.addEventListener("scroll", handleScrollProgress);
        window.addEventListener("load", handleScrollProgress);
        document.addEventListener("click", () => setTimeout(handleScrollProgress, 50));

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2c. AOS Init
    AOS.init({
        once: true,
        duration: 1000,
        delay: 200,
    });

    // 2d. Swiper Init
    new Swiper('.product-slider', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                autoplay: false,
            }
        }
    });

    // 2e. GLightbox Init
    GLightbox({ selector: '.glightbox' });
});

//--------------------------------------------
// 3. window.load for loader and category
//--------------------------------------------
window.addEventListener("load", () => {
    displayCategory();

    const loaderWrapper = document.getElementById('loader');
    const loaderLine = document.getElementById('loader-line');
    const loaderTop = document.getElementById('top');
    const loaderBottom = document.getElementById('bottom');

    setTimeout(() => {
        loaderLine?.classList.add('animate-line');
    }, 500);

    setTimeout(() => {
        loaderTop?.classList.add('animate-up');
        loaderBottom?.classList.add('animate-down');

        setTimeout(() => {
            if (loaderWrapper) loaderWrapper.style.display = 'none';
            document.getElementById('heroContent')?.classList.add('animate');
        }, 800);
    }, 400);
});

//--------------------------------------------
// 4. Fetch Navbar & Events
//--------------------------------------------
fetch('navbar.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;

        const toggleBtn = document.getElementById("mobileMenuToggle");
        const closeBtn = document.getElementById("closeMenu");
        const menuOverlay = document.getElementById("mobileMenu");

        if (toggleBtn && closeBtn && menuOverlay) {
            toggleBtn.addEventListener("click", () => menuOverlay.classList.add("show"));
            closeBtn.addEventListener("click", () => menuOverlay.classList.remove("show"));
        }

        // Navbar scroll effect
        window.addEventListener("scroll", () => {
            const navbar = document.querySelector(".navbar-custom");
            if (window.scrollY > 90) {
                navbar?.classList.add("navbar-scrolled");
            } else {
                navbar?.classList.remove("navbar-scrolled");
            }
        });

        // Mobile submenu
        const productToggle = document.getElementById('mobileProductsToggle');
        productToggle?.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.toggle('open');
            const submenu = this.nextElementSibling;
            submenu?.classList.toggle('open');
        });

        // Close overlay on mobile nav link click
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.id === 'mobileProductsToggle') {
                    e.preventDefault();
                    return;
                }
                document.getElementById('mobileMenu')?.classList.remove('show');
            });
        });
    });

//--------------------------------------------
// 5. Fetch Footer
//--------------------------------------------
fetch('footer.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });
