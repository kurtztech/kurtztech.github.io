function flagTransform() {
  let tl = new TimelineMax();
  if ($('.title').html() !== 'France')
    tl.to(
      '.title',
      0.5,
      { text: { value: 'France', newClass: 'title-fr' } },
      0
    );

  tl.to('.blue', 1, { height: '160', y: '320', backgroundColor: '#171796' }, 1);
  tl.to('.white', 1, { height: '160', y: '160' }, 1);
  tl.to('.red', 1, { height: '160', y: '0', backgroundColor: '#FF0000' }, 1);
  tl.to('.title', 0.5, { text: { value: 'Vs.', newClass: 'title-vs' } }, 1);

  tl.fromTo('.croat', 1.5, { y: '0' }, { y: '375', ease: Bounce.easeOut }, 1.5);

  tl.to('.blue', 1, { width: '639', x: '0' }, 2);
  tl.to('.white', 1, { width: '639', x: '-213' }, 2);
  tl.to('.red', 1, { width: '639', x: '-426' }, 2);
  tl.to('.title', 0.5, { text: { value: 'Croatia', newClass: 'title-cr' } }, 2);

  tl.to('.blue', 1, { width: '213', x: '0' }, 3);
  tl.to('.white', 1, { width: '213', x: '0' }, 3);
  tl.to('.red', 1, { width: '213', x: '0' }, 3);
  tl.to('.title', 0.5, { text: { value: 'Vs.', newClass: 'title-vs' } }, 3);

  tl.to('.blue', 1, { height: '480', y: '0', backgroundColor: '#00267f' }, 4);
  tl.to('.white', 1, { height: '480', y: '0' }, 4);
  tl.to('.red', 1, { height: '480', y: '0', backgroundColor: '#f31830' }, 4);
  tl.to('.croat', 0.75, { ease: Back.easeIn.config(1.5), y: '800' }, 4);
  tl.to('.title', 0.5, { text: { value: 'France', newClass: 'title-fr' } }, 4);
}

flagTransform();

setInterval(function() {
  flagTransform();
}, 4500);
