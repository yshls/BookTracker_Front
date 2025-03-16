// ========================================
// ✅ 차트바 관련
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  const goalSetup = document.getElementById('goal-setup'); // 목표 설정 UI
  const progressSection = document.getElementById('progress-section'); // 진행 바 영역
  const openModalBtn = document.getElementById('edit-goal'); // 목표 설정 버튼
  const modal = document.getElementById('goalModal'); // 목표 설정 모달
  const closeModalBtn = document.getElementById('cancelGoal'); // 목표 설정 모달 닫기 버튼
  const saveGoalBtn = document.getElementById('saveGoal'); // 목표 저장 버튼
  const goalInput = document.getElementById('goalInput'); // 목표 입력 필드
  const increaseProgressBtn = document.getElementById('increase-progress'); // 책 한 권 읽기 버튼

  let progressChart; // Chart.js 차트 객체
  let currentBooks = 0; // 현재 읽은 책 수
  let totalBooks = 0; // 목표 책 수

  // 처음에는 목표 설정 UI만 보이고, 진행 바 숨김
  progressSection.style.display = 'none';

  // 목표 설정 모달 열기
  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // 목표 저장 버튼 클릭 시 차트 생성
  saveGoalBtn.addEventListener('click', function () {
    let newTotal = goalInput.value;

    if (newTotal && !isNaN(newTotal) && newTotal > 0) {
      totalBooks = parseInt(newTotal);
      document.getElementById('total-books').textContent = totalBooks;
      modal.style.display = 'none';

      // 목표가 설정되면 설정 UI 숨기고 진행 바 표시
      goalSetup.style.display = 'none';
      progressSection.style.display = 'block';

      // Chart.js 진행 바 생성
      const canvas = document.getElementById('progressChart');
      if (!canvas) {
        console.error("⚠️ 'progressChart' 요소를 찾을 수 없습니다.");
        return;
      }
      const ctx = canvas.getContext('2d');

      if (progressChart) {
        progressChart.destroy(); // 기존 차트 삭제 후 새로 생성
      }

      progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['진행률'],
          datasets: [
            {
              label: '독서 진행률',
              data: [(currentBooks / totalBooks) * 100],
              backgroundColor: ['#fb6f92'], //  진행 바 색상 설정
              borderRadius: 10,
              borderSkipped: false,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          categoryPercentage: 1.0, // 진행바 꽉 차게 설정
          barPercentage: 1.0, // 진행바 꽉 차게 설정
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              display: false,
            },
            y: {
              display: false,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      });

      updateProgress();
    }
  });

  // 진행률 업데이트 함수
  function updateProgress() {
    if (progressChart) {
      let progress = totalBooks > 0 ? (currentBooks / totalBooks) * 100 : 0;
      progressChart.data.datasets[0].data = [progress];
      progressChart.update();
    }

    document.getElementById('current-books').textContent = currentBooks;
    document.getElementById('progress-text').textContent = `${Math.round(
      (currentBooks / totalBooks) * 100
    )}%`;
  }

  // 책 한 권 읽기 버튼 클릭 이벤트
  increaseProgressBtn.addEventListener('click', function () {
    if (currentBooks < totalBooks) {
      currentBooks++;
      updateProgress();
    } else {
      alert('🎉 목표를 이미 달성했습니다!');
    }
  });

  // 독서 목표 토글 기능 (펼치기/접기)
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  console.log(`📌 .toggle-btn 요소 개수: ${toggleBtns.length}`);

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const goalContainer = this.closest('.goal-container');

      if (!goalContainer) {
        console.error("⚠️ 'goal-container'를 찾을 수 없습니다.");
        return;
      }

      goalContainer.classList.toggle('open');

      console.log(`📌 goal-container 클래스 목록: ${goalContainer.classList}`);
    });
  });
});

// ========================================
// ✅ 총 몇권 클릭 설정
// ========================================

