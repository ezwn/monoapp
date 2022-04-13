
const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';

export const generateRandomTextId = (length: number) => {
  let str = '';
  const { length: n } = chars;
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * n));
  }
  return str;
}
