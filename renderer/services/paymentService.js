import api from '../utils/smartvendApi';
import config from '../config/config';

let currentOrderId = null;
let pollingAttempts = 0;
let pollingInterval = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initiatePayment = async (serviceDetails) => {
  // try {
  //   console.log(`Initiated payment for ${serviceDetails.serviceName}, amount: ${serviceDetails.amount}`);
  //   const orderRequest = {
  //     item_name: serviceDetails.serviceName,
  //     request_sum: serviceDetails.amount,
  //     merchant_order_id: serviceDetails.merchantOrderId || `photobooth-${Date.now()}`
  //   };

  //   const orderResponse = await api.createOrder(orderRequest);
  //   console.log('Order created:', orderResponse);

  //   if (!orderResponse.id || !orderResponse.payment_url) {
  //     throw new Error('Invalid order response: missing ID or payment URL');
  //   }
  //   currentOrderId = orderResponse.id;
  //   return orderResponse;
  // } catch (error) {
  //   console.error('Payment initiation failed:', error);
  //   throw error;
  // }
  await delay(100);
  return {payment_url: 'https://github.com', id: '12345'};
};

//REMOVE ASYNC FROM THE FUNCTION NAME
const startPaymentStatusPolling = async () => {
  // console.log(`Started polling for order ${currentOrderId} status`);
  // pollingAttempts = 0;

  // return new Promise((resolve, reject) => {
  //   if (pollingInterval) {
  //     clearInterval(pollingInterval);
  //   }

  //   pollingInterval = setInterval(async () => {
  //     try {
  //       pollingAttempts++;
  //       if (pollingAttempts > config.maxPollingAttempts) {
  //         clearInterval(pollingInterval);
  //         await cancelPayment();
  //         reject({ status: "error", error: new Error('Payment timeout: exceeded maximum polling attempts') });
  //         return;
  //       }

  //       const orderStatus = await checkPaymentStatus();
  //       console.log(`Polling attempt ${pollingAttempts}: Order status is "${orderStatus.status}"`);

  //       if (orderStatus.status === 'paid') {
  //         clearInterval(pollingInterval);
  //         const confirmedOrder = await confirmPayment();
  //         resolve({ status: "success", data: confirmedOrder });
  //       } else if (['refunded', 'canceled'].includes(orderStatus.status)) {
  //         clearInterval(pollingInterval);
  //         reject({ status: "error", error: new Error(`Payment ${orderStatus.status}`) });
  //       }
  //     } catch (error) {
  //       console.error('Error during status polling:', error);
  //       clearInterval(pollingInterval);
  //       reject({ status: "error", error });
  //     }
  //   }, config.pollingInterval);
  // });
  await delay(3000);
  return { status: "success", data: { id: "12345", status: "paid" } };
};

const checkPaymentStatus = async () => {
  if (!currentOrderId) {
    throw new Error('No active order to check status');
  }
  return await api.getOrder(currentOrderId);
};

const confirmPayment = async () => {
  if (!currentOrderId) {
    throw new Error('No active order to confirm');
  }
  console.log(`Confirming order ${currentOrderId}`);
  const confirmedOrder = await api.confirmOrder(currentOrderId);
  console.log('Order confirmed successfully');
  return confirmedOrder;
};

const cancelPayment = async () => {
  if (!currentOrderId) {
    throw new Error('No active order to cancel');
  }
  console.log(`Cancelling order ${currentOrderId}`);
  const canceledOrder = await api.cancelOrder(currentOrderId);
  console.log('Order cancelled successfully');
  return canceledOrder;
};

export default {
  initiatePayment,
  startPaymentStatusPolling
};