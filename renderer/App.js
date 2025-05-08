import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native-web';
import Selector from './components/Selector';
import Loader from './components/Loader';
import PaymentService from './services/paymentService';
import { QRCode } from 'react-qrcode-logo';

const App = () => {
    const [status, setStatus] = useState("idle");
    const [photo, setPhoto] = useState(1);
    const [copy, setCopy] = useState(1);
    const [qrCode, setQrCode] = useState(null);

    const handlePayment = async () => {
        setStatus("loading");
        try {
            const serviceDetails = {
                serviceName: "Photo Booth Session",
                amount: 1000 * photo * copy,
                merchantOrderId: `photobooth-${Date.now()}`
            };
            // const orderResponse = await PaymentService.initiatePayment(serviceDetails)
            // console.log("Order created:", orderResponse);
            setQrCode("https://github.com");
            setStatus("scanning");
            // const finalStatus = await PaymentService.startPaymentStatusPolling();
            // console.log("Final status:", finalStatus);
            // setStatus("paid");
        } catch (error) {
            console.error('Payment initiation failed:', error);
            setStatus("error");
        }
    }

    const styles = StyleSheet.create({
        payContainer:{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20
        },
        payButton:{
            width: 300,
            height: 60,
            borderRadius: 10,
            backgroundColor: '#3FA0E1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        payText:{
            fontSize: 25,
            fontWeight: 'bold',
            color: '#fff'
        },
        qrContainer:{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20
        },
        qrText:{
            fontSize: 25,
            fontWeight: 'bold',
            marginBottom: 20
        },
        qrImage:{}
    });

    return(
        status === "idle" ? (
            <View>
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
                <Text style={styles.qrText}>Сканируйте Kaspi QR для оплаты</Text>
                {qrCode && <QRCode style={styles.qrImage} value={qrCode} size={200}/>}
            </View>
        ) : status === "paid" ? (
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Оплата прошла успешно!</Text>
            </View>
        ) : (<View></View>)
    );
};

export default App;