import {
  FreeTablesType,
  IRequestDeleteReservation,
  IReservationsInfo,
  ITable,
  TableMessageType,
} from 'types'
import { api } from './api'

export const tableApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTables: builder.query<ITable[], string>({
      query: () => ({ url: '/tables' }),
      providesTags: ['Table'],
    }),

    getFreeTables: builder.query<FreeTablesType[], void>({
      query: () => ({ url: 'api/tables/free' }),
      providesTags: ['Table'],
    }),

    getTableReservationForCurrentDay: builder.query<TableMessageType, string>({
      query: (tableNumber) => ({ url: `api/tables/reservation/${tableNumber}` }),
    }),

    getTableReservationSelectedDate: builder.query<TableMessageType, { id: string; date: string }>({
      query: ({ id, date }) => ({ url: `/tables/reservation/${id}/${date}` }),
    }),

    addNewTable: builder.mutation<ITable, ITable>({
      query: (body) => ({ url: '/tables', method: 'POST', body }),
      invalidatesTags: ['Table'],
    }),

    addNewReservation: builder.mutation<ITable, { id: string; body: IReservationsInfo }>({
      query: ({ id, body }) => ({ url: `/tables/reservation/${id}`, method: 'POST', body }),
      invalidatesTags: ['Table'],
    }),

    updateTableStatus: builder.mutation<ITable, string>({
      query: (tableNumber) => ({ url: `api/tables/${tableNumber}`, method: 'PUT' }),
      invalidatesTags: ['Table'],
    }),

    updateReservation: builder.mutation<ITable, { id: string; body: Required<IReservationsInfo> }>({
      query: ({ id, body }) => ({ url: `/tables/reservation/update/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Table'],
    }),

    deleteTable: builder.mutation<ITable, string>({
      query: (id) => ({ url: `/tables/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Table'],
    }),

    deleteReservation: builder.mutation<
      IRequestDeleteReservation,
      { tableNumber: string; reservationId: string }
    >({
      query: ({ tableNumber, reservationId }) => ({
        url: `/tables/reservation/${tableNumber}/${reservationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Table'],
    }),
  }),
})

export const {
  useGetAllTablesQuery,
  useGetFreeTablesQuery,
  useAddNewReservationMutation,
  useAddNewTableMutation,
  useDeleteReservationMutation,
  useDeleteTableMutation,
  useGetTableReservationForCurrentDayQuery,
  useGetTableReservationSelectedDateQuery,
  useUpdateReservationMutation,
  useUpdateTableStatusMutation,
} = tableApi
