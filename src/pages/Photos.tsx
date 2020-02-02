import {
  IonActionSheet,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { camera, close, trash } from 'ionicons/icons'
import React, { useState } from 'react'

import { Photo, usePhotoGallery } from '../hooks/usePhotoGallery'

const Tab2: React.FC = () => {
  const { takePhoto, photos, deletePhoto } = usePhotoGallery()
  const [photoToDelete, setPhotoToDelete] = useState<Photo>()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonContent>
          <IonGrid>
            <IonRow>
              {photos.map(photo => (
                <IonCol size="6" key={photo.filepath}>
                  <IonImg
                    onClick={() => setPhotoToDelete(photo)}
                    src={photo.base64 ?? photo.webviewPath}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonContent>
        {/* fab */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="dark" onClick={takePhoto}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
            {
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete)
                  setPhotoToDelete(undefined)
                }
              }
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel'
            }
          ]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />
      </IonContent>
    </IonPage>
  )
}

export default Tab2
