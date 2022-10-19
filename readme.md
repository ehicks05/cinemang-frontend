# cinemang-backend

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
