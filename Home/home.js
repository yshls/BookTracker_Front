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
        console.error(" 'progressChart' 요소를 찾을 수 없습니다.");
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
      alert('목표를 이미 달성했습니다!');
    }
  });

  // 독서 목표 토글 기능 (펼치기/접기)
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  console.log(`.toggle-btn 요소 개수: ${toggleBtns.length}`);

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const goalContainer = this.closest('.goal-container');

      if (!goalContainer) {
        console.error("'goal-container'를 찾을 수 없습니다.");
        return;
      }

      goalContainer.classList.toggle('open');

      console.log(`goal-container 클래스 목록: ${goalContainer.classList}`);
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
      console.log('목표 수정 아이콘 클릭됨! 모달을 엽니다.');
      modal.style.display = 'flex';
    });
  } else {
    console.error('목표 수정 아이콘을 찾을 수 없습니다!');
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
// ✅ 배경에 글 써져있는거
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.menu'); // 탭 요소들 선택
  const bookDesc = document.querySelector('.book-desc h4'); // 배경 글자 변경할 요소 선택
  const token = sessionStorage.getItem('Authorization');

  // 로그인하지 않은 경우 메시지 표시 후 함수 종료
  if (!token) {
    bookDesc.innerHTML = '💢 로그인 후 이용 가능합니다. 💢';
    return;
  }

  // 탭 클릭 이벤트 추가
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', async () => {
      // 기존의 선택된 스타일 제거
      tabs.forEach((t) => t.classList.remove('active'));

      // 클릭된 탭에 활성 클래스 추가
      tab.classList.add('active');

      // 선택된 상태에 따라 텍스트 변경
      let status;
      switch (index) {
        case 0:
          status = '읽고 있어요';
          bookDesc.innerHTML =
            '지금 읽고 있는 책을 등록해보세요 <i class="fa-regular fa-face-smile"></i>';
          break;
        case 1:
          status = '다 읽었어요';
          bookDesc.innerHTML =
            '다 읽은 책을 등록해보세요 <i class="fa-regular fa-face-smile"></i>';
          break;
        case 2:
          status = '읽고 싶어요';
          bookDesc.innerHTML =
            '읽고 싶은 책을 등록해보세요 <i class="fa-regular fa-face-smile"></i>';
          break;
      }

      // API 호출하여 해당 상태의 책 가져오기
      try {
        const response = await axios.get(
          `http://localhost:8080/api/books/user-books?status=${status}`,
          {
            headers: { Authorization: token },
          }
        );

        const books = response.data;
        console.log(`${status} 책 목록:`, books);

        // UI 업데이트
        renderBooks(books, status);
        updateBookCount(books);

        return books; // deleteBook에서 사용할 수 있도록 반환
      } catch (error) {
        console.error(`${status} 책 목록 불러오기 실패:`, error);
      }
    });
  });

  // 사용자 책 목록 다시 불러오는 함수
  async function fetchUserBooks() {
    const token = sessionStorage.getItem('Authorization');
    if (!token) {
      console.warn('로그인 필요');
      showToast(
        `<i class="fa-solid fa-triangle-exclamation"></i> 먼저 로그인 해주세요.`
      );
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/api/books/user-books',
        {
          headers: { Authorization: token },
        }
      );

      const books = response.data;
      console.log('새로 불러온 책 목록:', books);

      renderBooks(books); // 목록 다시 렌더링
    } catch (error) {
      console.error('책 목록 불러오기 실패:', error);
    }
  }

  function updateBookCount(books) {
    // 모든 책 개수 합산
    let totalBookCount = books.length;

    // UI 업데이트 (하나의 개수만 표시)
    document.getElementById(
      'total-book-count'
    ).textContent = `${totalBookCount}권`;
  }

  // 책 목록을 UI에 렌더링
  function renderBooks(books) {
    const readingList = document.getElementById('reading-now-list'); // "읽고 있어요" 리스트
    const finishedList = document.getElementById('reading-done-list'); // "다 읽었어요" 리스트
    const wantToReadList = document.getElementById('reading-want-list'); // "읽고 싶어요" 리스트
    const bookDesc = document.querySelector('.book-desc h4'); // 메시지 요소

    // 기존 목록 초기화
    readingList.innerHTML = '';
    finishedList.innerHTML = '';
    wantToReadList.innerHTML = '';

    if (books.length === 0) {
      // 책이 없으면 메시지 표시
      bookDesc.style.display = 'block';
    } else {
      // 책이 있으면 메시지 숨기기
      bookDesc.style.display = 'none';
    }

    books.forEach((book) => {
      const bookItem = document.createElement('div');
      bookItem.classList.add('book-item');
      bookItem.innerHTML = `
     
        <img class="book-cover" src="${book.cover}" alt="${book.title}">
        <div class="book-info">
          <h4 class="book-title">${book.title}
          ${
            book.status === '읽고 있어요' || book.status === '읽고 싶어요'
              ? `<button class="delete-btn" onclick="deleteBook(${book.book_id})">🗑️</button>`
              : ''
          }
              </h4>
          <p class="book-author">${book.author} · ${book.publisher}</p>
          
          <select class="status-select">
            <option value="읽고 싶어요" ${
              book.status === '읽고 싶어요' ? 'selected' : ''
            }>읽고 싶어요</option>
            <option value="읽고 있어요" ${
              book.status === '읽고 있어요' ? 'selected' : ''
            }>읽고 있어요</option>
            <option value="다 읽었어요" ${
              book.status === '다 읽었어요' ? 'selected' : ''
            }> 다 읽었어요</option>
          </select>

          
       </div>
       
      `;

      const statusSelect = bookItem.querySelector('.status-select');
      statusSelect.addEventListener('change', (event) =>
        updateBookStatus(book, event.target.value)
      );

      // 상태별로 적절한 리스트에 추가
      if (book.status === '읽고 싶어요') {
        wantToReadList.appendChild(bookItem);
      } else if (book.status === '읽고 있어요') {
        readingList.appendChild(bookItem);
      } else if (book.status === '다 읽었어요') {
        finishedList.appendChild(bookItem);
      }
    });
  }

  // 책 상태 변경 함수
  // 책 상태 변경 함수
  async function updateBookStatus(book, newStatus) {
    const token = sessionStorage.getItem('Authorization');

    try {
      // 서버로 요청 보낼 데이터 확인 (book_id가 올바르게 전달되는지 확인)
      console.log('변경 요청:', {
        book_id: book.book_id,
        status: newStatus,
      });

      await axios.put(
        'http://localhost:8080/api/books/update-status',
        {
          book_id: book.book_id, //
          status: newStatus,
        },
        {
          headers: { Authorization: token },
        }
      );

      showToast(`${book.title} 상태가 '${newStatus}'로 변경되었습니다.`);

      // 변경 후, 해당 상태의 책 목록만 다시 불러오기
      fetchUserBooks(newStatus); // 변경된 상태의 목록만 다시 렌더링
    } catch (error) {
      console.error('책 상태 변경 실패:', error);
      showToast('상태 변경 중 오류 발생');
    }
  }

  async function fetchUserBooks(status = null) {
    const token = sessionStorage.getItem('Authorization');
    if (!token) {
      console.warn('로그인 필요');
      showToast(
        `<i class="fa-solid fa-triangle-exclamation"></i> 먼저 로그인 해주세요.`
      );
      return [];
    }

    try {
      let url = 'http://localhost:8080/api/books/user-books';
      if (status) {
        url += `?status=${status}`; // 특정 상태만 불러오기
      }

      const response = await axios.get(url, {
        headers: { Authorization: token },
      });

      const books = response.data;
      console.log(`${status || '전체'} 책 목록 불러옴:`, books);

      renderBooks(books, status); // 특정 상태만 렌더링
      return books;
    } catch (error) {
      console.error('책 목록 불러오기 실패:', error);
      return [];
    }
  }

  // 책삭제
  async function deleteBook(book_id) {
    const token = sessionStorage.getItem('Authorization');

    console.log('📌 삭제 요청 - book_id:', book_id, 'token:', token);

    if (!token) {
      console.error('❌ 인증 토큰이 없습니다. 로그인하세요.');
      alert('로그인이 필요합니다.');
      return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/books/delete?book_id=${book_id}`,
        {
          headers: { Authorization: token },
        }
      );

      console.log('📌 삭제 성공:', response.data);
      alert(response.data); // 서버에서 온 응답 메시지 표시

      // 페이지 자동 새로고침 (삭제 후 목록 갱신)
      window.location.reload();
    } catch (error) {
      console.error('❌ 책 삭제 실패:', error.response?.data || error.message);
      alert('삭제 실패: ' + (error.response?.data || '서버 오류'));
    }
  }

  window.deleteBook = deleteBook; // 전역 함수로 등록
});

function moveBookToNewStatus(book, newStatus) {
  // 기존 목록에서 제거
  document.querySelectorAll('.book-item').forEach((item) => {
    if (item.querySelector('.book-title').innerHTML === book.title) {
      item.remove();
    }
  });

  // 상태 변경 후 새로운 목록에 추가
  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.innerHTML = `
    <img class="book-cover" src="${book.cover}" alt="${book.title}">
    <div class="book-info">
      <h4 class="book-title">${book.title}</h4>
      <p class="book-author">${book.author} · ${book.publisher}</p>
      <select class="status-select">
        <option value="읽고 싶어요" ${
          newStatus === '읽고 싶어요' ? 'selected' : ''
        }> 읽고 싶어요</option>
        <option value="읽고 있어요" ${
          newStatus === '읽고 있어요' ? 'selected' : ''
        }> 읽고 있어요</option>
        <option value="다 읽었어요" ${
          newStatus === '다 읽었어요' ? 'selected' : ''
        }> 다 읽었어요</option>
      </select>
    </div>
  `;

  // 상태 선택 시 다시 변경 가능하도록 이벤트 추가
  const statusSelect = bookItem.querySelector('.status-select');
  statusSelect.addEventListener('change', (event) =>
    updateBookStatus(book, event.target.value)
  );

  // 새로운 상태에 따라 적절한 리스트에 추가
  if (newStatus === '읽고 싶어요') {
    document.getElementById('reading-want-list').appendChild(bookItem);
  } else if (newStatus === '읽고 있어요') {
    document.getElementById('reading-now-list').appendChild(bookItem);
  } else if (newStatus === '다 읽었어요') {
    document.getElementById('reading-done-list').appendChild(bookItem);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const scrollContainer = document.getElementById('scrollContainer');
  const addBtn = document.getElementById('addBtn');

  let lastScrollTop = 0;

  scrollContainer.addEventListener('scroll', function () {
    const st = scrollContainer.scrollTop;
    if (st > lastScrollTop) {
      addBtn.style.opacity = '0';
    } else {
      addBtn.style.opacity = '1';
    }
    lastScrollTop = st;
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const scrollerCotainer = document.getElementById('scrollerCotainer');
  const addBtn = document.getElementById('addBtn');

  let lastScrollTop = 0;

  scrollerCotainer.addEventListener('scroll', function () {
    const st = scrollerCotainer.scrollTop;
    if (st > lastScrollTop) {
      addBtn.style.opacity = '0';
    } else {
      addBtn.style.opacity = '1';
    }
    lastScrollTop = st;
  });
});

// ========================================
// ✅ 로그인 상태 확인 후 UI 변경
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  const authLinks = document.getElementById('authLinks');
  const userName = document.getElementById('userName');
  const token = sessionStorage.getItem('Authorization');
  const nickname = sessionStorage.getItem('nickname');

  if (token && nickname) {
    // 로그인 상태
    userName.textContent = nickname + '님';
    authLinks.innerHTML = `<li><a href="#" id="logoutBtn">Logout</a></li>`;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    //  로그아웃 상태 (자동 로그아웃 후에도 이 상태로 보이게 됨)
    userName.textContent = '💢 로그인 후 이용해주세요.';
    authLinks.innerHTML = `
      <li><a href="../SignUp/signup.html">SignUp</a></li>
      <p id="slash">|</p>
      <li><a href="../Login/login.html">Login</a></li>
    `;
  }
});

// ========================================
// ✅ 로그아웃 함수 -> 로그인 화면으로 이동
// ========================================
async function logout() {
  const token = sessionStorage.getItem('Authorization');

  if (!token) {
    sessionStorage.clear();
    window.location.href = '../Login/login.html';
    return;
  }

  try {
    // 백엔드에 로그아웃 요청
    await axios.post(
      'http://localhost:8080/logout',
      {},
      {
        headers: { Authorization: token },
      }
    );
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error);
  }

  // 클라이언트의 sessionStorage 삭제 후 로그인 페이지로 이동
  sessionStorage.clear();
  window.location.href = '../Login/login.html';
}

// `setInterval`의 ID를 저장할 변수
let loginCheckInterval = setInterval(checkLoginStatus, 60000);

// ===========================================
// ✅ 로그아웃 상태 확인 함수 -> 모달창 띄우기
// ===========================================
async function checkLoginStatus() {
  const token = sessionStorage.getItem('Authorization');

  if (!token) return; // 토큰이 없으면 그냥 return (로그인 안 된 상태)

  try {
    const response = await axios.get('http://localhost:8080/checkToken', {
      headers: { Authorization: token },
    });

    if (response.data.expired === 'true') {
      clearInterval(loginCheckInterval); //  세션 만료 시 `setInterval` 중지
      showLogoutModal(); // 로그아웃 모달 띄우기
    }
  } catch (error) {
    console.error('❌ 로그인 상태 확인 오류:', error);
  }
}

// ===========================================
// ✅ 로그아웃 모달 띄우기
// ===========================================
function showLogoutModal() {
  const existingModal = document.getElementById('logoutModal');
  if (existingModal) return; // 이미 모달이 있다면 추가 생성 X

  const modal = document.createElement('div');
  modal.id = 'logoutModal';
  modal.classList.add('modal-bg');
  modal.innerHTML = `
      <div class="modal-box">
          <p>❌ 세션이 만료되었습니다. ❌<hr>계속하려면 다시 로그인해 주세요.</p>
          <button id="logoutNoBtn" class="btn-no">No</button>
          <button id="logoutYesBtn" class="btn-yes">Yes</button>
      </div>
  `;

  document.body.appendChild(modal);

  //  "네(Yes)" 버튼 클릭 시 로그인 페이지로 이동
  document
    .getElementById('logoutYesBtn')
    .addEventListener('click', function () {
      sessionStorage.clear(); // 세션스토리지 삭제
      window.location.href = '../Login/login.html'; // 로그인 페이지로 이동
    });

  // "아니요(No)" 버튼 클릭 시 모달만 닫고 홈 화면 리로드 (로그아웃된 상태)
  document.getElementById('logoutNoBtn').addEventListener('click', function () {
    sessionStorage.clear(); // 세션스토리지 삭제
    modal.remove(); // 모달 제거
    location.reload(); // 홈 화면 리로드
  });
}
