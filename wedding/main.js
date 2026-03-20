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
        <div class="gb-item" data-id="${e.id}" data-msg="${escapeHtml(e.message)}">
            <div class="gb-item-header">
                <span class="gb-item-name">${escapeHtml(e.name)}</span>
                <div class="gb-item-actions">
                    <span class="gb-item-date">${date}</span>
                    <button class="gb-action-btn gb-edit-btn">수정</button>
                    <button class="gb-action-btn del gb-del-btn">삭제</button>
                </div>
            </div>
            <p class="gb-item-msg">${escapeHtml(e.message)}</p>
        </div>`;
    }).join('');

    list.querySelectorAll('.gb-edit-btn').forEach(btn => {
        const item = btn.closest('.gb-item');
        btn.addEventListener('click', () => openEditModal(item.dataset.id, item.dataset.msg));
    });
    list.querySelectorAll('.gb-del-btn').forEach(btn => {
        const item = btn.closest('.gb-item');
        btn.addEventListener('click', () => openDeleteModal(item.dataset.id));
    });
}

/* 등록 */
async function submitGuestbook(e) {
    e.preventDefault();
    const name = document.getElementById('gb-name').value.trim();
    const msg  = document.getElementById('gb-msg').value.trim();
    const pw   = document.getElementById('gb-pw').value;
    if (!name || !msg || !pw) return;

    const btn = e.target.querySelector('.gb-submit');
    btn.disabled = true;
    btn.textContent = '등록 중...';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
            method: 'POST',
            headers: gbHeaders,
            body: JSON.stringify({ name, message: msg, password: pw })
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error('방명록 등록 실패 [' + res.status + ']:', errText);
            throw new Error(errText);
        }
        document.getElementById('gb-name').value = '';
        document.getElementById('gb-msg').value = '';
        document.getElementById('gb-pw').value = '';
        await renderGuestbook();
        showToast('메시지가 등록되었습니다 ♥');
    } catch {
        showToast('등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
        btn.disabled = false;
        btn.textContent = '메시지 남기기';
    }
}

/* ── 비밀번호 모달 ── */
let gbPending = null; /* { type: 'edit'|'delete', id, msg? } */

function openDeleteModal(id) {
    gbPending = { type: 'delete', id };
    document.getElementById('gb-modal-title').textContent = '삭제하시겠습니까?';
    document.getElementById('gb-modal-confirm').textContent = '삭제';
    document.getElementById('gb-modal-pw').value = '';
    document.getElementById('gb-modal').classList.add('open');
    setTimeout(() => document.getElementById('gb-modal-pw').focus(), 100);
}

function openEditModal(id, msg) {
    gbPending = { type: 'edit', id };
    document.getElementById('gb-modal-title').textContent = '수정하려면 비밀번호를 입력하세요';
    document.getElementById('gb-modal-confirm').textContent = '확인';
    document.getElementById('gb-modal-pw').value = '';
    document.getElementById('gb-modal').classList.add('open');
    /* 검증 후 열릴 수정 모달에 기존 메시지 미리 세팅 */
    document.getElementById('gb-edit-msg').value = msg;
    setTimeout(() => document.getElementById('gb-modal-pw').focus(), 100);
}

function closeGbModal() {
    document.getElementById('gb-modal').classList.remove('open');
    gbPending = null;
}

async function confirmGbModal() {
    const pw = document.getElementById('gb-modal-pw').value;
    if (!pw) { showToast('비밀번호를 입력해 주세요.'); return; }

    const confirmBtn = document.getElementById('gb-modal-confirm');
    confirmBtn.disabled = true;

    try {
        /* 비밀번호 검증: id + password 일치하는 행 조회 */
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/guestbook?id=eq.${gbPending.id}&password=eq.${encodeURIComponent(pw)}&select=id`,
            { headers: gbHeaders }
        );
        const rows = await res.json();
        if (!rows.length) {
            showToast('비밀번호가 맞지 않습니다.');
            return;
        }

        if (gbPending.type === 'delete') {
            await fetch(`${SUPABASE_URL}/rest/v1/guestbook?id=eq.${gbPending.id}`, {
                method: 'DELETE',
                headers: gbHeaders
            });
            closeGbModal();
            await renderGuestbook();
            showToast('메시지가 삭제되었습니다.');
        } else {
            /* 수정: 비밀번호 모달 닫고 수정 모달 열기 */
            document.getElementById('gb-modal').classList.remove('open');
            document.getElementById('gb-edit-modal').classList.add('open');
            setTimeout(() => document.getElementById('gb-edit-msg').focus(), 100);
        }
    } catch {
        showToast('오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
        confirmBtn.disabled = false;
    }
}

/* ── 수정 모달 ── */
function closeEditModal() {
    document.getElementById('gb-edit-modal').classList.remove('open');
    gbPending = null;
}

async function confirmEdit() {
    const newMsg = document.getElementById('gb-edit-msg').value.trim();
    if (!newMsg || !gbPending) return;

    const btn = document.querySelector('#gb-edit-modal .gb-modal-confirm');
    btn.disabled = true;
    btn.textContent = '저장 중...';

    try {
        await fetch(`${SUPABASE_URL}/rest/v1/guestbook?id=eq.${gbPending.id}`, {
            method: 'PATCH',
            headers: gbHeaders,
            body: JSON.stringify({ message: newMsg })
        });
        closeEditModal();
        await renderGuestbook();
        showToast('메시지가 수정되었습니다.');
    } catch {
        showToast('수정 중 오류가 발생했습니다.');
    } finally {
        btn.disabled = false;
        btn.textContent = '저장';
    }
}

/* 모달 바깥 클릭 시 닫기 */
document.getElementById('gb-modal').addEventListener('click', function(e) {
    if (e.target === this) closeGbModal();
});
document.getElementById('gb-edit-modal').addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
});

/* Enter 키로 비밀번호 확인 */
document.getElementById('gb-modal-pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmGbModal();
});

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.addEventListener('DOMContentLoaded', renderGuestbook);

/* ====== 계좌 아코디언 ====== */
function toggleAcc(btn) {
    const content = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    content.hidden = expanded;
}
