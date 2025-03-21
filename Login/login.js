// ========================================
// ✅ 로그인 기능 함수
// ========================================
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pwd = document.getElementById('pwd').value;
  const data = { email, pwd };

  try {
    const response = await axios.post('http://localhost:8080/tokenLogin', data);

    if (response.data.msg === 'ok') {
      const token = response.data.Authorization;
      console.log('Authorization:', token);

      // sessionStorage에 저장
      sessionStorage.setItem('Authorization', token);
      sessionStorage.setItem('nickname', response.data.nickname);

      // Axios 전역 Authorization 헤더 설정
      axios.defaults.headers.common['Authorization'] = token;

      // 로그인 성공 모달 표시
      okModal('로그인이 완료되었습니다 ❗');
    } else {
      failModal('❌ email 또는 password ❌<hr>다시 입력해주세요.');
    }
  } catch (error) {
    console.error('❌ 로그인 오류 :<br>', error);
    failModal('❌ 로그인 중 오류가 발생했습니다. ❌');
  }
});

// ========================================
// ✅ 로그인 상태 유지 (페이지 새로고침 후에도 유지)
// ========================================
const Authorization = sessionStorage.getItem('Authorization');
const nickname = sessionStorage.getItem('nickname');

if (Authorization && nickname) {
  axios.defaults.headers.common['Authorization'] = Authorization;
  document.getElementById('loginSpan').innerHTML = `${nickname}  
    <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`;
}

// ========================================
// ✅ 비밀번호 보이기 버튼
// ========================================
const togglePwd = document.getElementById('togglePwd');
const pwdInput = document.getElementById('pwd');
const eyeIcon = togglePwd.querySelector('i');

togglePwd.addEventListener('mousedown', function () {
  pwdInput.type = 'text';
  eyeIcon.classList.remove('fa-eye');
  eyeIcon.classList.add('fa-eye-slash');
});

togglePwd.addEventListener('mouseup', function () {
  pwdInput.type = 'password';
  eyeIcon.classList.remove('fa-eye-slash');
  eyeIcon.classList.add('fa-eye');
});

// ========================================
// ✅ 로그인 성공 모달 생성 함수
// ========================================
function okModal(message) {
  const modal = document.createElement('div');
  modal.classList.add('modal-bg');
  modal.innerHTML = `
      <div class="modal-box">
          <p>${message}</p>
          <button id="closeModalBtn">확인</button>
      </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById('closeModalBtn')
    .addEventListener('click', function () {
      modal.remove();
      window.location.href = '../Home/home.html';
    });
}

// ========================================
// ✅ 로그인 실패 모달 생성 함수
// ========================================
function failModal(message) {
  const modal = document.createElement('div');
  modal.classList.add('modal-bg');
  modal.innerHTML = `
      <div class="modal-box">
          <p>${message}</p>
          <button id="closeModalBtn">확인</button>
      </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById('closeModalBtn')
    .addEventListener('click', function () {
      modal.remove();
    });
}

// ========================================
// ✅ 가입하기 버튼 (회원가입 화면으로 이동)
// ========================================
document.getElementById('signupBtn').addEventListener('click', function () {
  window.location.href = '../SignUp/signup.html';
});

// ========================================
// ✅ back 버튼 (홈화면으로 이동)
// ========================================
document.getElementById('backBtn').addEventListener('click', function () {
  window.location.href = '../Home/home.html';
});
