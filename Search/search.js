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
      console.log(response.data); // 응답 확인을 큰솔에 출력
      renderSearchResults(response.data); // 검색 결과를 화면에 반응
    })
    .catch((error) => {
      console.error('API 요청 중 에러 발생:', error); // 에러메시지
      resultArea.innerHTML = '검색 중 오류가 발생했습니다.';
    });
}

//  검색 결과를 렌더링하는 함수
function renderSearchResults(data) {
  resultArea.innerHTML = ''; // 브라우저 초기화

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

      // 상태 버튼
      const statusBtn = div.querySelector('.status-btn');

      statusBtn.addEventListener('click', () => {
        const token = sessionStorage.getItem('Authorization'); //사용자가 로그인했는지를 확인하는 거, 그래서 토큰 가져옴

        if (!token) {
          showToast(
            `<i class="fa-solid fa-triangle-exclamation"></i> 먼저 로그인 해주세요.`
          ); // 로그인 안했으면 알림 표시
          return;
        }

        saveBookStatus(book)
          .then((response) => {
            if (response.status === 200) {
              statusBtn.innerHTML = `<i class="fa-solid fa-check"></i> 저장됨`; //  저장 성공 표시
              statusBtn.disabled = true; //  중복 클릭 방지
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              showToast(
                `<i class="fa-solid fa-check"></i> 이미 추가된 책입니다.`
              ); //  409 응답 처리
              statusBtn.innerHTML = `<i class="fa-solid fa-check"></i> 이미 저장됨`;
              statusBtn.disabled = true; // 버튼 비활성화
            } else if (error.response && error.response.status === 400) {
              showToast(
                `<i class="fa-solid fa-triangle-exclamation"></i> 먼저 로그인 해주세요.`
              ); // 400 응답 처리
            } else {
              showToast(`<i class="fa-solid fa-x"></i> 저장 중 오류 발생`);
            }
          });
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

function saveBookStatus(book) {
  const token = sessionStorage.getItem('Authorization'); // 로그인 토큰 가져오기

  axios
    .post(
      'http://localhost:8080/api/books/save',
      {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        cover: book.cover,
        status: '읽고 싶어요',
      },
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        // 200 응답일 때만 UI 업데이트
        showToast(`<i class="fa-solid fa-book"></i> 책이 담겼습니다.`);

        updateBookUI(book.title); // UI 업데이트 (버튼 변경)
      }
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 409) {
          showToast(
            `<i class="fa-solid fa-triangle-exclamation"></i> 이미 담겨 있습니다.`
          ); // 409 응답 처리
        } else {
          showToast(`<i class="fa-solid fa-x"></i> 책 저장 중 오류 발생.`);
        }
      } else {
        showToast(`<i class="fa-solid fa-x"></i> 서버 응답 없음.`);
      }
    });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast-message');
  toast.innerHTML = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log(' 페이지 로드 완료, 책 상태 업데이트 시작');

  const token = sessionStorage.getItem('Authorization'); // 저장된 로그인 토큰 가져오기
  if (!token) {
    console.log('토큰 없음, 로그인 필요');
    return;
  }

  axios
    .get('http://localhost:8080/api/books/user-books', {
      headers: { Authorization: token }, //  로그인한 사용자의 책 목록 요청
    })
    .then((response) => {
      const userBooks = response.data;
      console.log(
        `<i class="fa-solid fa-book"></i> 사용자 책 목록:`,
        userBooks
      );

      // UI 업데이트 (저장된 책 버튼 상태 유지)
      userBooks.forEach((book) => updateBookUI(book.title));
    })
    .catch((error) => {
      console.error('사용자 책 목록 로드 실패:', error);
    });
});

// 처음 눌렀을때 저장되는 버튼 문구
function updateBookUI(title) {
  console.log(` UI 업데이트 실행됨: ${title}`); // 디버깅 메시지 추가

  document.querySelectorAll('.book-item').forEach((item) => {
    if (item.querySelector('.book-title').innerText === title) {
      const button = item.querySelector('.status-btn');
      button.innerHTML = `<i class="fa-solid fa-check"></i> 저장됨`;
      button.disabled = true; // 중복 클릭 방지
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('Authorization'); // 로그인 상태 확인

  document.querySelectorAll('.status-btn').forEach((button) => {
    if (!token) {
      button.disabled = true; // 로그인 안 했으면 버튼 비활성화
      button.addEventListener('click', () =>
        showToast(
          `<i class="fa-solid fa-triangle-exclamation"></i> 로그인 먼저 해주세요.`
        )
      );
    } else {
      button.disabled = false; // 로그인 했으면 버튼 활성화
      button.addEventListener('click', (event) => {
        const bookElement = event.target.closest('.book-item');
        const book = {
          title: bookElement.querySelector('.book-title').innerText,
          author: bookElement
            .querySelector('.book-author')
            .innerText.split('·')[0]
            .trim(),
          publisher:
            bookElement
              .querySelector('.book-author')
              .innerText.split('·')[1]
              ?.trim() || '',
          cover: bookElement.querySelector('.book-cover').src,
          status: '읽고 싶어요',
        };
        saveBookStatus(book); //  책 저장 요청 실행
      });
    }
  });
});

// function enableButtonsAfterLogin() {
//   const token = sessionStorage.getItem('Authorization'); // 로그인 토큰 확인
//   if (token) {
//     document.querySelectorAll('.status-btn').forEach((button) => {
//       button.disabled = false; // 로그인 후 버튼 활성화
//       button.removeEventListener('click', showToast); // 기존의 "로그인 먼저 하세요" 메시지 제거
//     });
//   }
// }

// document.getElementById('loginBtn').addEventListener('click', async () => {
//   const email = document.getElementById('loginEmail').value;
//   const pwd = document.getElementById('loginPwd').value;
//   const data = { email, pwd };

//   const response = await axios.post('http://localhost:8080/tokenLogin', data);

//   if (response.data.Authorization) {
//     sessionStorage.setItem('Authorization', response.data.Authorization);
//     sessionStorage.setItem('nickname', response.data.nickname);
//     axios.defaults.headers.common['Authorization'] =
//       response.data.Authorization;
//     // 로그인 후 버튼 활성화
//     enableButtonsAfterLogin();

//     showToast(` ${response.data.nickname}님, 환영합니다!`);
//   } else { 로그인 실패. 다시 시도해주세요.');
//   }
// });

