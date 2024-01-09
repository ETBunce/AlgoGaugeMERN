// Regex to check if string is a number
export const isNumber = (char) => {
  return /^\d+$/.test(char);
};

// Takes a string and finds caret ^ to replace as superscript (Used for representing big O notation)
export const superScriptExponent = (string) => {
  if (string.includes("^")) {
    return string
      .replace("^", "")
      .split("")
      .map((char, index) => {
        if (isNumber(char)) {
          return <sup key={`superscript-${index + 1}`}>{char}</sup>;
        }
        return char;
      });
  }
  return string;
};

// Takes in array of input to create a description of the experiment along with a limit to which dots are represented
export const dotDotTextInputExperiment = (inputArray, limit) => {
  let titleStringArray = inputArray;

  let titleString = "";

  if (titleStringArray) {
    titleStringArray = inputArray.map(
      (input, i) =>
        `${input.name} ${input.dataOrdering} (n=${Number(
          input.inputSize
        ).toLocaleString()}) ${
          inputArray.length > 1 && i + 1 <= inputArray.length - 1 ? "VS " : ""
        }`
    );

    titleString = titleStringArray.join("");

    if (titleString.length > limit) {
      return (titleString = `${titleString.substring(0, limit + 2)}...`);
    }
  }

  return titleString;
};
