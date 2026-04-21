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

/* ====== 갤러리 이미지 목록 ======
   - 처음 9장: 페이지 로드 시 바로 표시
   - 나머지: '더보기' 버튼 클릭 시 표시
   - 사진 파일은 images/gallery/opt/ 폴더에 있습니다
   - 순서: 찐핑크(12장) → 풍성(10장) → 슬림(14장)
   ============================================================ */
const GALLERY_IMAGES = [
    /* ── 찐핑크 ── */
    'images/gallery/opt/pink_01.webp',
    'images/gallery/opt/pink_02.webp',
    'images/gallery/opt/pink_03.webp',
    'images/gallery/opt/pink_04.webp',
    'images/gallery/opt/pink_05.webp',
    'images/gallery/opt/pink_06.webp',
    'images/gallery/opt/pink_07.webp',
    'images/gallery/opt/pink_08.webp',
    'images/gallery/opt/pink_09.webp',
    /* ── 아래는 '더보기' 클릭 시 표시 ── */
    'images/gallery/opt/pink_10.webp',
    'images/gallery/opt/pink_11.webp',
    'images/gallery/opt/pink_12.webp',
    /* ── 풍성 ── */
    'images/gallery/opt/full_01.webp',
    'images/gallery/opt/full_02.webp',
    'images/gallery/opt/full_03.webp',
    'images/gallery/opt/full_04.webp',
    'images/gallery/opt/full_05.webp',
    'images/gallery/opt/full_06.webp',
    'images/gallery/opt/full_07.webp',
    'images/gallery/opt/full_08.webp',
    'images/gallery/opt/full_09.webp',
    'images/gallery/opt/full_10.webp',
    /* ── 슬림 ── */
    'images/gallery/opt/slim_01.webp',
    'images/gallery/opt/slim_02.webp',
    'images/gallery/opt/slim_03.webp',
    'images/gallery/opt/slim_04.webp',
    'images/gallery/opt/slim_05.webp',
    'images/gallery/opt/slim_06.webp',
    'images/gallery/opt/slim_07.webp',
    'images/gallery/opt/slim_08.webp',
    'images/gallery/opt/slim_09.webp',
    'images/gallery/opt/slim_10.webp',
    'images/gallery/opt/slim_11.webp',
    'images/gallery/opt/slim_12.webp',
    'images/gallery/opt/slim_13.webp',
    'images/gallery/opt/slim_14.webp',
];
const GALLERY_INITIAL = 9;
let galleryExpanded = false;


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
        img.loading = i < GALLERY_INITIAL ? 'eager' : 'lazy';
        div.appendChild(img);
        div.addEventListener('click', () => openLightbox(i));
        grid.appendChild(div);
    });
}

function toggleGallery() {
    galleryExpanded = !galleryExpanded;
    renderGallery(galleryExpanded ? GALLERY_IMAGES.length : GALLERY_INITIAL);
    document.getElementById('gallery-more-btn').innerHTML = galleryExpanded ? '접기 &nbsp;▴' : '더보기 &nbsp;▾';
}

