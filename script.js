/**
 * Fresh Global Solutions - Interactive Website
 * Modern logistics and freight forwarding website with tracking capabilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initTrackingSystem();
    initForms();
    initMapInteraction();
    initCounterAnimation();
    initParallaxEffects();
});

/* ===================== */
/* NAVIGATION */
/* ===================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ===================== */
/* SCROLL ANIMATIONS */
/* ===================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Staggered animation for children
                const children = entry.target.querySelectorAll('.service-card, .why-card, .contact-card');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('fade-in', 'visible');
                });
            }
        });
    }, observerOptions);

    // Add fade-in class and observe sections
    const animatedElements = document.querySelectorAll(
        '.about-grid, .services-grid, .why-us-cards, .contact-grid, .quote-grid, .map-container, .tracking-container'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* ===================== */
/* SHIPMENT TRACKING SYSTEM */
/* ===================== */
function initTrackingSystem() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');
    const trackingTimeline = document.getElementById('trackingTimeline');

    // Demo tracking data (in production, this would come from an API)
    const demoShipments = {
        'FGS-2024-001234': {
            title: 'Electronics Shipment',
            origin: 'Shanghai, China',
            destination: 'Nairobi, Kenya',
            status: 'in-transit',
            statusText: 'In Transit',
            eta: '2024-02-15',
            timeline: [
                { status: 'completed', title: 'Order Confirmed', date: 'Jan 20, 2024 - 09:00 AM', location: 'Shanghai, China' },
                { status: 'completed', title: 'Picked Up', date: 'Jan 21, 2024 - 02:30 PM', location: 'Shanghai Port' },
                { status: 'completed', title: 'Customs Cleared (Origin)', date: 'Jan 23, 2024 - 11:00 AM', location: 'Shanghai Customs' },
                { status: 'completed', title: 'Departed Origin Port', date: 'Jan 25, 2024 - 06:00 AM', location: 'Shanghai Port' },
                { status: 'current', title: 'In Transit - Indian Ocean', date: 'Feb 05, 2024 - 08:00 AM', location: 'En Route to Mombasa' },
                { status: 'pending', title: 'Arrival at Mombasa Port', date: 'Expected: Feb 10, 2024', location: 'Mombasa, Kenya' },
                { status: 'pending', title: 'Customs Clearance', date: 'Expected: Feb 12, 2024', location: 'Mombasa Customs' },
                { status: 'pending', title: 'Delivered', date: 'Expected: Feb 15, 2024', location: 'Nairobi, Kenya' }
            ]
        },
        'FGS-2024-005678': {
            title: 'Medical Supplies',
            origin: 'Dubai, UAE',
            destination: 'Kampala, Uganda',
            status: 'delivered',
            statusText: 'Delivered',
            eta: '2024-01-28',
            timeline: [
                { status: 'completed', title: 'Order Confirmed', date: 'Jan 15, 2024 - 10:00 AM', location: 'Dubai, UAE' },
                { status: 'completed', title: 'Picked Up', date: 'Jan 16, 2024 - 08:00 AM', location: 'Dubai Cargo' },
                { status: 'completed', title: 'In Transit', date: 'Jan 17, 2024 - 03:00 AM', location: 'Air Freight' },
                { status: 'completed', title: 'Arrived Entebbe', date: 'Jan 17, 2024 - 09:00 AM', location: 'Entebbe Airport' },
                { status: 'completed', title: 'Customs Cleared', date: 'Jan 18, 2024 - 02:00 PM', location: 'Uganda Revenue Authority' },
                { status: 'completed', title: 'Delivered', date: 'Jan 20, 2024 - 11:30 AM', location: 'Kampala, Uganda' }
            ]
        },
        'FGS-2024-009012': {
            title: 'Agricultural Equipment',
            origin: 'Rotterdam, Netherlands',
            destination: 'Dar es Salaam, Tanzania',
            status: 'in-transit',
            statusText: 'At Port',
            eta: '2024-02-08',
            timeline: [
                { status: 'completed', title: 'Order Confirmed', date: 'Jan 05, 2024 - 11:00 AM', location: 'Rotterdam, Netherlands' },
                { status: 'completed', title: 'Container Loaded', date: 'Jan 08, 2024 - 09:00 AM', location: 'Rotterdam Port' },
                { status: 'completed', title: 'Departed Europe', date: 'Jan 10, 2024 - 06:00 PM', location: 'Rotterdam Port' },
                { status: 'completed', title: 'Passed Suez Canal', date: 'Jan 20, 2024 - 02:00 PM', location: 'Suez, Egypt' },
                { status: 'current', title: 'Arrived at Port', date: 'Feb 01, 2024 - 07:00 AM', location: 'Dar es Salaam Port' },
                { status: 'pending', title: 'Customs Processing', date: 'In Progress', location: 'TRA Customs' },
                { status: 'pending', title: 'Ready for Pickup', date: 'Expected: Feb 05, 2024', location: 'Dar es Salaam' },
                { status: 'pending', title: 'Delivered', date: 'Expected: Feb 08, 2024', location: 'Destination Warehouse' }
            ]
        }
    };

    trackingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const trackingNumber = document.getElementById('trackingNumber').value.trim().toUpperCase();

        // Show loading state
        const submitBtn = trackingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Tracking...';
        submitBtn.disabled = true;

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check demo data or try real API
        let shipmentData = demoShipments[trackingNumber];

        if (!shipmentData) {
            // Try fetching from tracking APIs (demo - would need actual API keys)
            shipmentData = await fetchFromTrackingAPIs(trackingNumber);
        }

        if (shipmentData) {
            displayTrackingResult(shipmentData, trackingNumber);
            trackingResult.classList.add('active');
            showToast('Shipment found!', 'success');
        } else {
            trackingResult.classList.remove('active');
            showToast('No shipment found with that tracking number. Try: FGS-2024-001234', 'error');
        }

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });

    function displayTrackingResult(data, trackingNumber) {
        document.getElementById('shipmentTitle').textContent = data.title;
        document.getElementById('trackingId').textContent = trackingNumber;
        document.getElementById('shipmentOrigin').textContent = data.origin;
        document.getElementById('shipmentDestination').textContent = data.destination;

        const statusEl = document.getElementById('shipmentStatus');
        statusEl.textContent = data.statusText;
        statusEl.className = `tracking-status ${data.status === 'delivered' ? 'delivered' : 'in-transit'}`;

        // Build timeline
        trackingTimeline.innerHTML = data.timeline.map(item => `
            <div class="timeline-item ${item.status}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${item.title}</h4>
                    <p>${item.date} - ${item.location}</p>
                </div>
            </div>
        `).join('');
    }

    // Mock function to simulate fetching from real tracking APIs
    async function fetchFromTrackingAPIs(trackingNumber) {
        // In production, you would integrate with real APIs:
        // - DHL: https://api-eu.dhl.com/track/shipments
        // - FedEx: https://apis.fedex.com/track/v1/trackingnumbers
        // - UPS: https://onlinetools.ups.com/track/v1/details
        // - Maersk: https://api.maersk.com/tracking

        // For demo purposes, return null (not found)
        // In production, you would make actual API calls here

        console.log(`Searching for tracking number: ${trackingNumber}`);
        console.log('In production, this would query real carrier APIs');

        return null;
    }
}

