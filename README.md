# Simple REST with Nest

This project is a showcase of my expertise in back-end development using NestJS. It demonstrates a RESTful API architecture with features like CI/CD, Automated testing, Authentication and Authorization, ORM, and containerization.

It highlights my ability to build scalable and secure applications, utilizing modern technologies and best practices.

### Dependencies

- [NestJs](https://docs.nestjs.com/) using `@nestjs/cli`
- [MikroORM](https://mikro-orm.io/) + [PostgreSQL](https://www.postgresql.org/)
- [CI/CD](https://github.com/features/actions)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)

### Execution

```bash
yarn install
cp .env.template .env
yarn start
yarn test
```

### Migrations with MikroORM

```bash
yarn generate_migration
yarn revert_db
yarn migrate_db
```

### CI/CD to Production

```bash
# build publishable image
docker build --file ./dockerfile --tag [image_name]:[version] . --no-cache --progress=plain

# login using specific user docker login docker.io -u username -p password
docker login docker.io

# publish the image to your docker repository
docker push [username]/[image_name]:[version]

# logout from docker
docker logout
```

### TODO

- add `Reset password` API
- add `Logout` API that flags the token as blacklisted to avoid re-use
- improve `FileService` upload (S3, buckets, spaces, etc)
- add API to verify captcha validity
