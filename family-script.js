// FamHub - Family Homepage JavaScript 2024

// Global State
const famhubState = {
    user: null,
    events: JSON.parse(localStorage.getItem('famhub_events')) || [
        {
            id: 1,
            title: '크리스마스 파티 🎄',
            description: '온 가족이 함께하는 따뜻한 크리스마스',
            date: '2024-12-25',
            time: '18:00',
            location: '우리집',
            status: 'upcoming'
        },
        {
            id: 2,
            title: '막둥이 생일파티 🎂',
            description: '우리 막내의 특별한 날',
            date: '2024-11-15',
            time: '19:00',
            location: '집 앞 카페',
            status: 'past'
        },
        {
            id: 3,
            title: '새해 가족 여행 ✈️',
            description: '새로운 한 해를 맞이하는 가족 여행',
            date: '2025-01-01',
            time: '08:00',
            location: '제주도',
            status: 'upcoming'
        }
    ],
    photos: JSON.parse(localStorage.getItem('famhub_photos')) || [
        {
            id: 1,
            title: '가족 나들이',
            date: '2024-10-01',
            category: 'family',
            url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            title: '막둥이 생일',
            date: '2024-09-15',
            category: 'birthday',
            url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            title: '제주도 여행',
            date: '2024-08-20',
            category: 'travel',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
        },
        {
            id: 4,
            title: '추석 한마당',
            date: '2024-09-29',
            category: 'holiday',
            url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            title: '가족 식사',
            date: '2024-10-05',
            category: 'family',
            url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            title: '바다 여행',
            date: '2024-07-10',
            category: 'travel',
            url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
        }
    ],
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    darkMode: localStorage.getItem('famhub_darkMode') === 'true',
    profilePhotos: JSON.parse(localStorage.getItem('famhub_profiles')) || {
        mom: 'https://images.unsplash.com/photo-1494790108755-2616c2c8c6e2?w=300&h=300&fit=crop',
        dad: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        daughter: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
        son: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop',
        youngest: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=300&fit=crop'
    },
    currentEditPhoto: null,
    originalImageData: null
};

// Authentication Check
function checkAuth() {
    const user = localStorage.getItem('famhub_user');
    const loginTime = localStorage.getItem('famhub_login_time');
    const currentTime = new Date().getTime();
    
    // 24시간 세션 유지
    if (user && loginTime && (currentTime - loginTime < 24 * 60 * 60 * 1000)) {
        famhubState.user = user;
        return true;
    } else {
        // 세션 만료 시 로그인 페이지로 리다이렉트
        localStorage.removeItem('famhub_user');
        localStorage.removeItem('famhub_login_time');
        window.location.href = 'login.html';
        return false;
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // 인증 확인
    if (!checkAuth()) return;
    
    // Initialize all components
    initNavigation();
    initDarkMode();
    initEventManagement();
    initPhotoGallery();
    initPhotoEditor();
    initProfilePhotoChange();
    initCalendar();
    initModals();
    initScrollEffects();
    initScrollToTop();
    
    // Update UI
    updateEventCount();
    updatePhotoCount();
    updateProfilePhotos();
    
    console.log('💖 FamHub loaded successfully!');
});

// Navigation Functions
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add user info to navbar
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `
        <span class="user-name">${famhubState.user}님</span>
        <button class="logout-btn" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i>
        </button>
    `;
    
    const navActions = document.querySelector('.nav-actions');
    navActions.insertBefore(userInfo, navActions.firstChild);
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Logout Function
function logout() {
    localStorage.removeItem('famhub_user');
    localStorage.removeItem('famhub_login_time');
    window.location.href = 'login.html';
}

// Dark Mode
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    if (famhubState.darkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        famhubState.darkMode = body.classList.contains('dark-mode');
        localStorage.setItem('famhub_darkMode', famhubState.darkMode);
        
        darkModeToggle.innerHTML = famhubState.darkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });
}

