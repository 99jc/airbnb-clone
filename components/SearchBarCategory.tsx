import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, RefObject, useEffect, useState } from "react";

interface SearchBarCategoryProps {
  categoryRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  active: boolean;
  classNames?: {
    parent?: string;
    leftButton?: string;
    rightButton?: string;
    content?: string;
  };
}

const SearchBarCategory = ({
  categoryRef,
  children,
  active,
  classNames,
}: SearchBarCategoryProps) => {
  const [spotCategoryButton, setSpotCategoryButton] = useState({
    left: false,
    right: true,
  });

  useEffect(() => {
    if (!categoryRef.current) return;
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = categoryRef.current!;
      setSpotCategoryButton({
        left: scrollLeft > 20,
        right: scrollLeft + clientWidth < scrollWidth,
      });
    };

    if (active) {
      categoryRef.current.addEventListener("scroll", handleScroll);
    } else {
      categoryRef.current.removeEventListener("scroll", handleScroll);
    }
    return () => {
      categoryRef!.current?.removeEventListener("scroll", handleScroll);
    };
  }, [active, categoryRef]);

  const scroll = (offset: number) => {
    if (categoryRef.current) {
      categoryRef.current.scrollLeft += offset;
    }
  };
  return (
    <div className={clsx("relative", classNames?.parent)}>
      <div
        onClick={() => scroll(-40)}
        className={clsx(
          "absolute",
          classNames?.leftButton,
          !spotCategoryButton.left && "hidden"
        )}
      >
        <ChevronLeft />
      </div>
      <div
        onClick={() => scroll(40)}
        className={clsx(
          "absolute",
          classNames?.rightButton,
          !spotCategoryButton.right && "hidden"
        )}
      >
        <ChevronRight />
      </div>
      <div
        ref={categoryRef}
        className={clsx(
          "overflow-x-scroll overflow-y-hidden scrollbar-hide",
          classNames?.content
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default SearchBarCategory;
