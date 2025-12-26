 // Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initAdminPanel();
    
    // Load dashboard data
    loadDashboardData();
    
    // Load all data
    loadAllData();
    
    // Setup event listeners
    setupAdminListeners();
});

function initAdminPanel() {
    // Tab navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get tab id
            const tabId = this.getAttribute('data-tab');
            
            // Update page title
            document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;
            
            // Show corresponding tab
            showTab(tabId);
        });
    });
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            const sidebar = document.querySelector('.sidebar');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

async function loadDashboardData() {
    try {
        // Load statistics
        const stats = JSON.parse(localStorage.getItem('nyoniStats')) || {
            visitors: 1250,
            inquiries: 48,
            orders: 25,
            revenue: 245000
        };
        
        document.getElementById('totalVisitors').textContent = stats.visitors.toLocaleString();
        document.getElementById('totalInquiries').textContent = stats.inquiries;
        document.getElementById('totalOrders').textContent = stats.orders;
        document.getElementById('totalRevenue').textContent = stats.revenue.toLocaleString();
        
        // Load recent activity
        await loadRecentActivity();
        
        // Load notification count
        updateNotificationCount();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadRecentActivity() {
    try {
        // Load inquiries from localStorage
        const inquiries = JSON.parse(localStorage.getItem('nyoniInquiries')) || [];
        
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        // Get last 5 activities
        const recentActivities = inquiries.slice(-5).reverse();
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = '<p class="no-data">No recent activity</p>';
            return;
        }
        
        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="activity-info">
                    <h4>New Inquiry from ${activity.name}</h4>
                    <p>Service: ${activity.service}</p>
                    <p class="activity-time">${formatDate(activity.timestamp)}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

function updateNotificationCount() {
    const inquiries = JSON.parse(localStorage.getItem('nyoniInquiries')) || [];
    const unreadCount = inquiries.filter(inquiry => !inquiry.read).length;
    
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

async function loadAllData() {
    try {
        // Load services
        await loadServices();
        
        // Load designs
        await loadDesigns();
        
        // Load ads
        await loadAds();
        
        // Load social media
        await loadSocialMediaForm();
        
        // Load settings
        await loadSettingsForm();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Failed to load data. Please check your connection.', 'error');
    }
}

// Services Management
async function loadServices() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        
        const container = document.getElementById('servicesList');
        if (!container) return;
        
        container.innerHTML = data.services.map(service => `
            <div class="service-item" data-id="${service.id}">
                <div class="item-header">
                    <h3>${service.title}</h3>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="editService('${service.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="delete-btn" onclick="deleteService('${service.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <p>${service.description}</p>
                <div class="item-price">${service.price}</div>
                <div class="service-features">
                    ${service.features.map(feature => `
                        <span><i class="fas fa-check"></i> ${feature}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('servicesList').innerHTML = '<p class="no-data">Failed to load services</p>';
    }
}

function showServiceForm() {
    document.getElementById('serviceForm').style.display = 'block';
}

function hideServiceForm() {
    document.getElementById('serviceForm').style.display = 'none';
    clearServiceForm();
}

function clearServiceForm() {
    document.getElementById('serviceTitle').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceIcon').value = 'fas fa-robot';
    document.getElementById('serviceFeatures').value = '';
}

async function saveService() {
    const service = {
        id: Date.now().toString(),
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        price: document.getElementById('servicePrice').value,
        icon: document.getElementById('serviceIcon').value,
        features: document.getElementById('serviceFeatures').value.split('\n').filter(f => f.trim())
    };
    
    if (!service.title || !service.description || !service.price) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        // Load existing services
        const response = await fetch('../data/products.json');
        const data = await response.json();
        
        // Add new service
        data.services.push(service);
        
        // Save back to file (in real app, this would be a server request)
        // For now, we'll update localStorage
        localStorage.setItem('nyoniServices', JSON.stringify(data.services));
        
        // Update UI
        await loadServices();
        
        // Hide form
        hideServiceForm();
        
        showNotification('Service saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving service:', error);
        showNotification('Failed to save service', 'error');
    }
}

function editService(serviceId) {
    // Implementation for editing service
    showNotification('Edit feature coming soon!', 'info');
}

function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    // Implementation for deleting service
    showNotification('Delete feature coming soon!', 'info');
}

// Designs Management
async function loadDesigns() {
    try {
        const response = await fetch('../data/designs.json');
        const data = await response.json();
        
        const container = document.getElementById('designsGrid');
        if (!container) return;
        
        container.innerHTML = data.designs.map(design => `
            <div class="design-item" data-id="${design.id}">
                <img src="${design.image}" alt="${design.title}" onerror="this.src='../assets/images/design-sample.jpg'">
                <div class="item-header">
                    <h3>${design.title}</h3>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="editDesign('${design.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteDesign('${design.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>${design.description}</p>
                <span class="design-category">${design.category}</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading designs:', error);
        document.getElementById('designsGrid').innerHTML = '<p class="no-data">Failed to load designs</p>';
    }
}

function showDesignForm() {
    document.getElementById('designForm').style.display = 'block';
}

function hideDesignForm() {
    document.getElementById('designForm').style.display = 'none';
    clearDesignForm();
}

function clearDesignForm() {
    document.getElementById('designTitle').value = '';
    document.getElementById('designDescription').value = '';
    document.getElementById('designCategory').value = 'logo';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageInput').value = '';
}

async function saveDesign() {
    const design = {
        id: Date.now().toString(),
        title: document.getElementById('designTitle').value,
        description: document.getElementById('designDescription').value,
        category: document.getElementById('designCategory').value,
        image: '' // Will be set after image upload
    };
    
    if (!design.title || !design.description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Handle image upload
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            design.image = e.target.result;
            
            try {
                // Load existing designs
                const response = await fetch('../data/designs.json');
                const data = await response.json();
                
                // Add new design
                data.designs.push(design);
                
                // Save to localStorage
                localStorage.setItem('nyoniDesigns', JSON.stringify(data.designs));
                
                // Update UI
                await loadDesigns();
                
                // Hide form
                hideDesignForm();
                
                showNotification('Design saved successfully!', 'success');
                
            } catch (error) {
                console.error('Error saving design:', error);
                showNotification('Failed to save design', 'error');
            }
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        showNotification('Please upload an image', 'error');
    }
}

function editDesign(designId) {
    showNotification('Edit feature coming soon!', 'info');
}

function deleteDesign(designId) {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    showNotification('Delete feature coming soon!', 'info');
}

// Ads Management
async function loadAds() {
    try {
        const response = await fetch('../data/ads.json');
        const data = await response.json();
        
        const container = document.getElementById('adsList');
        if (!container) return;
        
        container.innerHTML = data.ads.map(ad => `
            <div class="ad-item" data-id="${ad.id}">
                <div class="item-header">
                    <h3>${ad.title}</h3>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="editAd('${ad.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteAd('${ad.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>${ad.content}</p>
                <div class="ad-info">
                    <span>Type: ${ad.type}</span>
                    <span>Expires: ${ad.expiry || 'Never'}</span>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading ads:', error);
        document.getElementById('adsList').innerHTML = '<p class="no-data">Failed to load ads</p>';
    }
}

function showAdForm() {
    document.getElementById('adForm').style.display = 'block';
}

function hideAdForm() {
    document.getElementById('adForm').style.display = 'none';
    clearAdForm();
}

function clearAdForm() {
    document.getElementById('adTitle').value = '';
    document.getElementById('adContent').value = '';
    document.getElementById('adType').value = 'promo';
    document.getElementById('adExpiry').value = '';
}

async function saveAd() {
    const ad = {
        id: Date.now().toString(),
        title: document.getElementById('adTitle').value,
        content: document.getElementById('adContent').value,
        type: document.getElementById('adType').value,
        expiry: document.getElementById('adExpiry').value,
        created: new Date().toISOString(),
        active: true
    };
    
    if (!ad.title || !ad.content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        // Load existing ads
        const response = await fetch('../data/ads.json');
        const data = await response.json();
        
        // Add new ad
        data.ads.push(ad);
        
        // Save to localStorage
        localStorage.setItem('nyoniAds', JSON.stringify(data.ads));
        
        // Update UI
        await loadAds();
        
        // Hide form
        hideAdForm();
        
        showNotification('Advertisement saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving ad:', error);
        showNotification('Failed to save advertisement', 'error');
    }
}

function editAd(adId) {
    showNotification('Edit feature coming soon!', 'info');
}

function deleteAd(adId) {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    
    showNotification('Delete feature coming soon!', 'info');
}

// Social Media Management
async function loadSocialMediaForm() {
    try {
        const response = await fetch('../data/social.json');
        const data = await response.json();
        
        // Load platform data into form
        data.platforms.forEach(platform => {
            const inputId = `${platform.name.toLowerCase()}Url`;
            const input = document.getElementById(inputId);
            if (input) {
                input.value = platform.url || '';
            }
        });
        
        // Load WhatsApp channel
        const channelInput = document.getElementById('whatsappChannel');
        if (channelInput && data.whatsappChannel) {
            channelInput.value = data.whatsappChannel;
        }
        
    } catch (error) {
        console.error('Error loading social media:', error);
    }
}

async function saveSocialLinks() {
    try {
        // Load existing social data
        const response = await fetch('../data/social.json');
        const data = await response.json();
        
        // Update URLs
        data.platforms.forEach(platform => {
            const inputId = `${platform.name.toLowerCase()}Url`;
            const input = document.getElementById(inputId);
            if (input) {
                platform.url = input.value;
            }
        });
        
        // Update WhatsApp channel
        const channelInput = document.getElementById('whatsappChannel');
        if (channelInput) {
            data.whatsappChannel = channelInput.value;
        }
        
        // Save to localStorage
        localStorage.setItem('nyoniSocial', JSON.stringify(data));
        
        showNotification('Social media links saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving social links:', error);
        showNotification('Failed to save social links', 'error');
    }
}

// Settings Management
async function loadSettingsForm() {
    try {
        const response = await fetch('../data/config.json');
        const data = await response.json();
        
        // Load settings into form
        document.getElementById('siteTitle').value = data.siteTitle || '';
        document.getElementById('siteDescription').value = data.siteDescription || '';
        document.getElementById('primaryColor').value = data.colors?.primary || '#ff6b6b';
        document.getElementById('secondaryColor').value = data.colors?.secondary || '#1a1a2e';
        document.getElementById('contactEmail').value = data.contactEmail || '';
        document.getElementById('phoneNumbers').value = data.phoneNumbers?.join(', ') || '';
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings() {
    const settings = {
        siteTitle: document.getElementById('siteTitle').value,
        siteDescription: document.getElementById('siteDescription').value,
        colors: {
            primary: document.getElementById('primaryColor').value,
            secondary: document.getElementById('secondaryColor').value
        },
        contactEmail: document.getElementById('contactEmail').value,
        phoneNumbers: document.getElementById('phoneNumbers').value
            .split(',')
            .map(num => num.trim())
            .filter(num => num)
    };
    
    try {
        // Load existing config
        const response = await fetch('../data/config.json');
        const data = await response.json();
        
        // Update with new settings
        const updatedConfig = { ...data, ...settings };
        
        // Save to localStorage
        localStorage.setItem('nyoniConfig', JSON.stringify(updatedConfig));
        
        showNotification('Settings saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save settings', 'error');
    }
}

// Data Backup & Restore
function exportAllData() {
    // Get all data
    const data = {
        services: JSON.parse(localStorage.getItem('nyoniServices')) || [],
        designs: JSON.parse(localStorage.getItem('nyoniDesigns')) || [],
        ads: JSON.parse(localStorage.getItem('nyoniAds')) || [],
        social: JSON.parse(localStorage.getItem('nyoniSocial')) || {},
        config: JSON.parse(localStorage.getItem('nyoniConfig')) || {},
        inquiries: JSON.parse(localStorage.getItem('nyoniInquiries')) || [],
        stats: JSON.parse(localStorage.getItem('nyoniStats')) || {},
        exportDate: new Date().toISOString()
    };
    
    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nyoni-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('All data exported successfully!', 'success');
}

function exportData(type) {
    let data;
    let filename;
    
    switch(type) {
        case 'services':
            data = JSON.parse(localStorage.getItem('nyoniServices')) || [];
            filename = 'nyoni-services.json';
            break;
        case 'designs':
            data = JSON.parse(localStorage.getItem('nyoniDesigns')) || [];
            filename = 'nyoni-designs.json';
            break;
        case 'ads':
            data = JSON.parse(localStorage.getItem('nyoniAds')) || [];
            filename = 'nyoni-ads.json';
            break;
        default:
            return;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${type} exported successfully!`, 'success');
}

function importData() {
    const fileInput = document.getElementById('importFile');
    if (!fileInput.files[0]) {
        showNotification('Please select a file to import', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Determine data type and import
            if (data.services) {
                localStorage.setItem('nyoniServices', JSON.stringify(data.services));
            }
            if (data.designs) {
                localStorage.setItem('nyoniDesigns', JSON.stringify(data.designs));
            }
            if (data.ads) {
                localStorage.setItem('nyoniAds', JSON.stringify(data.ads));
            }
            if (data.social) {
                localStorage.setItem('nyoniSocial', JSON.stringify(data.social));
            }
            if (data.config) {
                localStorage.setItem('nyoniConfig', JSON.stringify(data.config));
            }
            
            showNotification('Data imported successfully!', 'success');
            
            // Reload all data
            loadAllData();
            
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Invalid file format', 'error');
        }
    };
    
    reader.readAsText(fileInput.files[0]);
}

function clearAllData() {
    if (!confirm('WARNING: This will delete ALL data. Are you absolutely sure?')) return;
    
    if (confirm('Are you REALLY sure? This cannot be undone!')) {
        // Clear all localStorage data
        localStorage.removeItem('nyoniServices');
        localStorage.removeItem('nyoniDesigns');
        localStorage.removeItem('nyoniAds');
        localStorage.removeItem('nyoniSocial');
        localStorage.removeItem('nyoniConfig');
        localStorage.removeItem('nyoniInquiries');
        localStorage.removeItem('nyoniStats');
        
        showNotification('All data has been cleared!', 'success');
        
        // Reload data
        loadAllData();
    }
}

// Helper Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not exists
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
                gap: 15px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification.success {
                border-left: 4px solid #00d95f;
            }
            .notification.error {
                border-left: 4px solid #ff4757;
            }
            .notification.info {
                border-left: 4px solid #4facfe;
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification.success i {
                color: #00d95f;
            }
            .notification.error i {
                color: #ff4757;
            }
            .notification.info i {
                color: #4facfe;
            }
            .notification button {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function setupAdminListeners() {
    // Image preview for design upload
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin session (in real app, you would clear token/cookie)
        localStorage.removeItem('adminToken');
        window.location.href = '../index.html';
    }
}

// Open specific tab from URL hash
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showTab(hash);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-tab') === hash) {
                link.classList.add('active');
                document.getElementById('pageTitle').textContent = link.querySelector('span').textContent;
            }
        });
    }
});

// Initialize on load
if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showTab(hash);
    }
                              }
