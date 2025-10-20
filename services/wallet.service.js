import { fetchWrapper } from '@/helpers/fetch-wrapper';

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/wallet`;

export const walletService = {
  sendBankOtp,
  verifyBankOtp,
  getBankDetails,
  hasBankDetails,
  // Refund methods
  checkRefund,
  getRefundData,
  getPaymentInfo,
  sendRefundOtp,
  verifyRefundOtp,
  retryRefund,
  processRefundViaBank,
  // Withdraw methods
  createWithdraw,
  getUserWithdraws,
  getWithdrawById,
  updateWithdrawBankDetails,
};

/**
 * Envia OTP para verificação de dados bancários
 */
function sendBankOtp(bankDetails) {
  return fetchWrapper.post(`${baseUrl}/bank/send-otp`, bankDetails);
}

/**
 * Verifica OTP e salva dados bancários
 */
function verifyBankOtp(otp, email, bankDetails) {
  return fetchWrapper.post(`${baseUrl}/bank/verify-otp`, {
    otp,
    email,
    bankDetails,
  });
}

/**
 * Obtém dados bancários do usuário
 */
function getBankDetails() {
  return fetchWrapper.get(`${baseUrl}/bank/details`);
}

/**
 * Verifica se o usuário tem dados bancários cadastrados
 */
function hasBankDetails() {
  return fetchWrapper.get(`${baseUrl}/bank/has-details`);
}

/**
 * Verifica se o usuário já solicitou refund
 */
function checkRefund() {
  return fetchWrapper.get(`${baseUrl}/refund/check`);
}

/**
 * Obtém dados do refund
 */
function getRefundData() {
  return fetchWrapper.get(`${baseUrl}/refund/data`);
}

/**
 * Obtém informações de pagamento para refund
 */
function getPaymentInfo() {
  return fetchWrapper.get(`${baseUrl}/refund/payment-info`);
}

/**
 * Envia OTP para verificação de refund
 */
function sendRefundOtp(email) {
  return fetchWrapper.post(`${baseUrl}/refund/send-otp`, { email });
}

/**
 * Verifica OTP e processa refund
 */
function verifyRefundOtp(otp, email) {
  return fetchWrapper.post(`${baseUrl}/refund/verify-otp`, { otp, email });
}

/**
 * Tenta novamente o refund pelo método original
 */
function retryRefund() {
  return fetchWrapper.post(`${baseUrl}/refund/retry`);
}

/**
 * Processa refund via banco
 */
function processRefundViaBank() {
  return fetchWrapper.post(`${baseUrl}/refund/process-via-bank`);
}

/**
 * Cria uma solicitação de saque
 */
function createWithdraw(withdrawData) {
  return fetchWrapper.post(`${baseUrl}/withdraw`, withdrawData);
}

/**
 * Lista todos os saques do usuário
 */
function getUserWithdraws() {
  return fetchWrapper.get(`${baseUrl}/withdraw`);
}

/**
 * Obtém um saque específico
 */
function getWithdrawById(id) {
  return fetchWrapper.get(`${baseUrl}/withdraw/${id}`);
}

/**
 * Atualiza os dados bancários de um saque e reseta a data de criação
 */
function updateWithdrawBankDetails(withdrawId) {
  return fetchWrapper.post(`${baseUrl}/withdraw/${withdrawId}/update-bank-details`);
}

