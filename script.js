// === 1. ЛОГИКА АВТОРИЗАЦИИ ===
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('nexus_user');
  if (user) {
    showCabinet(JSON.parse(user));
  }
});

function switchAuth(type) {
  if (type === 'login') {
    document.getElementById('tab-login').classList.add('active');
    document.getElementById('tab-register').classList.remove('active');
    document.getElementById('form-login').style.display = 'flex';
    document.getElementById('form-register').style.display = 'none';
  } else {
    document.getElementById('tab-register').classList.add('active');
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('form-register').style.display = 'flex';
    document.getElementById('form-login').style.display = 'none';
  }
}

function handleAuth(e, type) {
  e.preventDefault();
  let user = {};
  
  if (type === 'login') {
    const email = document.getElementById('login-email').value;
    const savedData = localStorage.getItem('nexus_db');
    if (savedData) {
      const db = JSON.parse(savedData);
      if (db.email === email) {
        user = { name: db.name, email: db.email };
      } else {
        alert('Пользователь не найден. Зарегистрируйтесь.');
        return;
      }
    } else {
      user = { name: 'Тестовый Пилот', email: email };
    }
  } else {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    user = { name: name, email: email };
    localStorage.setItem('nexus_db', JSON.stringify(user));
  }
  
  localStorage.setItem('nexus_user', JSON.stringify(user));
  showCabinet(user);
  closeAuth();
  document.getElementById('user-cabinet').scrollIntoView({ behavior: 'smooth' });
}

function showCabinet(user) {
  document.querySelector('#dock-profile-btn span').textContent = 'Профиль';
  document.querySelector('#dock-profile-btn svg').style.stroke = 'var(--accent-cyan)';
  document.getElementById('cabinet-user-name').textContent = user.name;
  document.getElementById('cabinet-user-email').textContent = user.email;
  document.querySelector('.hero').style.display = 'none';
  document.getElementById('user-cabinet').style.display = 'block';
}

function openAuthOrProfile(e) {
  e.preventDefault();
  const user = localStorage.getItem('nexus_user');
  if (user) {
    showCabinet(JSON.parse(user));
    document.getElementById('user-cabinet').scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.hash = '#auth';
  }
}

function closeAuth() {
  window.location.hash = '';
}

function logout() {
  localStorage.removeItem('nexus_user');
  alert('Сеанс завершен.');
  location.reload();
}

// ==========================================
// 2. УМНЫЕ АНИМАЦИИ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  
  const elementsToAnimate = document.querySelectorAll('.section__header, .tabs, .card, .vital-card, .plan, .cabinet-card');
  
  elementsToAnimate.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  elementsToAnimate.forEach(el => revealObserver.observe(el));

  // 3D-наклон карточек
  if (window.innerWidth > 768) {
    const tiltCards = document.querySelectorAll('.card, .plan, .vital-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      });
    });
  }
});