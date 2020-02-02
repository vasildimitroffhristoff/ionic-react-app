import {
  CameraPhoto,
  CameraResultType,
  CameraSource,
  Capacitor,
  FilesystemDirectory
} from '@capacitor/core'
import { isPlatform } from '@ionic/react'
import { useCamera } from '@ionic/react-hooks/camera'
import { base64FromPath, useFilesystem } from '@ionic/react-hooks/filesystem'
import { useStorage } from '@ionic/react-hooks/storage'
import { useEffect, useState } from 'react'

export interface Photo {
  filepath: string
  webviewPath?: string
  base64?: string,
  date?: string
}

const PHOTO_STORAGE = 'photos'
export function usePhotoGallery() {
  const { getPhoto } = useCamera()
  const [photos, setPhotos] = useState<Photo[]>([])
  const { deleteFile, getUri, readFile, writeFile } = useFilesystem()
  const { get, set } = useStorage()

  useEffect(() => {
    const loadSaved = async () => {
      const photosString = await get('photos')
      const photos = (photosString ? JSON.parse(photosString) : []) as Photo[]
      if (!isPlatform('hybrid')) {
        for (let photo of photos) {
          const file = await readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Data
          })

          photo.base64 = `data:image/jpeg;base64,${file.data}`
        }
      }
      setPhotos(photos)
    }
    loadSaved()
  }, [get, readFile])

  const takePhoto = async () => {
    const cameraPhoto = await getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
    const fileName = new Date().getTime() + '.jpg'
    const date = new Date().toISOString()
    const savedFileImage = await savePicture(cameraPhoto, fileName)
    const savedImage= {...savedFileImage, date}
    const newPhotos = [savedImage, ...photos]

    setPhotos(newPhotos)
    set(
      PHOTO_STORAGE,
      isPlatform('hybrid')
        ? JSON.stringify(newPhotos)
        : JSON.stringify(
            newPhotos.map(p => {
              const photoCopy = { ...p }
              delete photoCopy.base64
              return photoCopy
            })
          )
    )
  }

  const savePicture = async (photo: CameraPhoto, fileName: string) => {
    let base64Data: string
    if (isPlatform('hybrid')) {
      const file = await readFile({
        path: photo.path!
      })
      base64Data = file.data
    } else {
      base64Data = await base64FromPath(photo.webPath!)
    }
    await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    })
    return getPhotoFile(photo, fileName)
  }

  const getPhotoFile = async (
    cameraPhoto: CameraPhoto,
    fileName: string
  ): Promise<Photo> => {
    if (isPlatform('hybrid')) {
      const fileUri = await getUri({
        directory: FilesystemDirectory.Data,
        path: fileName
      })

      return {
        filepath: fileUri.uri,
        webviewPath: Capacitor.convertFileSrc(fileUri.uri)
      }
    } else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      }
    }
  }

  const deletePhoto = async (photo: Photo) => {
    const newPhotos = photos.filter(p => p.filepath !== photo.filepath)

    set(PHOTO_STORAGE, JSON.stringify(newPhotos))

    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1)
    await deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    })
    setPhotos(newPhotos)
  }

  return {
    photos,
    takePhoto,
    deletePhoto
  }
}
