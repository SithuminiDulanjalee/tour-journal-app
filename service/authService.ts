import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore"
export const registerUser = async (
    fullname: string, 
    email: string, 
    password: string)=>{
    const userCredintials = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
    )
    await updateProfile(userCredintials.user, {
        displayName: fullname
    })

    
    //firestore(database service)
    await setDoc(doc(db, "users", userCredintials.user.uid), {
        name: fullname,
        email,
        createAt: new Date()

    }); 
    return userCredintials.user;   
}
export const login = async (email: string, password: string)=>{
    // const userCredintials = await signInWithEmailAndPassword(auth, email, password);
    // return userCredintials.user;
    return await signInWithEmailAndPassword(auth, email, password)
}
export const logOut = async ()=>{
    await signOut(auth)
    return
}