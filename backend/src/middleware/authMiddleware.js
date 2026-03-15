const supabase = require('../lib/supabaseClient');

/**
 * authenticateUser
 * Middleware to verify the Supabase JWT token from the Authorization header.
 * Attaches the user object to req.user if successful.
 */
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth Error:', error?.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Middleware Error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = authenticateUser;
