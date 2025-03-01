/**
 * converts raw ansi strings to html
 * @param text raw text including ansi sequences
 * @returns html code with tailwind spans
 */
export default function ansiToHtml(text: string): string {
  // eslint-disable-next-line no-control-regex
  const ansiRegex: RegExp = /\x1B\[([0-9;]+)m/g;

  return text
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(ansiRegex, (_match: string, codes: string) => {
      if (codes === "0") return "</span>"; // reset code

      const codeArray = codes.split(";") as (keyof typeof ansiColors)[];
      let style: string = "";

      codeArray.forEach((code) => {
        if (ansiColors[code]) style += ansiColors[code];
      });

      return `<span class="${style}">`;
    });
}

export const ansiColors = {
  // Text styles
  "1": "font-bold", // Bold
  "2": "opacity-50", // Disable (lighten)
  "4": "underline", // Underline
  "7": "invert", // Reverse (light/dark mode)
  "9": "line-through", // Strikethrough
  "8": "invisible", // Invisible (not directly supported in Tailwind)

  // Foreground colors
  "30": "text-black dark:text-white",
  "31": "text-red-600 dark:text-red-400",
  "32": "text-green-600 dark:text-green-400",
  "33": "text-yellow-500 dark:text-yellow-300",
  "34": "text-blue-600 dark:text-blue-400",
  "35": "text-purple-600 dark:text-purple-400",
  "36": "text-cyan-600 dark:text-cyan-400",
  "37": "text-gray-300 dark:text-gray-600",
  "90": "text-gray-500 dark:text-gray-400",
  "91": "text-red-400 dark:text-red-300",
  "92": "text-green-400 dark:text-green-300",
  "93": "text-yellow-500 dark:text-yellow-200",
  "94": "text-blue-400 dark:text-blue-300",
  "95": "text-pink-400 dark:text-pink-300",
  "96": "text-cyan-400 dark:text-cyan-300",

  // Background colors
  "40": "bg-black dark:bg-white",
  "41": "bg-red-600 dark:bg-red-400",
  "42": "bg-green-600 dark:bg-green-400",
  "43": "bg-yellow-500 dark:bg-yellow-300",
  "44": "bg-blue-600 dark:bg-blue-400",
  "45": "bg-purple-600 dark:bg-purple-400",
  "46": "bg-cyan-600 dark:bg-cyan-400",
  "47": "bg-gray-300 dark:bg-gray-600",
} as const;
