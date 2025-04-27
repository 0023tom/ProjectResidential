// Store the default estimate box content when page loads
let defaultEstimateContent;

window.addEventListener('load', function() {
    const estimateBox = document.getElementById("estimate_box");
    if (estimateBox) {
        defaultEstimateContent = estimateBox.innerHTML;
    }
});

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
    loanAmount = parseFloat(loanAmount);
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

    let monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    generateRepaymentSummary(loanAmount, annualInterestRate, loanTenure, monthlyPayment);

    const calculateButton = document.getElementById("calculate");
    calculateButton.innerHTML = `<img src="static/img/refresh.png" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 8px;"> Recalculate Mortgage`;
}

function generateRepaymentSummary(principal, annualInterestRate, loanTenure, monthlyPayment) {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const totalMonths = loanTenure * 12;

    let interestPaidTotal = 0;
    let principalPaidTotal = 0;
    let balance = principal;
    let yearlyData = [];

    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = balance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        if (balance < 0) balance = 0;

        interestPaidTotal += interestPayment;
        principalPaidTotal += principalPayment;

        if (month % 12 === 0 || balance <= 0) {
            yearlyData.push({
                year: new Date().getFullYear() + (month / 12 - 1),
                principalPaid: principalPaidTotal,
                interestPaid: interestPaidTotal,
                remainingBalance: balance
            });
        }
    }

    const principalPercentage = (principalPaidTotal / (principalPaidTotal + interestPaidTotal)) * 100;
    const interestPercentage = 100 - principalPercentage;

    // Now calculate monthly principal and monthly interest
    const monthlyPrincipal = monthlyPayment * (principalPercentage / 100);
    const monthlyInterest = monthlyPayment * (interestPercentage / 100);

    document.getElementById("estimate_box").innerHTML = `
        <div style="background-color: whitesmoke; padding: 50px; border-radius: 10px;">
            <h3>Your Estimated Monthly Repayment</h3>
            <h2>RM ${monthlyPayment.toFixed(0)} / month</h2>
            <div style="display: flex; width: 100%; height: 30px; margin-top: 20px; border-radius: 5px; overflow: hidden; background-color: #e0e0e0;">
                <div style="width: ${principalPercentage}%; background-color: #5c407d; color: white; text-align: center; font-size: 14px; line-height: 30px;">
                    ${principalPercentage.toFixed(0)}%
                </div>
                <div style="width: ${interestPercentage}%; background-color: #b39ddb; color: white; text-align: center; font-size: 14px; line-height: 30px;">
                    ${interestPercentage.toFixed(0)}%
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; width: 100%; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 5px; color: #5c407d; white-space: nowrap;">
                    <span style="font-size: 16px;">●</span>
                    <span>RM ${Math.round(monthlyPrincipal).toLocaleString()} Principal</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px; color: #b39ddb; white-space: nowrap;">
                    <span style="font-size: 16px;">●</span>
                    <span>RM ${Math.round(monthlyInterest).toLocaleString()} Interest</span>
                </div>
            </div>
        </div>
    `;

    // --- repayment table below ---
    let summaryHTML = `
        <div style="margin-top: 30px;">
            <h3 style="margin-top: 30px;">Repayment Breakdown</h3>
            <div style="overflow-x:auto;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
                <thead style="background-color: #1a237e; color: white;">
                    <tr>
                        <th style="padding: 8px;">Year</th>
                        <th style="padding: 8px;">Principal Paid (RM)</th>
                        <th style="padding: 8px;">Interest Paid (RM)</th>
                        <th style="padding: 8px;">Outstanding Balance (RM)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    yearlyData.forEach((data, index) => {
        const bgColor = index % 2 === 0 ? "#ffffff" : "#f0f0f0"; // even rows white, odd rows light grey
    
        summaryHTML += `
            <tr style="text-align: center; background: ${bgColor};">
                <td style="padding: 8px;">${data.year}</td>
                <td style="padding: 8px;">${Math.round(data.principalPaid).toLocaleString()}</td>
                <td style="padding: 8px;">${Math.round(data.interestPaid).toLocaleString()}</td>
                <td style="padding: 8px;">${Math.round(data.remainingBalance).toLocaleString()}</td>
            </tr>
        `;
    });    

    summaryHTML += `
                </tbody>
            </table>
            </div>
        </div>
    `;

    document.getElementById("result").innerHTML = summaryHTML;
    document.getElementById("result").style.display = "block";
}
