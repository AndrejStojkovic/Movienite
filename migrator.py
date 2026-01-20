from movienite import get_movies, fetch_imdb, save_movies


### Migration Script to Enrich Existing Movies with IMDB Data ###
def migrate_existing_movies():
    existing_movies = get_movies()['movies']
    print(f'Migrating {len(existing_movies)} existing movies')
    for i, existing_movie in enumerate(existing_movies):
        print(f'Processing movie {i + 1}/{len(existing_movies)}: {existing_movie.get("title", "Unknown Title")}')
        imdb_url = existing_movie.get('imdb_url', '')
        if not imdb_url:
            print('no imdb url, skipping')
            continue

        movie_data = fetch_imdb(imdb_url)
        if not movie_data:
            print('failed to fetch imdb data, skipping')
            continue

        for key, value in movie_data.items():
            if value and (key not in existing_movie or not existing_movie[key]):
                existing_movie[key] = value

    print('Saving migrated movies...')
    save_movies({'movies': existing_movies})


if __name__ == "__main__":
    print('Starting migration of existing movies...')
    migrate_existing_movies()
    print('Migration complete.')
