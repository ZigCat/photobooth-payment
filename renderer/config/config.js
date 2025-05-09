export default{
  smartVendBaseUrl: process.env.SMARTVEND_BASE_URL,
  smartVendApiKey: process.env.SMARTVEND_API_KEY,
  dslrBaseUrl: process.env.DSLR_BASE_URL,
  dslrPassword: process.env.DSLR_PASSWORD,
  pollingInterval: 5000,
  maxPollingAttempts: 60,
  preSessionDelay: 5000,
  sessionDuration: 5000,
  printDuration: 5000
};