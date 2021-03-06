import Profile from '../models/ProfileModel.js'
import { statusCodes } from '../lib/statusCodes.js'

const getFriendsProfile = async (friends) => {
    const newFriends = []
    for (const friend of friends) {

        const userProfile = await Profile.findOne({ uid: friend })
        newFriends.push(
            {
                _id: userProfile._id,
                uid: userProfile.uid,
                user: userProfile.firstName + ' ' + userProfile.lastName,
                userProfilePicture: userProfile.profilePicture,
                userFriends: userProfile.freinds,
                gender: userProfile.gender,
                mobileNumber: userProfile.mobileNumber
            }

        )
    }

    return newFriends

}

export const getProfile = async (req, res) => {

    try {

        const uid = res.locals.user
        const userProfile = await Profile.findOne({ uid: uid }).lean()
        userProfile.friends = await getFriendsProfile(userProfile.friends)
        userProfile.friendRequests = await getFriendsProfile(userProfile.friendRequests)

        // console.log(userProfile.friendRequests)
        res.status(statusCodes.SUCCESS).json(userProfile)

    }

    catch (error) {
        console.log(error)
        res.status(statusCodes.INTERNALERROR).json({ "Get_Error": error.message });

    }
}


export const editProfile = async (req, res) => {
    try {
        const profile = req.body
        const userProfile = await Profile.findByIdAndUpdate(profile._id, profile).lean()
        userProfile.friends = await getFriendsProfile(userProfile.friends)
        userProfile.friendRequests = await getFriendsProfile(userProfile.friendRequests)


        res.status(statusCodes.CREATED).json(profile)
    }

    catch (error) {
        console.log(error)
        res.status(statusCodes.SUCCESS).json({ "Get_Error": error.message });

    }
}


export const getUsers = async (req, res) => {
    try {
        const uid = res.locals.user
        const currentUser = await Profile.findOne({ uid: uid }).lean()

        const listOfFriends = currentUser.friendRequests.map(r => { return (r) })
        listOfFriends.push(uid)

        const users = await Profile.find(
            {
                $and: [
                    {
                        friends:
                        {
                            $nin: [uid]
                        }
                    },
                    {
                        friendRequests:
                        {
                            $nin: [uid]
                        }
                    },
                    {
                        uid: {

                            $nin: listOfFriends

                        }
                    }
                ]
            }
        ).lean()

        res.status(statusCodes.SUCCESS).json(users)
    }

    catch (error) {
        res.status(statusCodes.INTERNALERROR).json({ "Get_Error": error.message });

    }

}

export const addFriend = async (req, res) => {
    try {
        const uid = res.locals.user
        const { _id } = req.body
        const userProfile = await Profile.findByIdAndUpdate(_id, {
            $push: {
                friendRequests: uid
            }
        }, { new: true }).lean()



        res.status(statusCodes.SUCCESS).json(userProfile)
    }

    catch (error) {
        res.status(statusCodes.INTERNALERROR).json({ "Get_Error": error.message });

    }


}

export const acceptRequest = async (req, res) => {
    try {
        const currentUid = res.locals.user
        const { _id, uid } = req.body

        const currentProfile = await Profile.findOne({ uid: currentUid }).lean()

        const updatedtUserProfile = await Profile.findByIdAndUpdate(currentProfile._id,
            {
                $push:
                {
                    friends: uid
                },
                $pull:
                {
                    friendRequests:
                    {
                        $in: [uid]
                    }
                }
            },
            { new: true }).lean()

        await Profile.findByIdAndUpdate(_id, {
            $push: {
                friends: currentUid
            }
        }, { new: true }).lean()


        updatedtUserProfile.friends = await getFriendsProfile(updatedtUserProfile.friends)
        updatedtUserProfile.friendRequests = await getFriendsProfile(updatedtUserProfile.friendRequests)

        res.status(statusCodes.SUCCESS).json(updatedtUserProfile)
    }

    catch (error) {
        res.status(statusCodes.INTERNALERROR).json({ "Get_Error": error.message });

    }


}


export const declineRequest = async (req, res) => {
    try {
        const currentUid = res.locals.user
        const { uid } = req.body
        const currentProfile = await Profile.findOne({ uid: currentUid }).lean()
        const updatedProfile = await Profile.findByIdAndUpdate(currentProfile._id, {
            $pull: {
                friendRequests: uid
            }
        }, { new: true }).lean()


        updatedProfile.friends = await getFriendsProfile(updatedProfile.friends)
        updatedProfile.friendRequests = await getFriendsProfile(updatedProfile.friendRequests)


        res.status(statusCodes.SUCCESS).json(updatedProfile)
    }

    catch (error) {
        res.status(statusCodes.INTERNALERROR).json({ "Update_error": error.message });

    }


}



