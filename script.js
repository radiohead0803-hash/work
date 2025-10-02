// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 환영 메시지 버튼 이벤트
    const welcomeBtn = document.getElementById('welcomeBtn');
    welcomeBtn.addEventListener('click', function() {
        alert('환영합니다! 이 웹페이지를 방문해 주셔서 감사합니다! 🎉');
    });

    // 부드러운 스크롤 네비게이션
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 연락처 폼 처리
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            alert(`감사합니다, ${name}님! 메시지가 성공적으로 전송되었습니다.\n\n이메일: ${email}\n메시지: ${message}`);
            
            // 폼 초기화
            contactForm.reset();
        } else {
            alert('모든 필드를 입력해 주세요.');
        }
    });

    // 스크롤 시 헤더 효과
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 아래로 스크롤할 때 헤더 숨기기
            header.style.transform = 'translateY(-100%)';
        } else {
            // 위로 스크롤할 때 헤더 보이기
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 카드 호버 효과 강화
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.color = 'white';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '#f8f9fa';
            this.style.color = '#333';
        });
    });

    // 페이지 로드 시 환영 메시지
    setTimeout(() => {
        console.log('🎉 웹페이지가 성공적으로 로드되었습니다!');
        console.log('💡 개발자 도구를 열어서 이 메시지를 확인하고 계시는군요!');
    }, 1000);

    // 현재 시간 표시 (선택사항)
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR');
        console.log(`현재 시간: ${timeString}`);
    }
    
    // 10초마다 시간 업데이트
    setInterval(updateTime, 10000);
    
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl + H로 홈으로 이동
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Ctrl + A로 소개 섹션으로 이동
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Ctrl + C로 연락처 섹션으로 이동
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 입력 필드 실시간 유효성 검사
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#28a745';
        }
    });

    console.log('✅ JavaScript가 성공적으로 로드되었습니다!');
});
