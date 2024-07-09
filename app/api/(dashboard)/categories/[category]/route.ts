import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";


export const PATCH = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category
    try {
        const body = await request.json()
        const { title } = body

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        await connect()

        const user = await User.findById(userId)

        const category = await Category.findOne({ _id: categoryId, user: userId })

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        )
        return new NextResponse(JSON.stringify({ message: "Category updated", category: updatedCategory }), { status: 200 })
    } catch (error) {
        return new NextResponse("Error update category" + error)
    }
}

export const DELETE = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category

    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("UserId")

        await connect()

        await Category.findOne({ _id: categoryId, user: userId })

        await Category.findByIdAndDelete(categoryId)
        return new NextResponse(JSON.stringify({ message: "Category is deleted" }), { status: 200 })

    } catch (error: any) {
        return new NextResponse(error)
    }

}