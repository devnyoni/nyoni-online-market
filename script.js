// Main JavaScript for Nyoni Online Market
document.addEventListener('DOMContentLoaded', function() {
    // Initialize website
    initWebsite();
    
    // Load all data
    loadAllData();
    
    // Setup event listeners
    setupEventListeners();
});

function initWebsite() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

async function loadAllData() {
    try {
        // Load services
        await loadServices();
        
        // Load portfolio
        await loadPortfolio();
        
        // Load social media
        await loadSocialMedia();
        
        // Load footer social links
        await loadFooterSocial();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage('Failed to load website data. Please try again later.');
    }
}

async function loadServices() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        
        const container = document.getElementById('servicesContainer');
        if (!container) return;
        
        container.innerHTML = data.services.map(service => `
            <div class="service-card">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="service-features">
                    ${service.features.map(feature => `
                        <span><i class="fas fa-check"></i> ${feature}</span>
                    `).join('')}
                </div>
                <div class="service-price">
                    <h4>Starting from <span class="price">${service.price}</span></h4>
                </div>
                <a href="#contact" class="service-btn" data-service="${service.title}">Order Now</a>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('servicesContainer').innerHTML = `
            <div class="error-message">
                <p>Unable to load services. Please check your connection.</p>
            </div>
        `;
    }
}

async function loadPortfolio() {
    try {
        const response = await fetch('data/designs.json');
        const data = await response.json();
        
        const container = document.getElementById('portfolioContainer');
        if (!container) return;
        
        container.innerHTML = data.designs.map(design => `
            <div class="portfolio-item" data-category="${design.category}">
                <div class="portfolio-img">
                    <img src="${design.image}" alt="${design.title}" onerror="this.src='assets/images/design-sample.jpg'">
                </div>
                <div class="portfolio-info">
                    <h3>${design.title}</h3>
                    <p>${design.description}</p>
                    <span class="portfolio-category">${design.category}</span>
                </div>
            </div>
        `).join('');
        
        // Setup filter buttons
        setupPortfolioFilter();
        
    } catch (error) {
        console.error('Error loading portfolio:', error);
        document.getElementById('portfolioContainer').innerHTML = `
            <div class="error-message">
                <p>Unable to load portfolio. Please check your connection.</p>
            </div>
        `;
    }
}

function setupPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

async function loadSocialMedia() {
    try {
        const response = await fetch('data/social.json');
        const data = await response.json();
        
        const container = document.getElementById('socialContainer');
        if (!container) return;
        
        container.innerHTML = data.platforms.map(platform => `
            <div class="social-card ${platform.name.toLowerCase()}">
                <div class="social-icon">
                    <i class="${platform.icon}"></i>
                </div>
                <h3>${platform.name}</h3>
                <p>${platform.description}</p>
                ${platform.stats ? `
                    <div class="social-stats">
                        ${platform.stats.map(stat => `
                            <span><i class="${stat.icon}"></i> ${stat.value}</span>
                        `).join('')}
                    </div>
                ` : ''}
                <a href="${platform.url}" target="_blank" class="social-btn">
                    <i class="${platform.icon}"></i> ${platform.buttonText}
                </a>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading social media:', error);
        document.getElementById('socialContainer').innerHTML = `
            <div class="error-message">
                <p>Unable to load social media links. Please check your connection.</p>
            </div>
        `;
    }
}

async function loadFooterSocial() {
    try {
        const response = await fetch('data/social.json');
        const data = await response.json();
        
        const container = document.querySelector('.social-links');
        if (!container) return;
        
        container.innerHTML = data.platforms.map(platform => `
            <a href="${platform.url}" target="_blank" title="${platform.name}">
                <i class="${platform.icon}"></i>
            </a>
        `).join('');
        
    } catch (error) {
        console.error('Error loading footer social:', error);
    }
}

function setupEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Phone number click to copy
    document.querySelectorAll('.phone-number').forEach(phone => {
        phone.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            copyToClipboard(number);
        });
    });
    
    // Service order buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('service-btn')) {
            e.preventDefault();
            const service = e.target.getAttribute('data-service');
            scrollToContact(service);
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.querySelector('input[type="text"]').value,
        phone: form.querySelector('input[placeholder*="WhatsApp"]').value,
        service: form.querySelector('select').value,
        message: form.querySelector('textarea').value,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for admin
    saveContactInquiry(formData);
    
    // Send via WhatsApp
    sendWhatsAppMessage(formData);
    
    // Reset form
    form.reset();
    
    // Show success message
    showSuccessMessage('Message sent! Opening WhatsApp...');
}

function saveContactInquiry(data) {
    try {
        // Get existing inquiries or create new array
        const inquiries = JSON.parse(localStorage.getItem('nyoniInquiries')) || [];
        
        // Add new inquiry
        inquiries.push(data);
        
        // Save back to localStorage
        localStorage.setItem('nyoniInquiries', JSON.stringify(inquiries));
        
        // Update statistics
        updateStatistics();
        
    } catch (error) {
        console.error('Error saving inquiry:', error);
    }
}

function updateStatistics() {
    // This would update the statistics in admin panel
    // For now, we'll just increment in localStorage
    const stats = JSON.parse(localStorage.getItem('nyoniStats')) || {
        inquiries: 0,
        orders: 0,
        revenue: 0
    };
    
    stats.inquiries = (stats.inquiries || 0) + 1;
    localStorage.setItem('nyoniStats', JSON.stringify(stats));
}

function sendWhatsAppMessage(data) {
    const whatsappNumber = '255610209120';
    const message = `*NEW INQUIRY FROM WEBSITE*%0A%0A` +
                   `*Name:* ${data.name}%0A` +
                   `*Phone:* ${data.phone}%0A` +
                   `*Service:* ${data.service}%0A` +
                   `*Message:* ${data.message}%0A%0A` +
                   `*Website:* Nyoni Online Market`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

function scrollToContact(service) {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        // Auto-select service in dropdown
        const serviceSelect = document.querySelector('#contactForm select');
        if (serviceSelect) {
            serviceSelect.value = service.toLowerCase().includes('bot') ? 'bot' : 
                                 service.toLowerCase().includes('design') ? 'design' : 'consultation';
        }
        
        // Scroll to contact section
        window.scrollTo({
            top: contactSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccessMessage(`Phone number copied: ${text}`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showErrorMessage('Failed to copy phone number');
    });
}

function showSuccessMessage(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            }
            .notification.success {
                border-left: 4px solid #00d95f;
            }
            .notification.error {
                border-left: 4px solid #ff4757;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slideOut animation to style
if (document.querySelector('#notification-styles')) {
    const style = document.querySelector('#notification-styles');
    style.textContent += `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add loaded class for animations
    document.body.classList.add('loaded');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('nyoniTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});
