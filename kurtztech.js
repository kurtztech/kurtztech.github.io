$('#k-header').on('click', function() {
  kh = $(this);
  kh.html('<img src = "hackerman.png" />');
  setTimeout(() => {
    kh.html('kurtztech');
  }, 500);
});