// Event Management
function initEventManagement() {
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventModal = document.getElementById('addEventModal');
    
    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => {
            openModal('eventModal');
        });
    }
    
    if (addEventModal) {
        addEventModal.addEventListener('click', () => {
            openModal('eventModal');
        });
    }
    
    // Event form submission
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    
    // Event action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-event')) {
            const eventCard = e.target.closest('.event-card');
            editEvent(eventCard);
        }
        
        if (e.target.classList.contains('delete-event')) {
            const eventCard = e.target.closest('.event-card');
            deleteEvent(eventCard);
        }
    });
    
    renderEvents();
}

function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        id: Date.now(),
        title: formData.get('eventTitle'),
        date: formData.get('eventDate'),
        time: formData.get('eventTime'),
        location: formData.get('eventLocation'),
        description: formData.get('eventDescription'),
        status: new Date(formData.get('eventDate')) > new Date() ? 'upcoming' : 'past'
    };
    
    famhubState.events.push(eventData);
    localStorage.setItem('famhub_events', JSON.stringify(famhubState.events));
    
    renderEvents();
    updateEventCount();
    closeModal('eventModal');
    showNotification('이벤트가 추가되었습니다! 🎉', 'success');
    
    e.target.reset();
}

function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    eventsGrid.innerHTML = '';
    
    famhubState.events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = `event-card ${event.status}`;
        eventCard.innerHTML = `
            <div class="event-date">
                <span class="month">${new Date(event.date).getMonth() + 1}</span>
                <span class="day">${new Date(event.date).getDate()}</span>
            </div>
            <div class="event-info">
                <h3>${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <span class="event-time"><i class="fas fa-clock"></i> ${event.time}</span>
                    <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
            </div>
            <div class="event-actions">
                <button class="edit-event" title="수정" data-id="${event.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-event" title="삭제" data-id="${event.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        eventsGrid.appendChild(eventCard);
    });
}

function deleteEvent(eventCard) {
    const eventId = parseInt(eventCard.querySelector('.delete-event').dataset.id);
    
    if (confirm('이 이벤트를 삭제하시겠습니까?')) {
        famhubState.events = famhubState.events.filter(event => event.id !== eventId);
        localStorage.setItem('famhub_events', JSON.stringify(famhubState.events));
        
        renderEvents();
        updateEventCount();
        showNotification('이벤트가 삭제되었습니다.', 'info');
    }
}

// Photo Gallery Management
function initPhotoGallery() {
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const addPhotoModal = document.getElementById('addPhotoModal');
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => {
            openModal('photoModal');
        });
    }
    
    if (addPhotoModal) {
        addPhotoModal.addEventListener('click', () => {
            openModal('photoModal');
        });
    }
    
    // Gallery filters
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            galleryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const category = filter.dataset.filter;
            filterPhotos(category);
        });
    });
    
    // Photo form submission
    const photoForm = document.getElementById('photoForm');
    if (photoForm) {
        photoForm.addEventListener('submit', handlePhotoSubmit);
    }
    
    // Photo action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('photo-view')) {
            const photoItem = e.target.closest('.photo-item');
            viewPhoto(photoItem);
        }
        
        if (e.target.classList.contains('photo-edit')) {
            const photoItem = e.target.closest('.photo-item');
            editPhoto(photoItem);
        }
        
        if (e.target.classList.contains('photo-delete')) {
            const photoItem = e.target.closest('.photo-item');
            deletePhoto(photoItem);
        }
    });
    
    renderPhotos();
}

function handlePhotoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fileInput = document.getElementById('photoFile');
    
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoData = {
                id: Date.now(),
                title: formData.get('photoTitle'),
                date: formData.get('photoDate'),
                category: formData.get('photoCategory'),
                url: e.target.result
            };
            
            famhubState.photos.push(photoData);
            localStorage.setItem('famhub_photos', JSON.stringify(famhubState.photos));
            
            renderPhotos();
            updatePhotoCount();
            closeModal('photoModal');
            showNotification('사진이 추가되었습니다! 📸', 'success');
            
            document.getElementById('photoForm').reset();
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function renderPhotos() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    famhubState.photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.dataset.category = photo.category;
        photoItem.innerHTML = `
            <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            <div class="photo-overlay">
                <div class="photo-info">
                    <h4>${photo.title}</h4>
                    <p>${photo.date}</p>
                </div>
                <div class="photo-actions">
                    <button class="photo-view" data-id="${photo.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="photo-edit" data-id="${photo.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="photo-delete" data-id="${photo.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        galleryGrid.appendChild(photoItem);
    });
}

