import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
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
            <IonItem key={p.filepath}>
              <IonAvatar style={{ marginRight: '1rem' }}>
                <img src={p.base64 ?? p.webviewPath} alt="" />
              </IonAvatar>
              <IonLabel>
                <p>
                  <b>File name: </b>
                  {p.filepath}
                </p>
                <p>
                  <b>Date created</b>: {p.date ? p.date : null}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Tab3Page
