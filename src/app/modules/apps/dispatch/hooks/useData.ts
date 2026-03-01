const DRIVER_URL = `${process.env.REACT_APP_API_URL}/api/drivers`
const DISPATCH_URL = `${process.env.REACT_APP_API_URL}/api/dispatch`

export const getDriverById = async (id: string) => {
  const response = await fetch(`${DISPATCH_URL}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch driver')
  }
  const data = await response.json()
  return data
}

export const createDispatch = async (driver_id: string) => {
  const response = await fetch(`${DISPATCH_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ driver_id }),
  })
  if (!response.ok) {
    throw new Error('Failed to create dispatch')
  }
  const data = await response.json()
  return data
}