function filterPhotos(category) {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

function viewPhoto(photoItem) {
    const photoId = parseInt(photoItem.querySelector('.photo-view').dataset.id);
    const photo = famhubState.photos.find(p => p.id === photoId);
    
    if (photo) {
        const viewerContent = document.getElementById('photoViewerContent');
        viewerContent.innerHTML = `
            <img src="${photo.url}" alt="${photo.title}" style="max-width: 100%; max-height: 80vh; object-fit: contain;">
            <div style="text-align: center; margin-top: 1rem; color: white;">
                <h3>${photo.title}</h3>
                <p>${photo.date}</p>
            </div>
        `;
        
        openModal('photoViewerModal');
    }
}

function editPhoto(photoItem) {
    const photoId = parseInt(photoItem.querySelector('.photo-edit').dataset.id);
    const photo = famhubState.photos.find(p => p.id === photoId);
    
    if (photo) {
        famhubState.currentEditPhoto = photo;
        loadImageToCanvas(photo.url);
        openModal('photoEditModal');
    }
}

function deletePhoto(photoItem) {
    const photoId = parseInt(photoItem.querySelector('.photo-delete').dataset.id);
    
    if (confirm('이 사진을 삭제하시겠습니까?')) {
        famhubState.photos = famhubState.photos.filter(photo => photo.id !== photoId);
        localStorage.setItem('famhub_photos', JSON.stringify(famhubState.photos));
        
        renderPhotos();
        updatePhotoCount();
        showNotification('사진이 삭제되었습니다.', 'info');
    }
}

// Photo Editor Functions
function initPhotoEditor() {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    
    // Editor controls
    document.getElementById('rotateLeft').addEventListener('click', () => rotateImage(-90));
    document.getElementById('rotateRight').addEventListener('click', () => rotateImage(90));
    document.getElementById('flipHorizontal').addEventListener('click', () => flipImage('horizontal'));
    document.getElementById('flipVertical').addEventListener('click', () => flipImage('vertical'));
    
    // Sliders
    document.getElementById('brightnessSlider').addEventListener('input', updateImageFilters);
    document.getElementById('contrastSlider').addEventListener('input', updateImageFilters);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyFilter(e.target.dataset.filter);
        });
    });
    
    // Editor actions
    document.getElementById('resetEdit').addEventListener('click', resetImageEdit);
    document.getElementById('cancelEdit').addEventListener('click', () => closeModal('photoEditModal'));
    document.getElementById('saveEdit').addEventListener('click', saveEditedPhoto);
    
    // Close modal
    document.getElementById('closePhotoEditor').addEventListener('click', () => closeModal('photoEditModal'));
}

function loadImageToCanvas(imageUrl) {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        canvas.width = Math.min(img.width, 600);
        canvas.height = (img.height * canvas.width) / img.width;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        famhubState.originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    img.src = imageUrl;
}

function rotateImage(degrees) {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create temporary canvas for rotation
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (degrees === 90 || degrees === -90) {
        tempCanvas.width = canvas.height;
        tempCanvas.height = canvas.width;
    } else {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
    }
    
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((degrees * Math.PI) / 180);
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
}

function flipImage(direction) {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    
    if (direction === 'horizontal') {
        ctx.scale(-1, 1);
        ctx.drawImage(canvas, -canvas.width, 0);
    } else {
        ctx.scale(1, -1);
        ctx.drawImage(canvas, 0, -canvas.height);
    }
    
    ctx.restore();
}

