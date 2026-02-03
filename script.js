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
    initHeroSlider();
});

/* ===================== */
/* HERO IMAGE SLIDER */
/* ===================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto-advance slides
    setInterval(nextSlide, slideInterval);
}

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

// API Configuration - Replace with your actual API keys
const TRACKING_CONFIG = {
    // Ship24 API - Tracks 1500+ carriers worldwide (https://www.ship24.com/api)
    ship24: {
        apiKey: 'YOUR_SHIP24_API_KEY', // Get from https://www.ship24.com/api
        baseUrl: 'https://api.ship24.com/public/v1'
    },
    // 17Track API - Popular tracking aggregator (https://api.17track.net)
    track17: {
        apiKey: 'YOUR_17TRACK_API_KEY', // Get from https://api.17track.net
        baseUrl: 'https://api.17track.net/track/v2'
    },
    // Searates API - Sea freight tracking (https://www.searates.com/services/tracking)
    searates: {
        apiKey: 'YOUR_SEARATES_API_KEY', // Get from https://www.searates.com/reference/api
        baseUrl: 'https://sirius.searates.com/tracking/v1'
    },
    // TrackingMore API - 1100+ carriers (https://www.trackingmore.com)
    trackingMore: {
        apiKey: 'YOUR_TRACKINGMORE_API_KEY',
        baseUrl: 'https://api.trackingmore.com/v4'
    }
};

// Carrier detection patterns for auto-routing
const CARRIER_PATTERNS = {
    // Air Carriers
    'dhl': /^\d{10,11}$|^[A-Z]{3}\d{7}$/i,
    'fedex': /^\d{12,22}$|^\d{15}$/,
    'ups': /^1Z[A-Z0-9]{16}$/i,
    'emirates': /^176-?\d{8}$/,
    'qatar': /^157-?\d{8}$/,
    'kenya_airways': /^706-?\d{8}$/,
    'ethiopian': /^071-?\d{8}$/,

    // Sea Carriers (Container tracking)
    'maersk': /^M[A-Z]{3}\d{7}$|^\d{9}$/,
    'msc': /^MSC[A-Z]\d{6,7}$/i,
    'cosco': /^COSU\d{7}$/i,
    'evergreen': /^EGL[UZ]\d{7}$/i,
    'hapag': /^HLCU\d{7}$/i,
    'cma_cgm': /^(CMAU|CGMU)\d{7}$/i,
    'one': /^(ONEY|TCLU)\d{7}$/i,
    'pil': /^PCIU\d{7}$/i,

    // Container numbers (ISO 6346 format)
    'container': /^[A-Z]{4}\d{7}$/i,

    // Bill of Lading patterns
    'bol': /^[A-Z]{4}\d{9,12}$/i,

    // Internal FGS shipments
    'fgs': /^FGS-\d{4}-\d{6}$/i
};

function initTrackingSystem() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');
    const trackingTimeline = document.getElementById('trackingTimeline');

    // Internal FGS shipments database (would be from your backend in production)
    const internalShipments = {
        'FGS-2024-001234': {
            title: 'Electronics Shipment',
            carrier: 'Maersk Line',
            carrierType: 'sea',
            origin: 'Shanghai, China',
            destination: 'Nairobi, Kenya',
            status: 'in-transit',
            statusText: 'In Transit',
            eta: '2024-02-15',
            vessel: 'Maersk Seletar',
            containerNo: 'MSKU1234567',
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
            carrier: 'Emirates SkyCargo',
            carrierType: 'air',
            origin: 'Dubai, UAE',
            destination: 'Kampala, Uganda',
            status: 'delivered',
            statusText: 'Delivered',
            eta: '2024-01-28',
            awb: '176-12345678',
            timeline: [
                { status: 'completed', title: 'Order Confirmed', date: 'Jan 15, 2024 - 10:00 AM', location: 'Dubai, UAE' },
                { status: 'completed', title: 'Picked Up', date: 'Jan 16, 2024 - 08:00 AM', location: 'Dubai Cargo Village' },
                { status: 'completed', title: 'Departed Dubai', date: 'Jan 17, 2024 - 03:00 AM', location: 'DXB Airport' },
                { status: 'completed', title: 'Arrived Entebbe', date: 'Jan 17, 2024 - 09:00 AM', location: 'Entebbe Airport' },
                { status: 'completed', title: 'Customs Cleared', date: 'Jan 18, 2024 - 02:00 PM', location: 'Uganda Revenue Authority' },
                { status: 'completed', title: 'Delivered', date: 'Jan 20, 2024 - 11:30 AM', location: 'Kampala, Uganda' }
            ]
        },
        'FGS-2024-009012': {
            title: 'Agricultural Equipment',
            carrier: 'CMA CGM',
            carrierType: 'sea',
            origin: 'Rotterdam, Netherlands',
            destination: 'Dar es Salaam, Tanzania',
            status: 'in-transit',
            statusText: 'At Port',
            eta: '2024-02-08',
            vessel: 'CMA CGM Zheng He',
            containerNo: 'CMAU5678901',
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
        submitBtn.innerHTML = '<span class="spinner"></span> Searching carriers...';
        submitBtn.disabled = true;

        try {
            // 1. First check internal FGS shipments
            let shipmentData = internalShipments[trackingNumber];

            if (!shipmentData) {
                // 2. Detect carrier and fetch from appropriate API
                const carrier = detectCarrier(trackingNumber);
                console.log(`Detected carrier: ${carrier} for tracking number: ${trackingNumber}`);

                submitBtn.innerHTML = `<span class="spinner"></span> Checking ${carrier}...`;

                // 3. Try fetching from real tracking APIs
                shipmentData = await fetchFromTrackingAPIs(trackingNumber, carrier);
            }

            if (shipmentData) {
                displayTrackingResult(shipmentData, trackingNumber);
                trackingResult.classList.add('active');
                showToast(`Shipment found via ${shipmentData.carrier || 'carrier'}!`, 'success');
            } else {
                trackingResult.classList.remove('active');
                showToast('No shipment found. Try demo: FGS-2024-001234 or enter a valid tracking number', 'error');
            }
        } catch (error) {
            console.error('Tracking error:', error);
            trackingResult.classList.remove('active');
            showToast('Error tracking shipment. Please try again.', 'error');
        }

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });

    // Detect carrier from tracking number pattern
    function detectCarrier(trackingNumber) {
        for (const [carrier, pattern] of Object.entries(CARRIER_PATTERNS)) {
            if (pattern.test(trackingNumber)) {
                return carrier;
            }
        }
        return 'unknown';
    }

    function displayTrackingResult(data, trackingNumber) {
        document.getElementById('shipmentTitle').textContent = data.title || 'Shipment';
        document.getElementById('trackingId').textContent = trackingNumber;
        document.getElementById('shipmentOrigin').textContent = data.origin;
        document.getElementById('shipmentDestination').textContent = data.destination;

        const statusEl = document.getElementById('shipmentStatus');
        statusEl.textContent = data.statusText;
        statusEl.className = `tracking-status ${data.status === 'delivered' ? 'delivered' : 'in-transit'}`;

        // Build timeline with carrier info
        let timelineHTML = '';

        // Add carrier badge if available
        if (data.carrier) {
            timelineHTML += `
                <div class="carrier-badge">
                    <span class="carrier-type ${data.carrierType || 'general'}">${data.carrierType === 'air' ? '✈️ Air' : data.carrierType === 'sea' ? '🚢 Sea' : '📦'}</span>
                    <span class="carrier-name">${data.carrier}</span>
                    ${data.vessel ? `<span class="vessel-name">Vessel: ${data.vessel}</span>` : ''}
                    ${data.containerNo ? `<span class="container-no">Container: ${data.containerNo}</span>` : ''}
                    ${data.awb ? `<span class="awb">AWB: ${data.awb}</span>` : ''}
                </div>
            `;
        }

        timelineHTML += data.timeline.map(item => `
            <div class="timeline-item ${item.status}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${item.title}</h4>
                    <p>${item.date} - ${item.location}</p>
                </div>
            </div>
        `).join('');

        trackingTimeline.innerHTML = timelineHTML;
    }

    // Fetch from real tracking APIs - Multi-carrier integration
    async function fetchFromTrackingAPIs(trackingNumber, carrier) {
        console.log(`Searching ${carrier} for: ${trackingNumber}`);

        // Try multiple tracking services

        // 1. Try Ship24 API (tracks 1500+ carriers worldwide)
        try {
            const ship24Result = await trackWithShip24(trackingNumber);
            if (ship24Result) return ship24Result;
        } catch (e) {
            console.log('Ship24:', e.message);
        }

        // 2. Try 17Track API
        try {
            const track17Result = await trackWith17Track(trackingNumber, carrier);
            if (track17Result) return track17Result;
        } catch (e) {
            console.log('17Track:', e.message);
        }

        // 3. Try Searates for sea freight
        if (['container', 'maersk', 'msc', 'cosco', 'evergreen', 'cma_cgm', 'hapag', 'one'].includes(carrier)) {
            try {
                const searatesResult = await trackWithSearates(trackingNumber);
                if (searatesResult) return searatesResult;
            } catch (e) {
                console.log('Searates:', e.message);
            }
        }

        return null;
    }

    // Ship24 API - Universal tracking (https://www.ship24.com/api)
    async function trackWithShip24(trackingNumber) {
        if (TRACKING_CONFIG.ship24.apiKey === 'YOUR_SHIP24_API_KEY') {
            console.log('Ship24: Configure API key at TRACKING_CONFIG.ship24.apiKey');
            return null;
        }

        const response = await fetch(`${TRACKING_CONFIG.ship24.baseUrl}/trackers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TRACKING_CONFIG.ship24.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trackingNumber })
        });

        if (!response.ok) return null;
        const data = await response.json();

        if (!data.data?.trackings?.[0]) return null;
        const t = data.data.trackings[0];

        return {
            title: 'International Shipment',
            carrier: t.shipment?.carrier?.name || 'Carrier',
            carrierType: t.shipment?.deliveryType || 'general',
            origin: t.shipment?.originCountry || 'Origin',
            destination: t.shipment?.destinationCountry || 'Destination',
            status: t.shipment?.statusMilestone === 'delivered' ? 'delivered' : 'in-transit',
            statusText: t.shipment?.statusMilestone || 'In Transit',
            eta: t.shipment?.estimatedDeliveryDate,
            timeline: (t.events || []).map((e, i) => ({
                status: i === 0 ? 'current' : 'completed',
                title: e.status,
                date: new Date(e.datetime).toLocaleString(),
                location: e.location || 'Unknown'
            })).reverse()
        };
    }

    // 17Track API (https://api.17track.net)
    async function trackWith17Track(trackingNumber, carrier) {
        if (TRACKING_CONFIG.track17.apiKey === 'YOUR_17TRACK_API_KEY') {
            console.log('17Track: Configure API key at TRACKING_CONFIG.track17.apiKey');
            return null;
        }

        // Register tracking number
        await fetch(`${TRACKING_CONFIG.track17.baseUrl}/register`, {
            method: 'POST',
            headers: { '17token': TRACKING_CONFIG.track17.apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify([{ number: trackingNumber }])
        });

        await new Promise(r => setTimeout(r, 2000));

        // Get tracking info
        const response = await fetch(`${TRACKING_CONFIG.track17.baseUrl}/gettrackinfo`, {
            method: 'POST',
            headers: { '17token': TRACKING_CONFIG.track17.apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify([{ number: trackingNumber }])
        });

        if (!response.ok) return null;
        const data = await response.json();

        if (!data.data?.accepted?.[0]) return null;
        const t = data.data.accepted[0];
        const events = t.track?.z0?.z || [];

        return {
            title: 'Tracked Shipment',
            carrier: t.carrier?.name || 'Carrier',
            carrierType: t.carrier?.type === 1 ? 'air' : 'general',
            origin: events.length > 0 ? events[events.length - 1].c : 'Origin',
            destination: t.destination || 'Destination',
            status: t.e === 40 ? 'delivered' : 'in-transit',
            statusText: ['Not Found','In Transit','Expired','Pickup','','Undelivered','Delivered'][Math.floor(t.e/10)] || 'In Transit',
            timeline: events.map((e, i) => ({
                status: i === 0 ? 'current' : 'completed',
                title: e.z,
                date: e.a,
                location: e.c || 'Unknown'
            }))
        };
    }

    // Searates API - Sea Freight (https://www.searates.com/services/tracking)
    async function trackWithSearates(trackingNumber) {
        if (TRACKING_CONFIG.searates.apiKey === 'YOUR_SEARATES_API_KEY') {
            console.log('Searates: Configure API key at TRACKING_CONFIG.searates.apiKey');
            return null;
        }

        const response = await fetch(`${TRACKING_CONFIG.searates.baseUrl}/container/${trackingNumber}`, {
            headers: { 'x-api-key': TRACKING_CONFIG.searates.apiKey }
        });

        if (!response.ok) return null;
        const data = await response.json();

        if (!data.data) return null;
        const c = data.data;

        return {
            title: 'Container Shipment',
            carrier: c.line || 'Shipping Line',
            carrierType: 'sea',
            origin: c.origin?.name || 'Origin Port',
            destination: c.destination?.name || 'Destination Port',
            status: c.status === 'delivered' ? 'delivered' : 'in-transit',
            statusText: c.status || 'In Transit',
            vessel: c.vessel,
            containerNo: c.container_number,
            eta: c.eta,
            timeline: (c.route || []).map((e, i, arr) => ({
                status: i === arr.length - 1 ? 'current' : 'completed',
                title: e.status,
                date: e.date,
                location: e.location || e.port
            }))
        };
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
