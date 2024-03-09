import LayoutFull from '@/components/layout/LayoutFull'
import { useRouter } from 'next/router'
import AdCard from '@/components/ads/AdCard'
import { SubCategoryTypes } from '@/types/SubCategoryTypes'
import { useQuery } from '@apollo/client'
import { querySubCatAndAds } from '@/components/graphql/SubCategories'
import IconBreadcrumbs from '@/components/breadcrumbs/Breadcrumbs'

function SubCategoryComponent(): React.ReactNode {
  const router = useRouter()
  const { id } = router.query
  const { data, error, loading } = useQuery<{ item: SubCategoryTypes }>(
    querySubCatAndAds,
    {
      variables: { subCategoryByIdId: id },
      skip: id === undefined,
    }
  )

  const subCategory = data ? data.item : null
  return (
    <LayoutFull
      title={subCategory ? `TGC : ${subCategory.name}` : `TGC : Catégorie`}
    >
      {subCategory && subCategory.category && (
        <>
          <IconBreadcrumbs
            items={[
              {
                url: `/categories/${subCategory.category.id}`,
                text: `${subCategory.category.name.toUpperCase()}`,
              },
              { url: '/final-item', text: `${subCategory.name.toUpperCase()}` },
            ]}
          />

          <p>{`Toutes les offres de la catégorie ${subCategory.name}`}</p>
          {Array.isArray(subCategory.ads) && subCategory.ads.length > 0 ? (
            <div>
              {subCategory.ads.map((infos) => (
                <AdCard key={infos.id} ad={infos} />
              ))}
            </div>
          ) : (
            <p>{`Aucune offre dans la catégorie ${subCategory.name} pour le moment !`}</p>
          )}
        </>
      )}
    </LayoutFull>
  )
}

export default SubCategoryComponent