function updateImageFilters() {
    const brightness = document.getElementById('brightnessSlider').value;
    const contrast = document.getElementById('contrastSlider').value;
    
    document.getElementById('brightnessValue').textContent = brightness;
    document.getElementById('contrastValue').textContent = contrast;
    
    applyImageAdjustments(brightness, contrast);
}

function applyImageAdjustments(brightness, contrast) {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    
    if (famhubState.originalImageData) {
        ctx.putImageData(famhubState.originalImageData, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const brightnessFactor = parseInt(brightness);
        const contrastFactor = (parseInt(contrast) + 100) / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            // Apply brightness
            data[i] += brightnessFactor;     // Red
            data[i + 1] += brightnessFactor; // Green
            data[i + 2] += brightnessFactor; // Blue
            
            // Apply contrast
            data[i] = ((data[i] - 128) * contrastFactor) + 128;
            data[i + 1] = ((data[i + 1] - 128) * contrastFactor) + 128;
            data[i + 2] = ((data[i + 2] - 128) * contrastFactor) + 128;
            
            // Clamp values
            data[i] = Math.max(0, Math.min(255, data[i]));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

function applyFilter(filterType) {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    
    if (famhubState.originalImageData) {
        ctx.putImageData(famhubState.originalImageData, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        switch (filterType) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                break;
                
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                }
                break;
                
            case 'vintage':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.1);
                    data[i + 2] = Math.min(255, data[i + 2] * 0.8);
                }
                break;
                
            case 'warm':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.1);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.05);
                    data[i + 2] = Math.min(255, data[i + 2] * 0.9);
                }
                break;
                
            case 'cool':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 0.9);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.05);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.1);
                }
                break;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

function resetImageEdit() {
    const canvas = document.getElementById('editCanvas');
    const ctx = canvas.getContext('2d');
    
    if (famhubState.originalImageData) {
        ctx.putImageData(famhubState.originalImageData, 0, 0);
    }
    
    // Reset controls
    document.getElementById('brightnessSlider').value = 0;
    document.getElementById('contrastSlider').value = 0;
    document.getElementById('brightnessValue').textContent = '0';
    document.getElementById('contrastValue').textContent = '0';
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
}

function saveEditedPhoto() {
    const canvas = document.getElementById('editCanvas');
    const editedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    if (famhubState.currentEditPhoto) {
        const photoIndex = famhubState.photos.findIndex(p => p.id === famhubState.currentEditPhoto.id);
        if (photoIndex !== -1) {
            famhubState.photos[photoIndex].url = editedImageUrl;
            localStorage.setItem('famhub_photos', JSON.stringify(famhubState.photos));
            
            renderPhotos();
            closeModal('photoEditModal');
            showNotification('사진이 편집되었습니다! 🎨', 'success');
        }
    }
}

// Profile Photo Change Functions
function initProfilePhotoChange() {
    // Profile photo change buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('change-photo-btn')) {
            const member = e.target.dataset.member;
            openProfilePhotoModal(member);
        }
    });
    
    // Profile photo form
    const profileForm = document.getElementById('profilePhotoForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfilePhotoSubmit);
    }
    
    // File preview
    const profileFileInput = document.getElementById('profilePhotoFile');
    if (profileFileInput) {
        profileFileInput.addEventListener('change', previewProfilePhoto);
    }
    
    // Modal controls
    document.getElementById('closeProfileModal').addEventListener('click', () => closeModal('profilePhotoModal'));
    document.getElementById('cancelProfile').addEventListener('click', () => closeModal('profilePhotoModal'));
}

function openProfilePhotoModal(member) {
    famhubState.currentEditMember = member;
    document.getElementById('profilePhotoForm').reset();
    document.getElementById('profilePreview').innerHTML = '';
    openModal('profilePhotoModal');
}

