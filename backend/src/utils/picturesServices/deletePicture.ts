import axios from 'axios'

export async function deletePicture(filename: string) {
  try {
    const baseUrl = process.env.MEGAS3_URL
    if (!filename) {
      throw new Error('Filename is required')
    }

    const response = await axios.delete(`${baseUrl}${filename}`)

    if (response.data.success) {
      return true
    } else {
      throw new Error(
        'Server responded with an error: ' + response.data.message
      )
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Error deleting picture')
  }
}
