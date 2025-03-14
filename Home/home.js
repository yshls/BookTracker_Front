document.addEventListener('DOMContentLoaded', function () {
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const goalContainer = this.closest('.goal-container');
      goalContainer.classList.toggle('open');
    });
  });
});
