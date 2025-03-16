// ========================================
// ✅ 회원가입 기능
// ========================================
document.getElementById('signupBtn').addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("pwd").value;
  const nickname = document.getElementById("nickname").value;

  const data = {email, pwd, nickname};

  if (!isNicknameChecked) {
    failModal("❌ 닉네임 중복 확인을 해주세요! ❌");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/insertUser" , data);

    if (response.data.msg === "ok") {
      okModal("✅회원가입이 완료되었습니다!✅<hr><br>바로 로그인하러 가실까요?");
    } else {
      const errorMessage = response.data.msg;

      if (errorMessage.includes("유효하지 않은 이메일 형식")) {
        failModal("❌ 이메일 형식이 올바르지 않습니다. ❌<br>다시 입력해주세요!");
      } else if (errorMessage.includes("패스워드는 8자리 이상")) {
        failModal("❌ 비밀번호는 8자리 이상이며,<br>특수문자와 숫자를 포함해야 합니다. ❌");
      } else if (errorMessage.includes("email")) {
        failModal("❌ email이 중복됩니다. ❌<br>다시 가입해주세요!");
      } else {
        failModal("❌ 회원가입 중 오류가 발생했습니다. ❌");
      }
    }
  } catch (error) {
    console.error("❌ 회원가입 오류 :<br>", error);
    failModal("❌ 회원가입 중 오류가 발생했습니다. ❌");
  }
});

// ========================================
// ✅ 닉네임 중복 확인 버튼
// ========================================
let isNicknameChecked = false;

document.getElementById('checknameBtn').addEventListener("click", async () => {
  const nickname = document.getElementById("nickname").value;
  const messageDiv = document.getElementById("nicknameMessage");

  if (!nickname) {
      messageDiv.innerText = "💢 닉네임을 입력하세요.";
      messageDiv.className = "nickname-message nickname-taken";
      return;
  }

  try {
      const response = await axios.get("http://localhost:8080/checkNickname", {
        params: { nickname }
      });
      
      if (response.data.available) {
          messageDiv.innerText = "✅ 사용 가능한 닉네임입니다.";
          messageDiv.className = "nickname-message nickname-available";
          isNicknameChecked = true; 
      } else {
          messageDiv.innerText = "❌ 닉네임이 이미 사용 중입니다.";
          messageDiv.className = "nickname-message nickname-taken";
          isNicknameChecked = false;
      }
  } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      messageDiv.innerText = "❌ 닉네임 확인 중 오류 발생!";
      messageDiv.className = "nickname-message nickname-taken";
      isNicknameChecked = false;
  }
});

// ========================================
// ✅ 비밀번호 보이기 버튼
// ========================================
const togglePwd = document.getElementById("togglePwd");
const pwdInput = document.getElementById("pwd");
const eyeIcon = togglePwd.querySelector("i"); 

togglePwd.addEventListener("mousedown", function () {
  pwdInput.type = "text"; 
  eyeIcon.classList.remove("fa-eye");
  eyeIcon.classList.add("fa-eye-slash"); 
});

togglePwd.addEventListener("mouseup", function () {
  pwdInput.type = "password"; 
  eyeIcon.classList.remove("fa-eye-slash");
  eyeIcon.classList.add("fa-eye"); 
});

// ========================================
// ✅ 회원가입 성공 모달 생성 함수
// ========================================
function okModal(message) {
  const modal = document.createElement('div');
  modal.classList.add("modal-bg");
  modal.innerHTML = `
      <div class="modal-box">
          <p>${message}</p>
          <button id="noModalBtn">No</button>
          <button id="okModalBtn">Yes</button>
      </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('okModalBtn').addEventListener('click', function () {
    modal.remove();
    window.location.href = '../Login/login.html';
  });

  document.getElementById('noModalBtn').addEventListener('click', function () {
    modal.remove();
    window.location.href = '../Home/home.html';
  });
}

// ========================================
// ✅ 회원가입 실패 모달 생성 함수
// ========================================
function failModal(message) {
  const modal = document.createElement('div');
  modal.classList.add("modal-bg");
  modal.innerHTML = `
      <div class="modal-box">
          <p>${message}</p>
          <button id="closeModalBtn">확인</button>
      </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('closeModalBtn').addEventListener('click', function () {
    modal.remove();
  });
}

// ========================================
// ✅ back 버튼 (홈화면으로 이동)
// ========================================
document.getElementById('backBtn').addEventListener('click', function () {
  window.location.href = '../Home/home.html';
});
