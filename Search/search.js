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
  axios
    .get(
      `http://localhost:8080/api/books/search?keyword=${encodeURIComponent(
        keyword
      )}`
    )
    .then((response) => {
      console.log(response.data); // 응답 확인
      renderSearchResults(response.data);
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
    placeholderText.style.display = 'none';
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
            <button class="status-btn"><i class="fa-solid fa-plus"></i>읽고싶어요</button>
        </div>
      `;

      // 상태 선택 이벤트 처리
      const statusBtn = div.querySelector('.status-btn');
      statusBtn.addEventListener('click', () => {
        saveBookStatus(book);
        statusBtn.innerHTML = `<i class="fa-solid fa-check"></i>저장됨`; // 저장되면 상태알려주는 거거
        statusBtn.disabled = true; // 중복 방지
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
  axios
    .post('http://localhost:8080/api/books/save', {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      cover: book.cover,

      status: '읽고 싶어요',
    })
    .then((response) => {
      console.log('저장 성공:', response.data);
    })
    .catch((error) => {
      console.error(
        '저장 중 오류:',
        error.response ? error.response.data : error
      );
    });
}
