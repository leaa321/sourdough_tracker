export type pastry = ({
    id: number,
    created_at: Date | null,
    title: string,
    description: string,
    image_path: string,
    tag: string
})

export type pastryUpload = {
    title: string,
    description: string,
    image_path: string,
    tag: string
}

export type PastryUpdate = {
    title: string,
    description: string,
    tag: string
}