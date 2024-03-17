import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string,
	}
}>();

app.get('/api/v1/all',async(c)=>{
    const prisma = new PrismaClient({           //this from line 19-21, we have to write in every routes, because we cannot access the env variables from outside.. as everything we get is from this 'c' variable only.
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())

    const data=await prisma.user.findMany()

    return c.json({
      result:data
    })
})
   
app.post('/api/v1/signup',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        //c is the super power in honoJS
    }).$extends(withAccelerate())

    const body=await c.req.json()           //remember, we use to do await, while getting the inputs while working in the express as well, same this we are doing here, syntactically different.
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
      return c.status(403);
    }
})

app.post('/api/v1/signin',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())

    const body=await c.req.json();
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

app.post('/api/v1/blog',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())
    
    const body=await c.req.json()           //remember, we use to do await, while getting the inputs while working in the express as well, same this we are doing here, syntactically different.
})

app.get('/api/v1/blog/:id', (c) => {

	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})


app.get('/api/v1/blog/bulk',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())
})

app.put('/api/v1/blog', (c) => {
	return c.text('signin route')
})

export default app;
