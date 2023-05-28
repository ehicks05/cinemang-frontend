# cinemang-backend

## Overview

This repo contains data importing logic for https://github.com/ehicks05/cinemang-frontend. On a high level, what it does is:

1. Take data from TMDB
3. Filter out a lot of noise. For example, it skips films over a month old with < 64 votes. This is partly to save db space and partly to avoid lots of movies that most people will be uninterested in.
2. Convert it into the schema for Cinemang and save it in a Supabase instance.
5. Tries to get clever in many ways to minimize requests to TMDB and Supabase.

## Prereqs

1. node

## Getting Started

1. clone repo
2. run:
   ```
   npm i
   npm run generate
   npm run dev
   ```

## TMDB API Notes

daily file:

- https://developers.themoviedb.org/3/getting-started/daily-file-exports
- contains valid ids
- each row is a json record
- available by 8AM UTC
- example URL: http://files.tmdb.org/p/exports/movie_ids_04_28_2017.json.gz

Seeder: runs daily@10AM

```
getGenres();
  fetch genres
  save id, name
```

```
getLanguages();
  fetch configuration/languages
  save iso_639_1, english_name as id, name
```

```
getFilms();
  let idsToProcess;
  doFullRun = DB is empty or it's first of month
  if doFullRun:
    idsToProcess = get daily file ids
  if !doFullRun:
    idsToProcess = get changes file
      grab changes from yday midnight to today midnight
```

```
// run after all others
getLanguageCounts();
  for each language
    select count(*) from film where language = language
  process each id
```
