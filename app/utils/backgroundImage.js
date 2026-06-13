import { readdirSync } from 'node:fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const imageExtensions = /\.(png|jpe?g|webp)$/i
const defaultBackgroundsDir = join(__dirname, '..', 'images', 'backgrounds')

function getImagesFromFolder (folderPath) {
  try {
    return readdirSync(folderPath)
      .filter(f => imageExtensions.test(f))
      .map(f => pathToFileURL(join(folderPath, f)).href)
  } catch (e) {
    return []
  }
}

function randomElement (arr) {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

function getBackgroundImage (imageFolder) {
  if (imageFolder) {
    const images = getImagesFromFolder(imageFolder)
    if (images.length > 0) {
      return randomElement(images)
    }
  }
  const defaults = getImagesFromFolder(defaultBackgroundsDir)
  if (defaults.length > 0) {
    return randomElement(defaults)
  }
  return null
}

export { getBackgroundImage }
