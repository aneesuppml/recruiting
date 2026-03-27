# Development image for docker-compose (Ruby 3.1, PostgreSQL client, native gem build deps).
ARG RUBY_VERSION=3.1.4
FROM docker.io/library/ruby:${RUBY_VERSION}-slim

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      curl \
      git \
      libpq-dev \
      libyaml-dev \
      pkg-config \
      postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV RAILS_ENV=development \
    BUNDLE_PATH=/usr/local/bundle

RUN gem install bundler -v '~> 2.5' --no-document

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

RUN chmod +x bin/docker-entrypoint-dev

EXPOSE 3000

ENTRYPOINT ["bin/docker-entrypoint-dev"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
