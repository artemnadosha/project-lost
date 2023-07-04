import { FC } from 'react'
import {
  ContentRouteDeliveryMobile,
  IndicatorsGroup,
  ModalAddressInfo,
  SidebarDeliveryInfo,
  TableContent,
} from 'components'
import { PageActionsBar } from 'UI'
import { useGoogleMapStateAction, useIsModal, useScreenTracking, useUserReducer } from 'hooks'
import { useGetAllDeliveryQuery, useLazyGetByIDQuery, useUpdateDeliveryMutation } from 'store/api'
import { Stack } from '@mui/material'
import { DeliveryAddressType } from 'types'
import { deliveryIndicatorItems, tableOrdersTitleDelivery } from './OrdersDeliveryPage.utils'

const OrdersDeliveryPage: FC = () => {
  const { isMobileScreen } = useScreenTracking()
  const { userState } = useUserReducer()
  const { isOpen, handleToggleIsOpenModal } = useIsModal()
  const { state: googleMap, handleSetStateMap } = useGoogleMapStateAction()
  const { data, isFetching } = useGetAllDeliveryQuery({ courier: userState.id, status: 'opened' })
  const [getByIdDelivery, { isFetching: isFetchingDeliveryItem, data: deliveryOrderItem }] =
    useLazyGetByIDQuery()
  const [updateDelivery] = useUpdateDeliveryMutation()

  const handleClickLine = (id: string) => {
    getByIdDelivery(id)
  }

  const handleCloseDelivery = (id: string) => {
    if (deliveryOrderItem?.bill || data?.data[0]?.bill) {
      updateDelivery({
        id,
        courier: userState.id,
        status: 'closed',
        bill: deliveryOrderItem?.bill || data?.data[0]?.bill,
      })
    }
  }

  const handleCancelDelivery = (id: string) => {
    updateDelivery({ id })
  }

  const handleOpenGoogleMap = (value: DeliveryAddressType) => {
    handleSetStateMap(value)
    handleToggleIsOpenModal()
  }

  return (
    <>
      <Stack flex={1} height="100%" width="100%" overflow="auto">
        <PageActionsBar>
          <IndicatorsGroup indicatorData={deliveryIndicatorItems} />
        </PageActionsBar>
        {isMobileScreen && <ContentRouteDeliveryMobile data={data} isLoading={isFetching} />}
        {!isMobileScreen && (
          <TableContent
            tableTitle={tableOrdersTitleDelivery}
            isLoading={isFetching}
            data={data?.data}
            isActiveLine={deliveryOrderItem?.id || data?.data[0]?.id}
            onClickLine={handleClickLine}
            onClickAction={() => {}}
            onClickOpenInfoAddress={handleOpenGoogleMap}
          />
        )}
      </Stack>
      {!isMobileScreen && (
        <SidebarDeliveryInfo
          deliveryId={deliveryOrderItem?.id || data?.data[0]?.id}
          withButtonCancel
          statusCheck
          onCancel={handleCancelDelivery}
          onSubmit={handleCloseDelivery}
          orderDetail={deliveryOrderItem?.order || data?.data[0]?.order}
          titleButton="Done"
          isLoading={isFetchingDeliveryItem}
        />
      )}
      {googleMap && (
        <ModalAddressInfo
          address={googleMap.street}
          lat={googleMap.latitude}
          lng={googleMap.longitude}
          isOpen={isOpen}
          onOpenModal={handleToggleIsOpenModal}
        />
      )}
    </>
  )
}

export default OrdersDeliveryPage
