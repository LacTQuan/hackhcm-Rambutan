
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Function to convert hash code to a hex color
function hashToColor(hash: number): string {
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
}

// Function to map strings to unique colors
function stringToColor(string: string) {
    const hash = stringToHash(string);
    return hashToColor(hash);
}

export default stringToColor;