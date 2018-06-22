$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover focus click'
  });

  $('#level-up-warehouse').on('click', () => {
    if (currentDollars.gte(shipUpPrice)) {
      currentDollars = currentDollars.minus(shipUpPrice);
      maxShipment = maxShipment.times(BigNumber('100'));
      shipUpPrice = shipUpPrice.times(BigNumber('1000'));
      $('#level-up-warehouse')
        .attr(
          'data-original-title',
          `100X Shipping Capacity $${numOut(shipUpPrice)}`
        )
        .tooltip('hide')
        .tooltip('show');
      upgradeTimeI = upgradeTimeF;
      upgradeTimeF = Date.now();
      refresh();
    }
  });

  $('#level-up-mint').on('click', () => {
    if (currentDollars.gte(levelUpPrice)) {
      currentDollars = currentDollars.minus(levelUpPrice);
      maxMinting = maxMinting.times(BigNumber('2'));
      levelUpPrice = levelUpPrice.times(BigNumber('2.5'));
      $('#level-up-mint')
        .attr('data-original-title', `2X Minting Rate $${numOut(levelUpPrice)}`)
        .tooltip('hide')
        .tooltip('show');
      upgradeTimeI = upgradeTimeF;
      upgradeTimeF = Date.now();
      refresh();
    }
  });

  $('#level-up-bank').on('click', () => {
    if (currentDollars.gte(coinUpPrice)) {
      currentDollars = currentDollars.minus(coinUpPrice);
      coinPrice = coinPrice.times(BigNumber('2'));
      coinUpPrice = coinUpPrice.times(BigNumber('25'));
      $('#level-up-bank')
        .attr('data-original-title', `2X Coin Value $${numOut(coinUpPrice)}`)
        .tooltip('hide')
        .tooltip('show');
      upgradeTimeI = upgradeTimeF;
      upgradeTimeF = Date.now();
      refresh();
    }
  });

  $('#bank')
    .mousedown(() => {
      clickBonus = BigNumber('3');
      refresh();
    })
    .bind('mouseup mouseleave', () => {
      clickBonus = BigNumber('1');
      refresh();
    });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      windowActive = false;
    } else {
      windowActive = true;
    }
  });

  $('#toggle-stats').on('click', () => {
    $('#settings-bg').css({ display: 'flex' });
  });

  $('#settings-bg').on('click', () => {
    $('#settings-bg').css({ display: 'none' });
  });
});
