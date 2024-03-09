import LayoutFull from '@/components/layout/LayoutFull'
import { useRouter } from 'next/router'
import { AdTypes } from '@/types/AdTypes'
import AdCard from '@/components/ads/AdCard'
import { queryAdById } from '@/components/graphql/Ads'
import { useQuery } from '@apollo/client'
import IconBreadcrumbs from '@/components/breadcrumbs/Breadcrumbs'

function AdDetailComponent(): React.ReactNode {
  const router = useRouter()
  const { id } = router.query
  const { data, error, loading } = useQuery<{ item: AdTypes }>(queryAdById, {
    variables: { adByIdId: id },
    skip: id === undefined,
  })

  const ad = data ? data.item : null
  return (
    <>
      {ad && (
        <LayoutFull title={`TGG : ${ad.title}`}>
          <IconBreadcrumbs
            items={[
              {
                url: `/categories/${ad.subCategory.category.id}`,
                text: `${ad.subCategory.category.name.toUpperCase()}`,
              },
              {
                url: `/sousCategories/${ad.subCategory.id}`,
                text: `${ad.subCategory.name.toUpperCase()}`,
              },
              { url: '/final-item', text: `${ad.title.toUpperCase()}` },
            ]}
          />
          <AdCard key={ad.id} ad={ad} />
        </LayoutFull>
      )}
    </>
  )
}

export default AdDetailComponent
