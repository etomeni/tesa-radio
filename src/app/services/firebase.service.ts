import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from '@angular/fire/auth';
import { 
  Firestore, 
  collection, collectionData, 
  doc, addDoc, setDoc,getDoc,getDocs,
  updateDoc, deleteDoc,
  query, startAfter, limit, orderBy, where,
  getCountFromServer
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Observable } from 'rxjs';
import { ResourcesService } from './resources.service';
import { AlertController } from '@ionic/angular';
import { whereCondition } from 'src/modelInterface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public isCurrentUserLoggedIn: boolean = false;
  public currentUser: any;

  constructor(
    private firestore: Firestore,
    private fireAuth: Auth,
    private router: Router,
    private alertController: AlertController,
    private resourcesService: ResourcesService,
  ) { }

  // push notifications
  async __pushNotification() {
    await PushNotifications.addListener('registration', async token => {
      // console.info('Registration token: ', token.value);
      const fcmData2Save = {
        createdAt: Date.now(), // Get the current timestamp in milliseconds
        token: token.value,
        deviceId: (await Device.getInfo()).platform + "_" + await (await Device.getId()).identifier,
      };

      const saveFCMpnToken = () => {
        this.getFirestoreDocumentData("appData", "fcm").then(
          async (res: any) => {
            // console.log(res);
            let newTokens: any[] = res.pnTokens;
            // if (newTokens.indexOf(token.value) === -1) {
            //   newTokens.push(token.value);
            // }
  
  
            // DELETE OLD TOKENS GREATER THAN 3 MONTHS 
            // AND TOKENS WITH THE SAME ID
  
            // Subtract 3 months' worth of milliseconds from the current timestamp
            const threeMonthsAgoTimestamp = fcmData2Save.createdAt - (90 * 24 * 60 * 60 * 1000);
  
            for (let i = 0; i < newTokens.length; i++) {
              const element = newTokens[i];
  
              // Compare the createdAt timestamp with the three months ago timestamp
              if (element.createdAt < threeMonthsAgoTimestamp) {
                // console.log("createdAt is more than 3 months old");
                newTokens.splice(i, 1);
              }
  
              // DELETES TOKENS WITH SAME ID
              newTokens = newTokens.filter((element) => element.deviceId !== fcmData2Save.deviceId);
            }
  
            // SAVES NEW UNIQUE TOKENS TO THE DATABASE
            if (
              newTokens.findIndex(item => item.token == token.value) === -1
            ) {
              newTokens.push(fcmData2Save);
            }
  
            // this.save2FirestoreDB("appData", { pnTokens: newTokens }, "fcm");
            this.updateFirestoreData("appData", "fcm", { pnTokens: newTokens });
            this.resourcesService.setLocalStorage("fcmToken", fcmData2Save);
  
            // if user is loggedin update his/her account
            if (this.currentUser) {
              const userId = this.currentUser.userID || this.currentUser.id || this.currentUser._id;
              if (userId) {
                // this.updateFirestoreData("users", userId, { pnTokens: token.value });
                this.updateFirestoreData("users", userId, { pnTokens: fcmData2Save });
              }
            }
          }
        );
      }

      this.resourcesService.getLocalStorage("fcmToken").then(
        (res: any) => {
          if (res) {
            const oneWeekAgoTimestamp = fcmData2Save.createdAt - (7 * 24 * 60 * 60 * 1000);

            // Compare the createdAt timestamp with the three months ago timestamp
            if (fcmData2Save.createdAt < oneWeekAgoTimestamp) {
              // console.log("createdAt is more than one week old");
              saveFCMpnToken();
            }
          } else {
            saveFCMpnToken();
          }
        },
        (err: any) => {
          saveFCMpnToken();
        }
      );

    });

    // await PushNotifications.addListener('registrationError', err => {
    //   console.error('Registration error: ', err.error);
    // });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      // console.log('Push notification received: ', notification);

      App.getState().then(async (res)=> {
        if (res.isActive) {
          const _alert = await this.alertController.create({
            message: notification.body,
            header: notification.title,
            subHeader: notification.subtitle,
            animated: true,
            mode: 'ios',
          });

          _alert.present();
        }
      })
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
      // console.log('Push notification action performed', notification.actionId, notification.inputValue);

      const _alert = await this.alertController.create({
        message: notification.notification.body,
        header: notification.notification.title,
        subHeader: notification.notification.subtitle,
        animated: true,
        mode: 'ios',
      });

      _alert.present();
    });
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
  
  async registerPushNotifications() {
    if(Capacitor.isNativePlatform()) {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
  
      if (permStatus.receive !== 'granted') {
        return;
        // throw new Error('User denied permissions!');
      }
      
      await PushNotifications.register();
      this.__pushNotification();
    }
  }

  // firestore
  save2FirestoreDB(path: string, data: any, id: string | undefined = undefined) {
    return new Promise<any> ((resolve, reject) => {
      const collectionInstance = collection(this.firestore, path);

      if (id) {
        setDoc(doc(collectionInstance, id), data).then((res: any) => {
          // console.log("Data Saved Successfully");
          // console.log(res);
          resolve(res || true);
        }).catch((err: any) => {
          console.log(err);
          reject(err || false);
        })

      } else {

        addDoc(collectionInstance, data).then((res: any) => {
          // console.log("Data Saved Successfully");
          this.updateFirestoreData(path, res.id, { id: res.id });

          // console.log(res);
          resolve(res || true);
        }).catch((err: any) => {
          console.log(err);
          reject(err || false);
        })
      }  
    });
  }

  getAllFirestoreCollectionData(path: string) {
    return new Promise<any> ((resolve, reject) => {
      const collectionInstance = collection(this.firestore, path);

      collectionData(collectionInstance, { idField: 'id' }).subscribe(
        (res: any) => {
          console.log(res);
          resolve(res);
        },
        (err: any) => {
          console.log(err);
          reject(err);
        }
      )
    });

    // const collectionInstance = collection(this.firestore, path);
    // collectionData(collectionInstance, { idField: 'id' }).subscribe((val: any) => {
    //   console.log(val);
    // })
  }

  async getOrderedLimitedFirestorDocs(path: string, orderBypath: string, limitNum: number = 10, orderBypath2: 'lastInteraction' | 'episodes' | 'category' | 'createdAt' | 'updatedAt' = "lastInteraction") {
    const docRef = collection(this.firestore, path);
    let queryRef: any;
    if (orderBypath2) {
      queryRef = query(docRef, orderBy(orderBypath, "desc"), orderBy(orderBypath2, "desc"), limit(limitNum));
    } else {
      queryRef = query(docRef, orderBy(orderBypath, "desc"), limit(limitNum));
    }

    const documentSnapshots = await getDocs(queryRef);

    let results: any[] = [];
    documentSnapshots.forEach((doc: any) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());

      let _id = doc.id;
      let res = { ...doc.data(), _id };
      results.push(res);
    });
    return results;
  }

  async getAllFirestoreDocumentData(path: string, docId: string) {
    let results: any[] = [];

    const querySnapshot = await getDocs(collection(this.firestore, path));
    querySnapshot.forEach((doc: any) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      let _id = doc.id;
      let res = { ...doc.data(), _id };
      results.push(res);
    });

    return results;
  }

  getFirestoreDocumentData(path: string, docId: string) {
    return new Promise<any> (async (resolve, reject) => {
      const docRef = doc(this.firestore, path, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let _id = docSnap.id;
        let result = { ...docSnap.data(), _id };

        resolve(result);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        reject(false);
      }
      
    });
  }

  async getLimitedFirestoreDocumentData(
    path: string, 
    limitNum: number, 
    where_Condition: whereCondition = {property: '', condition: '==', value: '' },
    where_Condition2: whereCondition = {property: '', condition: '==', value: '' },
  ) {
    let results: any[] = [];

    // Query the first page of docs
    const docRef = collection(this.firestore, path);
    let first;
    // const first = query(docRef, orderBy(order_By), limit(limitNum));
    if (where_Condition.property && where_Condition.value) {
      if (where_Condition2.property && where_Condition2.value) {
        first = query(
          docRef, 
            where(where_Condition.property, where_Condition.condition, where_Condition.value),
            where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
            limit(limitNum)
          );
      } else {
        first = query(docRef, where(where_Condition.property, where_Condition.condition, where_Condition.value), limit(limitNum));
      }

    } else {
      first = query(docRef, limit(limitNum));
    }
    const documentSnapshots = await getDocs(first);

    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

    documentSnapshots.forEach((doc: any) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());

      let _id = doc.id;
      let res = { ...doc.data(), _id, lastVisible };
      results.push(res);
    });

    return results;
  }

  async getNextLimitedFirestoreDocumentData(
    path: string, 
    last_Visible: any, 
    limitNum: number, 
    where_Condition: whereCondition = {property: '', condition: '==', value: '' },
    where_Condition2: whereCondition = {property: '', condition: '==', value: '' }
  ) {
    let results: any[] = [];
    
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const docRef = collection(this.firestore, path);
    let next;
    // next = query(docRef, orderBy(order_By), where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
    if (where_Condition.property && where_Condition.value) {
      if (where_Condition2.property && where_Condition2.value) {
        next = query(
          docRef, 
          where(where_Condition.property, where_Condition.condition, where_Condition.value), 
          where(where_Condition2.property, where_Condition2.condition, where_Condition2.value), 
          startAfter(last_Visible), 
          limit(limitNum)
        );
      } else {
        next = query(docRef, where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
      }
    } else {
      next = query(docRef, startAfter(last_Visible), limit(limitNum));
    }
    const documentSnapshots = await getDocs(next);

    // console.log(documentSnapshots);
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
    // console.log("last", lastVisible);

    documentSnapshots.forEach((doc: any) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());

      let _id = doc.id;
      let res = { ...doc.data(), _id, lastVisible };
      results.push(res);
    });

    return results;
  }





  async countFirestoreDocs(path: string, where_Condition: whereCondition = {property: '', condition: '==', value: '' }) {
    const coll = collection(this.firestore, path);

    if (where_Condition.property) {
      const q = query(coll, where(where_Condition.property, where_Condition.condition, where_Condition.value));
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } else {
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    }
  }



  updateFirestoreData(path: any, id: string, updateData: any) {
    return new Promise<any> ((resolve, reject) => {
      const docInstance = doc(this.firestore, path, id);
      updateDoc(docInstance, updateData).then((res: any) => {
        // console.log("Data updated" + res);
        resolve(res || true);
      }).catch((err: any) => {
        console.log(err);
        reject(err || false);
      });
    });
  }

  deleteFirestoreData(path: any, id: string) {
    return new Promise<any> ((resolve, reject) => {
      const docInstance = doc(this.firestore, path, id);
      deleteDoc(docInstance).then((res: any) => {
        // console.log("Data deleted" + res);
        resolve(res || true);
      }).catch((err: any) => {
        console.log(err);
        reject(err || false);
      })
    })
  }



  // auth
  signupFireAuth (value: any) {
    return new Promise<any> ( (resolve, reject) => {
      createUserWithEmailAndPassword(this.fireAuth, value.email, value.password).then (
        (res: any)=>resolve(res),
        (err: any)=>reject(err)
      )
    });
  }

  loginFireAuth(value: any) {
    return new Promise<any> ( (resolve, reject) => {
      signInWithEmailAndPassword(this.fireAuth, value.email, value.password).then(
        res=>resolve(res),
        error=>reject(error)
      )
    })
  }

  sendEmailVerificationFireAuth () {
    return new Promise<any> ( (resolve, reject) => {
      const currentUser: any = this.fireAuth.currentUser;
      sendEmailVerification(currentUser).then (
        (res: any)=>resolve(res),
        (err: any)=>reject(err)
      )
    });
  }

  updateUserProfileFireAuth (displayName: string, photoURL: string = '') {
    return new Promise<any> ( (resolve, reject) => {
      const currentUser: any = this.fireAuth.currentUser;
      let updateData: any;
      if(photoURL) {
        updateData = {
          displayName,
          photoURL
        }
      } else {
        updateData = {
          displayName,
        }
      }

      updateProfile(currentUser, updateData).then (
        (res: any)=>resolve(res),
        (err: any)=>reject(err)
      )
    });
  }

  updateEmailAddressFireAuth (newEmail: string, currentUserEmail: string, currentUserPassword: string) {
    const currentUser: any = this.fireAuth.currentUser;
    const credential = EmailAuthProvider.credential(currentUserEmail,currentUserPassword);
  
    return new Promise<any> ( (resolve, reject) => {
      reauthenticateWithCredential(currentUser, credential).then(() => {
        // User re-authenticated.
        updateEmail(currentUser, newEmail).then (
          (res: any)=>resolve(res),
          (err: any)=>reject(err)
        );
      }).catch((error) => {
        console.log(error);
        reject(error)
        // An error ocurred
        // ...
      });

    });
  }

  deleteFireAuthAcct (currentUserEmail: string, currentUserPassword: string) {
    const currentUser: any = this.fireAuth.currentUser;
    const credential = EmailAuthProvider.credential(currentUserEmail, currentUserPassword);

    return new Promise<any> ( (resolve, reject) => {
      reauthenticateWithCredential(currentUser, credential).then(() => {
        // User re-authenticated.
        deleteUser(currentUser).then(
          // User deleted.
          (res: any)=>resolve(res),
          (err: any)=>reject(err)
        )
      }).catch((error) => {
        console.log(error);
        reject(error)
        // An error ocurred
        // ...
      });
    });
  }

  updatePasswordFireAuth (newPassword: string, currentUserEmail: string, currentUserPassword: string) {
    const currentUser: any = this.fireAuth.currentUser;
    const credential = EmailAuthProvider.credential(currentUserEmail, currentUserPassword);

    return new Promise<any> ( (resolve, reject) => {
      reauthenticateWithCredential(currentUser, credential).then(() => {
        // User re-authenticated.
        updatePassword(currentUser, newPassword).then (
          (res: any)=>resolve(res),
          (err: any)=>reject(err)
        );
      }).catch((error) => {
        console.log(error);
        reject(error)
        // An error ocurred
        // ...
      });
    });
  }

  sendPasswordResetEmailFireAuth(email: any) {
    return new Promise<any> ( (resolve, reject) => {
      sendPasswordResetEmail(this.fireAuth, email).then(
        (res: any) => {
          resolve(res || true);
        }
      ).catch((error: any) => {
        // console.log(error);
        reject(error || false);
      })
    })

  }

  async IsLoggedIn(): Promise<boolean | any> {
    const responseData: any = {
      state: true || false,
      message: "",
    };

    await new Promise((resolve, reject) =>
      this.fireAuth.onAuthStateChanged(
        (authRes: any) => {
          // console.log(authRes);
          
          if (authRes) {
            // User is signed in.
            this.getUserData(authRes);
            this.isCurrentUserLoggedIn = true;
            responseData.state = true;
            responseData.message = "Success, you're logged in.";
            responseData.user = authRes;
            
            return resolve(responseData);
          } else {
            // No user is signed in.
            this.isCurrentUserLoggedIn = false;
            responseData.state = false;
            responseData.message = "Error, no user logged in.";

            return reject(responseData);
          }
        },
        // Prevent console error
        (error: any) => {
          // console.log(error);
          responseData.state = false;
          responseData.message = "Error...";
          responseData.error = error;

          return reject(responseData);
        } 
      )
    );

    return responseData;
  }

  logoutFirebaseUser() {
    return new Promise<any> ( (resolve, reject) => {
      // this.fireAuth.signOut().then(
      signOut(this.fireAuth).then(
        (res: any) => {
          this.isCurrentUserLoggedIn = false;
          this.resourcesService.removeLocalStorageItem("isCurrentUserLoggedIn");
          this.resourcesService.removeLocalStorageItem("user");
          this.router.navigateByUrl('/auth/login', {replaceUrl: true});
                    
          resolve(res || true);
        },
        (error) => {
          this.isCurrentUserLoggedIn = false;
          this.resourcesService.setLocalStorage("isCurrentUserLoggedIn", false);
          this.resourcesService.removeLocalStorageItem("user");
          this.router.navigateByUrl('/auth/login', {replaceUrl: true});

          reject(error || false);
        }
      )
    })
  }



  getUserData(authUserData: any) {
    this.getFirestoreDocumentData("users", authUserData.uid).then(
      (res: any) => {
        // console.log(res);
        if(res) {
          this.currentUser = res;

          let userData = {
            userAuthInfo: authUserData,
            userDBinfo: res,
            loginStatus: true
          }
          this.resourcesService.setLocalStorage("user", userData);
        }
      },
      (err: any) => {
        console.log(err);
        this.resourcesService.getLocalStorage("user").then(
          (res: any) => {
            if(res) {
              this.currentUser = res.userDBinfo;
            }
          }
        )
      }
    )
  }

}
