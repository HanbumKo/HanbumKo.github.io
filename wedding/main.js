/* ======================================================
   고한범 ♥ 윤수희 모바일 청첩장 JavaScript
   ======================================================
   TODO 목록:
   1. GALLERY_IMAGES 배열에 실제 사진 파일명 입력 (24장)
   2. 전화번호 href="tel:010-xxxx-xxxx" 를 실제 번호로 수정 (index.html)
   3. 계좌번호를 실제 계좌번호로 수정 (index.html)
   4. 전세버스/오시는길 정보 수정 (index.html)
   5. audio/bgm.mp3 파일 준비 후 audio 폴더에 넣기
   ====================================================== */

/* ====== 장소 정보 ====== */
const VENUE = {
    name: '소노펠리체 컨벤션',
    address: '서울 강남구 테헤란로87길 22 공항터미널 3층',
    lat: 37.509590871936794,
    lng: 127.05669351148788,
    kakaoPlaceId: '8229296',
};

/* ====== 갤러리 이미지 목록 (TODO: 실제 파일명으로 수정) ======
   - 처음 6장: 페이지 로드 시 바로 표시
   - 나머지 18장: '더보기' 버튼 클릭 시 표시
   - 실제 사진 파일을 images/ 폴더에 넣고 파일명을 아래에 입력하세요
   ============================================================ */
const GALLERY_IMAGES = [
    'images/IMG_6983.JPG', // 1
    'images/IMG_6983.JPG', // 2
    'images/IMG_6983.JPG', // 3
    'images/IMG_6983.JPG', // 4
    'images/IMG_6983.JPG', // 5
    'images/IMG_6983.JPG', // 6  ← 여기까지 처음 표시
    /* ── 아래는 '더보기' 클릭 시 표시 ── */
    'images/IMG_6983.JPG', // 7
    'images/IMG_6983.JPG', // 8
    'images/IMG_6983.JPG', // 9
    'images/IMG_6983.JPG', // 10
    'images/IMG_6983.JPG', // 11
    'images/IMG_6983.JPG', // 12
    'images/IMG_6983.JPG', // 13
    'images/IMG_6983.JPG', // 14
    'images/IMG_6983.JPG', // 15
    'images/IMG_6983.JPG', // 16
    'images/IMG_6983.JPG', // 17
    'images/IMG_6983.JPG', // 18
    'images/IMG_6983.JPG', // 19
    'images/IMG_6983.JPG', // 20
    'images/IMG_6983.JPG', // 21
    'images/IMG_6983.JPG', // 22
    'images/IMG_6983.JPG', // 23
    'images/IMG_6983.JPG', // 24
];
const GALLERY_INITIAL = 6;
let galleryExpanded = false;

/* ====== D-DAY 계산 ====== */
(function calcDday() {
    const wedding = new Date(2026, 5, 27);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24));
    const el = document.getElementById('dday-num');
    if (!el) return;
    if (diff > 0) {
        el.textContent = diff;
    } else if (diff === 0) {
        el.textContent = 'DAY';
        el.closest('.dday-box').style.background = '#c9868a';
    } else {
        el.textContent = '+' + Math.abs(diff);
    }
})();

/* ====== 달력 생성 (2026년 6월) ====== */
(function buildCalendar() {
    const grid = document.getElementById('cal-grid');
    if (!grid) return;
    const firstDay = new Date(2026, 5, 1).getDay(); /* 월요일 = 1 */
    const totalDays = 30;
    const WEDDING = 27;

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-cell empty';
        grid.appendChild(empty);
    }
    for (let d = 1; d <= totalDays; d++) {
        const cell = document.createElement('div');
        const dow = (firstDay + d - 1) % 7;
        let cls = 'cal-cell';
        if (d === WEDDING)    cls += ' wedding-day';
        else if (dow === 0)   cls += ' sun';
        else if (dow === 6)   cls += ' sat';
        cell.className = cls;
        cell.textContent = d;
        grid.appendChild(cell);
    }
})();

/* ====== 갤러리 렌더링 ====== */
function renderGallery(count) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    GALLERY_IMAGES.slice(0, count).forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'g-item';
        const img = document.createElement('img');
        img.src = src;
        img.alt = `웨딩 사진 ${i + 1}`;
        img.loading = 'lazy';
        div.appendChild(img);
        div.addEventListener('click', () => openLightbox(i));
        grid.appendChild(div);
    });
}

function expandGallery() {
    galleryExpanded = true;
    renderGallery(GALLERY_IMAGES.length);
    document.getElementById('gallery-more-btn').classList.add('hidden');
}

/* 초기 갤러리 렌더링 */
(function initGallery() {
    renderGallery(GALLERY_INITIAL);
    const moreBtn = document.getElementById('gallery-more-btn');
    const remaining = GALLERY_IMAGES.length - GALLERY_INITIAL;
    if (remaining > 0) {
        document.getElementById('gallery-more-count').textContent = `(+${remaining})`;
    } else {
        moreBtn.classList.add('hidden');
    }
})();

/* ====== 라이트박스 ====== */
let currentIdx = 0;

