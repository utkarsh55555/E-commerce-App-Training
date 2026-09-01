module.exports = {
  // ---- 2xx : Success ----
  OK: 200,           // GET / PATCH / DELETE successful
  CREATED: 201,      // POST successful — new resource created

  // ---- 4xx : Client errors ----
  BAD_REQUEST: 400,  // Validation fail, invalid input
  UNAUTHORIZED: 401, // Token missing / invalid / expired
  FORBIDDEN: 403,    // Token valid but no permission
  NOT_FOUND: 404,    // Product/route doesn't exist
  CONFLICT: 409,     // Duplicate — e.g., SKU already exists

  // ---- 5xx : Server errors ----
  INTERNAL_SERVER_ERROR: 500,
};
