// A	.-	B	-...	C	-.-.	D	-..	E	.	F	..-.
// G	--.	H	....	I	..	J	.---	K	-.-	L	.-..
// M	--	N	-.	O	---	P	.--.	Q	--.-	R	.-.
// S	...	T	-	U	..-	V	...-	W	.--	X	-..-
// Y	-.--	Z	--..
const DIT = '.';
const DAH = '-';

const LETTER_CODE_MAP = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
};
const CODE_LETTER_MAP = Object.keys(LETTER_CODE_MAP).reduce((obj, letter) => {
  const code = LETTER_CODE_MAP[letter];

  obj[code] = letter;
  return obj;
}, {});

const LETTER_MAP = {
  A: [DIT, DAH],
  B: [],
  C: [],
  D: [],
  E: [],
  F: [],
  G: [],
  H: [],
  I: [],
  J: [],
  K: [],
  L: [],
  M: [],
  N: [],
  O: [],
  P: [],
  Q: [],
  R: [],
  S: [],
  T: [],
  U: [],
  V: [],
  W: [],
  X: [],
  Y: [],
  Z: [],
};

function splitMoseWord(str) {
  const spaceReg = /\s{2,}/g;
  if (spaceReg.test(str)) {
    return str.split(spaceReg);
  } else {
    str.split(' ');
  }
}

function letter2morse(letter, dict, options = {}) {
  const { padEnd = '    ', space = 1 } = options;
  let codes = LETTER_CODE_MAP[letter.toUpperCase()];

  if (codes) {
    codes = codes.split('').join(''.padEnd(space)) + padEnd;
  } else {
    codes = letter;
  }

  if (dict) {
    return codes
      .replace(new RegExp(`\\${DIT}`, 'g'), dict.dit)
      .replace(new RegExp(DAH, 'g'), dict.dah);
  }
  return codes.split('');
}

function morse2letter(code, dict) {
  const trimCode = code.replace(/\s/g, '');
  const map = {
    [dict.dit]: DIT,
    [dict.dah]: DAH,
  };

  const nCode = trimCode
    .split('')
    .map((char) => map[char] || char)
    .join('');

  return CODE_LETTER_MAP[nCode] || nCode;
}

function toRows(str) {
  return str.split('\n').filter((v) => v.length > 0);
}

function decode(
  str,
  dict = {
    dit: '.',
    dah: '-',
  }
) {
  if (!str || str.length < 1) return;
  const rows = toRows(str).map((rowStr) => splitMoseWord(rowStr));

  const decodeRows = rows.map((row) =>
    row.map((morseLetter) => {
      return morse2letter(morseLetter, dict);
    })
  );

  return decodeRows.map((row) => row.join('')).join('\n');
}

function encode(
  str,
  dict = {
    dit: '.',
    dah: '-',
  },
  options
) {
  const rows = toRows(str).map((row) => row.split(''));
  const morseRows = rows.map((row) =>
    row.map((letter) => letter2morse(letter, dict, options))
  );

  const result = morseRows.map((row) => row.join('')).join('\n');

  return result;
}

const str = `．━ ━ ━        ．．        ．．━        
━ ━        ．．        ━ ．        ━ ━ ．
`;
const str1 = 'JIU MING';
const str2 = `  JIU MING   JIU MING
  JIU MING`;
const str3 = 'HAHA TODAY IS IMPORTANT';

// const dict = { dit: '．', dah: '━' };
const dict = { dit: '滴', dah: '答' };
const secret = encode(str3, dict, { space: 0, padEnd: '  ' });

console.log(secret, '\n\n解密\n', decode(secret, dict));
// console.log(decode('。～～～ 。。 。。～    ～～ 。。 ～。 ～～。', { dit: '.', dah: '-' }));
