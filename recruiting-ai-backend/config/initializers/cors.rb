# Be sure to restart your server when you modify this file.
# Avoid CORS issues when API is called from the frontend app.
# Read more: https://github.com/cyu/rack-cors

# Comma-separated list; default allows the Vite dev server (Docker and local).
cors_origins = ENV.fetch("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",").map(&:strip)

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins cors_origins
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
