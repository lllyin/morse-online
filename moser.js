// 字母
// A	.-	B	-...	C	-.-.	D	-..	E	.	F	..-.
// G	--.	H	....	I	..	J	.---	K	-.-	L	.-..
// M	--	N	-.	O	---	P	.--.	Q	--.-	R	.-.
// S	...	T	-	U	..-	V	...-	W	.--	X	-..-
// Y	-.--	Z	--..
// 数字
// 0	-----	1	.----	2	..---	3	...--	4	....-	5	.....
// 6	-....	7	--...	8	---..	9	----.
// 标点
// .	.-.-.-	,	--..--	?	..--..	'	.----.	!	-.-.--	/	-..-.
// (	-.--.	)	-.--.-	&	.-...	:	---...	;	-.-.-.	=	-...-
// +	.-.-.	-	-....-	_	..--.-	"	.-..-.	$	...-..-	@	.--.-.
// ¿	..-.-	¡	--...-

const reverseMap = (map) => {
  return Object.keys(map).reduce((obj, letter) => {
    const code = map[letter];

    obj[code] = letter;
    return obj;
  }, {});
};

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
const CODE_LETTER_MAP = reverseMap(LETTER_CODE_MAP);

const NUM_CODE_MAP = {
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
};
const CODE_NUM_MAP = reverseMap(NUM_CODE_MAP);

const POINT_CODE_MAP = {
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
  '¿': '..-.-',
  '¡': '--...-',
};
const CODE_POINT_MAP = reverseMap(POINT_CODE_MAP);

const CHAR_CODE_MAP = Object.assign(
  {},
  LETTER_CODE_MAP,
  NUM_CODE_MAP,
  POINT_CODE_MAP
);
const CODE_CHAR_MAP = Object.assign(
  {},
  CODE_LETTER_MAP,
  CODE_NUM_MAP,
  CODE_POINT_MAP
);

function splitMoseWord(str) {
  const spaceReg = /(\s{2,})/g;
  if (spaceReg.test(str)) {
    return str.replace(spaceReg, ',$1,').split(',');
  } else {
    str.split(' ');
  }
}

function letter2morse(letter, dict, options = {}) {
  const { padEnd = '    ', space = 1 } = options;
  let codes = CHAR_CODE_MAP[letter.toUpperCase()];

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

  if (trimCode.length === 0) return code;

  const nCode = trimCode
    .split('')
    .map((char) => map[char] || char)
    .join('');

  return CODE_CHAR_MAP[nCode] || code;
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

const DEBUG = false;
if (DEBUG) {
  console.log(
    Object.keys(CHAR_CODE_MAP).length,
    Object.keys(CODE_CHAR_MAP).length
  );
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
  // console.log(
  //   '答滴滴  滴答  答滴答答   滴滴'.replace(/(\s{2,})/g, ',$1,').split(',')
  // );
}