function openLightbox(idx) {
    currentIdx = idx;
    const lb = document.getElementById('lightbox');
    document.getElementById('lb-img').src = GALLERY_IMAGES[idx];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLbCounter();
    updateLbNav();
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function lightboxPrev(e) {
    if (e) e.stopPropagation();
    if (currentIdx > 0) openLightbox(currentIdx - 1);
}

function lightboxNext(e) {
    if (e) e.stopPropagation();
    const total = galleryExpanded ? GALLERY_IMAGES.length : GALLERY_INITIAL;
    if (currentIdx < total - 1) openLightbox(currentIdx + 1);
}

function updateLbCounter() {
    const total = galleryExpanded ? GALLERY_IMAGES.length : GALLERY_INITIAL;
    document.getElementById('lb-counter').textContent = `${currentIdx + 1} / ${total}`;
}

function updateLbNav() {
    const total = galleryExpanded ? GALLERY_IMAGES.length : GALLERY_INITIAL;
    const prev = document.querySelector('.lb-prev');
    const next = document.querySelector('.lb-next');
    prev.dataset.disabled = currentIdx === 0 ? 'true' : 'false';
    next.dataset.disabled = currentIdx >= total - 1 ? 'true' : 'false';
}

/* 키보드 탐색 */
document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    else if (e.key === 'ArrowLeft')  lightboxPrev();
    else if (e.key === 'ArrowRight') lightboxNext();
});

/* 터치 스와이프 */
(function addSwipe() {
    const lb = document.getElementById('lightbox');
    let startX = 0, startY = 0;
    lb.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) lightboxNext();
            else lightboxPrev();
        }
    }, { passive: true });
})();

/* ====== 배경 음악 ====== */
let musicPlaying = false;

function setMusicState(playing) {
    musicPlaying = playing;
    const btn   = document.getElementById('music-btn');
    const play  = document.getElementById('music-icon-play');
    const pause = document.getElementById('music-icon-pause');
    if (playing) {
        btn.classList.add('playing');
        play.classList.add('hidden');
        pause.classList.remove('hidden');
    } else {
        btn.classList.remove('playing');
        play.classList.remove('hidden');
        pause.classList.add('hidden');
    }
}

function toggleMusic() {
    const audio = document.getElementById('bgm');
    if (musicPlaying) {
        audio.pause();
        setMusicState(false);
    } else {
        audio.play().then(() => setMusicState(true)).catch(() => {
            showToast('음악 파일을 찾을 수 없습니다 (audio/bgm.mp3)');
        });
    }
}

/* 자동 재생 — 브라우저 정책상 사용자 첫 상호작용 후 재생됨 */
(function initAutoplay() {
    const audio = document.getElementById('bgm');
    /* 즉시 시도 (일부 브라우저 허용) */
    audio.play().then(() => setMusicState(true)).catch(() => {
        /* 차단된 경우 첫 터치/클릭/스크롤 시 재생 */
        const trigger = ['touchstart', 'click', 'scroll', 'keydown'];
        function onFirstInteraction() {
            if (!musicPlaying) {
                audio.play().then(() => setMusicState(true)).catch(() => {});
            }
            trigger.forEach(ev => document.removeEventListener(ev, onFirstInteraction));
        }
        trigger.forEach(ev => document.addEventListener(ev, onFirstInteraction, { once: true, passive: true }));
    });
})();

/* ====== 스크롤 reveal ====== */
function checkReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', checkReveal, { passive: true });
window.addEventListener('load', checkReveal);
/* 스크립트 로드 즉시 + DOM 준비 후 한 번씩 실행 */
checkReveal();
document.addEventListener('DOMContentLoaded', checkReveal);

/* ====== 지도 앱 열기 ====== */
function openKakao() {
    tryAppScheme(
        `kakaomap://place?id=${VENUE.kakaoPlaceId}`,
        `https://place.map.kakao.com/${VENUE.kakaoPlaceId}`
    );
}
function openNaver() {
    const name = encodeURIComponent(VENUE.name);
    tryAppScheme(
        `nmap://place?lat=${VENUE.lat}&lng=${VENUE.lng}&name=${name}&appname=wedding`,
        `https://naver.me/5VmQvsvf`
    );
}
function openGoogle() {
    window.open('https://maps.app.goo.gl/4ahuakMbrKBci8Gp9', '_blank');
}
function openTmap() {
    const name = encodeURIComponent(VENUE.name);
    tryAppScheme(
        `tmap://route?goalname=${name}&goalx=${VENUE.lng}&goaly=${VENUE.lat}`,
        `https://tmap.life/`
    );
}

function tryAppScheme(scheme, fallback) {
    const timer = setTimeout(() => window.open(fallback, '_blank'), 700);
    window.addEventListener('blur', () => clearTimeout(timer), { once: true });
    window.location.href = scheme;
}

/* ====== 주소 복사 ====== */
function copyAddress() {
    copyToClipboard(document.getElementById('venue-addr').textContent, '주소가 복사되었습니다');
}

/* ====== 계좌번호 복사 ====== */
function copyAcct(num, btn) {
    copyToClipboard(num, '계좌번호가 복사되었습니다');
    btn.classList.add('copied');
    btn.textContent = '완료';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '복사'; }, 2000);
}

/* ====== 클립보드 공통 ====== */
function copyToClipboard(text, msg) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => fallbackCopy(text, msg));
    } else {
        fallbackCopy(text, msg);
    }
}
function fallbackCopy(text, msg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); showToast(msg); } catch { showToast('직접 복사해 주세요.'); }
    document.body.removeChild(ta);
}

/* ====== 토스트 ====== */
let toastTimer;
function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ====== 오시는길 탭 ====== */
function switchTab(btn, id) {
    document.querySelectorAll('.dir-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dir-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + id);
    if (target) target.classList.add('active');
}

/* ====== 계좌 아코디언 ====== */
function toggleAcc(btn) {
    const content = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    content.hidden = expanded;
}
