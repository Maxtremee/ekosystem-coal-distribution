import { Base64 } from "js-base64";

export const fileToString = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const fileToBase64 = async (file: File) =>
  Base64.encode(await fileToString(file));

export default fileToBase64;
