//hero
// --- Hero Section Background Carousel ---
const hero = document.querySelector('.hero');

// 1. Define your image array (update these paths as necessary)
const heroImages = [
    './images/amz2.jpg',
    './images/pooja.jpg',
    './images/aazhipooja.jpg'
];

let currentImageIndex = 0;
const intervalTime = 5000; // 5000 milliseconds = 5 seconds transition interval

function changeHeroBackground() {
    // 2. Increment the index and loop back to 0 if it exceeds the array length
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;

    const nextImage = heroImages[currentImageIndex];

    // 3. Preload the next image to prevent flickering
    const img = new Image();
    img.src = nextImage;

    img.onload = () => {
        // 4. Once the image is loaded, update the background-image property
        hero.style.backgroundImage = `url('${nextImage}')`;
    };

    // Fallback: If image fails to load, still switch (optional)
    img.onerror = () => {
        hero.style.backgroundImage = `url('${nextImage}')`;
        console.error(`Failed to load background image: ${nextImage}`);
    };
}

// 5. Set the interval to automatically switch the background
// Note: The first image is set via CSS/initial setup, so we start the interval immediately.
// We call the function first to immediately start the cycle at image 2.
setInterval(changeHeroBackground, intervalTime);



// --- CAROUSEL LOGIC ---
const track = document.querySelector('.slider-track');
const slides = Array.from(track.children); // Array of all .news-slide elements
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
// The sliderContainer is no longer needed for hover detection
// const sliderContainer = document.querySelector('.slider-container'); 

// Standard Auto-Scroll Interval Time (in milliseconds)
const AUTO_SCROLL_INTERVAL = 2500;

let slideWidth = slides[0].getBoundingClientRect().width;
let currentSlideIndex = 0;
let autoScroll;

// Arrange the slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
};

// Apply initial positioning
slides.forEach(setSlidePosition);

// Function to move the track
const moveToSlide = (currentIndex) => {
    track.style.transform = 'translateX(-' + (slideWidth * currentIndex) + 'px)';
};

// --- Auto Scroll Helper Functions ---
function startAutoScroll() {
    clearInterval(autoScroll); // Clear first to prevent multiple intervals
    autoScroll = setInterval(() => {
        nextButton.click();
    }, AUTO_SCROLL_INTERVAL);
}

function stopAutoScroll() {
    clearInterval(autoScroll);
}

function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
}

// 1. Handle Window Resize
window.addEventListener('resize', () => {
    slideWidth = slides[0].getBoundingClientRect().width;
    // Must re-position slides on resize for accurate slider movement
    slides.forEach(setSlidePosition);
    moveToSlide(currentSlideIndex);
});

// 2. Next Button Click
nextButton.addEventListener('click', () => {
    const slidesVisible = Math.round(track.parentElement.clientWidth / slideWidth);
    const maxIndex = slides.length - slidesVisible;

    if (currentSlideIndex >= maxIndex) {
        currentSlideIndex = 0;
    } else {
        currentSlideIndex++;
    }
    moveToSlide(currentSlideIndex);
    // Do NOT resetAutoScroll here, as clicks already handled below will reset it
});

// 3. Previous Button Click
prevButton.addEventListener('click', () => {
    const slidesVisible = Math.round(track.parentElement.clientWidth / slideWidth);
    const maxIndex = slides.length - slidesVisible;

    if (currentSlideIndex <= 0) {
        currentSlideIndex = maxIndex;
    } else {
        currentSlideIndex--;
    }
    moveToSlide(currentSlideIndex);
    // Do NOT resetAutoScroll here, as clicks already handled below will reset it
});

// 4. NEW FEATURE: Pause Auto-Scroll when hovering ANY individual slide 
slides.forEach(slide => {
    slide.addEventListener('mouseenter', stopAutoScroll);
    slide.addEventListener('mouseleave', startAutoScroll);
});


// 5. Enhance Button Clicks to also reset auto-scroll
// Note: nextButton.click() is called inside the interval, which already includes the move logic.
// However, manual clicks need to reset the timer for a full AUTO_SCROLL_INTERVAL duration before moving again.
nextButton.addEventListener('click', resetAutoScroll);
prevButton.addEventListener('click', resetAutoScroll);


// 6. Initial Auto Scroll start
startAutoScroll();


// edited

// --- MOBILE MENU TOGGLE SCRIPT ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    // 1. Toggle the side menu
    navLinks.classList.toggle('nav-active');

    // 2. Animate the Links (Optional: nice fade-in effect)
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            // Stagger the animation so they appear one by one
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // 3. Burger Animation (Optional: turns lines into X)
    hamburger.classList.toggle('toggle');
});

// 4. Close menu when a link is clicked
navLinks.addEventListener('click', () => {
    navLinks.classList.remove('nav-active');
    hamburger.classList.remove('toggle');
});

// --- LIVE CALENDAR WIDGET SCRIPT ---

const date = new Date();
const currentMonthYear = document.getElementById("month-year");
const calendarGrid = document.getElementById("calendar-grid");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

// 1. Define Important Temple Events (Month is 0-indexed: Jan=0, Feb=1, etc.)
const templeEvents = [
    { month: 0, day: 11, title: "Petta Thullal" },      // Jan 11
    { month: 0, day: 14, title: "Makaravilakku" },      // Jan 14
    { month: 11, day: 22, title: "Mandala Pooja" },     // Dec 22
    // Add more dates here...
];

