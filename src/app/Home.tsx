import { FC, useEffect, useState } from "react";
import { Loading } from "components";
import { PostgrestError, useClient, useSelect } from "react-supabase";

const Home: FC = () => {
  return (
    <div>
      <Genres />
      <Languages />
    </div>
  );
};

const Genres = () => {
  const [{ data, error, fetching }] = useSelect("genre");

  if (error || fetching) return <Loading error={error} loading={fetching} />;
  if (!data || data.length === 0) return <div>No genres</div>;

  return (
    <div>
      <div>count: {data.length}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const Languages = () => {
  const client = useClient();

  const [languages, setLanguages] = useState<any[] | null>();
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<PostgrestError | null>();

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await client
        .from("language")
        .select("*")
        .gt("count", 0)
        .order("count", { ascending: false });

      setError(error);
      setLanguages(data);
      setFetching(false);
    };
    fetch();
  }, [client]);

  if (error || fetching) return <Loading error={error} loading={fetching} />;
  if (!languages || languages.length === 0) return <div>No languages</div>;

  return (
    <div>
      <div>count: {languages.length}</div>
      <pre>{JSON.stringify(languages, null, 2)}</pre>
    </div>
  );
};

export default Home;

/*
<div th:fragment="filmMediaItems" id="results-block">
    <th:block th:each="film,loop : ${filmSearchResult.pageOfResults}">
<!--        th:title="${loop.count + ((filmSearchResult.page - 1) * filmSearchResult.pageSize)}-->
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img th:src="@{https://image.tmdb.org/t/p/w92} + ${film.posterPath}" alt="poster"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <div>
                        <strong th:text="${film.title}"></strong>
                        <small th:text="${'(' + film.released.year + ')'}"></small>
                        <small th:text="${film.runtimeString}"></small>
                        <br>
                        <div>
                            <strong>Cast:</strong>
                            <span th:text="${film.actors}"></span>
                        </div>
                        <div>
                            <strong>Director:</strong>
                            <span th:text="${film.director}"></span>
                        </div>
                        <div style="cursor:pointer;" th:attr="data-text=${film.overview}" th:text="${#strings.abbreviate(film.overview,100)}"
                             onclick="const temp = this.innerText; this.innerText = this.dataset.text; this.dataset.text=temp;"></div>
                    </div>
                    <nav class="level is-mobile is-hidden-desktop">
                        <div class="level-item has-text-centered">
                            <div>
                                <div class="icon is-small has-text-danger"><i class="fas fa-heart"></i></div>
                                <div><span class="tag"><span th:text="${film.userVoteAverage}"></span></span></div>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <div class="icon is-small has-text-warning"><i class="fas fa-star"></i></div>
                                <div><span class="tag"><span th:text="${film.userVoteCountString}"></span></span></div>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <div class="icon is-small has-text-success"><i class="fas fa-language"></i></div>
                                <div><span class="tag"><span th:text="${film.language.name}"></span></span></div>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <div class="icon is-small has-text-link"><i class="fas fa-theater-masks"></i></div>
                                <div><span class="tag"><span th:text="${film.primaryGenre}"></span></span></div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div class="media-right is-hidden-touch">
                <div class="has-text-right">
                    <div>
                        <span class="tag">
                            <span th:text="${film.userVoteAverage}"></span>
                            <span class="icon is-small has-text-danger"><i class="fas fa-heart"></i></span>
                        </span>
                    </div>
                    <div>
                        <span class="tag">
                            <span th:text="${film.userVoteCountString}"></span>
                            <span class="icon is-small has-text-warning"><i class="fas fa-star"></i></span>
                        </span>
                    </div>
                    <div>
                        <span class="tag">
                            <span th:text="${film.language.name}"></span>
                            <span class="icon is-small has-text-success"><i class="fas fa-language"></i></span>
                        </span>
                    </div>
                    <div>
                        <span class="tag">
                            <span th:text="${film.genreString}"></span>
                            <span class="icon is-small has-text-link"><i class="fas fa-theater-masks"></i></span>
                        </span>
                    </div>
                </div>
            </div>
        </article>

    </th:block>

    <div th:if="${filmSearchResult.searchResults.isEmpty()}">
        No films found...
    </div>

    <br/>
    <div style="text-align: center;">
        <input class="button is-small firstButton" type="button" value="First" onclick="goToPage('first')" th:disabled="${!filmSearchResult.hasPrevious}" />
        <input class="button is-small previousButton" type="button" value="Previous" onclick="goToPage('previous')" th:disabled="${!filmSearchResult.hasPrevious}" />

        <button class="button is-small is-light" th:title="${#numbers.formatInteger(filmSearchResult.size, 0, 'COMMA') + ' Results'}">
            <span class="currentPageSpan" th:text="${#numbers.formatInteger(filmSearchResult.page, 0)}"></span>
            /
            <span th:text="${#numbers.formatInteger(filmSearchResult.pages, 0)}"></span>
        </button>

        <input class="button is-small nextButton" type="button" value="Next" onclick="goToPage('next')" th:disabled="${!filmSearchResult.hasNext}" />
        <input class="button is-small lastButton" type="button" value="Last" onclick="goToPage('last')" th:disabled="${!filmSearchResult.hasNext}" />
    </div>
</div>
*/
