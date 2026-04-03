export type loaf = ({
    id: number | null,
    created_at: Date | null,
    title: string,
    description: string,
    image_path: string,
    tag: string
})

export type loafUpload = {
    title: string,
    description: string,
    image_path: string,
    tag: string
}