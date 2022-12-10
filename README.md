## Who built this?
Noah Adhikari, with the much appreciated help of Meshan Khosla.

# Instructions

## Setup

You'll need a bash terminal. If you're on Windows, this will be [Git Bash](https://git-scm.com/downloads).

If you're unfamiliar with bash commands, CS61B has a quick-and-easy starting guide [here](https://fa22.datastructur.es/materials/lab/lab01/#the-terminal).

If you're unfamiliar with Git, there's a guide [here](https://fa22.datastructur.es/materials/guides/git/). This is pretty dense and probably overkill, but you should know what `add`, `commit`, and `push` do if you plan on contributing.

I also recommend installing [VSCode](https://code.visualstudio.com/) as your code editor. It has a lot of support due to its popularity, and is generally a good editor for many languages, especially TypeScript.

Navigate to where you would like the code to be located and clone the repo with the following command, which will clone the GitHub repo into a folder called `model-rating`:
```bash
git clone https://github.com/noahadhikari/model-rating.git
```

You'll also need to have [Node.js](https://nodejs.org/en/) installed on your machine.

Then, install the Node dependencies by running the following command from wherever you cloned the repo:

```bash
npm install
```

### Environment variables
You will need to create a file called `.env` (just like that, no file extension) in the root directory of the project. This file will contain the environment variables that the app needs to run. Be sure not to commit this file, as it contains secrets. Use the `.env-example` file as a template. 

## Running the app
You can use Prisma Studio to view the database locally. To do this, run:
```bash
npx prisma studio
```
Then, open `http://localhost:5555` in your browser. This will provide a user-friendly interface for viewing the database, with options to filter it as well without having to know SQL. Though it is run locally, it is up-to-date with the actual database. This is useful for checking that things are working properly, as well as adding/deleting a handful of rows without having to run any commands.

To run the app locally, run:
```bash
npm run dev
```
Then, open `http://localhost:3000` in your browser.

The app is also deployed on Vercel, which is a cloud platform for hosting static websites. You can view the app at https://model-rating.vercel.app/ (production) or https://model-rating-noahadhikari.vercel.app/ (staging).

## How is the database structured?
The database consists of two main tables, one for models and one for ratings. Each model has an id, a name, its Google Drive STL file ID, and its Google Drive binvox ID, as well as some other metadata information. 

The ratings are related to a specific model, so that one model can have many ratings. Each rating has an associated model ID, user name, rating, reasoning, and some other metadata.

On this website, when the models are queried, the STL file is fetched from that Google Drive ID and is used to render the model in the browser. This can also be used to download the models. This allows us to store potentially millions of models while using very little space in our database, because all we need to store are short IDs corresponding to the drive files.

## How is this app structured?
This is built using Next.js, which is a React framework. React is a JavaScript library for building user interfaces. TypeScript is essentially JavaScript but statically typed, which makes bugs easier to catch. 

The database is hosted on PlanetScale, a cloud database service. Prisma is the ORM (Object Relational Mapper) which allows you to interact with a database using JavaScript. tRPC is a framework for building APIs in Next.js - this lets us connect to the database and return data to the frontend.

`src/server/prisma/schema.prisma` is where the database schema is defined. This is where you can add new tables and columns to the database, and change existing ones (though this might require some changes to the code and may not always be backwards-compatible).

Under `src/pages/index.tsx` is the homepage of the website. This is where the user is brought to when first loading the site. Another custom page is `src/pages/model/[id].tsx` which handles the loading of each separate model at the given model id, which corresponds to a row in the database. `src/pages/components` is where all the React components are held.

`src/server/router/*.ts` is where the API endpoints are defined. These are where the data is fetched from the database and returned to the frontend, and is where most of the Prisma database queries take place.

### If you have questions, please email me at noahadhikari (at) berkeley.edu.

<!--  -->
<!-- Below is the default README when creating a T3 app -->
<!--  -->

# Create T3 App (default README)

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## Why are there `.js` files in here?

As per [T3-Axiom #3](https://github.com/t3-oss/create-t3-app/tree/next#3-typesafety-isnt-optional), we take typesafety as a first class citizen. Unfortunately, not all frameworks and plugins support TypeScript which means some of the configuration files have to be `.js` files.

We try to emphasize that these files are javascript for a reason, by explicitly declaring its type (`cjs` or `mjs`) depending on what's supported by the library it is used by. Also, all the `js` files in this project are still typechecked using a `@ts-check` comment at the top.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with the most basic configuration and then move on to more advanced configuration.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

Also checkout these awesome tutorials on `create-t3-app`.

- [Build a Blog With the T3 Stack - tRPC, TypeScript, Next.js, Prisma & Zod](https://www.youtube.com/watch?v=syEWlxVFUrY)
- [Build a Live Chat Application with the T3 Stack - TypeScript, Tailwind, tRPC](https://www.youtube.com/watch?v=dXRRY37MPuk)
- [Build a full stack app with create-t3-app](https://www.nexxel.dev/blog/ct3a-guestbook)
- [A first look at create-t3-app](https://dev.to/ajcwebdev/a-first-look-at-create-t3-app-1i8f)

## How do I deploy this?

### Vercel

We recommend deploying to [Vercel](https://vercel.com/?utm_source=t3-oss&utm_campaign=oss). It makes it super easy to deploy NextJs apps.

- Push your code to a GitHub repository.
- Go to [Vercel](https://vercel.com/?utm_source=t3-oss&utm_campaign=oss) and sign up with GitHub.
- Create a Project and import the repository you pushed your code to.
- Add your environment variables.
- Click **Deploy**
- Now whenever you push a change to your repository, Vercel will automatically redeploy your website!

### Docker

You can also dockerize this stack and deploy a container. See the [Docker deployment page](https://create-t3-app-nu.vercel.app/en/deployment/docker) for details.

## Useful resources

Here are some resources that we commonly refer to:

- [Protecting routes with Next-Auth.js](https://next-auth.js.org/configuration/nextjs#unstable_getserversession)
