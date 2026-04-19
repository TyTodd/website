import { useMDXComponents as getThemeComponents } from "nextra-theme-blog";
import { Fragment } from "react";
import { PostTagLink } from "./src/components/PostTagLink";

const themeComponents = getThemeComponents();

function PostWrapper({ children, metadata }) {
  const { author, tags, date, readingTime } = metadata ?? {};
  const dateObj = date ? new Date(date) : null;
  const readingTimeText = readingTime?.text;

  const tagEls = Array.isArray(tags)
    ? tags.map((t) => <PostTagLink key={t} tag={t} />)
    : null;

  const hasAuthorAndDate = author && dateObj;
  const hasSeparator =
    (author || dateObj) && (readingTime || tags?.length);

  return (
    <Fragment>
      <h1>{metadata.title}</h1>
      <div
        className={
          "x:mb-8 x:flex x:gap-3 " +
          (readingTimeText ? "x:items-start" : "x:items-center")
        }
      >
        <div className="x:grow x:dark:text-gray-400 x:text-gray-600">
          <div className="x:flex x:flex-wrap x:items-center x:gap-1">
            {author}
            {hasAuthorAndDate && ","}
            {dateObj && (
              <time dateTime={dateObj.toISOString()}>
                {dateObj.toLocaleDateString()}
              </time>
            )}
            {hasSeparator && <span className="x:px-1">•</span>}
            {readingTimeText || tagEls}
          </div>
          {readingTime && tagEls && (
            <div className="x:mt-1 x:flex x:flex-wrap x:items-center x:gap-1">
              {tagEls}
            </div>
          )}
        </div>
      </div>
      {children}
    </Fragment>
  );
}

export function useMDXComponents(components) {
  return {
    ...themeComponents,
    wrapper: PostWrapper,
    YouTube: require("./src/components/YouTubeClient").default,
    ...components,
  };
}
