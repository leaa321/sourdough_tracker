export type recipe = {
    id: number | null,
    created_at: Date | null,
    title: string,
    description: string,
    instructions: string,
    image_path: string
}

export type recipe_ingredient = {
    id: number | null,
    created_at: Date,
    recipe_id: number,
    ingredient_id: number,
    amount: number,
    unit: string,
    specification: string
}

export type recipe_ingredient_upload = {
    recipe_id: number,
    ingredient_id: number,
    amount: number,
    unit: string,
    specification: string
}

export type ingredient = {
    id: number,
    title: string
}