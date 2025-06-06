export default{
  proxyBaseUrl: process.env.BASE_URL,
  proxyApiKey: process.env.PROXY_API_KEY,
  dslrBaseUrl: process.env.DSLR_BASE_URL,
  dslrPassword: process.env.DSLR_PASSWORD,
  pollingInterval: 2000,
  maxPollingAttempts: 5,
  preSessionDelay: 5000,
  sessionDuration: 5000,
  printDuration: 5000,
  copyPrice: 2,
  sessionPrice: 2
};