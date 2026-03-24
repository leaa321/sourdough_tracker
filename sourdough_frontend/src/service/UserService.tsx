import { supabase } from "../utils/supabase";


export async function checkUser() {
    const { data: { user } } = await supabase
        .auth
        .getUser();

    if (!user) {
        throw new Error('No user logged in')
    }

    return user;
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