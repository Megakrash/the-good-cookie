import LayoutFull from '@/components/layout/LayoutFull'
import RecentAds from '@/components/ads/RecentAds'
import Search from '@/components/search/Search'

function Home(): React.ReactNode {
  return (
    <LayoutFull title="Accueil TGC">
      <Search />
      <RecentAds />
    </LayoutFull>
  )
}

export default Home
