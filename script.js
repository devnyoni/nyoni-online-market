 // Main JavaScript for Nyoni Online Market

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Load designs from JSON
    loadDesigns();

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                phone: this.querySelector('input[placeholder*="WhatsApp"]').value,
                service: this.querySelector('select').value,
                message: this.querySelector('textarea').value
            };

            // Send via WhatsApp
            const whatsappNumber = '255610209120';
            const message = `*NEW ORDER FROM WEBSITE*\n\n` +
                          `Name: ${formData.name}\n` +
                          `Phone: ${formData.phone}\n` +
                          `Service: ${formData.service}\n` +
                          `Message: ${formData.message}\n\n` +
                          `Website: Nyoni Online Market`;
            
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            
            // Reset form
            this.reset();
            
            // Show success message
            alert('Message sent! Opening WhatsApp...');
        });
    }

    // Copy WhatsApp number function
    window.copyNumber = function(number) {
        navigator.clipboard.writeText(number).then(() => {
            alert('Phone number copied to clipboard: ' + number);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Order bot function
    window.orderBot = function(botType) {
        const whatsappNumber = '255610209120';
        const message = `*BOT ORDER REQUEST*\n\n` +
                       `Bot Type: ${botType}\n` +
                       `Price: ${botType === 'Basic' ? '3,000 Tsh' : botType === 'Premium' ? '5,000 Tsh' : '10,000 Tsh'}\n\n` +
                       `I want to order ${botType} WhatsApp Bot from your website.`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    // Filter designs
    window.filterDesigns = function(category) {
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const designs = document.querySelectorAll('.design-card');
        designs.forEach(design => {
            if (category === 'all' || design.dataset.category === category) {
                design.style.display = 'block';
            } else {
                design.style.display = 'none';
            }
        });
    };

    // Initialize animations
    initAnimations();
});

// Load designs from JSON
async function loadDesigns() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        displayDesigns(data.designs);
    } catch (error) {
        console.error('Error loading designs:', error);
        // Fallback designs
        const fallbackDesigns = [
            {
                id: 1,
                title: "Business Logo Design",
                description: "Professional logo for your business",
                category: "logo",
                image: "https://via.placeholder.com/400x250/667eea/ffffff?text=Logo+Design"
            },
            {
                id: 2,
                title: "Social Media Banner",
                description: "Eye-catching banner for social media",
                category: "banner",
                image: "https://via.placeholder.com/400x250/764ba2/ffffff?text=Social+Banner"
            },
            {
                id: 3,
                title: "Instagram Post Design",
                description: "Creative posts for Instagram",
                category: "social",
                image: "https://via.placeholder.com/400x250/ff6b6b/ffffff?text=Instagram+Post"
            },
            {
                id: 4,
                title: "Business Card",
                description: "Professional business card design",
                category: "business",
                image: "https://via.placeholder.com/400x250/25D366/ffffff?text=Business+Card"
            }
        ];
        displayDesigns(fallbackDesigns);
    }
}

function displayDesigns(designs) {
    const container = document.getElementById('designsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    designs.forEach(design => {
        const designCard = document.createElement('div');
        designCard.className = 'design-card';
        designCard.dataset.category = design.category;
        
        designCard.innerHTML = `
            <div class="design-image">
                <img src="${design.image}" alt="${design.title}" onerror="this.src='https://via.placeholder.com/400x250/ccc/333?text=Design+Image'">
            </div>
            <div class="design-info">
                <h3>${design.title}</h3>
                <p>${design.description}</p>
                <span class="design-category">${design.category}</span>
            </div>
        `;
        
        container.appendChild(designCard);
    });
}

// Initialize animations
function initAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.service-card, .social-card, .design-card').forEach(el => {
        observer.observe(el);
    });
}

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
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
