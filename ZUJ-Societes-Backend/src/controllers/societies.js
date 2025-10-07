const Society = require("../models/societies");
const SocietyMember = require("../models/societyMembers");
const SocietyJoinRequest = require("../models/societyJoinRequests");
const SocietyInvite = require('../models/SocietyInvite');
const User = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const jsonWebToken = require("../helper/json_web_token");
const { sendNotificationToUsers } = require('./notifications');

exports.getSocietyInformation = async (req, res) => {
  try {
    const society = await Society.findOne({ ID: req.query.society_id }).select(
      "Name Description Image Category Privacy Permissions Notifications"
    );
    if (!society) {
      return res.status(404).json({ error_message: "Society not found" });
    }
    res.status(200).json({ data: society });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get society info" });
  }
};

exports.inviteMemberToSociety = async (req, res) => {
  try {
    const { SocietyID, InviteeID, token } = req.body;

    const decoded = jsonWebToken.verify_token(token);
    const inviterID = decoded.id;

    const society = await Society.findOne({ ID: SocietyID });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found' });
    }

    const inviterMember = await SocietyMember.findOne({ Society: SocietyID, User: inviterID });
    if (!inviterMember) {
      return res.status(403).json({ error_message: 'You are not a member of this society' });
    }

    const whoCanInvite = society.Permissions?.whoCanInvite || 'all-members';
    const inviterRole = inviterMember.Role;

    const canInvite =
      (whoCanInvite === 'all-members') ||
      (whoCanInvite === 'moderators' && ['moderator', 'admin'].includes(inviterRole)) ||
      (whoCanInvite === 'admins' && inviterRole === 'admin');

    if (!canInvite) {
      return res.status(403).json({ error_message: 'You do not have permission to invite members' });
    }

    const isAlreadyMember = await SocietyMember.findOne({ Society: SocietyID, User: InviteeID });
    if (isAlreadyMember) {
      return res.status(400).json({ error_message: 'User is already a member of this society' });
    }

    const existingInvite = await SocietyInvite.findOne({
      Society: SocietyID,
      Invitee: InviteeID,
      Status: 'pending'
    });

    if (existingInvite) {
      return res.status(400).json({ error_message: 'User has already been invited' });
    }

    const invite = new SocietyInvite({
      ID: uuidv4(),
      Society: SocietyID,
      Inviter: inviterID,
      Invitee: InviteeID,
      Status: 'pending',
      CreatedAt: new Date()
    });

    await invite.save();

    res.status(201).json({ message: 'Invitation sent successfully', invite });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to send invitation' });
  }
};

exports.getSentInvitations = async (req, res) => {
  try {
    const { society_id } = req.query;
    const userId = req.user.id;

    const member = await SocietyMember.findOne({ Society: society_id, User: userId });
    if (!member || !['admin', 'moderator'].includes(member.Role)) {
      return res.status(403).json({ error_message: 'You do not have permission to view invitations' });
    }

    const invitations = await SocietyInvite.find({ Society: society_id })
      .populate('Invitee', 'ID Name Email Photo')
      .sort({ CreatedAt: -1 });

    const formattedInvitations = invitations.map(invite => ({
      ID: invite.ID,
      InviteeName: invite.Invitee?.Name || 'Unknown User',
      InviteeEmail: invite.Invitee?.Email || 'unknown@email.com',
      InviteePhoto: invite.Invitee?.Photo,
      Status: invite.Status,
      CreatedAt: invite.CreatedAt
    }));

    res.status(200).json({ data: formattedInvitations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to fetch invitations' });
  }
};

exports.cancelInvitation = async (req, res) => {
  try {
    const { invitation_id } = req.query;
    const userId = req.user.id;

    const invitation = await SocietyInvite.findOne({ ID: invitation_id });
    if (!invitation) {
      return res.status(404).json({ error_message: 'Invitation not found' });
    }

    const member = await SocietyMember.findOne({ Society: invitation.Society, User: userId });
    if (!member || !['admin', 'moderator'].includes(member.Role)) {
      return res.status(403).json({ error_message: 'You do not have permission to cancel this invitation' });
    }

    await SocietyInvite.deleteOne({ ID: invitation_id });
    res.status(200).json({ message: 'Invitation cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Failed to cancel invitation' });
  }
};

exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ 'Privacy.visibility': { $ne: 'private' } });
    const societiesWithCount = await Promise.all(
      societies.map(async (society) => {
        const memberCount = await SocietyMember.countDocuments({ Society: society.ID });
        return {
          ID: society.ID,
          Name: society.Name,
          Description: society.Description,
          Category: society.Category,
          Image: society.Image,
          Member_Count: memberCount,
          CreatedAt: society.CreatedAt,
          User: society.User
        };
      })
    );

    res.status(200).json({ data: societiesWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get societies' });
  }
};

