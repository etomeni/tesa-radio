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
import { Database, onValue, ref } from '@angular/fire/database';
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
import { Observable } from 'rxjs';
import { ResourcesService } from './resources.service';


enum conditionType {
  '!=' = "!=",
  '<' = "<",
  '<=' = "<=",
  '==' = "==",
  '>' = ">",
  '>=' = ">=",
  'array-contains' = "array-contains",
  'array-contains-any' = "array-contains-any",
  'in' = "in",
  'not-in' = "not-in",
};

interface userInterface {
  updatedAt: number,
  createdAt: number,
  email: string,
  name: string,
  phoneNumber: string,
  profilePhotoURL: string,
  id: string,
  userID: string,
  lastInteraction: number,

  lastPlayed: [
    {
      id: string,
      arrayID: number,
      type: "shows" | "podcast",
      src: string,
      wave_surfer: any,
      audio: any,
      title: string,
      description: string,
      image: string,
      category: string,
      ref_id: string,
      playStat: string,
      comments: any,
      createdAt: string,
      updatedAt: string,
  
      // playing controls
      durationSummary: string,
      timingInterval: any, 
      seekAudioRangeValue: number,
      currentTime: any,
      duration: any,
      playbackRate: any,
      loadingState: boolean // true, 
      isPlaying: boolean // false,
    }
  ]
};

interface whereCondition {
  property: string, 
  condition: "!=" | "<" | "<=" | "==" | ">" | ">=" | "array-contains" | "array-contains-any" | "in" | "not-in",
  value: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public isCurrentUserLoggedIn: boolean = false;
  public currentUser: any;

  constructor(
    private realtimeDB: Database,
    private firestore: Firestore,
    private fireAuth: Auth,
    private router: Router,
    private resourcesService: ResourcesService,
  ) { }



  // push notifications
  async __pushNotification() {
    await PushNotifications.addListener('registration', token => {
      // console.info('Registration token: ', token.value);

      this.getFirestoreDocumentData("appData", "fcm").then(
        (res: any) => {
          // console.log(res);
          let newTokens: any[] = res.token;
          newTokens.unshift(token.value);

          this.save2FirestoreDB("appData", { pnTokens: newTokens }, "fcm");

          if (this.currentUser) {
            const userId = this.currentUser.userID || this.currentUser.id || this.currentUser._id;
            if (userId) {
              this.updateFirestoreData("users", userId, { pnTokens: newTokens });
            }
          }
        }
      );
    });

    // await PushNotifications.addListener('registrationError', err => {
    //   console.error('Registration error: ', err.error);
    // });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
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
        throw new Error('User denied permissions!');
      } else {
        this.__pushNotification();
      }
  
