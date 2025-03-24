// font: http://www.catalysoft.com/articles/StrikeAMatch.html

export function compareStrings(str1: string, str2: string) {
  str1 = formatStr(str1).toUpperCase();
  str2 = formatStr(str2).toUpperCase();

  if (str1 === str2) return 1;
  if (!str1 || !str2) return 0;
  if (str1.length === 1 && str2.length === 1) return 0;

  if (str1.length === 1) return str2.indexOf(str1) > -1 ? 1 / str2.length : 0;
  if (str2.length === 1) return str1.indexOf(str2) > -1 ? 1 / str1.length : 0;

  const pairs1 = getPairs(str1);
  const pairs2 = getPairs(str2);
  const coef = comparePairs(pairs1, pairs2);

  return coef;
}

function formatStr(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getPairs(str: string) {
  const letters = str.split("");
  const pairs = [];

  for (let i = 0; i < letters.length - 1; i++) {
    pairs.push(letters[i] + letters[i + 1]);
  }

  return pairs;
}

function comparePairs(pairs1: string[], pairs2: string[]) {
  const equalPairs = [];
  let intersection = 0;

  for (let i = 0; i < pairs1.length; i++) {
    for (let j = 0; j < pairs2.length; j++) {
      if (pairs1[i] === pairs2[j]) {
        equalPairs.push(pairs1[i]);
        intersection++;
        break;
      }
    }
  }

  return (2 * intersection) / (pairs1.length + pairs2.length);
}
