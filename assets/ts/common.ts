// Decode a URL-Safe Base64 encoding

export function base64DecodeUrl(str: string): string {
  return Buffer.from(str
    .replace(/~/g, '=')
    .replace(/\./g, '+')
    .replace(/_/g, '/'), 'base64')
    .toString('ascii')
}

// Encoding a string to a URL-Safe base64 string
export function base64EncodeUrl(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, '~')
    .replace(/\+/g, '.')
    .replace(/\//g, '_')
}


export function hexToRGBA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}


/**
 * Save an SVG element to disk
 * @param svgEl
 * @param name
 */
export function saveSvgElement(svgEl: HTMLElement, name: string) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgData = svgEl.outerHTML;
  const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  const svgBlob = new Blob([preface, svgData], {type: "image/svg+xml;charset=utf-8"});
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// sleep time expects milliseconds
export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


export function maybeToLocaleString(num: number | null | undefined) {
  if (num !== undefined && num !== null) {
    return num.toLocaleString();
  } else {
    return num;
  }
}

export function JsonEqual(a: object, b: object): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}



export const COLOURS = ['#189b72', '#47188e', '#2e689b', '#e8a4e2', '#ea989c', '#447704', '#840630', '#2c237f', '#e069cc', '#83eaa2', '#56a2b5', '#ea8c99', '#cc3b69', '#e1b7f7', '#fa7bfc', '#8cba03', '#7c13d8', '#bf8e2b', '#32449e', '#66e86a', '#75ff77', '#65228e', '#56d8cd', '#57d15b', '#72e0c6', '#bdf97c', '#f7bbe2', '#f4d83a', '#f9c1b1', '#1ad8bf', '#abf945', '#77f4d7', '#199689', '#774ee0', '#f5bafc', '#910d30', '#8f63ce', '#dbf497', '#a8dded', '#f49adb', '#bc2b37', '#cbc9ff', '#af94dd', '#0e5d7c', '#ba281d', '#020059', '#f7add8', '#f26896', '#b51c38', '#9ab5f4'];



export function pickTextColorBasedOnBgColorSimple(bgColor: string, lightColor: string, darkColor: string) {
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
    darkColor : lightColor;
}
