import { Component, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { FiUser, FiChevronDown, FiX } from "solid-icons/fi";
import type { Movie } from "@/types";

interface UserFilterProps {
  value: string;
  onInput: (value: string) => void;
  movies: Movie[];
}

export const UserFilter: Component<UserFilterProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const uniqueUsers = createMemo(() => {
    const usersMap = new Map<string, string>();
    for (const movie of props.movies) {
      if (movie.user?.username) {
        usersMap.set(movie.user.username.toLowerCase(), movie.user.username);
      }
    }
    return Array.from(usersMap.values()).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  });

  const filteredUsers = createMemo(() => {
    const query = props.value.toLowerCase().trim();
    if (!query) return uniqueUsers();
    return uniqueUsers().filter((username) =>
      username.toLowerCase().includes(query)
    );
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  const handleSelect = (username: string) => {
    props.onInput(username);
    setIsOpen(false);
  };

  const handleClear = () => {
    props.onInput("");
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div class="user-filter-container" ref={containerRef}>
      <div class="user-filter-input-wrapper">
        <div class="user-filter-icon">
          <FiUser size={20} />
        </div>
        <input
          type="text"
          class="user-filter-input"
          placeholder="Filter by user"
          value={props.value}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          onFocus={handleInputFocus}
        />
        <Show when={props.value}>
          <button
            class="user-filter-clear"
            onClick={handleClear}
            title="Clear filter"
          >
            <FiX size={16} />
          </button>
        </Show>
        <button
          class="user-filter-toggle"
          onClick={() => setIsOpen(!isOpen())}
          title="Show users"
        >
          <FiChevronDown
            size={20}
            style={{
              transform: isOpen() ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
      </div>
      <Show when={isOpen() && filteredUsers().length > 0}>
        <div class="user-filter-dropdown">
          <For each={filteredUsers()}>
            {(username) => (
              <button
                class="user-filter-option"
                classList={{
                  selected: username.toLowerCase() === props.value.toLowerCase(),
                }}
                onClick={() => handleSelect(username)}
              >
                {username}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default UserFilter;