      await PushNotifications.register();
    }
  }



  getAllRealTimeDBdata(path: string) {
    const databaseRef = ref(this.realtimeDB, path);
    onValue(databaseRef, (snapshot) => {
      console.log(snapshot.val);
      
    })
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

  // async getLimitedFirestoreDocumentData(path: string, limitNum: number, where_Condition: whereCondition = {property: '', condition: '==', value: '' }) {
  //   let results: any[] = [];

  //   // Query the first page of docs
  //   const docRef = collection(this.firestore, path);
  //   let first;
  //   // const first = query(docRef, orderBy(order_By), limit(limitNum));
  //   if (where_Condition.property && where_Condition.value) {
  //     first = query(docRef, where(where_Condition.property, where_Condition.condition, where_Condition.value), limit(limitNum));
  //   } else {
  //     first = query(docRef, limit(limitNum));
  //   }
  //   const documentSnapshots = await getDocs(first);

  //   const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

  //   documentSnapshots.forEach((doc: any) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     // console.log(doc.id, " => ", doc.data());

  //     let _id = doc.id;
  //     let res = { ...doc.data(), _id, lastVisible };
  //     results.push(res);
  //   });

  //   return results;
  // }

  // async getNextLimitedFirestoreDocumentData(path: string, last_Visible: any, limitNum: number, where_Condition: whereCondition = {property: '', condition: '==', value: '' }) {
  //   let results: any[] = [];
    
  //   // Construct a new query starting at this document,
  //   // get the next 25 cities.
  //   const docRef = collection(this.firestore, path);
  //   let next;
  //   // next = query(docRef, orderBy(order_By), where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
  //   if (where_Condition.property && where_Condition.value) {
  //     next = query(docRef, where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
  //   } else {
  //     next = query(docRef, startAfter(last_Visible), limit(limitNum));
  //   }
  //   const documentSnapshots = await getDocs(next);

  //   // console.log(documentSnapshots);
  //   const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
  //   // console.log("last", lastVisible);

  //   documentSnapshots.forEach((doc: any) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     // console.log(doc.id, " => ", doc.data());

  //     let _id = doc.id;
  //     let res = { ...doc.data(), _id, lastVisible };
  //     results.push(res);
  //   });

  //   return results;
  // }



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



  
  // getMultipleDBdata(path: string) {
  //   const notesRef = collection(this.firestore, path);
  //   return collectionData(notesRef) as Observable<any[]>;
  // }

  // getDBdataById(path: string, id): Observable<Note> {
  //   const noteDocRef = doc(this.firestore, `notes/${id}`);
  //   return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  // }

  // async getFirestore(path: string) {
  //   try {
  //     const querySnapshot = await getDocs(collection(this.firestore, path));
  //     querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} => ${doc.data()}`);
  //     });
  //   } catch (error) {
  //     return error;
  //     console.error("Error adding document: ", error);
  //   }
    
  // }
 
  // addToDB(path: string, data: any) {
  //   try {
  //     const collectionRef = collection(this.firestore, path);
  //     const docRef: any = addDoc(collectionRef, data);
  //     return docRef;
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (error) {
  //     return error;
  //     console.error("Error adding document: ", error);
  //   }
  // }
 
  // deleteDb(path: string) {
  //   try {
  //     const docRef = doc(this.firestore, path);
  //     return deleteDoc(docRef);
  //     // await deleteDoc(doc(this.firestore, "cities", "DC"));
  //   } catch (error) {
  //     return error;
  //     console.error("Error updating document: ", error);
  //   }
  // }
 
  // updateDB(path: string, dataObj: any) {
  //   try {
  //     const noteDocRef = doc(this.firestore, path);
  //     const updateDb = updateDoc(noteDocRef, dataObj);
  //     return updateDb;
  //   } catch (error) {
  //     return error;
  //     console.error("Error updating document: ", error);
  //   }
  // }








  // THE FOLLOWING IS FOR THE COMPACTIBLE REALTIME DATABASE
  

  // getLastKey(path:any){
  //   let dbPath = this.realtimeDB.database.ref(path);

  //   return new Promise<any> ((resolve, reject) => {
  //     this.realtimeDB.list(dbPath, ref =>
  //       ref.orderByKey().limitToLast(1)).snapshotChanges().subscribe (
  //         (res: any) => {
  //           if (res.length) {
  //             this.totalQdb = Number(res[0].key);
  //           }
  //           resolve(res);
  //         },
  //         (err: any) => {
  //           reject(err);
  //           // console.log(err);
  //         }
  //     )
  //   })

  // }

  // async getFbDBpartData(path:any, totalDBlength=this.totalQdb, start=0, size=10) {
  //   // get data in bits as an array

  //   let dbPath = this.realtimeDB.database.ref(path);
  //   let dbLength = totalDBlength || this.totalQdb;

  //   let end_at: number;
  //   let start_at: number;
  //   let next_start_size: number = ((start+1)*size);

  //   if (start == 0) {
  //     if (dbLength <= size) {
  //       this.endAll = true;
  //     }

  //     return new Promise<any> ((resolve, reject) => {
  //       this.realtimeDB.list(dbPath, ref =>
  //       ref.orderByKey().limitToLast(size)).valueChanges().subscribe (
  //         res=>resolve(res.reverse()),
  //         error=>reject(error)
  //       )
  //     });
  //   } else {
      
  //     if (next_start_size >= dbLength && this.endAll == false) {
  //       // let remaingSize = dbLength % (next_start_size - size) + 1;
  //       let remaingSize: number;

  //       if (next_start_size == dbLength) {
  //         remaingSize = size; 
  //       } else {
  //         remaingSize = dbLength % (next_start_size - size) + 1;
  //       }

  //       this.endAll = true;
        
  //       if (remaingSize > 0) {
  //         return new Promise<any> ((resolve, reject) => {
  //           this.realtimeDB.list(dbPath, ref =>
  //           ref.orderByKey().limitToFirst(remaingSize)).valueChanges().subscribe (
  //             res=>resolve(res.reverse()),
  //             error=>reject(error)
  //           )
  //         })
  //       }

  //     }

  //     start_at = dbLength - next_start_size;
  //     end_at = start_at + size;
  
  //     return new Promise<any> ((resolve, reject) => {
  //       if (this.endAll == false) {
  //         this.realtimeDB.list(dbPath, ref =>
  //         ref.orderByKey().startAt(`${start_at}`).endAt(`${end_at}`)).valueChanges().subscribe (
  //           res=>resolve(res.reverse()),
  //           error=>reject(error)
  //         )
  //       } else {
  //         resolve([]);
  //         reject(false);
  //       }
  
  //     });
      
  //   }
  // }
  
  // // get all data once as an object
  // getRealtimeDBdata(path:any) {
  //   let dbPath = this.realtimeDB.database.ref(path);
  //   return new Promise<any> ((resolve, reject) => {
  //     this.realtimeDB.object(dbPath).valueChanges().subscribe (
  //       res=>resolve(res),
  //       error=>reject(error)
  //     )
  //   })
  // }

  // saveToRealtimeDataDB(path: string, objData: object) {
  //   // save in firebase real time database
  //   // this.realtimeDB.object(path).set(objData).then( () => {
  //   //   return "true";
  //   // }).catch( ()=> {
  //   //   return false;
  //   // });

  //   return new Promise<any> ( (resolve, reject) => {
  //     this.realtimeDB.object(path).set(objData).then (
  //       (res: any)=>resolve(res),
  //       (err: any)=>reject(err)
  //     )
  //   })

  // }

  // updateRealtimeDBdata(path: string, objData: object) {
  //   return new Promise<any> ( (resolve, reject) => {
  //     this.realtimeDB.object(path).update(objData).then (
  //       res=>resolve(true),
  //       error=>reject(false)
  //     )
  //   })
  // }

  // sendPasswordResetEmail(email: any) {
  //   return new Promise<any> ( (resolve, reject) => {
  //     this.auth.sendPasswordResetEmail(email).then (
  //       (res: any)=>resolve({response: res, status: true}),
  //       (err: any)=>reject(err)
  //     )
  //   })

  // }


  // signupFireAuth (value: any) {
  //   return new Promise<any> ( (resolve, reject) => {
  //     this.auth.createUserWithEmailAndPassword (value.email, value.password).then (
  //       (res: any)=>resolve(res),
  //       (err: any)=>reject(err)
  //     )
  //   });
  // }

  // async IsLoggedIn(): Promise<boolean | any> {
  //   const responseData: any = {
  //     state: true || false,
  //     message: "",
  //   };

  //   try {
  //     await new Promise((resolve, reject) =>
  //       this.auth.onAuthStateChanged(
  //         (user: any) => {
  //           // console.log(user);
            
  //           if (user) {
  //             // User is signed in.
  //             responseData.state = true;
  //             responseData.message = "Success, you're logged in.";
  //             responseData.user = user;
              
  //             return resolve(responseData);
  //           } else {
  //             // No user is signed in.
  //             responseData.state = false;
  //             responseData.message = "Error, no user logged in.";

  //             return reject(responseData);
  //           }
  //         },
  //         // Prevent console error
  //         (error: any) => {
  //           // console.log(error);
  //           responseData.state = false;
  //           responseData.message = "Error...";
  //           responseData.error = error;

  //           return reject(responseData);
  //         } 
  //       )
  //     );

  //     return responseData;
  //   } catch (error) {
  //     responseData.state = false;
  //     responseData.message = "Error...";
  //     responseData.error = error;

  //     return responseData;
  //   }
  // }

  // loginFireAuth (value: any) {
  //   return new Promise<any> ( (resolve, reject) => {
  //     this.auth.signInWithEmailAndPassword (value.email, value.password).then (
  //       res=>resolve(res),
  //       error=>reject(error)
  //     )
  //   })

  // }

  // userDBinfo(userID: any) {
  //   let dbPath = this.realtimeDB.database.ref("users/" + userID);
  //   return new Promise<any> ((resolve, reject) => {
  //     this.realtimeDB.object(dbPath).valueChanges().subscribe (
  //       res=>resolve(res),
  //       error=>reject(error)
  //     )
  //   })
  // }

  // uploadFile2firebase(path: any, file: any) {
  //   let ref = this.firebaseStorage.ref(`${path}`);
  //   return new Promise<any> ((resolve, reject) => {
  //     ref.put(file).then(
  //       (res: any) => {
  //         ref.getDownloadURL().subscribe(imgURL=> {
  //           resolve(imgURL);
  //         });
  //       },
  //       (err: any) => {
  //         reject(err);
  //       }
  //     );
  //   })
  // }

}
