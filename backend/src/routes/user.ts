import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import { signupInput,signinInput } from "@prakharsinha09/icoders-blog-commons";


export const userRouter=new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string,
	},
  Variables:{
      userId: string;
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
          password: body.password,
          bio: body.bio,
          twitter: body.twitter,
          linkedin: body.linkedin,
          github : body.github,
        }
      });
    
      return c.text('User Registered Successfully!')
    } catch(e) {
      return c.text("Some Error Occured");
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
        email:body.email,
        password:body.password
      }
    })

    if(!user)
    {
        c.status(403)
        return c.json({
          error:"Please Verify The Credentials Before Signing In!"
        })
    }

    const token=await sign({id:user.id},c.env.JWT_SECRET)
    return c.json({token})
})

userRouter.use('/*',async(c,next)=>{
  const token=c.req.header("authorization") || ""
  try {
      const payload=await verify(token,c.env.JWT_SECRET)
      if(payload)
      {
          c.set('userId',payload.id)
          await next()
      }
      else{
          c.status(403);
          return c.json({
              message:"You are not logged in!"
          })
      }
  } catch (error) {
      c.status(403);
          return c.json({
              message:"You are not logged in!"
          })
  }

})

userRouter.get('/userInfo',async(c)=>{
  const userId=await c.get('userId');

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,        
  }).$extends(withAccelerate())

  const user=await prisma.user.findUnique({
    where:{
      id:userId
    },
    select:{
      id:true,
      email:true,
      name:true,
      bio:true,
      password:true,
      twitter:true,
      linkedin:true,
      github:true,
    }
  })

  if(!user)
  {
      c.status(403)
      return c.json({
        error:"User Not Found!"
      })
  }

  return c.json({user})
})

userRouter.post('/update',async(c)=>{
  const userId=await c.get('userId');

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,        
  }).$extends(withAccelerate())

  const body=await c.req.json();

  const user=await prisma.user.update({
    where:{
      id:userId
    },
    data: {
			name: body.name,
			email: body.email,
      password: body.password,
      bio: body.bio,
      twitter: body.twitter,
      linkedin: body.linkedin,
      github : body.github,
		}
  })

  if(!user)
  {
      c.status(403)
      return c.json({
        error:"User Not Found!"
      })
  }

  return c.json({
    status:"success",
    msg:"User Info Updated Successfully!"
  })
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