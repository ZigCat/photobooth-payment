import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native-web';
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

    console.log(config.copyPrice);
    console.log(config.sessionPrice);

    const handleStartSession = async () => {
        setStatus("loading");
        try {
            const serviceDetails = {
                serviceName: "Photo",
                amount: parseInt(config.sessionPrice, 10),
                merchantOrderId: `photobooth-${Date.now()}`
            };
            const orderResponse = await PaymentService.initiatePayment(serviceDetails);
            console.log("Order created:", orderResponse);
            setQrCode(orderResponse.url);
            setStatus("scanning");
            const pollingResult = await PaymentService.startPaymentStatusPolling();
            if (pollingResult.status === "success") {
                DslrService.startPhotoSession();
            } else {
                setCopy(1);
                setQrCode(null);
                setStatus('idle');
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
                amount: parseInt(config.copyPrice, 10) * copy,
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
        const initializeDslrListener = () => {
            if (window.dslrAPIReady && window.dslrAPI) {
                window.dslrAPI.onEvent((eventType) => {
                    if (eventType === 'session_start') {
                        console.log('React received DSLR event:', eventType);
                        setStatus('paid');
                    } else if (eventType === 'session_end') {
                        console.log('React received DSLR event:', eventType);
                        setStatus('completed');
                    }
                });
            } else {
                setTimeout(initializeDslrListener, 100);
            }
        };
        
        initializeDslrListener();
        if (window.dslrAPI && window.dslrAPI.onMainLog) {
        window.dslrAPI.onMainLog((logData) => {
            const style = logData.level === 'error' ? 'color: red' : 
                         logData.level === 'success' ? 'color: green' : 
                         'color: blue';
            console.log(`%c[MAIN] ${logData.message}`, style);
        });
    }
    }, []);

    useEffect(() => {
        let timer;
        if (status === "error") {
            timer = setTimeout(() => {
                setStatus("idle");
                setErrorMessage(null);
                setQrCode(null);
                setCopy(1);
            }, 3000);
        } else if (status === "completed") {
            timer = setTimeout(() => {
                setStatus("idle");
                setQrCode(null);
                setCopy(1);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [status]);

    const styles = StyleSheet.create({
        body:{
            display: 'flex',
            flex: 1,
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
        },
        inner:{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        action: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
            color: '#fff',
            fontFamily: 'Arial',
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
            fontFamily: 'Arial',
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
            textAlign: 'center',
            fontFamily: 'Arial',
        },
        successText: {
            fontSize: 25,
            color: '#117E07',
            textAlign: 'center',
            fontFamily: 'Arial',
        },
        processingText: {
            fontSize: 25,
            color: '#3FA0E1',
            textAlign: 'center',
            fontFamily: 'Arial',
        },
        printingText: {
            fontSize: 25,
            color: '#3FA0E1',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Arial',
        }
    });

    return (
        <View style={styles.body}>
            {status === "idle" ? (
                <View style={styles.inner}>
                    <View style={styles.action}>
                        <StartButton onPress={handleStartSession}/>
                    </View>
                    {/* <View>
                        <Selector title={"Сделать копии последней сессии"} value={copy} setValue={setCopy}/>
                        <View style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={styles.payButton} onPress={handlePrintCopies}>
                                <Text style={styles.payText}>Печать</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>
            ) : status === "loading" ? (
                <Loader/>
            ) : status === "scanning" ? (
                <View style={styles.qrContainer}>
                    {qrCode && <QRCode 
                        style={styles.qrImage} 
                        value={qrCode} 
                        size={250}/>}
                </View>
            ) : status === "paid" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.processingText}>Процесс съемки начался!</Text>
                </View>
            ) : status === "printing" ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.printingText}>Печать копий...</Text>
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
            ) : (<View></View>)}
        </View>
    );
};

export default App;