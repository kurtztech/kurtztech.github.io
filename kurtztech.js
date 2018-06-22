$('#k-header').on('click', function() {
  kh = $(this);
  kh.html('<img src = "hackerman.png" />');
  setTimeout(function() {
    kh.html('KURTZTECH');
  }, 500);
});
