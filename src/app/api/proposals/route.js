import { connect } from "@/db/dbConfig";
import Porposal from "@/modals/proposalModal";
import { CreateProposalUserSchema } from "@/schemas/proposalSchema";
import CustomError from "@/utils/Error";
import { NextResponse } from "next/server";

await connect();

export async function POST(req) {
    try {
        const body = await req.json();
        const response = CreateProposalUserSchema.safeParse(body);
        if(!response.success){
            const {errors} = response.error;
            return NextResponse.json(CustomError.validationError(errors),{status:422})
        }

        const data = await Porposal.create(body);
        return NextResponse.json({
            success: true,
            data,
            message: "proposal is created successfuly"
        }, { status: 201 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(CustomError.internalServerError({ message: "proposal can not be created successfuly" }), { status: 500 })

    }
}

export async function GET(req) {
    try {
        const url = new URL(req.url)
        const uid = url.searchParams.get('uid');
        const service = url.searchParams.get('service');
        let data = null;
        if (!service && uid) {
            data = await Porposal.find({ uid })
                .sort({ 'createdAt': -1 })
                .select('-__v ')
        } else if (uid && service) {
            data = await Porposal.find({
                $and: [
                    { uid: uid },
                    { service: service }
                ]
            })
                .sort({ 'createdAt': -1 })
                .select('-__v')
        } else {
            data = await Porposal.find()
                .sort({ 'createdAt': -1 })
                .select('-__v')
        }
        return NextResponse.json({
            success: true,
            data,
            message: "Proposal get  successfully"
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json(CustomError.internalServerError(error), { status: 500 })

    }
}