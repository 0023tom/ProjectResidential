function validateInput(input) {
      let value = input.value.replace(/,/g, '').replace(/\D/g, '');

      if (value) {
          input.value = parseInt(value, 10).toLocaleString(); // Format with commas
      } else {
          input.value = "";
      }
}

function calculateMortgage() {
      let loanAmount = document.getElementById("loan_amount").value.replace(/,/g, '');
      loanAmount = parseFloat(loanAmount)
      let downPayment = document.getElementById("down_payment").value.replace(/,/g, '');
      downPayment = parseFloat(downPayment);
      let annualInterestRate = parseFloat(document.getElementById("interest_rate").value);
      let loanTenure = parseInt(document.getElementById("loan_tenure").value);

      if (isNaN(loanAmount) || isNaN(downPayment) || isNaN(annualInterestRate) || isNaN(loanTenure) || loanAmount <= 0 || annualInterestRate <= 0 || loanTenure <= 0) {
          document.getElementById("result").innerHTML = "Please enter valid numbers.";
          return;
      }

      loanAmount -= downPayment;

      let monthlyInterestRate = (annualInterestRate / 100) / 12;
      let totalPayments = loanTenure * 12;

      let monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
                           (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

      document.getElementById("result").innerHTML = `Estimated Monthly Payment: RM ${monthlyPayment.toFixed(0)}`;
}