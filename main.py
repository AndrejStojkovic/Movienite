from urllib.parse import urlparse, urlunparse

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI
import tldextract
import uvicorn

from movienite import add_movie as _add_movie, get_movies, fetch_imdb, fetch_letterboxd

VALID_MOVIE_SITES = ['imdb.com', 'letterboxd.com']

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return FileResponse("static/index.html")


@app.get("/movies")
async def movies():
    return get_movies()


@app.post("/movies")
async def add_new_movie(movie_url: str):
    if not movie_url.startswith("http://") and not movie_url.startswith("https://"):
        movie_url = "https://" + movie_url

    parsed_url = urlparse(movie_url)
    ext = tldextract.extract(movie_url)

    host = f"{ext.domain}.{ext.suffix}"
    parsed_url = parsed_url._replace(netloc=host)
    cleaned_url = urlunparse(parsed_url)

    if host == "imdb.com":
        movie_data = fetch_imdb(cleaned_url)
    elif host == "letterboxd.com":
        movie_data = fetch_letterboxd(cleaned_url)
    else:
        return {"error": "URL must be from IMDb or Letterboxd"}

    if not movie_data:
        return {"error": "Failed to fetch movie data"}

    _add_movie(movie_data)
    return {"message": "Movie added successfully"}


def main():
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
