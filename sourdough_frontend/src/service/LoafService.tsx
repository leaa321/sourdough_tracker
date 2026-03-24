import { data } from "react-router-dom";
import type { loafUpload } from "../models/loaf";
import { supabase } from "../utils/supabase";

export async function getLoafes() {
    const { data, error } = await supabase
        .from('sourdough_loaves')
        .select()

    if (error) {
        throw new Error('Error loading loaves')
    }

    return data
}

export function getLoafPicture(path: string) {
    const { data } = supabase
        .storage
        .from("LoafImages")
        .getPublicUrl(path);

    return data.publicUrl;
}

export async function uploadLoaf(loaf: loafUpload) {
    await checkUser();

    const { data, error } = await supabase
        .from('sourdough_loaves')
        .insert([loaf])

    if (error) {
        throw new Error('Error inserting loaf')
    }

    return data;
}

export async function uploadLoafPicture() {

}

export async function checkUser() {
    const { data: { user } } = await supabase
        .auth
        .getUser();

    if (!user) {
        throw new Error('No user logged in')
    }

    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase
        .auth
        .signInWithPassword({
            email: email,
            password: password
        })

    if (error) {
        throw new Error('Could not login')
    }

    return data;
}