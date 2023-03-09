export default function spaceEvery3Chars(text: string) {
  let res = "";
  for (let i = 0; i < text.length; i++) {
    res = `${res}${i % 3 === 0 ? " " : ""}${text.at(text.length - i - 1)}`;
  }
  return res.split("").reverse();
}
