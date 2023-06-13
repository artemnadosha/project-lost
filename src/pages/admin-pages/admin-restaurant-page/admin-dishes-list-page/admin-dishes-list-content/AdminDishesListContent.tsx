import { FC } from 'react'
import { Pagination, Stack } from '@mui/material'
import { SearchFilterBar, Table } from 'components'
import { useParamsSearchFilter } from 'hooks'
import { useGetCategoriesQuery, useGetDishesQuery } from 'store/api'
import { FilterMenuItemType } from 'types'
import { correctionName } from 'utils'
import { dishesTableTitles } from './adminDishesListContent.utils'

interface AdminDishesListContentProps {
  onClickLine: (id: string) => void
  onClickAction: (id: string) => void
}

const AdminDishesListContent: FC<AdminDishesListContentProps> = ({
  onClickLine,
  onClickAction,
}) => {
  const {
    params: category,
    search,
    page,
    handleFilterTitle,
    handleFilterCategory,
    handlePagination,
  } = useParamsSearchFilter('category')
  const { data: categories } = useGetCategoriesQuery(null)
  const { data, isLoading } = useGetDishesQuery({ category, page, search, status: 'all' })
  const categoriesValues: FilterMenuItemType[] | undefined =
    categories && categories.map(({ title }) => ({ value: title, label: correctionName(title) }))

  return (
    <>
      {categoriesValues && (
        <SearchFilterBar
          subcategories={categoriesValues}
          changeCategory={handleFilterCategory}
          changeTitle={handleFilterTitle}
          defaultValueFilter={category?.split(',')}
          defaultValueInput={search || ''}
        />
      )}
      <Table
        tableMinWidth="660px"
        data={data?.data}
        isLoading={isLoading}
        tableTitles={dishesTableTitles}
        tableType="dishes"
        onClickAction={onClickAction}
        onClickLine={onClickLine}
      />
      <Stack
        sx={{
          height: 'fit-content',
          alignItems: 'flex-end',
          marginRight: '30px',
          p: { md: '20px', xs: '10px' },
          flex: 0,
        }}>
        {data && (
          <Pagination
            count={Math.ceil(data.totalCount / 8)}
            variant="text"
            shape="rounded"
            color="primary"
            onChange={handlePagination}
            page={Number(page)}
          />
        )}
      </Stack>
    </>
  )
}

export default AdminDishesListContent
