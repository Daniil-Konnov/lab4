document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('.js-update-input');
  const deleteButton = document.getElementById('deleteButton');

  if (!inputs.length || !deleteButton) return;

  let locked = false;

  function onFirstInput() {
    if (locked) return;
    locked = true;
    deleteButton.disabled = true;
  }

  inputs.forEach((input) => {
    input.addEventListener('input', onFirstInput, { once: true });
  });
});