function previewProfilePhoto(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('profilePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="미리보기">`;
        };
        reader.readAsDataURL(file);
    }
}

function handleProfilePhotoSubmit(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('profilePhotoFile');
    
    if (fileInput.files[0] && famhubState.currentEditMember) {
        const reader = new FileReader();
        reader.onload = function(e) {
            famhubState.profilePhotos[famhubState.currentEditMember] = e.target.result;
            localStorage.setItem('famhub_profiles', JSON.stringify(famhubState.profilePhotos));
            
            updateProfilePhotos();
            closeModal('profilePhotoModal');
            showNotification('프로필 사진이 변경되었습니다! 📸', 'success');
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function updateProfilePhotos() {
    Object.keys(famhubState.profilePhotos).forEach(member => {
        const memberElement = document.querySelector(`[data-member="${member}"] img`);
        if (memberElement) {
            memberElement.src = famhubState.profilePhotos[member];
        }
    });
}

// Calendar Management
function initCalendar() {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            famhubState.currentMonth--;
            if (famhubState.currentMonth < 0) {
                famhubState.currentMonth = 11;
                famhubState.currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            famhubState.currentMonth++;
            if (famhubState.currentMonth > 11) {
                famhubState.currentMonth = 0;
                famhubState.currentYear++;
            }
            renderCalendar();
        });
    }
    
    renderCalendar();
}

function renderCalendar() {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!calendarTitle || !calendarGrid) return;
    
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    calendarTitle.textContent = `${famhubState.currentYear}년 ${monthNames[famhubState.currentMonth]}`;
    
    const firstDay = new Date(famhubState.currentYear, famhubState.currentMonth, 1).getDay();
    const daysInMonth = new Date(famhubState.currentYear, famhubState.currentMonth + 1, 0).getDate();
    const today = new Date();
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.cssText = `
            background: #f8f9fa;
            padding: 0.5rem;
            text-align: center;
            font-weight: 600;
            color: #495057;
            border-bottom: 1px solid #dee2e6;
        `;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(famhubState.currentYear, famhubState.currentMonth, day);
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Check if today
        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if has events
        const hasEvent = famhubState.events.some(event => event.date === dateString);
        if (hasEvent) {
            dayElement.classList.add('has-event');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Modal Management
function initModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal.id);
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Cancel buttons
    document.addEventListener('click', (e) => {
        if (e.target.id === 'cancelEvent') {
            closeModal('eventModal');
        }
        if (e.target.id === 'cancelPhoto') {
            closeModal('photoModal');
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll(
        '.section-header, .family-member, .event-card, .photo-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 100;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function updateEventCount() {
    const eventCountElement = document.getElementById('eventCount');
    if (eventCountElement) {
        eventCountElement.textContent = famhubState.events.length;
    }
}

function updatePhotoCount() {
    const photoCountElement = document.getElementById('photoCount');
    if (photoCountElement) {
        photoCountElement.textContent = famhubState.photos.length;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#ff7675' : '#74b9ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for user info
const userInfoStyles = document.createElement('style');
userInfoStyles.textContent = `
    .user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-right: 1rem;
    }
    
    .user-name {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .logout-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .logout-btn:hover {
        background: var(--heart-color);
        color: white;
    }
    
    .calendar-day-header {
        background: #f8f9fa !important;
        padding: 0.5rem !important;
        text-align: center !important;
        font-weight: 600 !important;
        color: #495057 !important;
        border-bottom: 1px solid #dee2e6 !important;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(userInfoStyles);

// Export functions for global access
window.scrollToSection = scrollToSection;
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;

console.log(`
💖 FamHub - Family Homepage 2024
━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Modern family website with authentication
🔐 Secure login system
📸 Photo upload and management
🎉 Event management system
📅 Interactive family calendar
🌙 Dark mode support
📱 Fully responsive design
━━━━━━━━━━━━━━━━━━━━━━━━━
Made with 💖 for our family
`);
