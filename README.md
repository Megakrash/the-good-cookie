### "The Good Cookie" project

Solo project carried out as part of the training at the Wild Code School for the preparation of the title "Application developer designer".

### Project launch

- Copy `.env.sample` and create `.env` in the backend
- Update reCAPTCHA key in `configApi.ts` in the frontend
- Run command `npm i` in the frontend to install the dependencies
- Run command `docker-compose build` at the root to create backend & postgres images
- Run command `docker-compose up` at the root to launch backend & postgres
- Run command `npm run dev` in the frontend to throw it

### Others commands

- `npm run lint` : Runs validation tools, and refuses unclean code (will be executed on every commit)
- `npm run fix` : Fixes linter errors (run it if lint growls on your code !)
- `npm test` : Launch tests with Jest (run it if you want test your code !)

### See in prod mode

- Release : https://release-tgc.megakrash.fr/
- Prod : https://tgc.megakrash.fr/
