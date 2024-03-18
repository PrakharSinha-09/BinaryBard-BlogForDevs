import z from 'zod'

export const signupInput=z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const signinInput=z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const createblogInput=z.object({
    title: z.string(),
    content: z.string()
})

export const updateblogInput=z.object({
    title: z.string(),
    content: z.string()
})

//type inference in zod... these will be required by our frontend, when we will configure the states and the above ones will be required by the backend
export type SignupInput=z.infer<typeof signupInput>
export type SigninInput=z.infer<typeof signinInput>
export type CreateBlogInput=z.infer<typeof createblogInput>
export type UpdateBlogInput=z.infer<typeof updateblogInput>
