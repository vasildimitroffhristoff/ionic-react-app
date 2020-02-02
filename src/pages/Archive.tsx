import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import React from 'react'

import { usePhotoGallery } from '../hooks/usePhotoGallery'

const Tab3Page: React.FC = () => {
  const { photos } = usePhotoGallery()
  console.log(photos)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Archive</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {photos.map(p => (
            <IonItem>
              <IonThumbnail>
                <img src={p.base64 ?? p.webviewPath} alt="" />
              </IonThumbnail>
              <IonLabel>
                <h2>
                  File name:
                  {p.filepath}
                </h2>
                <p>Date created: {p.date ? p.date : null}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Tab3Page
