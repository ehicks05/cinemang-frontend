# cinemang-backend

## Overview

This repo contains data importing logic for https://github.com/ehicks05/cinemang-frontend. On a high level, what it does is:

1. Take data from TMDB
3. Filter out a lot of noise. For example, it skips films with < 64 votes. This both saves db space and skips a lot of movies that most people won't care about.
2. Convert data into the schema for Cinemang and save it in a Supabase instance.
5. Tries to get clever in many ways to minimize requests to TMDB and Supabase.

## Prereqs

1. node
2. to work with ehicks/cinemang-frontend you need a supabase instance, otherwise any postgres instance should work.
3. a tmdb API key

## Getting Started

1. clone repo
2. refer to `.env.example` to create a `.env` file
2. run:
   ```
   npm i
   npm run generate
   npm run dev
   ```

## Design Notes

### Constraints and Considerations

We have several technical constraints:
1. Supabase free tier 500MB limit: [link](https://supabase.com/pricing)
2. TMDB ~50 rps limit: [link](https://developer.themoviedb.org/docs/rate-limiting)
3. TMDB's `/discover` endpoint is limited to 500 pages
4. The memory limit of wherever this script runs

And a few potential limits that don't **currently** apply:
1. TMDB # of queries
2. supabase reads & writes

On top of that we have some more considerations:
1. The import should run in reasonable time, at most a few hours
2. The import script should be maintainable
3. The import should run on a schedule
4. We do **NOT** require mirroring all content on TMDB. We'll use `vote_count` to limit the media we import.
5. On TMDB, older media will be updated way less often than newer media

### What types of data do we want

Supporting tables: languages, genres, and providers.

Primary tables: movies, shows, and people.

Relations: credits and media providers.

### Pseudocode

Load languages, genres, and providers. These are the simplest to grab because they're small standalone tables.

Then, in batches, we identify movies to load, load them, people involved, credits, and media providers. We do the same for shows.

Once media is loaded we wrap up by finding out how popular each language and provider is for ordering dropdowns on the UI.