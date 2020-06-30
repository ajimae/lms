function getReturnDate(duration) {
  const date = new Date();
  date.setMonth(date.getMonth() + Number(duration));

  return date;
}

module.exports = {
  getReturnDate
}