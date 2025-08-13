// 준비: 피드와 초기 카드 2개, 센티널
const feed = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const initialPosts = Array.from(feed.querySelectorAll('.post')).slice(0, 2);

let turn = 0;      // 0,1 번갈아
let total = 2;     // 현재 렌더된 카드 개수(처음 2개 있음)

const io = new IntersectionObserver((entries) => {
if (!entries[0].isIntersecting) return;

// 한번에 몇 개 붙일지 
const batch = 2;
for (let i = 0; i < batch; i++) {
    const src = initialPosts[turn % 2];
    const clone = src.cloneNode(true); // 카드 통째로 복제
    // 최적화: 이미지에 lazy 로딩 속성 부여(있으면 무시)
    clone.querySelectorAll('img').forEach(img => img.loading = 'lazy');

    // sentinel 앞에 삽입
    feed.insertBefore(clone, sentinel);

    turn++;
    total++;
}

// 메모리/성능 보호: 화면에 너무 많이 쌓이면 위에서 제거(선택)
const MAX = 30;  // 원하는 값
if (total > MAX) {
    // sentinel과 첫 2개(원본)는 건너뛰고 가장 오래된 복제본부터 제거
    const posts = feed.querySelectorAll('.post');
    if (posts.length > 2) {
    feed.removeChild(posts[0]);
    total--;
    }
}
}, { root: null, rootMargin: '200px', threshold: 0 });

io.observe(sentinel);
