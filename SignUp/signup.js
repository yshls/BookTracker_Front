// ========================================
// ✅ 회원가입 기능 함수
// ========================================
document.getElementById('signupBtn').addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("pwd").value;
  const nickname = document.getElementById("nickname").value;

  const data = {email, pwd, nickname};

  try {
    let response = await fetch("http://localhost:8080/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    response = await response.json();
    console.log(response);

    if (response.msg === "ok") {
      console.log("ok");

      // 모달 생성 함수 호출
      okModal("회원가입이 완료되었습니다!");
    } else {
      failModal("❌ nickname이나 email이 중복됩니다. ❌<br>다시 가입해주세요!");
    }
  } catch (error) {
    console.error("❌ 회원가입 오류:", error);
    failModal("❌ 회원가입 중 오류가 발생했습니다. ❌");
  }
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
          <button id="closeModalBtn">확인</button>
      </div>
  `;

  document.body.appendChild(modal);

  // 확인 버튼 클릭 시 모달 제거 및 홈 이동
  document.getElementById('closeModalBtn').addEventListener('click', function () {
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

  // 확인 버튼 클릭 시 모달 제거
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