/* ===================== */
/* FORMS */
/* ===================== */
function initForms() {
    // Quote Form
    const quoteForm = document.getElementById('quoteForm');
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In production, send to backend:
        // await fetch('/api/quote', { method: 'POST', body: JSON.stringify(data) });

        showToast('Quote request submitted! We\'ll contact you within 24 hours.', 'success');
        quoteForm.reset();

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = newsletterForm.querySelector('input[type="email"]').value;

        // Simulate subscription
        await new Promise(resolve => setTimeout(resolve, 800));

        showToast('Successfully subscribed to our newsletter!', 'success');
        newsletterForm.reset();
    });

    // Input animations
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

/* ===================== */
/* MAP INTERACTION */
/* ===================== */
function initMapInteraction() {
    const locationItems = document.querySelectorAll('.location-item');
    const mapWrapper = document.getElementById('mapWrapper');
    const mapOverlay = mapWrapper.querySelector('.map-overlay');

    // Map URLs for different locations
    const mapUrls = {
        'Nairobi': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743783!2d36.68258752776498!3d-1.3028617804389252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus',
        'Mombasa': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127499.09873789127!2d39.59340295!3d-4.05177875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184012e78ec02c15%3A0xcb618bbc35f3a55f!2sMombasa%2C%20Kenya!5e0!3m2!1sen!2sus!4v1706000000001!5m2!1sen!2sus',
        'Dar es Salaam': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253730.99698577808!2d39.12416675!3d-6.8161019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4bae169bd6f1%3A0x940f6b26a086a1dd!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1706000000002!5m2!1sen!2sus',
        'Kampala': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255346.48489831037!2d32.48229225!3d0.31628395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc0f90f5f695%3A0xe9da3365d3e2ceec!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1706000000003!5m2!1sen!2sus'
    };

    locationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            locationItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Get city name and update map
            const city = this.dataset.city;
            const iframe = mapWrapper.querySelector('iframe');

            // Animate map change
            iframe.style.opacity = '0';
            setTimeout(() => {
                iframe.src = mapUrls[city];
                iframe.style.opacity = '1';
            }, 300);

            // Update overlay
            const officeName = this.querySelector('h4').textContent;
            const officeAddress = this.querySelector('p').textContent;
            mapOverlay.querySelector('h4').textContent = officeName.split('(')[0].trim();
            mapOverlay.querySelector('p').textContent = officeAddress;
        });

        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/* ===================== */
/* COUNTER ANIMATION */
/* ===================== */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        const heroSection = document.querySelector('.hero');
        const rect = heroSection.getBoundingClientRect();

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            animated = true;
            stats.forEach(stat => {
                const text = stat.textContent;
                const hasPlus = text.includes('+');
                const value = parseInt(text.replace(/\D/g, ''));

                if (!isNaN(value)) {
                    animateValue(stat, 0, value, 2000, hasPlus);
                }
            });
        }
    };

    function animateValue(element, start, end, duration, hasPlus) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                clearInterval(timer);
                current = end;
            }
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }, 16);
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Initial check
}

/* ===================== */
/* PARALLAX EFFECTS */
/* ===================== */
function initParallaxEffects() {
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.setProperty('--scroll', scrolled * 0.5 + 'px');
        }
    });

    // Add CSS variable for parallax
    const style = document.createElement('style');
    style.textContent = `
        .hero-bg {
            transform: translateY(var(--scroll, 0));
        }
    `;
    document.head.appendChild(style);
}

/* ===================== */
/* TOAST NOTIFICATIONS */
/* ===================== */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success'
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
            }
        </svg>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ===================== */
/* UTILITY FUNCTIONS */
/* ===================== */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

/* ===================== */
/* KEYBOARD NAVIGATION */
/* ===================== */
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* ===================== */
/* PERFORMANCE OPTIMIZATIONS */
/* ===================== */

// Preload critical resources
const preloadLinks = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', as: 'style' }
];

preloadLinks.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
});

// Service Worker Registration (for production)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

console.log('Fresh Global Solutions website initialized successfully!');
