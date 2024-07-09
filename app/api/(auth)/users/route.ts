import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId

export const GET = async () => {
    try {
        await connect()
        const users = await User.find()
        return new NextResponse(JSON.stringify(users), { status: 200 })
    } catch (error) {
        return new NextResponse("Error fetching users")
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        await connect()
        const newUser = new User(body)
        await newUser.save()
        return new NextResponse(JSON.stringify({ message: "Success user created", user: newUser }), { status: 200 })

    } catch (error) {
        return new NextResponse("Error create new user " + error, { status: 500 })
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const { userId, newUserName } = body

        await connect()

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUserName },
            { new: true }
        )

        return new NextResponse(JSON.stringify({ message: "User updated success", user: updatedUser }), { status: 200 })
    } catch (error) {
        return new NextResponse("Error to update user")
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        await connect()
        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))

        return new NextResponse(JSON.stringify({ message: "User is deleted", user: deletedUser }), { status: 200 })
    } catch (error) {
        return new NextResponse("Error to delete user")
    }
}