exports.createSociety = async (req, res) => {
  try {
    const newSocietyId = uuidv4();
    const userId = jsonWebToken.verify_token(req.body.token)['id'];

    const newSociety = new Society({
      ID: newSocietyId,
      Name: req.body.name,
      Description: req.body.description,
      User: userId,
      Category: req.body.category,
      Visibility: req.body.visibility,
      Image: req.body.image,

      Privacy: req.body.privacy || {
        visibility: 'public',
        joinApproval: true,
        memberListVisible: true,
        eventsVisible: true
      },

      Permissions: req.body.permissions || {
        whoCanPost: 'all-members',
        whoCanCreateEvents: 'moderators',
        whoCanInvite: 'all-members'
      },

      Notifications: req.body.notifications || {
        newMemberNotifications: true,
        eventReminders: true,
        weeklyDigest: false,
        emailNotifications: true
      }
    });

    await newSociety.save();

    const newMember = new SocietyMember({
      ID: uuidv4(),
      Society: newSocietyId,
      User: userId,
      Role: "admin"
    });

    await newMember.save();
    res.status(201).json({ data: newSocietyId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create society" });
  }
};

exports.deleteSociety = async (req, res) => {
  try {
    const { society_id } = req.query;
    
    if (!society_id) {
      return res.status(400).json({ error_message: "Society ID is required" });
    }

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: "Society not found" });
    }

    const userId = req.user.id;
    if (society.User !== userId) {
      return res.status(403).json({ error_message: "You don't have permission to delete this society" });
    }

    const result = await Society.deleteOne({ ID: society_id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error_message: "Society not found" });
    }

    res.status(200).json({ message: "Society deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete society" });
  }
};

exports.getSocietiesByUser = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];
    const createdSocieties = await Society.find({ User: userId });
    const memberships = await SocietyMember.find({ User: userId }).select("Society Role");
    const memberSocietyIds = memberships.map(m => m.Society);
    const memberSocieties = await Society.find({ ID: { $in: memberSocietyIds } });

    const societiesWithCounts = await Promise.all(
      [...createdSocieties, ...memberSocieties].map(async (society) => {
        const memberCount = await SocietyMember.countDocuments({ Society: society.ID });
        return {
          ...society.toObject(),
          Member_Count: memberCount
        };
      })
    );

    const combined = [
      ...societiesWithCounts.filter(s => createdSocieties.some(cs => cs.ID === s.ID)).map(s => ({ ...s, Role: 'creator' })),
      ...societiesWithCounts.filter(s => memberSocieties.some(ms => ms.ID === s.ID)).map(s => {
        const membership = memberships.find(m => m.Society === s.ID);
        return { ...s, Role: membership?.Role || null };
      })
    ];

    res.status(200).json({ data: combined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get societies for the user" });
  }
};

exports.joinRequest = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const existingRequest = await SocietyJoinRequest.findOne({
      User: userId,
      Society: req.body.society_id,
      Status: { $in: ["pending", "approved"] }
    });

    if (existingRequest) {
      return res.status(400).json({ error_message: "You have already requested to join this society." });
    }

    const newRequest = new SocietyJoinRequest({
      ID: uuidv4(),
      Society: req.body.society_id,
      User: userId,
      Status: "pending"
    });

    const saved = await newRequest.save();

    try {
      const society = await Society.findOne({ ID: req.body.society_id });
      const user = await User.findOne({ ID: userId }).select('Name Photo');
      
      const admins = await SocietyMember.find({ 
        Society: req.body.society_id, 
        Role: { $in: ['admin', 'creator'] } 
      }).select('User');
      
      const adminUserIds = admins.map(admin => admin.User);
      
      if (adminUserIds.length > 0) {
        const notification = {
          type: 'join_request',
          title: 'New Join Request',
          message: `${user?.Name || 'Someone'} wants to join ${society?.Name || 'your society'}`,
          data: {
            requestId: saved.ID,
            societyId: req.body.society_id,
            userId: userId,
            societyName: society?.Name
          },
          time: new Date().toISOString()
        };

        await sendNotificationToUsers(adminUserIds, notification);
      }
    } catch (notificationError) {
      console.error('Failed to send join request notification:', notificationError);
    }

    res.status(201).json({ data: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to join society" });
  }
};

