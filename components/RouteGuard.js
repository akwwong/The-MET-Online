import { useState, useEffect } from 'react'
import { isAuthenticated } from '@/lib/authenticate'
import { useRouter } from 'next/router'
import { getHistory, getFavourites } from '@/lib/userData'
import { favouritesAtom, searchHistoryAtom } from '@/store'
import { useAtom } from 'jotai'

// add "/register" to the PUBLIC_PATHS array
const PUBLIC_PATHS = ['/login', '/', '/_error', '/register']

export default function RouteGuard(props) {
  const [authorized, setAuthorized] = useState(false)
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)
  const router = useRouter()

  // copy the  "asynchronous" (async) function "updateAtoms()" defined in the "Login" component and paste it within the "RouteGuard" component function
  async function updateAtoms() {
    setFavouritesList(await getFavourites())
    setSearchHistory(await getHistory())
  }

  // invoke the "updateAtoms()" at the beginning of the "useEffect()" hook function (this will ensure that our atoms are up to date when the user refreshes the page)
  useEffect(() => {

    updateAtoms()
    authCheck(router.pathname)
    router.events.on('routeChangeComplete', authCheck)
    
    return () => {
      router.events.off('routeChangeComplete', authCheck)
    }

  }, [])
  
  function authCheck(url) {

    const path = url.split('?')[0]

    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false)
      router.push('/login')
    } else {
      setAuthorized(true)
    }

  }
  return <>{authorized && props.children}</>
}