// ========================================
// ✅ 도서 검색
// ========================================
const inputField = document.getElementById('searchInput');
const resultArea = document.getElementById('resultArea');
const clearBtn = document.getElementById('clearBtn');

// 엔터 입력 시 검색 실행
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchBooks(inputField.value);
  }
});

// clear 버튼 클릭 시 초기화
clearBtn.addEventListener('click', () => {
  inputField.value = '';
  resultArea.innerHTML = '';
});

// 도서 검색 함수
function searchBooks(keyword) {
  fetch(
    `http://localhost:8080/api/books/search?keyword=${encodeURIComponent(
      keyword
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // 응답 확인
      renderSearchResults(data); // ✅ 함수명 변경
    })
    .catch((error) => {
      console.error('API 요청 중 에러 발생:', error);
      resultArea.innerHTML = '검색 중 오류가 발생했습니다.';
    });
}

//  검색 결과를 렌더링하는 함수
function renderSearchResults(data) {
  resultArea.innerHTML = ''; // 초기화

  const placeholderText = document.getElementById('placeholderText');

  if (placeholderText) {
    placeholderText.style.display = 'none'; // ✅ 검색 시 문구 숨기기
  }

  if (data && data.item && data.item.length > 0) {
    data.item.forEach((book) => {
      const div = document.createElement('div');
      div.classList.add('book-item');
      div.innerHTML = `
        <img class="book-cover" src="${book.cover}" alt="${book.title}">
        <div class="book-info">
          <h4 class="book-title">${book.title}</h4>
          <p class="book-author">${book.author} · ${book.publisher}</p>
          <div class="book-status-dropdown">
            <button class="status-btn">읽고싶어요 <i class="fa-solid fa-chevron-down"></i></button>
            <ul class="status-list">
              <li data-status="reading">읽고 있어요</li>
              <li data-status="completed">다 읽었어요</li>
              <li data-status="want">읽고 싶어요</li>
            </ul>
          </div>
        </div>
      `;

      // 드롭다운 이벤트 추가
      const statusBtn = div.querySelector('.status-btn');
      const statusList = div.querySelector('.status-list');

      statusBtn.addEventListener('click', () => {
        statusList.classList.toggle('show');
      });

      // 상태 선택 이벤트 처리
      statusList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          const selectedStatus = e.target.getAttribute('data-status');
          statusBtn.innerHTML = `${e.target.textContent} <i class="fa-solid fa-chevron-down"></i>`;
          statusList.classList.remove('show');

          //  상태를 백엔드로 저장
          saveBookStatus(book, selectedStatus);
        }
      });

      resultArea.appendChild(div);

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    });
  } else {
    resultArea.innerHTML = '검색 결과가 없습니다.';
  }
}

//  상태 저장 요청 함수
function saveBookStatus(book, status) {
  fetch('http://localhost:8080/api/books/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      cover: book.cover,
      status: status,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('저장 성공:', data);
    })
    .catch((error) => {
      console.error('저장 중 오류:', error);
    });
}
