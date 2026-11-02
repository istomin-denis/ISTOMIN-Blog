export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }))
    });
  }
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `${field} is already in use` });
  }
  if (error?.name === "ValidationError") {
    return res.status(400).json({ message: "Invalid data", errors: Object.values(error.errors).map((item) => item.message) });
  }
  if (error?.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier" });
  }
  console.error(error);
  const status = Number(error.status) || 500;
  res.status(status).json({ message: status >= 500 ? "Internal server error" : error.message });
}
