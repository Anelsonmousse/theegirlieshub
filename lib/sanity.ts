import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const sanityClient = createClient({
  projectId: "id1lbvpz",
  dataset: "production",
  token:
    "skZOrHU0bdaKdPXWJnBnIxQo6DvwLJ0j1fEnq5B9KjgKCHT5eIMk772ul2PM85pXdjM5lP20zYu6dkycsR719t8uv6U2oN1WqVjrboZzoMLd9lzrstkk3aSferl6ffNRYGIAtRkIixganobUorImSPttZIekkfF6WuzamfKTcaKk76SWtfHm",
  useCdn: false,
  apiVersion: "2024-01-01",
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// Helper function to upload images to Sanity
export async function uploadImageToSanity(file: File): Promise<string> {
  try {
    const asset = await sanityClient.assets.upload("image", file, {
      filename: file.name,
    })
    return asset._id
  } catch (error) {
    console.error("Error uploading image to Sanity:", error)
    throw error
  }
}

// Helper function to get image URL from Sanity asset ID
export function getSanityImageUrl(assetId: string, width?: number, height?: number): string {
  const imageRef = builder.image(assetId)
  if (width && height) {
    return imageRef.width(width).height(height).url()
  }
  return imageRef.url()
}
