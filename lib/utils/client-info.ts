import UAParser from 'ua-parser-js';

export function getClientInfo() {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
    device: result.device.type || 'desktop'
  };
}
