// Simple static AI summary logic
export function generateAISummary(text: string): string {
  // Take first 2 sentences as summary (static logic)
  if (!text) return '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 2).join(' ').trim();
}

// Simple English to Urdu dictionary
const englishToUrdu: Record<string, string> = {
  // Expanded dictionary
  laugh: 'ہنسنا',
  happy: 'خوش',
  sad: 'اداس',
  angry: 'غصہ',
  afraid: 'ڈرا ہوا',
  strong: 'مضبوط',
  weak: 'کمزور',
  big: 'بڑا',
  small: 'چھوٹا',
  long: 'لمبا',
  short: 'چھوٹا',
  tall: 'لمبا',
  high: 'اونچا',
  fast: 'تیز',
  slow: 'آہستہ',
  the: 'دی',
  and: 'اور',
  is: 'ہے',
  you: 'آپ',
  we: 'ہم',
  are: 'ہیں',
  this: 'یہ',
  that: 'وہ',
  for: 'کے لئے',
  with: 'کے ساتھ',
  on: 'پر',
  in: 'میں',
  to: 'کو',
  from: 'سے',
  by: 'بذریعہ',
  of: 'کا',
  a: 'ایک',
  an: 'ایک',
  it: 'یہ',
  as: 'جیسے',
  at: 'پر',
  was: 'تھا',
  were: 'تھے',
  be: 'ہونا',
  have: 'ہے',
  has: 'ہے',
  not: 'نہیں',
  can: 'سکتا ہے',
  will: 'ہوگا',
  do: 'کرو',
  did: 'کیا',
  about: 'کے بارے میں',
  work: 'کام',
  use: 'استعمال',
  make: 'بنائیں',
  get: 'حاصل کریں',
  like: 'پسند',
  help: 'مدد',
  learn: 'سیکھیں',
  read: 'پڑھیں',
  write: 'لکھیں',
  see: 'دیکھیں',
  go: 'جائیں',
  come: 'آئیں',
  know: 'جانیں',
  think: 'سوچیں',
  find: 'تلاش کریں',
  give: 'دیں',
  tell: 'بتائیں',
  want: 'چاہتے ہیں',
  need: 'ضرورت',
  feel: 'محسوس کریں',
  show: 'دکھائیں',
  call: 'کال کریں',
  try: 'کوشش کریں',
  ask: 'پوچھیں',
  move: 'حرکت کریں',
  play: 'کھیلیں',
  run: 'دوڑیں',
  walk: 'چلیں',
  eat: 'کھائیں',
  drink: 'پیئیں',
  sleep: 'سوئیں',
  start: 'شروع کریں',
  end: 'ختم کریں',
  open: 'کھولیں',
  close: 'بند کریں',
  live: 'رہیں',
  die: 'مرنا',
  love: 'محبت',
  hate: 'نفرت',
  win: 'جیتیں',
  lose: 'ہاریں',
  buy: 'خریدیں',
  sell: 'بیچیں',
  send: 'بھیجیں',
  receive: 'حاصل کریں',
  break: 'توڑیں',
  choose: 'منتخب کریں',
  change: 'تبدیل کریں',
  watch: 'دیکھیں',
  speak: 'بولیں',
  hear: 'سنیں',
  smile: 'مسکرائیں',
  cry: 'روئیں',
  hope: 'امید',
  dream: 'خواب',
  plan: 'منصوبہ',
  study: 'مطالعہ',
  teach: 'سکھائیں',
  // ...add more words as needed
};

export function translateToUrdu(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => englishToUrdu[word.toLowerCase()] || word)
    .join(' ');
}
