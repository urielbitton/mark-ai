import { setDB } from "./CrudDB"

export const createTransactionService = (myUserID, data, details) => {
  return setDB('transactions', data.orderID, {
    transactionID: data.orderID,
    dateCreated: new Date(details.create_time),
    amount: details.purchase_units[0].amount.value,
    currency: details.purchase_units[0].amount.currency_code,
    status: details.status,
    payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
    payerEmail: details.payer.email_address,
    payerAddress: `${details.payer.address.address_line_1} ${details.payer.address.admin_area_2} ${details.payer.address.admin_area_1} ${details.payer.address.postal_code} ${details.payer.address.country_code}`,
    payerPaypalID: details?.payer?.payer_id,
    userID: myUserID,
    mode: details?.links[0].href.includes('sandbox') ? 'sandbox' : 'live'
  })
}