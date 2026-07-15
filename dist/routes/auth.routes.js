"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', validation_middleware_1.validateRegister, auth_controller_1.register);
router.post('/login', validation_middleware_1.validateLogin, auth_controller_1.login);
// Protected routes
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.getMe);
exports.default = router;
