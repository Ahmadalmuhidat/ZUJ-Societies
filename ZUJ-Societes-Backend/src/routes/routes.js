const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const commentsController = require('../controllers/commentsController');
const eventsController = require('../controllers/eventsController');
const postsController = require('../controllers/postsController');
const societiesController = require('../controllers/societiesController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const supportController = require('../controllers/supportController');
const analyticsController = require('../controllers/analyticsController');
const notificationsController = require('../controllers/notificationsController');

// auth routes
router.get('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// users routes
router.get('/users/info', authMiddleware.checkUserLoggedIn, userController.getUserInformation);
router.get('/users/profile', authMiddleware.checkUserLoggedIn, userController.getUserProfileInformation);
router.put('/users/profile', authMiddleware.checkUserLoggedIn, userController.updateProfile);
router.get('/users/profile/public', userController.getUserPublicProfile);
router.get('/users/search', authMiddleware.checkUserLoggedIn, userController.searchUsers);
// router.delete('/users/delete_user', auth_mdiddleware.checkUserLoggedIn, userController.deleteUser);
router.get('/users/events', eventsController.getEventsAttendedByUser);
router.get('/users/events/status', authMiddleware.checkUserLoggedIn, eventsController.getUserEventStatus);
router.get('/users/posts', userController.getPostsByUserPublic);
router.get('/users/societies/public', userController.getSocietiesByUserPublic);
router.get('/user/societies', authMiddleware.checkUserLoggedIn, societiesController.getSocietiesByUser);

// societies routes
router.get('/societies/info', societiesController.getSocietyInformation);
router.get('/societies', societiesController.getAllSocieties);
router.post('/societies/create', authMiddleware.checkUserLoggedIn, societiesController.createSociety);
router.delete('/societies', authMiddleware.checkUserLoggedIn, societiesController.deleteSociety);
router.post('/societies/requests', authMiddleware.checkUserLoggedIn, societiesController.joinRequest);
router.get('/societies/requests/check', authMiddleware.checkUserLoggedIn, societiesController.checkJoinRequest);
router.post('/societies/requests/approve', authMiddleware.checkUserLoggedIn, societiesController.approveJoinRequest);
router.post('/societies/requests/reject', authMiddleware.checkUserLoggedIn, societiesController.rejectJoinRequest);
router.get('/societies/requests', authMiddleware.checkUserLoggedIn, societiesController.getAllJoinRequests);
router.get('/societies/members', societiesController.getAllMembers);
router.delete('/societies/members', authMiddleware.checkUserLoggedIn, societiesController.removeMember);
router.get('/societies/members/check', authMiddleware.checkUserLoggedIn, societiesController.checkMembership);
router.get('/societies/admin/check', authMiddleware.checkUserLoggedIn, societiesController.checkAdmin);
router.put('/societies', authMiddleware.checkUserLoggedIn, societiesController.updateInformation);
router.put('/societies/members/roles', authMiddleware.checkUserLoggedIn, societiesController.updateMemberRole);
router.post('/societies/leave', authMiddleware.checkUserLoggedIn, societiesController.leaveSociety);
router.post('/societies/members/invites', authMiddleware.checkUserLoggedIn, societiesController.inviteMemberToSociety);
router.post('/societies/members/invites/respond', authMiddleware.checkUserLoggedIn, societiesController.respondToInvitation);
router.post('/societies/members/invites/check-status', authMiddleware.checkUserLoggedIn, societiesController.checkInvitationStatus);
router.get('/societies/members/invites', authMiddleware.checkUserLoggedIn, societiesController.getSentInvitations);
router.delete('/societies/members/invites/cancel', authMiddleware.checkUserLoggedIn, societiesController.cancelInvitation);
router.get('/societies/events', eventsController.getEventsBySociety);
router.get('/societies/posts', postsController.getPostsBySociety);

// comment routes
router.get('/comments', authMiddleware.checkUserLoggedIn, commentsController.getCommentsByPost);
router.post('/comments', authMiddleware.checkUserLoggedIn, commentsController.createComment);
router.delete('/comments', authMiddleware.checkUserLoggedIn, commentsController.deleteComment);

// events routes
router.get('/events', eventsController.getAllEvents);
router.post('/events', authMiddleware.checkUserLoggedIn, eventsController.createEvent);
router.delete('/events', authMiddleware.checkUserLoggedIn, eventsController.deleteEvent);
router.get('/events/info', eventsController.getEventInfo);
router.get('/events/stats', eventsController.getEventStats);
router.post('/events/attendance', authMiddleware.checkUserLoggedIn, eventsController.toggleEventAttendance);
router.post('/events/share', authMiddleware.checkUserLoggedIn, eventsController.recordEventShare);

// posts routes
router.get('/posts', authMiddleware.checkUserLoggedIn, postsController.getAllPosts);
router.post('/posts', authMiddleware.checkUserLoggedIn, postsController.createPost);
router.delete('/posts', authMiddleware.checkUserLoggedIn, postsController.deletePost);
router.post('/posts/like', authMiddleware.checkUserLoggedIn, postsController.likePost);
router.post('/posts/unlike', authMiddleware.checkUserLoggedIn, postsController.unlikePost);
router.post('/posts/report', authMiddleware.checkUserLoggedIn, supportController.reportPost);

// Support routes
router.post('/support', authMiddleware.checkUserLoggedIn, supportController.CreateTicket);

// Analytics routes
router.get('/analytics/platform', analyticsController.getPlatformAnalytics);
router.get('/analytics/trending-posts', analyticsController.getTrendingPosts);
router.get('/analytics/activity-feed', analyticsController.getActivityFeed);

// Notification routes
router.get('/notifications', authMiddleware.checkUserLoggedIn, notificationsController.getNotifications);
router.get('/notifications/sse', notificationsController.getNotificationsSSE);
router.post('/notifications/mark-read', authMiddleware.checkUserLoggedIn, notificationsController.markNotificationAsRead);
router.post('/notifications/mark-all-read', authMiddleware.checkUserLoggedIn, notificationsController.markAllNotificationsAsRead);

module.exports = router;