function renderCalendar() {
    date.setDate(1); // Set to first day of the current viewing month

    const month = date.getMonth();
    const year = date.getFullYear();

    // Set Header Text
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonthYear.innerText = `${months[month]} ${year}`;

    // Calculate days
    const lastDay = new Date(year, month + 1, 0).getDate(); // Last day of current month
    const prevLastDay = new Date(year, month, 0).getDate(); // Last day of prev month
    const firstDayIndex = date.getDay(); // Day of week the month starts on (0-6)
    const lastDayIndex = new Date(year, month + 1, 0).getDay(); // Day of week the month ends on
    const nextDays = 7 - lastDayIndex - 1; // Days to fill from next month

    let days = "";

    // 1. Previous Month's fading days
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="empty">${prevLastDay - x + 1}</div>`;
    }

    // 2. Current Month's days
    for (let i = 1; i <= lastDay; i++) {
        // Check if it is TODAY
        const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "today" : "";

        // Check if it is an EVENT DATE
        let isEvent = "";
        let eventTitle = "";

        templeEvents.forEach(evt => {
            if (evt.day === i && evt.month === month) {
                isEvent = "event-date";
                eventTitle = evt.title;
            }
        });

        // Add the HTML for the day
        // We add a 'title' attribute so hovering shows the event name
        days += `<div class="${isToday} ${isEvent}" title="${eventTitle}">${i}</div>`;
    }

    // 3. Next Month's fading days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="empty">${j}</div>`;
    }

    calendarGrid.innerHTML = days;
}

// Button Listeners
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent menu from closing when clicking buttons
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// Initial Load
renderCalendar();


// Function to Render Table
function renderAazhiTable() {
    const tableBody = document.getElementById('aazhi-table-body');

    // Safety Check: Ensure the table element and data exist
    if (!tableBody || typeof ALL_AAZHI_EVENTS === 'undefined') return;

    // Clear existing content
    tableBody.innerHTML = '';

    // Loop through the data array
    ALL_AAZHI_EVENTS.forEach(event => {
        const row = document.createElement('tr');

        // Create Google Maps Search Link dynamically
        // Example: https://www.google.com/maps/search/Ambalapuzha+Temple
        const mapQuery = `https://www.google.com/maps/search/${encodeURIComponent(event.name + ', ' + event.area)}`;

        row.innerHTML = `
            <td><strong>${event.date}</strong></td>
            <td style="font-family:'Manjari', sans-serif;">${event.name}</td>
            <td style="font-family:'Manjari', sans-serif;">${event.area}</td>
            <td>
                <a href="${mapQuery}" target="_blank" class="map-link-btn">
                    <i class="fas fa-map-marker-alt"></i> View Map
                </a>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', renderAazhiTable);


// --- NEWS & HISTORY MODAL LOGIC ---
const newsModal = document.getElementById('news-modal');
const modalImg = document.getElementById('modal-img');
const modalIconContainer = document.getElementById('modal-icon-container');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeModalBtn = document.querySelector('.close-modal');

// Select both news cards and history cards
// We select .news-card AND .card (specifically those inside #history to be safe)
const allCards = document.querySelectorAll('.news-card, #history .card');

// Open Modal when a card is clicked
allCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent default if it's a link
        e.preventDefault();

        // 1. Get Data from the clicked card
        const fullDesc = card.getAttribute('data-full-description');
        // Fallback to the paragraph text if no detailed description exists
        const shortDesc = card.querySelector('p') ? card.querySelector('p').innerText : "";
        const description = fullDesc ? fullDesc : shortDesc;

        // Get Title (h3 or h4)
        const titleEl = card.querySelector('h3') || card.querySelector('h4');
        const title = titleEl ? titleEl.innerText : "Details";

        // 2. Determine if it is an Image Card (News) or Icon Card (History)
        const imgDiv = card.querySelector('.news-img');
        const iconEl = card.querySelector('.icon-large');

        if (imgDiv) {
            // It's a News Card -> Show Image, Hide Icon
            const style = window.getComputedStyle(imgDiv);
            const bgImage = style.backgroundImage.slice(5, -2); // Remove 'url("' and '")'

            modalImg.src = bgImage;
            modalImg.style.display = 'block';
            modalIconContainer.style.display = 'none';
        } else if (iconEl) {
            // It's a History Card -> Show Icon, Hide Image
            // Copy the classes from the card's icon to the modal's icon
            modalIcon.className = iconEl.className;

            modalImg.style.display = 'none';
            modalIconContainer.style.display = 'block';
        }

        // 3. Populate Text
        modalTitle.innerText = title;
        modalDesc.innerText = description;

        // 4. Show Modal
        newsModal.style.display = "flex";

        // 5. Stop auto-scroll if it's running (safe to call even if not)
        if (typeof stopAutoScroll === "function") {
            stopAutoScroll();
        }
    });
});

// Close Modal when X is clicked
closeModalBtn.addEventListener('click', () => {
    newsModal.style.display = "none";
    if (typeof startAutoScroll === "function") {
        startAutoScroll();
    }
});

// Close Modal when clicking outside the content (on the overlay)
window.addEventListener('click', (e) => {
    if (e.target == newsModal) {
        newsModal.style.display = "none";
        if (typeof startAutoScroll === "function") {
            startAutoScroll();
        }
    }
});
