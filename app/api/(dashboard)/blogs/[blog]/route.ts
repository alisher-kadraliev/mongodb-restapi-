import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        await connect()

        await User.findById(userId)
        await Category.findById(categoryId)

        const blog = await Blog.findOne(
            {
                _id: blogId,
                user: userId,
                category: categoryId,
            }
        )

        return new NextResponse(JSON.stringify({ blog }), {
            status: 200
        })
    } catch (error: any) {
        return new NextResponse("Error in fetching a blog" + error.message, { status: 500 });
    }
}
export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog

    try {
        const body = await request.json()
        const { title, description } = body

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        await connect()

        await User.findById(userId)
        await Blog.findOne({ _id: blogId, user: userId })

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        )

        return new NextResponse(JSON.stringify({ message: "blog updated", updatedBlog }), { status: 200 })
    } catch (error) {
        return new NextResponse("error" + error, { status: 500 })
    }
}

export const DELETE = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        await connect()

        await User.findById(userId)
        await Blog.findOne({ _id: blogId, user: userId })

        await Blog.findByIdAndDelete(blogId)

        return new NextResponse(JSON.stringify({ message: "Blog deleted" }), { status: 200 })

    } catch (error) {

    }
}