import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import neo from "../../../assets/images/logos/neo.jfif"
import omt from "../../../assets/images/logos/omt.png"
import whish from "../../../assets/images/logos/whish.jpg"
import './PaymentMethod.css';

const PaymentMethod = ({ plan }) => {
    const qrSize = 200;

    // Array of payment methods
    const paymentMethods = [
        {
            id: "whish",
            name: "Whish Money",
            logo: whish,
            qrValue: "https://whish.money/pay/OG8JdkS2J",
            description: "Pay via Whish"
        },
        {
            id: "omt",
            name: "OMT Pay",
            logo: omt,
            qrValue: "5eVHQMFnR4o2YOdO/wF/jCNcsYqlvj0iPvR63uKo2pPBy4ePUnEMxozWI4wKrDPtAS/+SCrX5oTP\nvIvO57QXSD4HvgjmmlGS82x4kaQG5us=",
            description: "Pay via OMT"
        },
        {
            id: "neo",
            name: "Neo Bank Audi",
            logo: neo,
            qrValue: '{"accountNumber":"501233060002","iban":"LB98005699840103501233060002","amount":"1.00","currency":"USD"}',
            description: "Pay via Neo"
        }
    ];

    return (
        <div className="payment-methods-wrapper">
            <h3>Payment for {plan.name}</h3>
            <div className="payment-methods-container">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="payment-method-card">
                        <img src={method.logo} alt={`${method.name} logo`} className="payment-logo" />
                        <QRCodeCanvas 
                            value={method.qrValue}
                            size={qrSize}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            className="payment-qr"
                        />
                        <p className="payment-description">{method.description}</p>
                        {/* <button className="pay-now-btn">Pay Now</button> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethod;
