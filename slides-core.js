// ---------------------------------------------------------------
// 슬라이드 덱 뷰어 — slides.html(전체 화면)과 홈페이지 마인드맵의
// 인라인 카드가 공유한다. 필요한 마크업은 전부 여기서 만들어 붙이므로,
// host는 빈 요소 하나만 넘기면 된다.
//
//   mountSlideDeck(el, {
//     manifestUrl: 'slides/manifest.json',
//     imageBase:   'slides/images/',
//     dots:     true,   // 우측 점 네비게이션
//     progress: true,   // 상단 진행 바
//     keyboard: true,   // ← / → / Space
//     emptyText: '...'  // 슬라이드가 없을 때 보여줄 안내
//   });
//
// 매니페스트는 이미지 파일명을 순서대로 담은 배열이다:
//   ["deck-1.png", "deck-2.png", ...]
// ---------------------------------------------------------------

function mountSlideDeck(root, options) {
  if (!root) return;
  var opts = options || {};
  var manifestUrl = opts.manifestUrl || 'slides/manifest.json';
  var imageBase = opts.imageBase || 'slides/images/';
  var useDots = opts.dots !== false;
  var useProgress = opts.progress !== false;
  var useKeyboard = opts.keyboard === true;
  var emptyText = opts.emptyText ||
    '아직 등록된 슬라이드가 없습니다. slides/images/ 에 PNG를 넣고 slides/manifest.json에 추가해보세요.';

  root.classList.add('deck');
  if (useDots) root.classList.add('has-dots');

  var statusEl = document.createElement('div');
  statusEl.className = 'deck-status';
  statusEl.textContent = '슬라이드를 불러오는 중…';
  root.appendChild(statusEl);

  var progressFill = null;
  if (useProgress) {
    var progress = document.createElement('div');
    progress.className = 'deck-progress';
    progressFill = document.createElement('div');
    progressFill.className = 'deck-progress-fill';
    progress.appendChild(progressFill);
    root.appendChild(progress);
  }

  var dotsWrap = null;
  if (useDots) {
    dotsWrap = document.createElement('div');
    dotsWrap.className = 'deck-dots';
    root.appendChild(dotsWrap);
  }

  function makeArrow(cls, label, text) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'deck-arrow ' + cls;
    b.setAttribute('aria-label', label);
    b.textContent = text;
    b.hidden = true; // 슬라이드가 실제로 있을 때만 노출
    root.appendChild(b);
    return b;
  }
  var prevBtn = makeArrow('deck-prev', '이전 슬라이드', '‹');
  var nextBtn = makeArrow('deck-next', '다음 슬라이드', '›');

  var countEl = document.createElement('div');
  countEl.className = 'deck-count';
  countEl.hidden = true;
  root.appendChild(countEl);

  var slides = [];
  var dots = [];
  var current = 0;

  fetch(manifestUrl, { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('manifest.json을 찾을 수 없습니다');
      return res.json();
    })
    .then(function (entries) {
      if (!entries || entries.length === 0) {
        statusEl.textContent = emptyText;
        return;
      }
      buildSlides(entries);
      statusEl.classList.add('hidden');
      prevBtn.hidden = false;
      nextBtn.hidden = false;
      countEl.hidden = false;
    })
    .catch(function (err) {
      console.error(err);
      statusEl.textContent = '슬라이드를 불러오지 못했습니다: ' + err.message;
    });

  function buildSlides(entries) {
    entries.forEach(function (entry, i) {
      // 파일명 문자열이 기본. 예전 형식({file: ...})도 조용히 받아준다.
      var file = typeof entry === 'string' ? entry : (entry && entry.file);
      if (!file) return;

      var section = document.createElement('section');
      section.className = 'slide';

      var img = document.createElement('img');
      img.src = imageBase + file;
      img.alt = '슬라이드 ' + (i + 1);
      img.loading = i < 2 ? 'eager' : 'lazy';
      section.appendChild(img);

      root.insertBefore(section, prevBtn);
      slides.push(section);

      if (dotsWrap) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'deck-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', '슬라이드 ' + (i + 1) + '로 이동');
        dot.addEventListener('click', (function (idx) {
          return function () { goTo(idx); };
        })(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    });

    render();
  }

  function render() {
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === current);
    });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    if (progressFill) {
      progressFill.style.width = (((current + 1) / slides.length) * 100) + '%';
    }
    countEl.innerHTML = '<b>' + (current + 1) + '</b> / ' + slides.length;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  function goTo(index) {
    if (slides.length === 0) return;
    if (index < 0 || index >= slides.length || index === current) return;
    current = index;
    render();
  }

  nextBtn.addEventListener('click', function () { goTo(current + 1); });
  prevBtn.addEventListener('click', function () { goTo(current - 1); });

  if (useKeyboard) {
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    });
  }

  // 터치 스와이프는 덱 안에서만 처리한다(페이지 전체 스와이프를 가로채지 않도록).
  var touchStartX = null;
  root.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
    touchStartX = null;
  }, { passive: true });
}
