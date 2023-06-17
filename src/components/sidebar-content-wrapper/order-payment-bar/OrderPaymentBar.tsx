import { FC } from 'react'

import { DetailsListTitle, ToggleMenu } from 'UI'
import { useAppSelector, useBillsReducer, useUserReducer } from 'hooks'
import { useUpdateBillMutation, useUpdateTableStatusMutation } from 'store/api'
import { PaymentFormReturnType } from 'types'
import { FadeIn } from 'utils'
import { Stack } from '@mui/material'
import { PaymentListInfo } from './payment-list-info'
import { toggleMenuValues } from './orderPaymentBar.utils'
import { OrderListInfo } from './order-list-info'

const OrderPaymentBar: FC = () => {
  const { userState } = useUserReducer()
  const { newBill, relocateBills, changeToggle } = useBillsReducer()

  const { firstName, secondName } = userState
  const toggleValue = useAppSelector((state) => state.bills.toggleValue)

  const [updateBill] = useUpdateBillMutation()
  const [updateTableStatus] = useUpdateTableStatusMutation()
  // const [sendEmail] = useLazySendEmailQuery()

  const buttonDisabled = newBill.status === 'closed'
  const detailsListTitle = toggleValue === 'Payment' ? 'Order payment' : 'Order info'

  const handleFormSubmit = (values: PaymentFormReturnType) => {
    updateBill({ ...newBill, ...values, status: 'closed' })
    relocateBills({ ...newBill, ...values, status: 'closed' })
    updateTableStatus(newBill.table)
    // if (newBill.id) sendEmail(newBill.id) TODO: fix nodemailer
    changeToggle('Order info')
  }

  return (
    <FadeIn styles={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <ToggleMenu
        menuItems={toggleMenuValues}
        onChange={changeToggle}
        defaultValue={toggleValue}
        buttonDisabled={buttonDisabled}
      />
      <Stack sx={{ height: 'calc(100% - 70px)' }}>
        <DetailsListTitle
          title={detailsListTitle}
          orderNumber={newBill.orderNumber}
          staffName={firstName}
          staffSurname={secondName}
        />
        {toggleValue === 'Payment' && (
          <PaymentListInfo onSubmit={handleFormSubmit} newBill={newBill} />
        )}
        {toggleValue === 'Order info' && <OrderListInfo newBill={newBill} />}
      </Stack>
    </FadeIn>
  )
}

export default OrderPaymentBar
