import { supabase } from "./utils/supabase";

export async function getLoafes() {
    const { data, error } = await supabase
        .from('sourdough_loaves')
        .select()
    console.log(data);

    if (error) {
        throw new Error('Error loading loaves')
    }

    console.log(data);
    return data
}

export async function getLoafPicture(path: string) {
    const { data, error } = await supabase
        .storage
        .from('LoafImages')
        .createSignedUrl(path, 60)

    if (error) {
        throw new Error('Error loading pic');
    }

    console.log("DATA " + data?.signedUrl);

    return data?.signedUrl;
}