document.addEventListener('DOMContentLoaded', function () {
  const signupBtn = document.getElementById('signupBtn');

  function createModal(message) {
    const modal = document.createElement('div');
    modal.innerHTML = `
            <div class="modal-bg">
                <div class="modal-box">
                    <p>${message}</p>
                    <button id="closeModalBtn">확인</button>
                </div>
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

  signupBtn.addEventListener('click', function (event) {
    event.preventDefault(); // 기본 폼 제출 방지
    createModal('회원가입이 완료되었습니다!');
  });
});

document.getElementById('backBtn').addEventListener('click', function () {
  window.location.href = '../Home/home.html';
});
