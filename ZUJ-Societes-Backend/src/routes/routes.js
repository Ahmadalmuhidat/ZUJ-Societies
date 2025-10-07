const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const commentsController = require('../controllers/comments');
const eventsController = require('../controllers/events');
const postsController = require('../controllers/posts');
const societiesController = require('../controllers/societies');
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');
const supportController = require('../controllers/support');
const analyticsController = require('../controllers/analytics');
const notificationsController = require('../controllers/notifications');

// auth routes
router.get('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// users routes
router.get('/users/get_user_info', authMiddleware.checkUserLoggedIn, userController.getUserInformation);
router.get('/users/get_user_profile_info', authMiddleware.checkUserLoggedIn, userController.getUserProfileInformation);
router.put('/users/update_profile', authMiddleware.checkUserLoggedIn, userController.updateProfile);
router.get('/users/get_user_public_profile', userController.getUserPublicProfile);
// router.delete('/users/delete_user', auth_mdiddleware.checkUserLoggedIn, userController.deleteUser);

// societies routes
router.get('/societies/get_society_info', societiesController.getSocietyInformation);
router.get('/societies/get_all_societies', societiesController.getAllSocieties);
router.post('/societies/create_society', authMiddleware.checkUserLoggedIn, societiesController.createSociety);
router.delete('/societies/delete_society', authMiddleware.checkUserLoggedIn, societiesController.deleteSociety);
router.get('/societies/get_societies_by_user', authMiddleware.checkUserLoggedIn, societiesController.getSocietiesByUser);
router.post('/societies/join_request', authMiddleware.checkUserLoggedIn, societiesController.joinRequest);
router.get('/societies/join_requests/check', authMiddleware.checkUserLoggedIn, societiesController.checkJoinRequest);
router.post('/societies/join_requests/approve', authMiddleware.checkUserLoggedIn, societiesController.approveJoinRequest);
router.post('/societies/join_requests/reject', authMiddleware.checkUserLoggedIn, societiesController.rejectJoinRequest);
router.get('/societies/join_requests/get_all', authMiddleware.checkUserLoggedIn, societiesController.getAllJoinRequests);
router.get('/societies/get_all_members', societiesController.getAllMembers);
router.delete('/societies/remove_member', authMiddleware.checkUserLoggedIn, societiesController.removeMember);
router.get('/societies/check_membership', authMiddleware.checkUserLoggedIn, societiesController.checkMembership);
router.get('/societies/check_admin', authMiddleware.checkUserLoggedIn, societiesController.checkAdmin);
router.put('/societies/update_info', authMiddleware.checkUserLoggedIn, societiesController.updateInformation);
router.put('/societies/update_member_role', authMiddleware.checkUserLoggedIn, societiesController.updateMemberRole);
router.put('/societies/leave_society', authMiddleware.checkUserLoggedIn, societiesController.leaveSociety);
router.post('/societies/invite_member', authMiddleware.checkUserLoggedIn, societiesController.inviteMemberToSociety);
router.get('/societies/get_sent_invitations', authMiddleware.checkUserLoggedIn, societiesController.getSentInvitations);
router.delete('/societies/cancel_invitation', authMiddleware.checkUserLoggedIn, societiesController.cancelInvitation);
router.get('/societies/get_societies_by_user_public', userController.getSocietiesByUserPublic);

// comment routes
router.get('/comment/get_comments_by_post', authMiddleware.checkUserLoggedIn, commentsController.getCommentsByPost);
router.post('/comment/create_comment', authMiddleware.checkUserLoggedIn, commentsController.createComment);
router.delete('/comment/delete_comment', authMiddleware.checkUserLoggedIn, commentsController.deleteComment);


// events routes
router.get('/events/get_all_events', eventsController.getAllEvents);
router.get('/events/get_event_info', eventsController.getEventInfo);
router.post('/events/create_event', authMiddleware.checkUserLoggedIn, eventsController.createEvent);
router.delete('/events/delete_event', authMiddleware.checkUserLoggedIn, eventsController.deleteEvent);
router.get('/events/get_events_by_society', eventsController.getEventsBySociety);

// Event interaction routes
router.get('/events/get_event_stats', eventsController.getEventStats);
router.post('/events/toggle_attendance', authMiddleware.checkUserLoggedIn, eventsController.toggleEventAttendance);
router.post('/events/toggle_bookmark', authMiddleware.checkUserLoggedIn, eventsController.toggleEventBookmark);
router.post('/events/record_share', authMiddleware.checkUserLoggedIn, eventsController.recordEventShare);
router.get('/events/get_user_status', authMiddleware.checkUserLoggedIn, eventsController.getUserEventStatus);
router.get('/events/get_related_events', eventsController.getRelatedEvents);
router.get('/events/get_events_attended_by_user', eventsController.getEventsAttendedByUser);

// posts routes
router.get('/posts/get_all_posts', authMiddleware.checkUserLoggedIn, postsController.getAllPosts);
router.post('/posts/create_post', authMiddleware.checkUserLoggedIn, postsController.createPost);
router.delete('/posts/delete_post', authMiddleware.checkUserLoggedIn, postsController.deletePost);
router.get('/posts/get_posts_by_society', postsController.getPostsBySociety);
router.post('/posts/like_post', authMiddleware.checkUserLoggedIn, postsController.likePost);
router.post('/posts/unlike_post', authMiddleware.checkUserLoggedIn, postsController.unlikePost);
router.get('/posts/get_posts_by_user', userController.getPostsByUserPublic);

// Support routes
router.post('/support/create_ticket', authMiddleware.checkUserLoggedIn, supportController.CreateTicket);

// Analytics routes
router.get('/analytics/platform', analyticsController.getPlatformAnalytics);
router.get('/analytics/trending-posts', analyticsController.getTrendingPosts);
router.get('/analytics/activity-feed', analyticsController.getActivityFeed);
router.get('/analytics/recommendations', analyticsController.getUserRecommendations);

// Notification routes
router.get('/notifications', authMiddleware.checkUserLoggedIn, notificationsController.getNotifications);
router.get('/notifications/sse', notificationsController.getNotificationsSSE);
router.post('/notifications/mark-read', authMiddleware.checkUserLoggedIn, notificationsController.markNotificationAsRead);
router.post('/notifications/mark-all-read', authMiddleware.checkUserLoggedIn, notificationsController.markAllNotificationsAsRead);

module.exports = router;