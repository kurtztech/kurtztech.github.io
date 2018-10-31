function changeHeader() {
  document.querySelector('#k-title').classList.toggle('hidden');
  document.querySelector('#hackerman').classList.toggle('hidden');
}

document.querySelector('#k-header').addEventListener('mouseenter', changeHeader);
document.querySelector('#k-header').addEventListener('mouseleave', changeHeader);
