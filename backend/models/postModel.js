import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    title: {
        type: String,
        maxlength: 40
    },
    content: {
        type: String,
        maxlength: 40
    },
    assetUrls: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reactions: [
        {
            by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            emoji: {
                type: String,
                required: true
            },
            reactedAt: {
                type: Date,
                default: Date.now,
                required: true
            }
        }
    ],
    comments:[
        {
            by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: User,
                required: true
            },
            like:[
                {
                    by: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref:"User",
                        required: true
                    }
                }
            ],
            comment: {
                type: String,
                required: true,
                maxlength: 40
            },
            commentedAt: {
                type: Date,
                default: Date.now,
                required: true
            }
        }
    ]
})

export const post = mongoose.model("Post", postSchema)