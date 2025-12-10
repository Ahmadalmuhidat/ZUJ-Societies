const Society = require("../models/societies");
const Notifications = require("../models/notifications");
const Post = require("../models/posts");
const Event = require("../models/events");
const User = require("../models/users");
const JsonWebToken = require("../helpers/jsonWebToken");
const ServerSentEvents = require('../helpers/serverSentEvents');

exports.getSocietyInformation = async (req, res) => {
  try {
    const { society_id } = req.query;

    const society = await Society.findOne(
      {
        ID: society_id
      },
      'Name Description Image Category Privacy Permissions Notifications Members'
    );

    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const membersCount = society.Members?.length || 0;

    const [postsCount, eventsCount] = await Promise.all([
      Post.countDocuments({ Society: society_id }),
      Event.countDocuments({ Society: society_id })
    ]);

    res.status(200).json({
      data: {
        ...society.toObject(),
        Post_Count: postsCount,
        Event_Count: eventsCount,
        Member_Count: membersCount
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get society info." });
  }
};

exports.inviteMemberToSociety = async (req, res) => {
  try {
    const { SocietyID, InviteeID } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ ID: SocietyID });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found.' });
    }

    const inviterMember = society.Members.find(m => m.User === userID);
    if (!inviterMember) {
      return res.status(403).json({ error_message: 'You are not a member of this society.' });
    }

    const whoCanInvite = society.Permissions?.whoCanInvite || 'all-members';
    const inviterRole = inviterMember.Role;

    const canInvite =
      (whoCanInvite === 'all-members') ||
      (whoCanInvite === 'moderators' && ['moderator', 'admin'].includes(inviterRole)) ||
      (whoCanInvite === 'admins' && inviterRole === 'admin');

    if (!canInvite) {
      return res.status(403).json({ error_message: 'You do not have permission to invite members.' });
    }

    const isAlreadyMember = society.Members?.some(m => m.User === InviteeID);
    if (isAlreadyMember) {
      return res.status(400).json({ error_message: 'User is already a member of this society.' });
    }

    const existingInvite = society.Invites.find(inv =>
      inv.Invitee === InviteeID && inv.Status === 'pending'
    );

    if (existingInvite) {
      return res.status(400).json({ error_message: 'User has already been invited.' });
    }

    const { v4: uuidv4 } = require('uuid');
    const invite = {
      ID: uuidv4(),
      Society: SocietyID,
      Inviter: userID,
      Invitee: InviteeID,
      Status: 'pending',
      CreatedAt: new Date()
    };

    await Society.updateOne(
      { ID: SocietyID },
      { $push: { Invites: invite } }
    );

    const notification = {
      type: 'invitation',
      title: 'Society Invitation',
      message: `You have been invited to join ${society.Name} society`,
      data: {
        inviteId: invite.ID,
        societyId: SocietyID,
        inviterId: userID,
        societyName: society.Name
      },
      time: new Date().toISOString()
    };

    ServerSentEvents.sendToUser([InviteeID], notification);
    res.status(201).json({ data: invite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to send invitation.' });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { invitation_id, response } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ "Invites.ID": invitation_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found.' });
    }

    const invitation = society.Invites.find(inv => inv.ID === invitation_id && inv.Invitee === userID);
    if (!invitation) {
      return res.status(404).json({ error_message: 'Invitation not found.' });
    }
    if (invitation.Status !== 'pending') {
      return res.status(400).json({ error_message: 'Invitation has already been responded to.' });
    }

    if (response === 'accept') {
      const { v4: uuidv4 } = require('uuid');
      const newMember = {
        ID: uuidv4(),
        User: userID,
        Role: 'member',
        JoinedAt: new Date()
      };

      await Society.updateOne(
        { "Invites.ID": invitation_id },
        {
          $push: { Members: newMember },
          $set: { "Invites.$.Status": 'accepted' }
        }
      );
      res.status(200).json({ data: invitation });
    } else if (response === 'decline') {
      await Society.updateOne(
        { "Invites.ID": invitation_id },
        { $set: { "Invites.$.Status": 'declined' } }
      );
      res.status(200).json({ data: invitation });
    } else {
      res.status(400).json({ error_message: 'Invalid response. Must be "accept" or "decline".' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to respond to invitation.' });
  }
};

exports.checkInvitationStatus = async (req, res) => {
  try {
    const { invitation_id } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ "Invites.ID": invitation_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Invitation not found.' });
    }

    const invitation = society.Invites.find(inv => inv.ID === invitation_id && inv.Invitee === userID);
    if (!invitation) {
      return res.status(404).json({ error_message: 'Invitation not found.' });
    }

    res.status(200).json({ status: invitation.Status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to check invitation status.' });
  }
};

exports.getSentInvitations = async (req, res) => {
  try {
    const { society_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found.' });
    }

    const member = society.Members.find(m => m.User === userID);
    if (!member || !['admin', 'moderator'].includes(member.Role)) {
      return res.status(403).json({ error_message: 'You do not have permission to view invitations.' });
    }

    const invitations = society.Invites.sort((a, b) => b.CreatedAt - a.CreatedAt);
    const inviteeIDs = invitations.map(invite => invite.Invitee);

    const users = await User.find({ ID: { $in: inviteeIDs } }).select('ID Name Email Photo');
    const userMap = {};
    users.forEach(user => { userMap[user.ID] = user });

    const formattedInvitations = invitations.map(invite => {
      const invitee = userMap[invite.Invitee];
      return {
        ID: invite.ID,
        InviteeName: invitee?.Name || 'Unknown User',
        InviteeEmail: invitee?.Email || 'unknown@email.com',
        InviteePhoto: invitee?.Photo || null,
        Status: invite.Status,
        CreatedAt: invite.CreatedAt
      };
    });

    res.status(200).json({ data: formattedInvitations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to fetch invitations.' });
  }
};

exports.cancelInvitation = async (req, res) => {
  try {
    const { invitation_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ "Invites.ID": invitation_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Invitation not found.' });
    }

    const member = society.Members.find(m => m.User === userID);
    if (!member || !['admin', 'moderator'].includes(member.Role)) {
      return res.status(403).json({ error_message: 'You do not have permission to cancel this invitation.' });
    }

    await Society.updateOne(
      { "Invites.ID": invitation_id },
      { $pull: { Invites: { ID: invitation_id } } }
    );
    await Notifications.deleteOne({
      type: 'invitation',
      Data: { inviteId: invitation_id }
    });
    res.status(200).json({ data: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to cancel invitation.' });
  }
};

exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ 'Privacy.visibility': { $ne: 'private' } });
    const societiesWithCount = societies.map(society => ({
      ID: society.ID,
      Name: society.Name,
      Description: society.Description,
      Category: society.Category,
      Image: society.Image,
      Member_Count: society.Members.length,
      CreatedAt: society.CreatedAt,
      User: society.User
    }));

    res.status(200).json({ data: societiesWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get societies.' });
  }
};

exports.createSociety = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      visibility,
      image,
      privacy,
      permissions,
      notifications
    } = req.body;

    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    const newSociety = new Society({
      Name: name,
      Description: description,
      User: userId,
      Category: category,
      Visibility: visibility,
      Image: image,

      Privacy: privacy || {
        visibility: 'public',
        joinApproval: true,
        memberListVisible: true,
        eventsVisible: true
      },

      Permissions: permissions || {
        whoCanPost: 'all-members',
        whoCanCreateEvents: 'moderators',
        whoCanInvite: 'all-members'
      },

      Notifications: notifications || {
        newMemberNotifications: true,
        emailNotifications: true
      }
    });

    await newSociety.save();

    const { v4: uuidv4 } = require('uuid');
    const newMember = {
      ID: uuidv4(),
      User: userId,
      Role: "admin",
      JoinedAt: new Date()
    };

    await Society.updateOne(
      { ID: newSociety.ID },
      { $push: { Members: newMember } }
    );

    res.status(201).json({ data: newSociety.ID });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create society." });
  }
};

exports.deleteSociety = async (req, res) => {
  try {
    const { society_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    if (!society_id) {
      return res.status(400).json({ error_message: "Society ID is required." });
    }

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    if (society.User !== userID) {
      return res.status(403).json({ error_message: "You don't have permission to delete this society." });
    }

    const result = await Society.deleteOne({ ID: society_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    res.status(200).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete society." });
  }
};

exports.getSocietiesByUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const createdSocieties = await Society.find({ User: userId });
    const allSocieties = await Society.find({});
    const memberSocieties = allSocieties.filter(s =>
      s.Members?.some(m => m.User === userId && s.User !== userId)
    );

    const societiesWithCounts = [...createdSocieties, ...memberSocieties].map(society => ({
      ...society.toObject(),
      Member_Count: society.Members.length
    }));

    const combined = [
      ...societiesWithCounts.filter(s => createdSocieties.some(cs => cs.ID === s.ID)).map(s => ({ ...s, Role: 'creator' })),
      ...societiesWithCounts.filter(s => memberSocieties.some(ms => ms.ID === s.ID)).map(s => {
        const membership = s.Members.find(m => m.User === userId);
        return { ...s, Role: membership?.Role || null };
      })
    ];

    res.status(200).json({ data: combined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get societies for the user." });
  }
};

exports.joinRequest = async (req, res) => {
  try {
    const { society_id } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found.' });
    }

    const existingRequest = society.JoinRequests.find(req =>
      req.User === userId && ["pending", "approved"].includes(req.Status)
    );

    const isMember = society.Members?.some(m => m.User === userId);

    if (isMember) {
      return res.status(400).json({ error_message: "You are already a member of this society." });
    }

    if (existingRequest) {
      return res.status(400).json({ error_message: "You have already requested to join this society." });
    }

    const { v4: uuidv4 } = require('uuid');
    const newRequest = {
      ID: uuidv4(),
      User: userId,
      Status: "pending",
      RequestedAt: new Date()
    };

    await Society.updateOne(
      { ID: society_id },
      { $push: { JoinRequests: newRequest } }
    );

    try {
      const society = await Society.findOne({ ID: society_id });
      const user = await User.findOne({ ID: userId }).select('Name Photo');

      const adminUserIds = society.Members
        .filter(m => ['admin', 'creator'].includes(m.Role))
        .map(m => m.User);

      if (adminUserIds.length > 0) {
        const notification = {
          type: 'join_request',
          title: 'New Join Request',
          message: `${user?.Name || 'Someone'} wants to join ${society?.Name || 'your society'}`,
          data: {
            requestId: newRequest.ID,
            societyId: society_id,
            userId: userId,
            societyName: society?.Name
          },
          time: new Date().toISOString()
        };

        await ServerSentEvents.sendToUser(adminUserIds, notification);
      }
    } catch (notificationError) {
      console.error('Failed to send join request notification:', notificationError);
    }

    res.status(201).json({ data: newRequest });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to join society." });
  }
};

exports.checkJoinRequest = async (req, res) => {
  try {
    const { society_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found.' });
    }

    const existingRequest = society.JoinRequests.find(req =>
      req.User === userId && ["pending", "approved", "rejected"].includes(req.Status)
    );

    if (!existingRequest) {
      return res.status(200).json({ data: "not_found" });
    }

    res.status(200).json({ data: existingRequest.Status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to check join request status." });
  }
};

exports.approveJoinRequest = async (req, res) => {
  try {
    const { request_id } = req.body;
    const society = await Society.findOne({ "JoinRequests.ID": request_id });

    if (!society) {
      return res.status(404).json({ error_message: "Request not found." });
    }

    const request = society.JoinRequests.find(r => r.ID === request_id);
    if (!request) {
      return res.status(404).json({ error_message: "Request not found." });
    }

    const { v4: uuidv4 } = require('uuid');
    const newMember = {
      ID: uuidv4(),
      User: request.User,
      Role: "member",
      JoinedAt: new Date()
    };

    await Society.updateOne(
      { "JoinRequests.ID": request_id },
      {
        $set: { "JoinRequests.$.Status": 'approved' },
        $push: { Members: newMember }
      }
    );

    try {
      const society = await Society.findOne({ ID: request.Society });

      const notification = {
        type: 'join_approved',
        title: 'Join Request Approved',
        message: `Your request to join ${society?.Name || 'the society'} has been approved!`,
        data: {
          requestId: request.ID,
          societyId: request.Society,
          societyName: society?.Name
        },
        time: new Date().toISOString()
      };

      await ServerSentEvents.sendToUser([request.User.toString()], notification);
    } catch (notificationError) {
      console.error('Failed to send approval notification:', notificationError);
    }

    res.status(204).json({ data: newMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to approve request." });
  }
};

exports.rejectJoinRequest = async (req, res) => {
  try {
    const { request_id } = req.body;
    const society = await Society.findOne({ "JoinRequests.ID": request_id });

    if (!society) {
      return res.status(404).json({ error_message: "Request not found." });
    }

    const request = society.JoinRequests.find(r => r.ID === request_id);
    if (!request) {
      return res.status(404).json({ error_message: "Request not found." });
    }

    await Society.updateOne(
      { "JoinRequests.ID": request_id },
      { $set: { "JoinRequests.$.Status": 'rejected' } }
    );

    try {
      const society = await Society.findOne({ ID: request.Society });

      const notification = {
        type: 'join_rejected',
        title: 'Join Request Rejected',
        message: `Your request to join ${society?.Name || 'the society'} has been rejected.`,
        data: {
          requestId: request.ID,
          societyId: request.Society,
          societyName: society?.Name
        },
        time: new Date().toISOString()
      };

      await ServerSentEvents.sendToUser([request.User.toString()], notification);
    } catch (notificationError) {
      console.error('Failed to send rejection notification:', notificationError);
    }

    res.status(204).json({ data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to reject request." });
  }
};

exports.getAllJoinRequests = async (req, res) => {
  try {
    const { society_id } = req.query;
    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const requests = society.JoinRequests;
    const userIds = requests.map(r => r.User);
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Email Photo");

    const data = requests.map(request => {
      const user = users.find(user => user.ID === request.User);
      return {
        Request_ID: request.ID,
        Status: request.Status,
        User_ID: user?.ID,
        User_Name: user?.Name,
        User_Email: user?.Email,
        User_Photo: user?.Photo
      };
    });

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get join requests." });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const { society_id } = req.query;
    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const members = society.Members;
    const userIds = members.map(m => m.User);
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Email Photo");
    const data = members.map(member => {
      const user = users.find(user => user.ID === member.User);
      return {
        ID: user?.ID,
        Name: user?.Name,
        Email: user?.Email,
        Photo: user?.Photo,
        Role: member.Role
      };
    });
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get members." });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { society_id, user_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const isAdmin = society.Members?.some(m => m.User === userId && m.Role === 'admin');

    if (!isAdmin) {
      return res.status(403).json({ error_message: "You don't have permission to remove the member." });
    }

    if (society.User === user_id) {
      return res.status(400).json({ error_message: "You cannot remove the owner of the society." });
    }

    await Society.updateOne(
      { ID: society_id },
      { $pull: { Members: { User: user_id } } }
    );

    res.status(204).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to remove member." });
  }
};

exports.checkMembership = async (req, res) => {
  try {
    const { society_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const isMember = society.Members?.some(m => m.User === userId);
    res.status(200).json({ data: !!isMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to check membership." });
  }
};

exports.checkAdmin = async (req, res) => {
  try {
    const { society_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const society = await Society.findOne({ ID: society_id });

    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const isAdmin = society.Members?.some(m => m.User === userId && m.Role === 'admin');

    res.status(200).json({ data: !!isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to check admin status." });
  }
};

exports.updateInformation = async (req, res) => {
  try {
    const { name, description, category, permissions, notifications, society_id } = req.body;
    const update = {
      Name: name,
      Description: description,
      Category: category,
      Privacy: privacy,
      Permissions: permissions,
      Notifications: notifications
    };

    if (privacy) {
      update.Privacy = privacy;
    };

    if (permissions) {
      update.Permissions = permissions;
    };

    if (notifications) {
      update.Notifications = notifications;
    };

    const result = await Society.updateOne({ ID: society_id }, update);
    res.status(204).json({ data: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update society info." });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const { society_id, member, role } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    const isAdmin = await SocietyMember.exists({
      User: userId,
      Society: society_id,
      Role: 'admin'
    });

    if (!isAdmin) {
      return res.status(403).json({ error_message: "You don't have permission to update member roles." });
    }

    const result = await SocietyMember.updateOne(
      { User: member, Society: society_id },
      { Role: role }
    );
    res.status(204).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update member role." });
  }
};

exports.leaveSociety = async (req, res) => {
  try {
    const { society_id } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    if (!society_id) {
      return res.status(400).json({ error_message: "Society ID is required." });
    }

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found." });
    }

    const isMember = society.Members?.some(m => m.User === userID);
    if (!isMember) {
      return res.status(404).json({ error_message: "You are not a member of this society." });
    }

    const isOwner = society.User === userID;
    if (isOwner) {
      return res.status(400).json({ error_message: "Society creators cannot leave. Please transfer ownership or delete the society instead." });
    }

    await Society.updateOne(
      { ID: society_id },
      { $pull: { Members: { User: userID } } }
    );

    res.status(200).json({ message: "Successfully left the society." });
  } catch (err) {
    console.error('Error in leaveSociety:', err);
    res.status(500).json({ error_message: "Failed to leave society." });
  }
};