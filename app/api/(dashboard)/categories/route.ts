import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";


export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }
        await connect()

        const user = await User.findById(userId)
        const categories = await Category.find({
            user: new Types.ObjectId(userId)
        })

        return new NextResponse(JSON.stringify(categories), { status: 200 })
    } catch (error) {
        return new NextResponse("Error to fetch category")
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const { title } = await request.json()
        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }
        await connect()

        const user = await User.findById(userId)

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId)
        })

        await newCategory.save()
        return new NextResponse(JSON.stringify({ message: "Category created", category: newCategory }), { status: 200 })
    } catch (error) {
        return new NextResponse("Error to create category" + error)
    }
}