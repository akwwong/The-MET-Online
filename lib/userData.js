import { getToken } from "./authenticate"

// PUT request to /favourites/id
export async function addToFavourites(id) {

  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {method: 'PUT', headers: {'content-type': 'application/json', 'Authorization': `JWT ${token}`}})
  const data = await res.json()

  if (res.status === 200) {
    return data
  } else {
    return []
  }
}

// DELETE request to /favourites/id
export async function removeFromFavourites(id) {

  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {method: 'DELETE', headers: {'content-type': 'application/json', 'Authorization': `JWT ${token}`}})
  const data = await res.json()

  if (res.status === 200) {
    return data
  } else {
    return []
  }
}

// GET request to /favourites/id
export async function getFavourites() {

  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {method: 'GET', headers: {'content-type': 'application/json', 'Authorization': `JWT ${token}`}})
  const data = await res.json()

  if (res.status === 200) {
    return data
  } else {
    return []
  }
}

// PUT request to /history/id
export async function addToHistory(id) {

  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {method: 'PUT', headers: {'content-type': 'application/json', 'Authorization': `JWT ${token}`}})
  const data = await res.json()

  if (res.status === 200) {
    return data
  } else {
    return []
  }
}

// DELETE request to /history/id
export async function removeFromHistory(id) {

  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {method: 'DELETE', headers: {'content-type': 'application/json', 'Authorization': `JWT ${token}`}})
  const data = await res.json()

  if (res.status === 200) {
    return data
  } else {
    return []
  }
}

// GET request to /history/id
export async function getHistory() {

  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {method: 'GET', headers: {'content-type': 'application/json', 'Authorization': `JWT ${token}`}})
  const data = await res.json()

  if (res.status === 200) {
    return data
  } else {
    return []
  }
}