import { PlusIcon } from "@/components/icons";
import type { Component } from "solid-js";

interface AddMovieButtonProps {
  onClick: () => void;
}

export const AddMovieButton: Component<AddMovieButtonProps> = (props) => (
  <button
    class="add-movie-button"
    onClick={props.onClick}
    aria-label="Add Movie"
    title="Add Movie"
  >
    <PlusIcon />
  </button>
);
