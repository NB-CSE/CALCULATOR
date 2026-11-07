
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function updateDisplay(value) {
  display.value = value || "0";
}

function calculate() {
  if (!expression || !/^[0-9+\-*/. ()]+$/.test(expression)) {
    updateDisplay("Error");
    expression = "";
    finished = true;
    return;
  }

  try {
    // Only allow a basic arithmetic expression.
    const result = Function('"use strict"; return (' + expression + ')')();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    expression = String(Number(result.toPrecision(12)));
    updateDisplay(expression);
  } catch {
    expression = "";
    updateDisplay("Error");
  }

  finished = true;
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "clear") {
    expression = "";
    finished = false;
    updateDisplay("0");
    return;
  }

  if (action === "delete") {
    if (finished) {
      expression = "";
      finished = false;
    } else {
      expression = expression.slice(0, -1);
    }
    updateDisplay(expression);
    return;
  }

  if (action === "calculate") {
    calculate();
    return;
  }

  if (value !== undefined) {
    if (finished || display.value === "Error") {
      expression = "";
      finished = false;
    }

    expression += value;
    updateDisplay(expression);
  }
});
