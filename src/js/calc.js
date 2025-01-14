let isError = false; // Tracks if there was an error in the last calculation

// Parse and evaluate the expression
const parseExpression = (tokens) => {
  let currentIndex = 0;

  const currentToken = () => tokens[currentIndex];
  const nextToken = () => tokens[currentIndex++];

  const parseNumberOrGroup = () => {
    const token = nextToken();
    if (token === "(") {
      const result = parseExpression();
      if (nextToken() !== ")") {
        throw new Error("Mismatched parentheses");
      }
      return result;
    } else if (!isNaN(token)) {
      return parseFloat(token);
    } else {
      throw new Error(`Unexpected token: ${token}`);
    }
  };

  const parseMultiplicationAndDivision = () => {
    let value = parseNumberOrGroup();
    while (currentToken() === "*" || currentToken() === "/") {
      const operator = nextToken();
      const nextValue = parseNumberOrGroup();
      value = operator === "*" ? value * nextValue : value / nextValue;
    }
    return value;
  };

  const parseAdditionAndSubtraction = () => {
    let value = parseMultiplicationAndDivision();
    while (currentToken() === "+" || currentToken() === "-") {
      const operator = nextToken();
      const nextValue = parseMultiplicationAndDivision();
      value = operator === "+" ? value + nextValue : value - nextValue;
    }
    return value;
  };

  return parseAdditionAndSubtraction();
};

// Split input into tokens (numbers and operators)
const tokenizeInput = (input) => {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    if (/\d/.test(char)) {
      // Handle multi-digit numbers
      let number = char;
      while (i + 1 < input.length && /\d|\./.test(input[i + 1])) {
        number += input[++i];
      }
      tokens.push(number);
    } else if (/[+\-*/()]/.test(char)) {
      tokens.push(char); // Add operators and parentheses
    } else if (/\s/.test(char)) {
      // Ignore spaces
    } else {
      throw new Error(`Invalid character: ${char}`);
    }
    i++;
  }

  return tokens;
};

// Evaluate the input string
const calculate = (input) => {
  try {
    const tokens = tokenizeInput(input);
    return parseExpression(tokens);
  } catch (err) {
    isError = true; // Set error flag
    return `Error: ${err.message}`;
  }
};

// Event listeners for buttons
const buttons = document.querySelectorAll("button");
const display = document.getElementById("display");

buttons.forEach((button) =>
  button.addEventListener("click", () => {
    const buttonValue = button.getAttribute("data-value");

    // Clear display if there was an error in the last calculation
    if (isError) {
      display.value = "";
      isError = false;
    }

    if (button.id === "clear") {
      display.value = "";
      isError = false;
      return;
    }

    if (button.id === "equals") {
      display.value = calculate(display.value);
      return;
    }

    if (button.classList.contains("backspace")) {
      display.value = display.value.slice(0, -1);
      return;
    }

    // Append button value to display
    display.value += buttonValue;
  })
);
