import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import { signupInput,signinInput } from "@prakharsinha09/icoders-blog-commons";


export const userRouter=new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string,
	}
}>()

userRouter.post('/signup',async (c) => {
    const body=await c.req.json()           //remember, we use to do await, while getting the inputs while working in the express as well, same this we are doing here, syntactically different.
    console.log(body);
    
    const {success}=signupInput.safeParse(body);
    
    if(!success)
    {
        c.status(411);
        return c.json({
            msg:"Inputs Not Correct!" 
        })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        //c is the super power in honoJS
    }).$extends(withAccelerate())

    try {
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password
        }
      });
    
      return c.text('User Registered Successfully!')
    } catch(e) {
        console.log('error');
      return c.status(403);
    }
})

userRouter.post('/signin',async (c) => {
    const body=await c.req.json();
    const {success}=signinInput.safeParse(body)
    
    if(!success)
    {
        c.status(411);
        return c.json({
            msg:"Inputs Not Correct!"
        })
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())

    const user=await prisma.user.findUnique({
      where:{
        email:body.email
      }
    })

    if(!user)
    {
        c.status(403)
        return c.json({
          error:"User Not Found!"
        })
    }

    const token=await sign({id:user.id},c.env.JWT_SECRET)
    return c.json({token})
})

userRouter.get('/all',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())

    const user=await prisma.user.findMany({})

    return c.json({
        res:user
    })
})