exports.checkJoinRequest = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];

    const existingRequest = await SocietyJoinRequest.findOne({
      User: userId,
      Society: req.query.society_id,
      Status: { $in: ["pending", "approved", "rejected"] }
    });

    if (!existingRequest) {
      return res.status(200).json({ data: "not_found" });
    }

    res.status(200).json({ data: existingRequest.Status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to check join request status" });
  }
};

exports.approveJoinRequest = async (req, res) => {
  try {
    const request = await SocietyJoinRequest.findOne({ ID: req.body.request_id });
    if (!request) return res.status(404).json({ error_message: "Request not found" });

    request.Status = 'approved';
    await request.save();

    const newMember = new SocietyMember({
      ID: uuidv4(),
      Society: request.Society,
      User: request.User,
      Role: "member"
    });
    await newMember.save();

    try {
      const society = await Society.findOne({ ID: request.Society });
      const user = await User.findOne({ ID: request.User }).select('Name');
      
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

      await sendNotificationToUsers([request.User.toString()], notification);
    } catch (notificationError) {
      console.error('Failed to send approval notification:', notificationError);
    }

    res.status(204).json({ data: newMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to approve request" });
  }
};

exports.rejectJoinRequest = async (req, res) => {
  try {
    const request = await SocietyJoinRequest.findOne({ ID: req.body.request_id });
    if (!request) return res.status(404).json({ error_message: "Request not found" });

    request.Status = 'rejected';
    await request.save();

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

      await sendNotificationToUsers([request.User.toString()], notification);
    } catch (notificationError) {
      console.error('Failed to send rejection notification:', notificationError);
    }

    res.status(204).json({ data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to reject request" });
  }
};

exports.getAllJoinRequests = async (req, res) => {
  try {
    const requests = await SocietyJoinRequest.find({ Society: req.query.society_id });
    const userIds = requests.map(r => r.User);
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Email Photo");

    const data = requests.map(r => {
      const user = users.find(u => u.ID === r.User);
      return {
        Request_ID: r.ID,
        Status: r.Status,
        User_ID: user?.ID,
        User_Name: user?.Name,
        User_Email: user?.Email,
        User_Photo: user?.Photo
      };
    });

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get join requests" });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await SocietyMember.find({ Society: req.query.society_id });
    const userIds = members.map(m => m.User);
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Email Photo");
    const data = members.map(m => {
      const user = users.find(u => u.ID === m.User);
      return {
        ID: user?.ID,
        Name: user?.Name,
        Email: user?.Email,
        Photo: user?.Photo,
        Role: m.Role
      };
    });
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get members" });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const result = await SocietyMember.deleteOne({ Society: req.query.society_id, User: req.query.user_id });
    res.status(204).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to remove member" });
  }
};

exports.checkMembership = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];
    const isMember = await SocietyMember.exists({ User: userId, Society: req.query.society_id });
    res.status(200).json({ data: !!isMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to check membership" });
  }
};

exports.checkAdmin = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];
    const isAdmin = await SocietyMember.exists({
      User: userId,
      Society: req.query.society_id,
      Role: 'admin'
    });

    res.status(200).json({ data: !!isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to check admin status" });
  }
};

exports.updateInformation = async (req, res) => {
  try {
    const update = {
      Name: req.body.name,
      Description: req.body.description,
      Category: req.body.category,
      Privacy: req.body.privacy,
      Permissions: req.body.permissions,
      Notifications: req.body.notifications
    };

    if (req.body.privacy) update.Privacy = req.body.privacy;
    if (req.body.permissions) update.Permissions = req.body.permissions;
    if (req.body.notifications) update.Notifications = req.body.notifications;

    const result = await Society.updateOne({ ID: req.body.society_id }, update);
    res.status(204).json({ data: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update society info" });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const result = await SocietyMember.updateOne(
      { User: req.body.member, Society: req.body.society_id },
      { Role: req.body.role }
    );
    res.status(204).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update member role" });
  }
};

exports.leaveSociety = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = req.body.society_id;
    
    if (!societyId) {
      return res.status(400).json({ error_message: "Society ID is required" });
    }

    const membership = await SocietyMember.findOne({ User: userId, Society: societyId });
    
    if (!membership) {
      return res.status(404).json({ error_message: "You are not a member of this society" });
    }

    const society = await Society.findOne({ ID: societyId });
    
    if (society && society.User === userId) {
      return res.status(400).json({ error_message: "Society creators cannot leave. Please transfer ownership or delete the society instead." });
    }

    const result = await SocietyMember.deleteOne({ User: userId, Society: societyId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error_message: "Membership not found" });
    }

    res.status(200).json({ message: "Successfully left the society" });
  } catch (err) {
    console.error('Error in leaveSociety:', err);
    res.status(500).json({ error_message: "Failed to leave society" });
  }
};