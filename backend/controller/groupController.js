import { Group } from "../models/groupModel.js";

const createGroup = async (req, res) => {
  try {
    const { name, type, isPublic } = req.body;
    const user = req.user;
    const group = new Group({
      name,
      type,
      isPublic,
      members: [
        {
          user: user._id,
          role: "owner",
        },
      ],
    });
    await group.save();
    res.status(201).json({
      message: "Group Created Successfully",
      group,
    });
  } catch (error) {
    console.log("Error in /new route:", error);
    res.sendStatus(500);
  }
};

const listAllGroups = async (req, res) => {
  const groups = await Group.find();
  console.log(groups);
  res.status(200).json({
    message: "These are the groups",
    groups,
  });
};

export { createGroup, listAllGroups };
