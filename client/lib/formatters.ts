//const LOCALES = ['en-US', 'de-DE', 'es-ES', 'fr-FR', 'en-GB', 'en-AU', 'en-CA', 'en-NZ',]

const CURRENCY_FORMATTER = new Intl.NumberFormat("de-DE", {
  currency: "EUR",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("de-DE");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

// const number = 123456.789;

// console.log(
//   new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
//     number,
//   ),
// );
// Expected output: "123.456,79 €"

// The Japanese yen doesn't use a minor unit
// console.log(
//   new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
//     number,
//   ),
// );
// Expected output: "￥123,457"

// Limit to three significant digits
// console.log(
//   new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
//     number,
//   ),
// );
// Expected output: "1,23,000"

/*
pl_PL      = 1 205,34 zł
en_US      = $1,205.34
en_GB      = £1,205.34
en_IE      = €1,205.34
de_DE      = 1.205,34 €
fr_FR      = 1 205,34 €
br_FR      = € 1 205,34
ja_JP      = ￥1,205
pt_TL      = 1 205,34 US$
fr_CA      = 1 205,34 $
en_CA      = $1,205.34
*/
