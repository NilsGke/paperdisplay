import { toast } from "react-toastify";

export default async function dataUrlFromImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target === null || e.target.result === null)
        return toast.error("could not read file");

      if (!(e.target.result instanceof ArrayBuffer)) resolve(e.target.result);

      // const arr = new Uint8Array(e.target.result);
      // const header = arr.slice(0, 2);

      // const blob = new Blob([arr], { type: "image/bmp" });
      const url = URL.createObjectURL(file);
      resolve(url);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}
