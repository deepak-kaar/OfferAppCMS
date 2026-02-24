import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { firestoreConfig } from '../interface/config';

// const fireStoreProvider = {
//   provide: 'FIREBASE_APP',
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) => {
//     const fireStoreEnvConfig = configService.get<firestoreConfig>('firestore', {
//       infer: true,
//     });
//     const fireStoreConfig = {
//       type: fireStoreEnvConfig.type,
//       project_id: fireStoreEnvConfig.project_id,
//       private_key_id: fireStoreEnvConfig.private_key_id,
//       private_key: fireStoreEnvConfig.private_key,
//       client_email: fireStoreEnvConfig.client_email,
//       client_id: fireStoreEnvConfig.client_id,
//       auth_uri: fireStoreEnvConfig.auth_uri,
//       token_uri: fireStoreEnvConfig.token_uri,
//       auth_provider_x509_cert_url:
//         fireStoreEnvConfig.auth_provider_x509_cert_url,
//       client_x509_cert_url: fireStoreEnvConfig.client_x509_cert_url,
//       universe_domain: fireStoreEnvConfig.universe_domain,
//     } as admin.ServiceAccount;

//     return admin.initializeApp({
//       credential: admin.credential.cert(fireStoreConfig),
//     });
//   },
// };


import { readFileSync } from 'fs';

const fireStoreProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () => {
    const serviceAccount = JSON.parse(
      readFileSync('/app/firebase/service-account.json', 'utf8')
    );

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  },
};

@Global()
@Module({
  providers: [fireStoreProvider],
  exports: [fireStoreProvider],
})
export class FirebaseModule {}
