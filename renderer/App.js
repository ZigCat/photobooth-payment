import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';
import { QRCode } from 'react-qrcode-logo';
import config from './config/config';
import Selector from './components/Selector';
import Loader from './components/Loader';
import PaymentService from './services/paymentService';
import DslrService from './services/dslrService';
import StartButton from './components/StartButton';

const App = () => {
    const [status, setStatus] = useState("idle");
    const [copy, setCopy] = useState(1);
    const [qrCode, setQrCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(0);

    const handleStartSession = async () => {
        setStatus("loading");
        try {
            const serviceDetails = {
                serviceName: "Photo",
                amount: config.sessionPrice,
                merchantOrderId: `photobooth-${Date.now()}`
            };
            const orderResponse = await PaymentService.initiatePayment(serviceDetails);
            console.log("Order created:", orderResponse);
            setQrCode(orderResponse.url);
            setStatus("scanning");
            const pollingResult = await PaymentService.startPaymentStatusPolling();
            if (pollingResult.status === "success") {
                setStatus("paid");
            } else {
                throw pollingResult.error;
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
            setErrorMessage(error.message || "Неизвестная ошибка при обработке платежа");
            setStatus("error");
        }
    };

    const handlePrintCopies = async () => {
        setStatus("loading");
        try {
            const serviceDetails = {
                serviceName: "Сделать копии",
                amount: config.copyPrice * copy,
                merchantOrderId: `print-${Date.now()}`
            };
            const orderResponse = await PaymentService.initiatePayment(serviceDetails);
            console.log("Order created:", orderResponse);
            setQrCode(orderResponse.url);
            setStatus("scanning");
            const pollingResult = await PaymentService.startPaymentStatusPolling();
            if (pollingResult.status === "success") {
                setStatus("printing");
                await DslrService.printCopies(copy);
                await new Promise(resolve => setTimeout(resolve, config.printDuration));
                setStatus("completed");
            } else {
                throw pollingResult.error;
            }
        } catch (error) {
            console.error('Print payment failed:', error);
            setErrorMessage(error.message || "Ошибка при обработке платежа для печати");
            setStatus("error");
        }
    };

    useEffect(() => {
        let timer;
        if (status === "error") {
            timer = setTimeout(() => {
                setStatus("idle");
                setErrorMessage(null);
                setQrCode(null);
                setCurrentPhoto(0);
                setCountdown(null);
                setCopy(1);
            }, 5000);
        } else if (status === "paid") {
            setCurrentPhoto(1);
            setCountdown(config.preSessionDelay / 1000);
            setStatus("countdown");
        } else if (status === "countdown" && countdown !== null) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                setStatus("processing");
                DslrService.startPhotoSession()
                    .then(() => {
                        setStatus("session");
                        timer = setTimeout(() => {
                            setStatus("completed");
                            timer = setTimeout(() => {
                                setStatus("idle");
                                setQrCode(null);
                                setCurrentPhoto(0);
                                setCopy(1);
                            }, 5000);
                        }, config.sessionDuration);
                    })
                    .catch(error => {
                        console.error('Photo session failed:', error);
                        setErrorMessage(error.message || "Ошибка при выполнении фотосессии");
                        setStatus("error");
                    });
            }
        } else if (status === "completed") {
            timer = setTimeout(() => {
                setStatus("idle");
                setQrCode(null);
                setCurrentPhoto(0);
                setCopy(1);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [status, countdown, copy]);

    const styles = StyleSheet.create({
        body:{
            display: 'flex',
            flex: 1,
            height: '100vh',
            backgroundColor: '#212121',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        inner:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'right',
            alignItems: 'center',
            width: '100%',
        },
        payButton: {
            width: 200,
            height: 60,
            borderRadius: 10,
            backgroundColor: '#3FA0E1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        payText: {
            fontSize: 25,
            fontWeight: 'bold',
            color: '#fff'
        },
        qrContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20
        },
        qrText: {
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#f0f0f0',
        },
        qrImage: {
            borderRadius: 10,
        },
        messageContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
            marginBottom: 20
        },
        errorText: {
            fontSize: 25,
            color: '#EE2626',
            textAlign: 'center'
        },
        successText: {
            fontSize: 25,
            color: '#117E07',
            textAlign: 'center'
        },
        processingText: {
            fontSize: 25,
            color: '#3FA0E1',
            textAlign: 'center'
        },
        countdownText: {
            fontSize: 25,
            fontWeight: 'bold',
            color: '#3FA0E1',
            textAlign: 'center'
        },
        sessionText: {
            fontSize: 25,
            color: '#3FA0E1',
            textAlign: 'center'
        },
        printingText: {
            fontSize: 25,
            color: '#3FA0E1',
            fontWeight: 'bold',
            textAlign: 'center'
        }
    });

    return (
        <View style={styles.body}>
            {status === "idle" ? (
                <View style={styles.inner}>
                    <StartButton onPress={handleStartSession}/>
                    <View>
                        <Selector title={"Печать копий последней сессии"} value={copy} setValue={setCopy}/>
                        <View style={{
                            display: 'flex',
                            justifyContentlerinde: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={styles.payButton} onPress={handlePrintCopies}>
                                <Text style={styles.payText}>Печать</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : status === "loading" ? (
                <Loader/>
            ) : status === "scanning" ? (
                <View style={styles.qrContainer}>
                    <Text style={styles.qrText}>Kaspi QR</Text>
                    {qrCode && <QRCode 
                        style={styles.qrImage} 
                        value={qrCode} 
                        size={200}/>}
                </View>
            ) : status === "countdown" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.countdownText}>
                        Подготовьтесь к съемке: {countdown}
                    </Text>
                </View>
            ) : status === "processing" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.processingText}>Начинается фотосессия {currentPhoto}...</Text>
                </View>
            ) : status === "session" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.sessionText}>Идет фотосессия {currentPhoto}...</Text>
                </View>
            ) : status === "printing" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.printingText}>Печать копий...</Text>
                </View>
            ) : status === "completed" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.successText}>Операция завершена успешно!</Text>
                </View>
            ) : status === "error" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.errorText}>
                        {errorMessage || "Ошибка при обработке платежа."}
                    </Text>
                </View>
            ) : (<View></View>)}
        </View>
    );
};

export default App;