document.addEventListener('DOMContentLoaded', function () {
  // 총 몇권 클릭 시 모달 열기
  const editGoalBtn = document.querySelector('.edit-goal'); // 총 몇권 클릭
  const modal = document.getElementById('goalModal'); // 모달 선택
  const closeModalBtn = document.getElementById('cancelGoal'); // 모달 닫기 버튼

  if (editGoalBtn) {
    editGoalBtn.addEventListener('click', function () {
      console.log('📌 목표 수정 아이콘 클릭됨! 모달을 엽니다.');
      modal.style.display = 'flex';
    });
  } else {
    console.error('⚠️  목표 수정 아이콘을 찾을 수 없습니다!');
  }

  // 모달 닫기 버튼 클릭 시 닫기
  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  // 모달 바깥 영역 클릭 시 닫기
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// ========================================
// ✅ 드롭 다운(최근 읽은 순, 가나다순순)
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownList = document.querySelector('.dropdown-list');
  const dropdownInput = document.querySelector('.dropdown-input');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  // 드롭다운 기본적으로 닫아두기
  dropdownList.style.display = 'none';

  // 드롭다운 열고 닫기
  dropdownToggle.addEventListener('click', function (event) {
    event.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되지 않도록 방지
    dropdownList.style.display =
      dropdownList.style.display === 'block' ? 'none' : 'block';
  });

  // 옵션 선택 시 input 값 변경 및 닫기
  dropdownItems.forEach((item) => {
    item.addEventListener('click', function () {
      dropdownInput.value = this.textContent; // 선택한 값으로 변경
      dropdownList.style.display = 'none'; // 선택 후 드롭다운 닫기
    });
  });

  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
      dropdownList.style.display = 'none';
    }
  });
});

// ========================================
// ✅ 배경에 글 써져있는거
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.menu'); // 탭 요소들 선택
  const bookDesc = document.querySelector('.book-desc h4'); // 배경 글자 변경할 요소 선택

  // 각 탭 클릭 시 이벤트 추가
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // 기존의 선택된 스타일 제거
      tabs.forEach((t) => t.classList.remove('active'));

      // 클릭된 탭에 활성 클래스 추가
      tab.classList.add('active');

      // 탭 인덱스에 따라 문구 변경
      switch (index) {
        case 0:
          bookDesc.innerHTML =
            '지금 읽고 있는 책을 등록해보세요<i class="fa-regular fa-face-smile"></i>';
          break;
        case 1:
          bookDesc.innerHTML =
            '다 읽은 책을 등록해보세요<i class="fa-regular fa-face-smile"></i>';
          break;
        case 2:
          bookDesc.innerHTML =
            '읽고 싶은 책을 등록해보세요<i class="fa-regular fa-face-smile"></i>';
          break;
      }
    });
  });
});

// ========================================
// ✅ search 기능 읽고 싶어요 불러오기
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  const readingList = document.getElementById('reading-list'); // "읽고 싶어요" 목록 표시할 div

  function fetchReadingList() {
    axios
      .get('http://localhost:8080/api/books/reading-list') // 백엔드 API 호출
      .then((response) => {
        const books = response.data; // 응답 데이터
        displayReadingList(books);
      })
      .catch((error) => {
        console.error('"읽고 싶어요" 목록 불러오기 실패:', error);
      });
  }

  function displayReadingList(books) {
    readingList.innerHTML = ''; // 기존 목록 초기화
    if (books.length === 0) {
      readingList.innerHTML = '<p>읽고 싶은 책이 없습니다.</p>';
      return;
    }

    books.forEach((book) => {
      const div = document.createElement('div');
      div.classList.add('book-item');
      div.innerHTML = `
        <img class="book-cover" src="${book.cover}" alt="${book.title}">
        <div class="book-info">
          <h4 class="book-title">${book.title}</h4>
          <p class="book-author">${book.author} · ${book.publisher}</p>
        </div>
      `;
      readingList.appendChild(div);
    });
  }

  fetchReadingList(); // 페이지 로드 시 실행
});
