# frozen_string_literal: true

class ApiDocsController < ApplicationController
  SPEC_PATH = Rails.root.join("docs", "openapi.yaml").freeze

  def ui
    render html: swagger_ui_html("/api-docs/openapi.yaml").html_safe
  end

  def openapi
    unless File.exist?(SPEC_PATH)
      render json: { error: "OpenAPI spec not found" }, status: :not_found
      return
    end

    render plain: File.read(SPEC_PATH), content_type: "application/yaml"
  end

  private

  def swagger_ui_html(spec_url)
    # Note: uses CDN for swagger-ui assets to avoid adding gems/build steps.
    <<~HTML
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Recruiting-AI API Docs</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function () {
              window.ui = SwaggerUIBundle({
                url: "#{spec_url}",
                dom_id: '#swagger-ui',
                presets: [
                  SwaggerUIBundle.presets.apis
                ],
                // Swagger UI v5 will pick a compatible layout by default.
              });
            };
          </script>
        </body>
      </html>
    HTML
  end
end

