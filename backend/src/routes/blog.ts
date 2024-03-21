import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import { createblogInput,updateblogInput } from "@prakharsinha09/icoders-blog-commons";

export const blogRouter=new Hono<{
	Bindings: {
		DATABASE_URL: string,
        JWT_SECRET: string,
	},
    Variables:{
        userId: string;
    }
}>()

//fetching all blogs for home page
blogRouter.get('/bulk',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())

    try {
      const posts = await prisma.post.findMany({
          where: { published: true },
          
          select: {
              author: { select: { name: true } },
              title: true,
              content: true,
              published: true,
              createdAt: true,
              id:true
          }
      });

      return c.json({
          result: posts
      });
  } catch (error) {
      console.error("Error fetching blog posts:", error);
      return c.json({ error: "Internal Server Error" });
  }
})

//fetching single blog for detailed view
blogRouter.get('/:id',async(c)=>{
  const blogId=c.req.param("id")
  const prisma = new PrismaClient({           //this from line 19-21, we have to write in every routes, because we cannot access the env variables from outside.. as everything we get is from this 'c' variable only.
    datasourceUrl: c.env?.DATABASE_URL,        
  }).$extends(withAccelerate())

  const blog=await prisma.post.findFirst({
    where:{
      id:blogId
    },
    select:{
      author: { select: { name: true } },
      title: true,
      content: true,
      published: true,
      createdAt: true,
      id:true
    }
  })
  
  if(!blog){
      return c.json({
          error:"Error Fetching"
      })
  }
  return c.json({
    result:blog
  })
})

blogRouter.use('/*',async(c,next)=>{
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

//new blog creation once user is logged in.
blogRouter.post('/new',async (c) => {
    const userId = c.get('userId');
    const body=await c.req.json()
    const {success}=await createblogInput.safeParse(body)

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
    
    try {
      const post = await prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
          published: true,
          authorId: userId        
        }
      });

      return c.json({
        res:"Blog Created!",
        id:post.id
      })
    } catch(e) {
      console.error("Error creating blog post:", e);
      return c.json({ error: "Internal Server Error" });
    }
})

//fetching user specific blogs
blogRouter.get('/:id',async(c)=>{
    const userId=c.req.param("id")
    const prisma = new PrismaClient({           //this from line 19-21, we have to write in every routes, because we cannot access the env variables from outside.. as everything we get is from this 'c' variable only.
      datasourceUrl: c.env?.DATABASE_URL,        
    }).$extends(withAccelerate())

    const userPost=await prisma.post.findMany({
      where:{
        authorId:userId
      }
    })
    
    if(userPost.length===0){
        return c.json({
            error:"You are not authorized for this action!"
        })
    }
    return c.json({
      result:userPost
    })
})



//updating a user blog
blogRouter.put('/:id',async (c) => {
	const blogId = c.req.param('id')
  const body = await c.req.json();
  const {success}=await updateblogInput.safeParse(body)

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

	await prisma.post.update({
		where: {
			id: blogId,
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated blog');
})

//deleting user blog
blogRouter.delete('/:id',async (c) => {
	const blogId = c.req.param('id')
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,        
      }).$extends(withAccelerate())

      try {
        await prisma.post.delete({ 
            where: {
                id: blogId,
            },
        });
        return c.text('Blog Deleted Successfully!');
    } catch (error) {
      return c.json({ error: "You Are not authorized for this action!" });
    } 

})

