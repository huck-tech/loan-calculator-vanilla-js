import './main.css';

function formatPriceNumber (rawValue) {
  rawValue = rawValue.replace(/[\D]/g, '');
  const rawNumber = parseInt(rawValue);
  rawValue = new Intl.NumberFormat('en-US')
    .format(rawValue);
  rawValue = '$' + rawValue;

  return { value: rawValue, number: rawNumber}
}

function formatNumber (rawValue) {
  rawValue = rawValue.replace(/[\D]/g, '');
  const rawNumber = parseInt(rawValue || "0");
  rawValue = new Intl.NumberFormat('en-US')
    .format(rawValue);

  return { value: rawValue, number: rawNumber}
}

function formatPercentNumber (rawValue) {
  rawValue = rawValue.replace('%', '')
  const rawNumber = parseFloat(rawValue || "0");

  return { value: rawValue + '%', number: rawNumber}
}

(() => {
  const formData = {
    purchaseAmount: 0,
    downPayment: 0,
    loanTerm: 0,
    interestRate: 0
  }

  let calculationResult = 0;
  
  const purchaseAmountEl = document.getElementById('purchase-amount');
  purchaseAmountEl.addEventListener('input', (e) => {
    const { value, number } = formatPriceNumber(e.target.value)
    purchaseAmountEl.value = value;
    formData.purchaseAmount = number;
  });

  const downPaymentEl = document.getElementById('down-payment');
  downPaymentEl.addEventListener('input', (e) => {
    const { value, number } = formatPriceNumber(e.target.value)
    downPaymentEl.value = value;
    formData.downPayment = number;
  })

  const loanTermEl = document.getElementById('loan-term');
  loanTermEl.addEventListener('input', (e) => {
    const { value, number } = formatNumber(e.target.value)
    loanTermEl.value = value;
    formData.loanTerm = number;
  })
  
  const interestRateEl = document.getElementById('interest-rate');
  interestRateEl.addEventListener('keydown', (e) => {
    const code = e.keyCode
    const notNumber = /[\D]/.test(e.key);
    // const notNumber = code < 48 || code > 57;
    if (notNumber && code !== 190 && code !== 9 &&  code !== 8 && code !== 37 && code !== 39) e.preventDefault();
  })

  interestRateEl.addEventListener('input', (e) => {
    const { value, number } = formatPercentNumber(e.target.value);
    interestRateEl.value = value;
    formData.interestRate = number
  })

  document.getElementById('calc-button').addEventListener('click', (e) => {
    const termsOptionEls = document.getElementsByName("loanTermOptions");
    let loanOption = 'month';
    for (let i = 0; i < termsOptionEls.length; i++) {
      if (termsOptionEls[i].checked) {
        loanOption = termsOptionEls[i].value;
        break;
      }
    }

    const interestRatePerMonth = formData.interestRate / 100 / 12;
    if (loanOption === "month") {
      calculationResult = ((formData.purchaseAmount - formData.downPayment) * (interestRatePerMonth))/(1 - (1 + interestRatePerMonth) ** (formData.loanTerm * (-1)));
    }

    if (loanOption === "year") {
      calculationResult = ((formData.purchaseAmount - formData.downPayment) * (interestRatePerMonth))/(1 - (1 + interestRatePerMonth) ** (formData.loanTerm * 12 * (-1)));
    }

    document.getElementById('calculate-result-text').innerText = '$' + calculationResult.toLocaleString('en-US', { maximumFractionDigits: 2 });
    document.getElementById('result-panel').style.visibility = "visible";
  })

})();