/* 초기 갤러리 렌더링 */
(function initGallery() {
    renderGallery(GALLERY_INITIAL);
    const moreBtn = document.getElementById('gallery-more-btn');
    if (GALLERY_IMAGES.length <= GALLERY_INITIAL) moreBtn.classList.add('hidden');
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
    /* 앞뒤 이미지 미리 로드 */
    [idx - 1, idx + 1].forEach(i => {
        if (i >= 0 && i < GALLERY_IMAGES.length) {
            const pre = new Image();
            pre.src = GALLERY_IMAGES[i];
        }
    });
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

let lbAnimating = false;

function slideLightbox(dir, startOffsetPx) {
    /* dir: +1 = next, -1 = prev
       startOffsetPx: current image's drag offset in px (0 for button/keyboard nav) */
    if (lbAnimating) return;
    const newIdx = currentIdx + dir;
    if (newIdx < 0 || newIdx >= GALLERY_IMAGES.length) return;

    lbAnimating = true;
    const EASE = 'cubic-bezier(0.25,0.46,0.45,0.94)';
    const MS   = 320;
    const W    = window.innerWidth;

    const curImg = document.getElementById('lb-img');
    const content = document.querySelector('.lb-content');

    /* 새 이미지 요소 생성 — 화면 밖에서 시작 */
    const nxt = document.createElement('img');
    nxt.src = GALLERY_IMAGES[newIdx];
    nxt.style.cssText = `position:absolute;max-width:92vw;max-height:84vh;
        object-fit:contain;border-radius:4px;user-select:none;pointer-events:none;
        z-index:1;transition:none;
        transform:translateX(${dir > 0 ? W - startOffsetPx : -W - startOffsetPx}px)`;
    content.appendChild(nxt);

    nxt.offsetHeight; /* reflow */

    /* 두 이미지를 동시에 슬라이드 */
    curImg.style.transition = `transform ${MS}ms ${EASE}`;
    curImg.style.transform  = `translateX(${dir > 0 ? -W : W}px)`;
    nxt.style.transition    = `transform ${MS}ms ${EASE}`;
    nxt.style.transform     = 'translateX(0)';

    setTimeout(() => {
        currentIdx = newIdx;
        curImg.src = GALLERY_IMAGES[newIdx];
        curImg.style.transition = 'none';
        curImg.style.transform  = 'translateX(0)';
        content.removeChild(nxt);
        updateLbCounter();
        updateLbNav();
        [newIdx - 1, newIdx + 1].forEach(i => {
            if (i >= 0 && i < GALLERY_IMAGES.length) new Image().src = GALLERY_IMAGES[i];
        });
        lbAnimating = false;
    }, MS);
}

function lightboxPrev(e) {
    if (e) e.stopPropagation();
    slideLightbox(-1, 0);
}

function lightboxNext(e) {
    if (e) e.stopPropagation();
    slideLightbox(1, 0);
}

function updateLbCounter() {
    document.getElementById('lb-counter').textContent = `${currentIdx + 1} / ${GALLERY_IMAGES.length}`;
}

function updateLbNav() {
    const prev = document.querySelector('.lb-prev');
    const next = document.querySelector('.lb-next');
    prev.dataset.disabled = currentIdx === 0 ? 'true' : 'false';
    next.dataset.disabled = currentIdx >= GALLERY_IMAGES.length - 1 ? 'true' : 'false';
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
    const lb      = document.getElementById('lightbox');
    const content = document.querySelector('.lb-content');
    let curImg, peekImg;
    let startX = 0, startY = 0, dragX = 0, dragging = false, peekDir = 0;

    lb.addEventListener('touchstart', e => {
        if (lbAnimating) return;
        curImg  = document.getElementById('lb-img');
        startX  = e.touches[0].clientX;
        startY  = e.touches[0].clientY;
        dragX   = 0; dragging = false; peekDir = 0;
        curImg.style.transition = 'none';
    }, { passive: true });

    lb.addEventListener('touchmove', e => {
        if (lbAnimating) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (!dragging) {
            if (Math.abs(dy) > Math.abs(dx)) return;
            dragging = true;
        }
        dragX = dx;
        const dir = dx < 0 ? 1 : -1;

        /* 방향이 바뀌면 미리보기 이미지 교체 */
        if (dir !== peekDir) {
            if (peekImg) { content.removeChild(peekImg); peekImg = null; }
            const nextIdx = currentIdx + dir;
            if (nextIdx >= 0 && nextIdx < GALLERY_IMAGES.length) {
                peekImg = document.createElement('img');
                peekImg.src = GALLERY_IMAGES[nextIdx];
                peekImg.style.cssText = `position:absolute;max-width:92vw;max-height:84vh;
                    object-fit:contain;border-radius:4px;user-select:none;pointer-events:none;
                    z-index:0;transition:none;`;
                content.appendChild(peekImg);
                peekDir = dir;
            }
        }

        const W = window.innerWidth;
        curImg.style.transform = `translateX(${dx}px)`;
        if (peekImg) peekImg.style.transform = `translateX(${dx + (dir > 0 ? W : -W)}px)`;
    }, { passive: true });

    lb.addEventListener('touchend', () => {
        if (!dragging) return;
        dragging = false;

        const threshold = window.innerWidth * 0.25;
        const dir = dragX < 0 ? 1 : -1;
        const nextIdx = currentIdx + dir;

        if (Math.abs(dragX) > threshold && nextIdx >= 0 && nextIdx < GALLERY_IMAGES.length) {
            /* 손 뗀 위치에서 이어서 슬라이드 완성 */
            const EASE = 'cubic-bezier(0.25,0.46,0.45,0.94)';
            const W    = window.innerWidth;
            const remaining = W - Math.abs(dragX);
            const MS   = Math.max(120, Math.round(remaining / W * 320));

            lbAnimating = true;
            curImg.style.transition = `transform ${MS}ms ${EASE}`;
            curImg.style.transform  = `translateX(${dir > 0 ? -W : W}px)`;
            if (peekImg) {
                peekImg.style.transition = `transform ${MS}ms ${EASE}`;
                peekImg.style.transform  = 'translateX(0)';
            }

            setTimeout(() => {
                currentIdx = nextIdx;
                curImg.src = GALLERY_IMAGES[nextIdx];
                curImg.style.transition = 'none';
                curImg.style.transform  = 'translateX(0)';
                if (peekImg) { content.removeChild(peekImg); peekImg = null; }
                updateLbCounter();
                updateLbNav();
                [nextIdx - 1, nextIdx + 1].forEach(i => {
                    if (i >= 0 && i < GALLERY_IMAGES.length) new Image().src = GALLERY_IMAGES[i];
                });
                lbAnimating = false;
            }, MS);
        } else {
            /* 임계값 미달 — 제자리 복귀 */
            curImg.style.transition = 'transform 0.25s ease';
            curImg.style.transform  = 'translateX(0)';
            if (peekImg) {
                const W = window.innerWidth;
                peekImg.style.transition = 'transform 0.25s ease';
                peekImg.style.transform  = `translateX(${peekDir > 0 ? W : -W}px)`;
                setTimeout(() => { if (peekImg) { content.removeChild(peekImg); peekImg = null; } }, 250);
            }
        }
        peekDir = 0;
    }, { passive: true });
})();

/* ====== 배경 음악 ====== */
let musicPlaying = true;

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

function switchDir(panel, btn) {
    document.querySelectorAll('.dir-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dir-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('dir-' + panel).classList.add('active');
}

function toggleContact() {
    const list = document.getElementById('contact-list');
    const arrow = document.getElementById('contact-arrow');
    const isHidden = list.classList.toggle('hidden');
    arrow.textContent = isHidden ? '▾' : '▴';
}

function toggleMusic() {
    const audio = document.getElementById('bgm');
    if (musicPlaying) {
        audio.pause();
        setMusicState(false);
    } else {
        audio.play().then(() => setMusicState(true)).catch(() => {});
    }
}

/* 페이지 로드 시 자동재생 시도 (브라우저 정책상 사용자 인터랙션 전엔 막힐 수 있음) */
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgm');
    setMusicState(true);
    audio.play().catch(() => {
        /* 자동재생 차단 시 정지 상태로 */
        setMusicState(false);
    });
});


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

