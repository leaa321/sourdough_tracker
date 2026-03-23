import { supabase } from "./utils/supabase";

export async function getLoafes() {
    const { data, error } = await supabase
        .from('sourdough_loaves')
        .select()

    if (error) {
        throw new Error('Error loading loaves')
    }

    return data
}


