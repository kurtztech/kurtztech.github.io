function numOut(bigNum) {
  if (bigNum.lte(BigNumber('99'))) {
    return bigNum.toFormat(2);
  } else if (bigNum.lte(BigNumber('999999'))) {
    return bigNum.toFormat(0);
  } else {
    return bigNum.toExponential(2);
  }
}
