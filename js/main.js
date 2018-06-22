let currentDollars = BigNumber('0');
let totalDollars = BigNumber('0');

let maxShipment = BigNumber('1000');
let shipUpPrice = BigNumber('50000');

let maxMinting = BigNumber('1');
let levelUpPrice = BigNumber('10');
let shipmentSize = () => {
  return maxMinting.lte(maxShipment) ? maxMinting : maxShipment;
};

let coinPrice = BigNumber('1');
let coinUpPrice = BigNumber('1000');

clickBonus = BigNumber('1');
let payment = () => {
  return shipmentSize()
    .times(coinPrice)
    .times(clickBonus);
};

let intervalCount = 0;
let windowActive = true;

let wt = 0;
let ft = 0;

const startTime = Date.now();
let upgradeTimeI = Date.now();
let upgradeTimeF = Date.now();

//* Interval that calls all functions that occur every second
//! Only Functions are allowed
$(document).ready(() => {
  setInterval(() => {
    if (windowActive === true) {
      moveWTrucks();
    }

    if (intervalCount >= 3 && windowActive === true) {
      moveFTrucks();
    }

    if (intervalCount >= 6) {
      updateCoins();
    }
    refresh();
    intervalCount += 1;
  }, 1000);
});

function updateCoins() {
  currentDollars = currentDollars.plus(payment());
  totalDollars = totalDollars.plus(payment());
}

let wtTracker = 0;
function moveWTrucks() {
  if (wtTracker === 0) {
    wt = TweenMax.staggerFromTo(
      '.wt',
      3,
      { left: 180 },
      {
        ease: Power0.easeInOut,
        left: 395,
        display: 'block'
      },
      1
    );
  }
  if (wtTracker === 2) {
    wtTracker = -1;
  }
  wtTracker += 1;
}

let ftTracker = 0;
function moveFTrucks() {
  if (ftTracker === 0) {
    ft = TweenMax.staggerFromTo(
      '.ft',
      3,
      { left: 180 },
      {
        ease: Power0.easeInOut,
        left: 395,
        display: 'block'
      },
      1
    );
  }
  if (ftTracker === 2) {
    ftTracker = -1;
  }
  ftTracker += 1;
}

function refresh() {
  if (currentDollars.gte(shipUpPrice)) {
    $('#level-up-warehouse')
      .removeClass('btn-secondary')
      .addClass('btn-primary');
  } else {
    $('#level-up-warehouse')
      .removeClass('btn-primary')
      .addClass('btn-secondary');
  }

  if (currentDollars.gte(levelUpPrice)) {
    $('#level-up-mint')
      .removeClass('btn-secondary')
      .addClass('btn-success');
  } else {
    $('#level-up-mint')
      .removeClass('btn-success')
      .addClass('btn-secondary');
  }

  if (currentDollars.gte(coinUpPrice)) {
    $('#level-up-bank')
      .removeClass('btn-secondary')
      .addClass('btn-warning');
  } else {
    $('#level-up-bank')
      .removeClass('btn-warning')
      .addClass('btn-secondary');
  }

  if (currentDollars.gte(BigNumber('250'))) {
    $('#level-up-bank').show();
  }

  if (currentDollars.gte(BigNumber('1000'))) {
    $('#level-up-warehouse').show();
  }

  if (intervalCount >= 3) {
    $('#minting-rate').html(`${numOut(shipmentSize())}`);
  }

  if (intervalCount >= 6) {
    $('#collection-rate').html(`$${numOut(payment())}`);
    $('#dollars').html(`$${numOut(currentDollars)}`);
  }

  $('#shipment').text(numOut(maxShipment));

  if (maxMinting.gte(maxShipment)) {
    $('#mint-warning').show();
  } else {
    $('#mint-warning').hide();
  }

  $('#play-time').html(Math.floor((Date.now() - startTime) / 1000));
  $('#time-since-upgrade').html(
    Math.floor((upgradeTimeF - upgradeTimeI) / 1000)
  );
}
