import { getStarIconPathBasedOnRating } from "@/utils/rating";
import { type Component, Show } from "solid-js";

interface MovieRatingProps {
  rating?: string;
  votes?: string;
  no_reviews?: string;
}

export const MovieRating: Component<MovieRatingProps> = (props) => {
  const formattedRating = () => {
    if (!props.rating) return "—/10";
    return props.rating.includes("/") ? props.rating : `${props.rating}/10`;
  };

  const getIconPath = () => {
    const rawRating = props.rating ?? "";
    const numericRating = parseFloat(rawRating.replace("/10", ""));
    const safeRating = Number.isNaN(numericRating) ? 0 : numericRating;
    return getStarIconPathBasedOnRating(safeRating);
  };

  return (
    <Show when={props.rating || props.votes || props.no_reviews}>
      <div class="rating-star">
        <img src={getIconPath()} alt="" />
      </div>
      <div class="rating-value">{formattedRating()}</div>
      <div class="rating-votes">{props.votes || props.no_reviews || ""}</div>
    </Show>
  );
};
