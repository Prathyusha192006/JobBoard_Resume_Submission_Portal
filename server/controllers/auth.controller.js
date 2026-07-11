// server/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role, roleId } = req.body;
    console.log('Login attempt:', { email, role, roleId });

    // 1. Find user by email
    const user = await User.findOne({ email }).select('+password +passwordHash');
    console.log('Found user:', user ? {
      email: user.email,
      role: user.role,
      roleId: user.roleId,
      hasPassword: !!user.password,
      hasPasswordHash: !!user.passwordHash
    } : 'No user found');

    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        debug: 'User not found with this email'
      });
    }

    // 2. Check role - normalize to lowercase for comparison
    const normalizedUserRole = user.role?.toLowerCase();
    const normalizedRequestRole = role?.toLowerCase();
    
    console.log('Role comparison:', {
      userRole: user.role,
      requestRole: role,
      userNormalized: normalizedUserRole,
      requestNormalized: normalizedRequestRole,
      match: normalizedUserRole === normalizedRequestRole
    });
    
    if (normalizedUserRole !== normalizedRequestRole) {
      console.log('❌ Role mismatch detected');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        debug: `Role mismatch - DB has '${user.role}', received '${role}'`
      });
    }

    // 3. Check roleId - case insensitive comparison
    console.log('RoleId comparison:', {
      userRoleId: user.roleId,
      requestRoleId: roleId,
      userUpper: user.roleId?.toUpperCase(),
      requestUpper: roleId?.toUpperCase(),
      match: user.roleId?.toUpperCase() === roleId?.toUpperCase()
    });
    
    if (user.roleId?.toUpperCase() !== roleId?.toUpperCase()) {
      console.log('❌ RoleId mismatch detected');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        debug: `RoleId mismatch - DB has '${user.roleId}', received '${roleId}'`
      });
    }
    
    console.log('✓ Role and RoleId verified successfully');

    // 4. Check password - handle both 'password' and 'passwordHash' fields
    let isMatch = false;
    const passwordField = user.passwordHash || user.password;
    
    if (!passwordField) {
      console.log('No password field found for user');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials - no password' 
      });
    }

    console.log('Password field length:', passwordField.length);
    console.log('Input password length:', password.length);

    // First try direct comparison (for plain text)
    if (passwordField === password) {
      console.log('✓ Password matches (plain text)');
      isMatch = true;
      
      // Hash the password for future logins
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.passwordHash = hashedPassword;
        user.password = undefined;  // Remove old password field if it exists
        await user.save();
        console.log('✓ Password has been hashed for security');
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        // Continue anyway since login was successful
      }
    } 
    // If direct comparison fails, try bcrypt
    else {
      try {
        isMatch = await bcrypt.compare(password, passwordField);
        console.log('Bcrypt compare result:', isMatch ? '✓ Match' : '✗ No match');
      } catch (bcryptError) {
        console.error('Bcrypt compare error:', bcryptError);
        // If bcrypt fails, it might not be a hashed password
        console.log('Bcrypt failed, trying direct comparison as fallback');
        isMatch = (passwordField === password);
      }
    }

    if (!isMatch) {
      console.log('✗ Password does not match');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        debug: 'Password does not match'
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' }
    );

    // 6. Remove sensitive data from output
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.passwordHash;

    console.log('✓ Login successful for user:', user.email);
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, roleId } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create user with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      passwordHash: hashedPassword,  // Use passwordHash instead of password
      role: role?.toLowerCase(), // Normalize role to lowercase
      roleId: roleId?.toUpperCase() // Normalize roleId to uppercase
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' }
    );

    // Remove password from output
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};