import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get("categoryId")

        await connect()
        await User.findById(userId)
        await Category.findById(categoryId)

        const filter: any = {
            user: userId ? new Types.ObjectId(userId) : undefined,
            category: categoryId ? new Types.ObjectId(categoryId) : undefined
        }

        // TODO

        const blogs = await Blog.find(filter)

        return new NextResponse(JSON.stringify(blogs), { status: 200 });

    } catch (error: any) {
        return new NextResponse(error);
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get("categoryId")
        const body = await request.json()
        const { title, description } = body

        await connect()

        const newBlog = new Blog({
            title,
            description,
            user: userId ? new Types.ObjectId(userId) : undefined,
            category: categoryId ? new Types.ObjectId(categoryId) : undefined
        })

        await newBlog.save()

        return new NextResponse(JSON.stringify({ message: "Blog created", blog: newBlog }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(error)
    }
}