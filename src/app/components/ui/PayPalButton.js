import React, { useEffect } from "react";
import {
  PayPalButtons, PayPalScriptProvider,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js"

const liveClientID = process.env.REACT_APP_PAYPAL_CLIENTID
const sandboxClientID = process.env.REACT_APP_PAYPAL_SANDBOX_CLIENTID

export default function PayPalButton({ amount, currency, onSuccess, onError }) {
  return (
    <div className="paypal-button-container">
      <PayPalScriptProvider
        options={{
          "client-id": sandboxClientID,
          components: "buttons",
          currency: "CAD",
        }}
      >
        <ButtonWrapper
          amount={amount}
          currency={currency}
          onSuccess={onSuccess}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  )
}

export function ButtonWrapper({ amount, currency, onSuccess, onError }) {

  const [{ options }, dispatch] = usePayPalScriptReducer()

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    })
  }, [currency])


  return (
    <PayPalButtons
      disabled={false}
      forceReRender={[amount, currency]}
      fundingSource={undefined}
      onError={(err) => onError(err)}
      createOrder={(data, actions) => {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: amount,
                },
              },
            ],
          })
          .then((orderId) => {
            return orderId
          })
      }}
      onApprove={(data, actions) => {
        return actions.order.capture()
          .then((details) => {
            onSuccess(data, details)
          })
          .catch((err) => {
            onError(err)
          })
      }}
    />
  )
}
