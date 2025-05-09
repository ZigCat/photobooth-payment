import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native-web';
import { QRCode } from 'react-qrcode-logo';
import config from './config/config';
import Selector from './components/Selector';
import Loader from './components/Loader';
import PaymentService from './services/paymentService';
import DslrService from './services/dslrService';

const App = () => {
    const [status, setStatus] = useState("idle");
    const [photo, setPhoto] = useState(1);
    const [copy, setCopy] = useState(1);
    const [qrCode, setQrCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(0);

    const handlePayment = async () => {
        setStatus("loading");
        try {
            const serviceDetails = {
                serviceName: "Photo Booth Session",
                amount: 1000 * photo * copy,
                merchantOrderId: `photobooth-${Date.now()}`
            };
            const orderResponse = await PaymentService.initiatePayment(serviceDetails);
            console.log("Order created:", orderResponse);
            setQrCode(orderResponse.payment_url);
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

    useEffect(() => {
        let timer;
        if (status === "error") {
            timer = setTimeout(() => {
                setStatus("idle");
                setErrorMessage(null);
                setQrCode(null);
                setCurrentPhoto(0);
                setCountdown(null);
                setPhoto(1);
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
                            setStatus("printing");
                            DslrService.printCopies(copy)
                                .then(() => {
                                    timer = setTimeout(() => {
                                        if (currentPhoto < photo) {
                                            setCurrentPhoto(currentPhoto + 1);
                                            setCountdown(config.preSessionDelay / 1000);
                                            setStatus("countdown");
                                        } else {
                                            setStatus("completed");
                                            timer = setTimeout(() => {
                                                setStatus("idle");
                                                setQrCode(null);
                                                setCurrentPhoto(0);
                                                setPhoto(1);
                                                setCopy(1);
                                            }, 5000);
                                        }
                                    }, config.printDuration);
                                })
                                .catch(error => {
                                    console.error('Print failed:', error);
                                    setErrorMessage(error.message || "Ошибка при печати");
                                    setStatus("error");
                                });
                        }, config.sessionDuration);
                    })
                    .catch(error => {
                        console.error('Photo session failed:', error);
                        setErrorMessage(error.message || "Ошибка при выполнении фотосессии");
                        setStatus("error");
                    });
            }
        }
        return () => clearTimeout(timer);
    }, [status, countdown, currentPhoto, photo, copy]);

    const styles = StyleSheet.create({
        companyName: {
            fontSize: 40,
            fontWeight: 'bold',
            color: '#3FA0E1',
            textAlign: 'center',
            marginTop: 50,
        },
        payContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
        },
        payButton: {
            width: 300,
            height: 60,
            borderRadius: 10,
            backgroundColor: '#3FA0E1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
            marginTop: 50,
            marginBottom: 20
        },
        qrText: {
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 20
        },
        qrImage: {},
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
        status === "idle" ? (
            <View>
                <Text style={styles.companyName}>Photobooth</Text>
                <Selector title={"Выберите количество снимков"} value={photo} setValue={setPhoto}/>
                <Selector title={"Выберите количество копий"} value={copy} setValue={setCopy}/>
                <View style={styles.payContainer}>
                    <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                        <Text style={styles.payText}>Оплатить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ) : status === "loading" ? (
            <Loader/>
        ) : status === "scanning" ? (
            <View style={styles.qrContainer}>
                <Text style={styles.qrText}>Kaspi QR</Text>
                {qrCode && <QRCode style={styles.qrImage} value={qrCode} size={200}/>}
                {/* <Image
                    source={require('./assets/kaspi.png')}
                    style={{ width: 40, height: 40, marginTop: 20, resizeMode: 'contain' }}
                /> */}
            </View>
        ) : status === "countdown" ? (
            <View style={styles.messageContainer}>
                <Text style={styles.countdownText}>
                    Подготовьтесь к съемке {currentPhoto}: {countdown}
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
                <Text style={styles.printingText}>Печать копий для фото {currentPhoto}...</Text>
            </View>
        ) : status === "completed" ? (
            <View style={styles.messageContainer}>
                <Text style={styles.successText}>Фотосессия завершена успешно!</Text>
            </View>
        ) : status === "error" ? (
            <View style={styles.messageContainer}>
                <Text style={styles.errorText}>
                    {errorMessage || "Ошибка при обработке платежа."}
                </Text>
            </View>
        ) : (<View></View>)
    );
};

export default App;