/* ====== 방명록 (Supabase 연동) ====== */
const SUPABASE_URL = 'https://gfifpjysrikqbhhrcoam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaWZwanlzcmlrcWJoaHJjb2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTc3MDksImV4cCI6MjA4OTU5MzcwOX0.LiKaqs0wlR8-Uqu7KQzz5dgG4fCQfLEzDAcrrAstCMY';

const gbHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

/* 목록 불러오기 */
async function fetchGuestbook() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook?order=created_at.desc&select=id,name,message,created_at`, {
            headers: gbHeaders
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error('방명록 불러오기 실패 [' + res.status + ']:', errText);
            return { error: res.status + ' ' + errText };
        }
        return res.json();
    } catch (err) {
        console.error('방명록 fetch 오류:', err);
        return { error: err.message };
    }
}

/* 목록 렌더링 */
async function renderGuestbook() {
    const list = document.getElementById('gb-list');
    if (!list) return;
    list.innerHTML = '<p class="gb-empty">불러오는 중...</p>';
    const result = await fetchGuestbook();
    if (result && result.error !== undefined) {
        list.innerHTML = `<p class="gb-empty">불러오기 실패: ${escapeHtml(result.error)}<br><small>F12 → Console 탭에서 자세한 오류를 확인하세요.</small></p>`;
        return;
    }
    const entries = result;
    if (!entries.length) {
        list.innerHTML = '<p class="gb-empty">아직 메시지가 없습니다. 첫 번째 축하 메시지를 남겨주세요!</p>';
        return;
    }
    list.innerHTML = entries.map(e => {
        const date = (e.created_at || '').slice(0, 10).replace(/-/g, '.');
        return `
        <div class="gb-item">
            <div class="gb-item-header">
                <span class="gb-item-name">${escapeHtml(e.name)}</span>
                <span class="gb-item-date">${date}</span>
            </div>
            <p class="gb-item-msg">${escapeHtml(e.message)}</p>
        </div>`;
    }).join('');
}

/* 등록 */
async function submitGuestbook(e) {
    e.preventDefault();
    const name = document.getElementById('gb-name').value.trim();
    const msg  = document.getElementById('gb-msg').value.trim();
    if (!name || !msg) return;

    const btn = e.target.querySelector('.gb-submit');
    btn.disabled = true;
    btn.textContent = '등록 중...';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
            method: 'POST',
            headers: gbHeaders,
            body: JSON.stringify({ name, message: msg })
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error('방명록 등록 실패 [' + res.status + ']:', errText);
            throw new Error(errText);
        }
        document.getElementById('gb-name').value = '';
        document.getElementById('gb-msg').value = '';
        const list = document.getElementById('gb-list');
        if (!list.classList.contains('hidden')) await renderGuestbook();
        showToast('메시지가 등록되었습니다 ♥');
    } catch {
        showToast('등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Leave a Message';
    }
}


function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* 페이지 로드 시 방명록 바로 표시 */
document.addEventListener('DOMContentLoaded', renderGuestbook);

/* ====== 계좌 아코디언 ====== */
function toggleAcc(btn) {
    const content = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    content.hidden = expanded;
}
