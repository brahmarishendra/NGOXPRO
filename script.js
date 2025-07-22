// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    let mobileNavOverlay;
    
    // Create mobile nav overlay
    function createMobileNavOverlay() {
        if (!mobileNavOverlay) {
            mobileNavOverlay = document.createElement('div');
            mobileNavOverlay.className = 'mobile-nav-overlay';
            document.body.appendChild(mobileNavOverlay);
            
            mobileNavOverlay.addEventListener('click', closeMobileNav);
        }
    }
    
    function openMobileNav() {
        createMobileNavOverlay();
        hamburger.classList.add('active');
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        body.classList.add('mobile-nav-open');
    }
    
    function closeMobileNav() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
        }
        body.classList.remove('mobile-nav-open');
    }
    
    function toggleMobileNav() {
        if (mobileNav.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile nav when clicking on nav links
    const mobileNavLinks = mobileNav.querySelectorAll('.nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });
    
    // Close mobile nav on window resize if screen becomes large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Handle escape key to close mobile nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // --- Mobile menu functionality ---
    let mobileNavLinks; // Declare it here, but define it AFTER cloning

    if (hamburger && mobileNav) {
        // Clone desktop nav and donate button into mobile-nav on load
        const desktopNav = document.querySelector('.header-content .nav');
        const desktopDonateBtn = document.querySelector('.header-content .donate-btn.primary');

        mobileNav.innerHTML = ''; // Clear any existing content

        if (desktopNav) {
            const clonedNav = desktopNav.cloneNode(true); // Deep clone
            clonedNav.classList.add('mobile-nav-content'); // Add specific class for mobile styling
            clonedNav.classList.remove('nav'); // Remove desktop specific class
            mobileNav.appendChild(clonedNav);
            // !!! IMPORTANT FIX: Now, select the links AFTER they are cloned into mobileNav !!!
            mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-content a');
        }
        if (desktopDonateBtn) {
            const clonedDonateBtn = desktopDonateBtn.cloneNode(true); // Deep clone
            clonedDonateBtn.classList.remove('primary'); // Remove desktop specific class
            clonedDonateBtn.classList.add('mobile-donate-btn'); // Add specific class for mobile styling
            mobileNav.appendChild(clonedDonateBtn);
        }

        // Event listener for hamburger click
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            console.log('Hamburger clicked. Mobile nav active:', mobileNav.classList.contains('active'));
        });

        // Close mobile nav when a link inside it is clicked
        if (mobileNavLinks && mobileNavLinks.length > 0) { // Check if links exist
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (this.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        const targetSection = document.querySelector(targetId);
                        if (targetSection) {
                            smoothScrollTo(targetSection);
                        }
                    }
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    console.log('Mobile nav link clicked. Mobile nav closed.');
                });
            });
        } else {
            console.warn('No mobile nav links found after cloning. Mobile menu links might not be interactive.');
        }

        // Also add listener for the cloned donate button in mobile nav
        const mobileDonateButton = mobileNav.querySelector('.mobile-donate-btn');
        if (mobileDonateButton) {
            mobileDonateButton.addEventListener('click', function() {
                window.location.href = 'donate.html';
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                console.log('Mobile donate button clicked. Mobile nav closed.');
            });
        } else {
            console.warn('Mobile donate button not found after cloning. Mobile menu donate button might not be interactive.');
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                console.log('Clicked outside. Mobile nav closed.');
            }
        });

        // Add touch support for mobile (swipe up to close)
        let touchStartY = 0;
        mobileNav.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        mobileNav.addEventListener('touchend', function(e) {
            let touchEndY = e.changedTouches[0].screenY;
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;

            if (diff > swipeThreshold) {
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    hamburger.classList.remove('active');
                    console.log('Swiped up. Mobile nav closed.');
                }
            }
        }, { passive: true });
    } else {
        console.error('Hamburger or Mobile Nav elements not found. Mobile menu functionality will not work.');
    }

    // Handle window resize for mobile menu - ensures menu closes if resized to desktop
    function handleResize() {
        if (window.innerWidth > 992) { // Changed to 992px to match CSS breakpoint
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
        // Update carousel on resize
        if (carouselController && carouselController.updateLayout) {
            carouselController.updateLayout();
        }
    }
    window.addEventListener('resize', handleResize);

    // --- Smooth scrolling for main navigation links ---
    // ... (rest of your script, including mainNavLinks declaration and other functions) ...
    // --- Smooth scrolling for main navigation links ---
    // Select all navigation links, including those that might go to other pages
    const mainNavLinks = document.querySelectorAll('.nav a');

    mainNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only smooth scroll for internal anchor links on the current page
            if (href.startsWith('#') && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                e.preventDefault(); // Prevent default only if smooth scrolling

                const targetId = href;
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    smoothScrollTo(targetSection);
                    // Close mobile menu if open (redundant due to mobileNavLinks handler, but safe)
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            }
            // For links like 'causes.html' or 'achievements.html', let the default behavior (page navigation) happen
        });
    });

    // --- Function to set active navigation state based on current page/scroll ---
    function setActiveNavigation() {
        const currentPath = window.location.pathname.split('/').pop(); // Gets 'index.html', 'causes.html', etc.
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;

        // Function to update active class based on scroll position
        const updateActiveOnScroll = () => {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 10; // Add some offset
                const sectionBottom = sectionTop + section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            mainNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(currentSectionId) && currentSectionId) {
                    link.classList.add('active');
                } else if ((currentPath === '' || currentPath === 'index.html') && link.getAttribute('href') === 'index.html') {
                    // Special handling for home page
                    link.classList.add('active');
                }
            });
        };

        // Initial check and on scroll
        updateActiveOnScroll();
        window.addEventListener('scroll', updateActiveOnScroll);

        // Also set active for direct page links (like causes.html)
        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (currentPath.includes(link.getAttribute('href').split('/').pop().split('.')[0]) && link.getAttribute('href') !== '#impact' && link.getAttribute('href') !== '#contact') {
                link.classList.add('active');
            }
             // Ensure "Home" is active if on index.html or root
            if ((currentPath === '' || currentPath === 'index.html') && link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            }
        });
    }

    setActiveNavigation(); // Initial call to set active state


    // --- Causes Carousel Functionality ---
    const carouselController = initializeCausesCarousel(); // Initialize and store the controller

    function initializeCausesCarousel() {
        const carousel = document.querySelector('.causes-grid');
        const carouselContainer = document.querySelector('.causes-carousel-container');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const cards = document.querySelectorAll('.cause-card');
        const progressFill = document.querySelector('.scroll-progress-fill');

        if (!carousel || !prevBtn || !nextBtn || !carouselContainer || !progressFill) return null;

        let isScrolling = false;
        let autoSlideInterval;
        let currentScrollPosition = 0;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0; // For vertical swipe detection
        let touchEndY = 0;   // For vertical swipe detection
        let isTouchDragging = false;
        let touchStartTime = 0;

        function getCardWidth() {
            const card = cards[0];
            if (!card) return 320; // Fallback value
            const cardRect = card.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(carousel);
            const gap = parseFloat(computedStyle.gap) || 24; // Ensure gap is a number
            return cardRect.width + gap;
        }

        function getMaxScroll() {
            return carousel.scrollWidth - carousel.clientWidth;
        }

        function getVisibleCards() {
            const containerWidth = carousel.clientWidth;
            const cardWidth = getCardWidth();
            return Math.floor(containerWidth / cardWidth);
        }

        function updateScrollPosition() {
            currentScrollPosition = carousel.scrollLeft;
            updateNavigationButtons();
            updateProgressBar();
            updateFadeEdges();
        }

        function updateNavigationButtons() {
            const maxScroll = getMaxScroll();
            prevBtn.disabled = currentScrollPosition <= 5; // Small buffer for pixel perfect
            nextBtn.disabled = currentScrollPosition >= maxScroll - 5; // Small buffer

            prevBtn.style.opacity = prevBtn.disabled ? '0.4' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.4' : '1';
        }

        function updateProgressBar() {
            const maxScroll = getMaxScroll();
            const progress = maxScroll > 0 ? (currentScrollPosition / maxScroll) * 100 : 0;
            progressFill.style.width = `${Math.min(progress, 100)}%`;
        }

        function updateFadeEdges() {
            const maxScroll = getMaxScroll();
            carouselContainer.classList.toggle('at-start', currentScrollPosition <= 5);
            carouselContainer.classList.toggle('at-end', currentScrollPosition >= maxScroll - 5);
        }

        function scrollToPosition(position, smooth = true) {
            if (isScrolling) return;

            isScrolling = true;
            carousel.scrollTo({
                left: position,
                behavior: smooth ? 'smooth' : 'auto'
            });

            // Set a timeout to reset isScrolling after the animation completes
            // This is a common pattern for smooth scroll animations
            setTimeout(() => {
                isScrolling = false;
                updateScrollPosition();
            }, smooth ? 600 : 100); // Match CSS transition duration for smooth scroll
        }

        function scrollByAmount(amount) {
            const newPosition = Math.max(0, Math.min(currentScrollPosition + amount, getMaxScroll()));
            scrollToPosition(newPosition);
        }

        function scrollToNextCard() {
            const cardWidth = getCardWidth();
            // Scroll by 2 cards or adjust if near end
            const scrollAmount = Math.min(cardWidth * 2, getMaxScroll() - currentScrollPosition);
            scrollByAmount(scrollAmount);
        }

        function scrollToPrevCard() {
            const cardWidth = getCardWidth();
            // Scroll by 2 cards or adjust if near beginning
            const scrollAmount = Math.max(-cardWidth * 2, -currentScrollPosition);
            scrollByAmount(scrollAmount);
        }

        function autoScroll() {
            const maxScroll = getMaxScroll();
            if (currentScrollPosition >= maxScroll - 5) { // Check with buffer
                scrollToPosition(0);
            } else {
                scrollToNextCard();
            }
        }

        function startAutoScroll() {
            // Only auto-scroll if there are more cards than can fit
            if (cards.length > getVisibleCards()) {
                if (!autoSlideInterval) { // Prevent multiple intervals
                    autoSlideInterval = setInterval(autoScroll, 5000);
                }
            } else {
                // If all cards fit, no need for auto-scroll or nav buttons
                stopAutoScroll();
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                prevBtn.style.opacity = '0.4';
                nextBtn.style.opacity = '0.4';
                progressFill.style.width = '100%'; // Full progress if all visible
            }
        }

        function stopAutoScroll() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        function resetAutoScroll() {
            stopAutoScroll();
            startAutoScroll();
        }

        function updateCarouselLayout() {
            updateScrollPosition();
            startAutoScroll(); // Re-evaluate and start/stop auto-scroll on layout change
        }

        // Mouse drag support
        function handleMouseDown(e) {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
            carousel.style.userSelect = 'none';
            stopAutoScroll();
        }

        function handleMouseMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5; // Adjust sensitivity
            carousel.scrollLeft = scrollLeft - walk;
        }

        function handleMouseUp() {
            isDragging = false;
            carousel.style.cursor = 'grab';
            carousel.style.userSelect = '';
            resetAutoScroll();
        }

        function handleMouseLeave() {
            if (isDragging) {
                handleMouseUp();
            }
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            scrollToPrevCard();
            resetAutoScroll();
            prevBtn.style.transform = 'scale(0.9)';
            setTimeout(() => { prevBtn.style.transform = ''; }, 150);
        });

        nextBtn.addEventListener('click', () => {
            scrollToNextCard();
            resetAutoScroll();
            nextBtn.style.transform = 'scale(0.9)';
            setTimeout(() => { nextBtn.style.transform = ''; }, 150);
        });

        carousel.addEventListener('mousedown', handleMouseDown);
        carousel.addEventListener('mousemove', handleMouseMove);
        carousel.addEventListener('mouseup', handleMouseUp);
        carousel.addEventListener('mouseleave', handleMouseLeave);
        carousel.addEventListener('dragstart', (e) => e.preventDefault()); // Prevent default image drag

        carousel.addEventListener('scroll', () => {
            if (!isScrolling) { // Only update if not programmatically scrolling
                updateScrollPosition();
            }
        });

        // Enhanced touch/swipe support
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY; // Store Y for vertical check
            touchStartTime = Date.now();
            isTouchDragging = true;
            stopAutoScroll();
        }, { passive: true }); // Use passive for touchstart to avoid blocking scroll

        carousel.addEventListener('touchmove', (e) => {
            if (!isTouchDragging) return;

            const currentX = e.changedTouches[0].screenX;
            const currentY = e.changedTouches[0].screenY;
            const diffX = touchStartX - currentX;
            const diffY = Math.abs(touchStartY - currentY); // Absolute difference for Y

            // Allow vertical scrolling if it's primarily a vertical swipe
            if (Math.abs(diffX) > diffY && Math.abs(diffX) > 10) { // If horizontal movement is greater than vertical and significant
                e.preventDefault(); // Prevent page scroll for horizontal swipe
                const walk = (touchStartX - currentX) * 1.5;
                carousel.scrollLeft = scrollLeft + walk; // Update scrollLeft based on initial scrollLeft
            }
        }, { passive: false }); // Needs to be non-passive to call preventDefault

        carousel.addEventListener('touchend', (e) => {
            if (!isTouchDragging) return;

            touchEndX = e.changedTouches[0].screenX;
            isTouchDragging = false;
            handleSwipeRelease(); // Call new function for release logic
            resetAutoScroll();
        }, { passive: true });

        function handleSwipeRelease() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            const swipeTime = Date.now() - touchStartTime;
            const swipeVelocity = Math.abs(touchStartX - touchEndX) / swipeTime;
            const diffX = touchStartX - touchEndX;

            if ((Math.abs(diffX) > swipeThreshold && swipeTime < 500) || swipeVelocity > 0.5) { // Fast swipe or long enough drag
                const cardWidth = getCardWidth();
                const targetCardIndex = Math.round(carousel.scrollLeft / cardWidth);
                let newScrollPosition = targetCardIndex * cardWidth;

                if (diffX > 0) { // Swiped left (want to go right)
                    newScrollPosition = (targetCardIndex + 1) * cardWidth;
                } else { // Swiped right (want to go left)
                    newScrollPosition = (targetCardIndex - 1) * cardWidth;
                }
                scrollToPosition(newScrollPosition); // Snap to nearest card
            } else {
                 // If not a strong swipe, snap to nearest card
                 const cardWidth = getCardWidth();
                 const targetCardIndex = Math.round(carousel.scrollLeft / cardWidth);
                 const newScrollPosition = targetCardIndex * cardWidth;
                 scrollToPosition(newScrollPosition);
            }
        }


        // Mouse wheel support
        carousel.addEventListener('wheel', (e) => {
            const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            const isShiftPressed = e.shiftKey;

            if (isHorizontalScroll || isShiftPressed) {
                e.preventDefault(); // Prevent vertical page scroll
                const scrollAmount = isShiftPressed ? e.deltaY : e.deltaX;
                scrollByAmount(scrollAmount * 2); // Increased sensitivity
                resetAutoScroll();
            }
        }, { passive: false }); // Needs to be non-passive to preventDefault

        // Pause auto-scroll on hover
        carouselContainer.addEventListener('mouseenter', stopAutoScroll);
        carouselContainer.addEventListener('mouseleave', startAutoScroll);

        // Focus management for accessibility
        carousel.addEventListener('focus', stopAutoScroll);
        carousel.addEventListener('blur', startAutoScroll);

        // Keyboard navigation (for the carousel itself)
        carousel.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    scrollToPrevCard();
                    resetAutoScroll();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    scrollToNextCard();
                    resetAutoScroll();
                    break;
                case 'Home':
                    e.preventDefault();
                    scrollToPosition(0);
                    resetAutoScroll();
                    break;
                case 'End':
                    e.preventDefault();
                    scrollToPosition(getMaxScroll());
                    resetAutoScroll();
                    break;
            }
        });

        // Card click handlers with improved UX
        cards.forEach((card, index) => {
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View ${card.querySelector('.cause-title').textContent} cause`);

            card.addEventListener('click', () => {
                // Scroll card into center view
                const cardWidth = getCardWidth();
                const containerWidth = carousel.clientWidth;
                const cardPosition = index * cardWidth;
                const centerPosition = cardPosition - (containerWidth / 2) + (cardWidth / 2);

                scrollToPosition(Math.max(0, Math.min(centerPosition, getMaxScroll())));
                resetAutoScroll();

                // Navigate to causes page after a short delay (if desired, currently navigating away)
                // setTimeout(() => {
                //     window.location.href = 'causes.html';
                // }, 300);
            });

            // Keyboard support for cards
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                card.style.zIndex = '10';
            });

            card.addEventListener('mouseleave', () => {
                card.style.zIndex = '';
            });
        });

        // Initial animation and Intersection Observer for cards
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.9)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.style.willChange = 'transform';
                } else {
                    entry.target.style.willChange = 'auto'; // Reset when out of view
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => cardObserver.observe(card));

        carousel.style.cursor = 'grab'; // Set default cursor

        // Initialize carousel state
        updateCarouselLayout();

        // Return controller object for external calls (like resize)
        return {
            updateLayout: updateCarouselLayout,
            scrollToCard: (index) => {
                const cardWidth = getCardWidth();
                const position = index * cardWidth;
                scrollToPosition(position);
            },
            getCurrentCard: () => {
                const cardWidth = getCardWidth();
                return Math.round(currentScrollPosition / cardWidth);
            }
        };
    }


    // --- Add functionality for social media icons in footer ---
    const footerSocialIcons = document.querySelectorAll('.footer .social-icon');
    footerSocialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            let url = '';

            switch(platform) {
                case 'facebook':
                    url = 'https://facebook.com/srivinayakafoundation';
                    break;
                case 'instagram':
                    url = 'https://instagram.com/srivinayakafoundation';
                    break;
                case 'twitter':
                    url = 'https://twitter.com/srivinayakafoundation';
                    break;
                case 'linkedin':
                    url = 'https://linkedin.com/company/srivinayakafoundation';
                    break;
            }
            if (url) { window.open(url, '_blank'); }
            this.style.transform = 'scale(0.95) translateY(-2px)';
            setTimeout(() => { this.style.transform = ''; }, 200);
        });
        icon.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-3px)'; });
        icon.addEventListener('mouseleave', function() { this.style.transform = ''; });
    });


    // --- Add click handlers for all donate buttons (excluding the one in mobile nav that behaves differently) ---
    const allDonateButtons = document.querySelectorAll('button.donate-btn:not(.mobile-nav .donate-btn), .donate-btn-overlay');
    allDonateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent parent clicks if nested

            const cause = this.getAttribute('data-cause'); // Get cause from data-attribute if present
            if (cause) {
                localStorage.setItem('selectedCause', cause);
            } else {
                localStorage.removeItem('selectedCause'); // Clear if no specific cause
            }

            // Add click animation
            this.style.transform = this.classList.contains('donate-btn-overlay') ? 'translateX(-50%) scale(0.95)' : 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = this.classList.contains('donate-btn-overlay') ? 'translateX(-50%) translateY(0)' : '';
            }, 150);

            window.location.href = 'donate.html'; // Redirect to donation page
        });

        // Enhanced hover effects for all main donate buttons
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });


    // --- Add hover effects for cause cards (general) ---
    const existingCauseCards = document.querySelectorAll('.cause-card');
    existingCauseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)'; // Unified transform for consistency
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';

            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'card-ripple';
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 152, 105, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
                pointer-events: none;
                z-index: 1;
            `;
            this.appendChild(ripple);
            setTimeout(() => {
                const size = Math.max(this.offsetWidth, this.offsetHeight) * 2; // Cover the whole card
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
            }, 10);
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';

            // Remove ripple effect
            const ripple = this.querySelector('.card-ripple');
            if (ripple) {
                ripple.style.opacity = '0';
                setTimeout(() => {
                    if (ripple.parentNode) { ripple.parentNode.removeChild(ripple); }
                }, 300);
            }
        });

        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98) translateY(-8px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }, 150);
        });
    });


    // --- Make cause cards clickable to navigate to the causes page ---
    // (Existing behavior of "scrolling to causes section" is removed as per prompt update implicitly)
    const clickableCauseCards = document.querySelectorAll('.cause-card');
    clickableCauseCards.forEach(card => {
        // Card click now also navigates to causes.html unless specifically overridden by overlay button
        card.addEventListener('click', function(e) {
            // Check if the click originated from the donate button overlay
            if (e.target.closest('.donate-btn-overlay')) {
                return; // Let the donate button handle it
            }
            window.location.href = 'causes.html'; // Navigate to the causes page
        });
    });


    // --- Add scroll animation for stats section ---
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && !statValue.dataset.animated) {
                    animateCounter(statValue);
                    statValue.dataset.animated = 'true';
                }
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                statsObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    function animateCounter(element) {
        const text = element.textContent;
        const hasLakh = text.includes('Lakh');
        const hasCr = text.includes('Cr');
        const hasRupee = text.includes('₹');

        let numberStr = text.replace(/[^\d.]/g, '');
        let targetNumber = parseFloat(numberStr);

        if (isNaN(targetNumber)) return;

        let currentNumber = 0;
        const duration = 2000; // 2 seconds
        const steps = 100; // More steps for smoother animation
        const increment = targetNumber / steps;
        let stepCount = 0;

        const timer = setInterval(() => {
            currentNumber += increment;
            stepCount++;

            if (stepCount >= steps) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }

            let displayNumber = currentNumber.toFixed(2);
            if (hasCr || hasLakh) {
                 // Adjust decimal places for large numbers, remove trailing .00
                displayNumber = parseFloat(displayNumber).toLocaleString('en-IN', {
                    minimumFractionDigits: (displayNumber % 1 === 0) ? 0 : 2, // No .00 for whole numbers
                    maximumFractionDigits: 2
                });
            } else {
                displayNumber = Math.round(currentNumber).toLocaleString('en-IN');
            }


            let displayText = displayNumber;

            if (hasRupee) displayText = '₹' + displayText;
            if (hasCr) displayText += ' Cr+';
            else if (hasLakh) displayText += ' Lakh+';
            else if (!hasRupee) displayText += '+'; // Add + for non-rupee numbers (like active donors)

            element.textContent = displayText;
        }, duration / steps);
    }

    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease, background 0.3s ease, box-shadow 0.3s ease';
        statsObserver.observe(item);
    });


    // --- Add scroll animations for other sections ---
    const animatedSections = document.querySelectorAll('.about, .impact, .transparency, .contact');
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    sectionObserver.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.1 });

        sectionObserver.observe(section);
    });


    // --- Enhanced loading animation and progress bar ---
    // Remove the body opacity manipulation here to avoid FOUC (Flash of Unstyled Content)
    // The CSS should handle initial hidden state if needed.
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10; // Slightly faster random increase
        if (progress > 95) progress = 95; // Stop before 100 to make the load event finish it
        progressBar.querySelector('.progress-fill').style.width = progress + '%';
    }, 80); // Quicker updates

    window.addEventListener('load', function() {
        clearInterval(progressInterval);
        progressBar.querySelector('.progress-fill').style.width = '100%';

        setTimeout(() => {
            progressBar.style.opacity = '0';
            setTimeout(() => {
                if (progressBar.parentNode) {
                    document.body.removeChild(progressBar);
                }
            }, 500); // Wait for fade-out
        }, 300); // A small delay to ensure 100% width is visible
    });


    // --- Custom Smooth Scroll Function (improved) ---
    function smoothScrollTo(targetElement, duration = 800) {
        const headerOffset = document.querySelector('.header').offsetHeight || 96; // Use actual header height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1); // Clamp progress to 0-1
            const ease = easeInOutQuad(progress); // Use normalized progress for easing

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        // Easing function: Quad (power of 2) - ease in/out
        function easeInOutQuad(t) {
            t *= 2;
            if (t < 1) return 0.5 * t * t;
            return -0.5 * (--t * (t - 2) - 1);
        }

        requestAnimationFrame(animation);
    }


    // --- Add parallax effect to hero section ---
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');

    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3; // Less intense parallax

            // Only apply parallax if hero is in view
            if (scrolled < hero.offsetHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        }, { passive: true }); // Use passive for scroll event listeners
    }


    // --- Add intersection observer for impact gallery images (staggered animation) ---
    const impactImages = document.querySelectorAll('.impact-image');
    const impactImageObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Get delay from index for staggered effect, but apply only once
                const index = Array.from(impactImages).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }, index * 150); // Stagger by 150ms
                impactImageObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.2 });

    impactImages.forEach(image => {
        image.style.opacity = '0';
        image.style.transform = 'scale(0.8)';
        image.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        impactImageObserver.observe(image);
    });


    // --- Add scroll-to-top button ---
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;
    scrollToTopBtn.title = 'Back to top';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }

        // Add scroll progress indicator
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollHeight > 0 ? (window.pageYOffset / scrollHeight) * 100 : 0;
        scrollToTopBtn.style.background = `conic-gradient(#ff9869 ${scrollProgress}%, rgba(255, 152, 105, 0.2) ${scrollProgress}%)`;
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => { this.style.transform = ''; }, 150);
        smoothScrollTo(document.body, 800);
    });


    // --- Quick Contact form functionality ---
    const quickContactForm = document.getElementById('quickContactForm');
    const quickFormSuccess = document.getElementById('quickFormSuccess');

    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(quickContactForm);
            const data = Object.fromEntries(formData);

            const requiredFields = ['name', 'email', 'phone', 'address', 'caseDescription'];
            let isValid = true;

            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                } else {
                    input.style.borderColor = '#22c55e';
                    input.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                }
            });

            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                document.getElementById('email').style.borderColor = '#ef4444';
                document.getElementById('email').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const submitBtn = quickContactForm.querySelector('.send-message-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            submitBtn.style.background = '#9ca3af';

            // Simulate form submission
            setTimeout(() => {
                console.log('Form submitted:', data);

                quickContactForm.style.display = 'none';
                quickFormSuccess.style.display = 'block';

                showNotification('Message sent successfully!', 'success');

                setTimeout(() => {
                    quickContactForm.reset();
                    quickContactForm.style.display = 'flex';
                    quickFormSuccess.style.display = 'none';

                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                    submitBtn.style.background = ''; // Reset to CSS default for primary color

                    const inputs = quickContactForm.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        input.style.borderColor = '#d1d5db';
                        input.style.boxShadow = 'none';
                    });
                }, 3000); // Hide success after 3 seconds, then show form again

            }, 2000); // Simulate 2 second processing time
        });

        // Real-time validation and focus effects for form fields
        const formInputs = quickContactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(this.value)) {
                        this.style.borderColor = '#22c55e';
                        this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                    } else {
                        this.style.borderColor = '#ef4444';
                        this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    }
                } else if (this.value.trim()) {
                    this.style.borderColor = '#22c55e';
                    this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                } else {
                    this.style.borderColor = '#d1d5db';
                    this.style.boxShadow = 'none';
                }
                this.parentElement.style.transform = 'translateY(0)'; // Reset parent transform on blur
            });

            input.addEventListener('focus', function() {
                this.style.borderColor = '#3b82f6';
                this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 15px rgba(59, 130, 246, 0.1)';
                this.parentElement.style.transform = 'translateY(-2px)'; // Animate parent on focus
            });
        });
    }


    // --- Notification system ---
    function showNotification(message, type = 'info') {
        const notificationContainer = document.querySelector('.notification-container') || (() => {
            const div = document.createElement('div');
            div.classList.add('notification-container');
            // Style this container in your CSS to position correctly (e.g., flex column reverse)
            Object.assign(div.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '10000',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'flex-end'
            });
            document.body.appendChild(div);
            return div;
        })();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        notificationContainer.prepend(notification); // Add to top for stack effect

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);

        // Auto-hide
        const timeout = setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        }, 5000); // Hide after 5 seconds

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout); // Clear auto-hide
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        });
    }


    // --- Add click functionality for contact options ---
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionType = this.classList[1];

            switch(optionType) {
                case 'whatsapp':
                    window.open('https://wa.me/919876543210', '_blank');
                    break;
                case 'instagram':
                    window.open('https://instagram.com/srivinayakafoundation', '_blank');
                    break;
                case 'phone':
                    window.location.href = 'tel:+919876543210';
                    break;
                case 'email':
                    window.location.href = 'mailto:office@vinayaka.foundation';
                    break;
                case 'address':
                    window.open('https://maps.google.com/?q=No.6,+Dhanammal+Street,Spurtank+Road,Chetpet,Chennai+600-031', '_blank'); // Direct link for address
                    break;
            }

            this.style.transform = 'scale(0.98)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 150);
        });

        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
        });
    });


    // --- Performance optimizations ---
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) { clearTimeout(scrollTimeout); }
        scrollTimeout = setTimeout(() => {
            // Place less critical, scroll-dependent functions here
        }, 10);
    }, { passive: true }); // Use passive for better scroll performance

    // Preload images
    const imageUrls = [
        '/rectangle-4.png',
        'https://i.postimg.cc/TwwNxr7c/IMG20250113155454-01.jpg', // Food & Nutrition
        'https://i.postimg.cc/MXk91gWs/IMG20250413124518-01.jpg', // Animal Rescue & Care
        'https://i.postimg.cc/3N0L43H4/IMG20250420095631-01.jpg', // Orphanage Care & Support
        'https://i.postimg.cc/44KZbtft/IMG20250429180424.jpg', // Education for Children
        'https://i.postimg.cc/LXbZfvQb/IMG20240218142551-01.jpg', // Impact Image 1
        'https://i.postimg.cc/z3mb2vrw/IMG20241002175844.jpg', // Impact Image 2
        'https://i.postimg.cc/tJnnzPLC/IMG20250125181706-01.jpg', // Impact Image 3
        '/image-3.png', // Transparency Icon
        '/rectangle-16.png' // Background Image Section
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Add reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Keyboard navigation for global elements (e.g., ESC for modal, Enter for buttons)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.donation-modal');
            if (modal && modal.style.display === 'block') {
                modal.querySelector('.modal-close').click();
            }
        }
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON' && !e.target.disabled) {
            e.target.click();
        }
        if (e.key === ' ' && e.target === scrollToTopBtn) {
            e.preventDefault(); // Prevent page scroll when space is pressed on button
            scrollToTopBtn.click();
        }
    });
});